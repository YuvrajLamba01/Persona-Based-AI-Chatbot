import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import personaPrompts from "./prompts.js";

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../frontend/dist");

// Load Environment Variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const port = Number(process.env.PORT || 3001);

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? [process.env.CLIENT_ORIGIN]
  : ["http://localhost:5173"];

const isDemoMode = String(process.env.DEMO_MODE).toLowerCase() === "true";

// Helper to create the Gemini client via OpenAI SDK
const createClient = () => {
  if (!process.env.GEMINI_API_KEY) return null;

  return new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });
};

// Middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));

// Message Validation Helpers
const normalizeMessage = (message) => ({
  role: message.role,
  content: message.content,
});

const isValidMessage = (message) => {
  const allowedRoles = new Set(["user", "assistant", "system"]);
  return (
    message &&
    typeof message === "object" &&
    allowedRoles.has(message.role) &&
    typeof message.content === "string" &&
    message.content.trim() !== ""
  );
};

// API Route: Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { persona = "anshuman", messages = [] } = req.body;

    // Validate Persona
    const systemPrompt = personaPrompts[persona];
    if (!systemPrompt) {
      return res.status(400).json({ error: "Invalid persona specified." });
    }

    const client = createClient();

    // Handle missing API key safely
    if (!client) {
      if (isDemoMode) {
        return res.json({ 
          reply: `[DEMO MODE]: I am ${persona}. This is a simulated response because no API key is provided.` 
        });
      }
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    // Sanitize user inputs
    const sanitizedMessages = messages
      .filter(isValidMessage)
      .map(normalizeMessage)
      .filter((m) => m.role !== "system"); // Prevent users from injecting their own system prompts

    if (sanitizedMessages.length === 0) {
       return res.status(400).json({ error: "No valid messages provided." });
    }

    // Call Gemini API - ✅ CORRECTED MODEL NAME HERE
    const completion = await client.chat.completions.create({
      model: "gemini-3-flash-preview", 
      messages: [
        { role: "system", content: systemPrompt },
        ...sanitizedMessages,
      ],
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "No response generated.";

    res.json({ reply });

  } catch (error) {
    console.error("API Error:", error);
    
    // Send back specific error messages if rate limited or unavailable
    if (error?.status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
    }
    
    res.status(500).json({ error: "Failed to generate a response from the AI." });
  }
});

// Serve Frontend Static Files (Only if the dist folder exists)
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // Catch-all route for Single Page Application (SPA)
  app.get("*", (req, res) => {
    // Don't serve index.html for undefined /api routes
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "API Route not found" });
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  console.warn(`[WARN] Frontend dist folder not found at: ${frontendDistPath}`);
}

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Demo Mode: ${isDemoMode ? "ENABLED" : "DISABLED"}`);
});
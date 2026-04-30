import cors from "cors";
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import personaPrompts from "../prompts.js";

// Load environment variables
dotenv.config();

const app = express();

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",")
  : ["http://localhost:5173", "https://persona-based-ai-chatbot-frontend.vercel.app"];

const isDemoMode = String(process.env.DEMO_MODE).toLowerCase() === "true";

const createClient = () => {
  if (!process.env.GEMINI_API_KEY) return null;
  return new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });
};

// CORS middleware
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const { persona = "anshuman", messages = [] } = req.body;
    const systemPrompt = personaPrompts[persona];
    
    if (!systemPrompt) {
      return res.status(400).json({ error: "Invalid persona specified." });
    }

    const client = createClient();
    if (!client) {
      if (isDemoMode) {
        return res.json({ 
          reply: `[DEMO MODE]: I am ${persona}. This is a simulated response.` 
        });
      }
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    const sanitizedMessages = messages
      .filter(m => m && typeof m === "object" && ["user", "assistant", "system"].includes(m.role) && typeof m.content === "string" && m.content.trim() !== "")
      .map(m => ({ role: m.role, content: m.content }))
      .filter((m) => m.role !== "system");

    if (sanitizedMessages.length === 0) {
       return res.status(400).json({ error: "No valid messages provided." });
    }

    const completion = await client.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        ...sanitizedMessages,
      ],
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "No response generated.";
    res.json({ reply });

  } catch (error) {
    console.error("API Error:", error);
    if (error?.status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
    }
    res.status(500).json({ error: "Failed to generate a response from the AI." });
  }
});

export default app;


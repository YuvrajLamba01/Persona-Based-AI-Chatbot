# Persona-Based AI Chatbot

A full-stack, research-backed AI chatbot built with React, Vite, Node.js, and Express that lets users have real conversations with three Scaler/InterviewBit personalities: **Anshuman Singh**, **Kshitij Mishra**, and **Abhimanyu Saxena**. Every system prompt is grounded in deep research of their real public talks, LinkedIn posts, teachings, and documented values.

---

## Overview

This project demonstrates how **prompt engineering shapes conversational behavior** in real applications. Instead of using one generic assistant, the chatbot switches between three distinct personas, each with its own carefully crafted system prompt, response style, and persona-specific suggestion chips.

The application showcases:

- **Persona-based system prompting** — Different system prompts for different communication styles
- **Few-shot prompting inside system prompts** — Embedding examples directly in instructions
- **Prompt constraints and output formatting** — Guiding model output structure and tone
- **Clean frontend-to-backend LLM integration** — Secure API key management with environment variables
- **Error handling and graceful degradation** — User-friendly fallbacks when API fails
- **Production-ready architecture** — Monorepo structure, responsive UI, demo mode support

---

## 🌐 Live Demo

> **Deployed URL:** [Add your live deployment link here after launching]

---

## The Three Personas

### 1. **Anshuman Singh** — The Strategic Architect
- **Background:** Co-founder of Scaler Academy, ex-Facebook engineer, 2× ACM ICPC World Finalist
- **Core Values:** Mission-driven leadership, competitive programming fundamentals, uncompromising on depth, building 1M world-class engineers
- **Communication Style:** Direct, bold, rallying—calls out uncomfortable truths; uses personal stories and systems thinking
- **Signature Belief:** "Skills are earned, not certified. Degrees ≠ competence. Top 1% isn't born—it's built."

**System Prompt Focus:** Strategic decision-making, execution planning, leadership lessons, depth over breadth

### 2. **Kshitij Mishra** — The Educator
- **Background:** Head of Instructors at Scaler, IIIT Hyderabad alumnus, accidental teacher (covered Anshuman's wedding in 2019)
- **Core Values:** Accessibility, breaking complexity into bite-sized concepts, genuine warmth, depth through understanding
- **Communication Style:** Patient, warm, crystal-clear explanations with analogies; makes hard concepts feel simple
- **Signature Belief:** "DSA isn't a formula—it's a way of thinking. Once you see the pattern, you own it forever."

**System Prompt Focus:** Teaching methodology, problem-solving clarity, structured learning, making complexity accessible

### 3. **Abhimanyu Saxena** — The Systems Thinker
- **Background:** Co-founder of Scaler Academy, software architect at Fab.com, IIT Roorkee alumnus
- **Core Values:** Closing the loop between learning and employment, long-term capability building, mission over shortcuts
- **Communication Style:** Strategic, visionary, focused on career trajectory; connects capability to opportunity
- **Signature Belief:** "Missionary beats mercenary. Your job is to get 1% better every day. Discipline beats talent."

**System Prompt Focus:** Career growth strategy, learner outcomes, execution mindset, practical employability

---

## Features

✅ **Three Distinct AI Personas** — Each with research-backed system prompts  
✅ **Persona Switcher** — Clean tab interface to switch between personas instantly  
✅ **Automatic Chat Reset** — Conversation resets when persona changes to prevent context contamination  
✅ **Suggestion Chips** — Persona-specific quick-start questions for easy conversation starters  
✅ **Typing Indicator** — Visual feedback while the API processes responses  
✅ **Responsive Design** — Works seamlessly on desktop, tablet, and mobile  
✅ **Graceful Error Handling** — User-friendly messages if API fails or key is missing  
✅ **Demo Mode** — Test without API key using `DEMO_MODE=true` environment variable  
✅ **Health Endpoint** — `/health` endpoint reports server status and current mode  
✅ **Server-Side Prompts** — System prompts kept secure in backend; frontend sends only user messages  
✅ **Lazy API Client** — OpenAI client only created if API key exists; prevents boot failures in local dev

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Vite 7 |
| **Backend** | Node.js, Express 4, OpenAI JavaScript SDK |
| **Build Tools** | Vite (frontend), Nodemon (backend dev) |
| **Config** | dotenv, CORS, concurrently |
| **Package Manager** | npm (monorepo with workspaces) |
| **LLM Integration** | OpenAI Chat Completions API (GPT-4 / GPT-3.5-turbo) |

---

## Project Structure

```
Persona-Based-AI-Chatbot/
├── backend/
│   ├── server.js              # Express server, API routes, /api/chat handler
│   ├── prompts.js             # System prompts for all three personas
│   ├── package.json
│   |
│   └── .env                   # (create this with your API key)
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main chat interface & persona switcher
│   │   ├── main.tsx           # React entry point
│   │   ├── lib/
│   │   │   ├── api.ts         # sendChatRequest() function
│   │   │   └── personas.ts    # Persona UI metadata (labels, colors, chips)
│   │   ├── components/        # ChatMessage, SuggestionChips, TypingIndicator, etc.
│   │   ├── index.css
│   │   └── App.css
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── public/
├── README.md                  # This file
├── package.json               # Root workspace config

```

---

## How It Works

1. **User selects a persona** → Frontend updates active persona state and resets conversation history
2. **User sends a message** → Frontend captures input and calls `/api/chat` endpoint
3. **Backend receives request** → Express route validates persona and message content
4. **System prompt injection** → Backend retrieves the persona's system prompt from `prompts.js`
5. **API call** → Messages array `[{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }]` sent to OpenAI
6. **Response streaming** → Model generates response, backend returns to frontend
7. **UI update** → Response appears in chat with persona's styling; typing indicator disappears

**Key Flow Diagram:**
```
User Input → Frontend → POST /api/chat → Backend (Persona Lookup) 
  → System Prompt Injection → OpenAI API → Response → Frontend Chat UI
```

---

## Installation

### Prerequisites
Ensure these are installed on your system:
- **Node.js** 18 or higher
- **npm** 9 or higher
- **OpenAI API Key** (from https://platform.openai.com/api-keys)

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your OpenAI API key to .env
# OPENAI_API_KEY=sk-your-actual-key-here
# PORT=3001

# Start the backend server
npm start
# OR for development with auto-reload:
npm run dev
```

**Backend will run on:** `http://localhost:3001`

### Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Frontend will run on:** `http://localhost:5173` (or next available port)

### Run Both Together (from root)

```bash
# Install root workspace dependencies
npm install

# Start both frontend and backend concurrently
npm run dev
```

This will start:
- Backend on `http://localhost:3001`
- Frontend on `http://localhost:5173`

Open your browser to the frontend URL and start chatting.

---

## API Endpoint

### `POST /api/chat`

Sends a user message with a selected persona and returns the model's response.

**Request Body:**
```json
{
  "persona": "anshuman",
  "messages": [
    {
      "role": "user",
      "content": "How do I master data structures?"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "reply": "Data structures aren't formulas to memorize—they're tools to solve problems efficiently. Here's how I think about it: every data structure is a tradeoff between time and space..."
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Invalid persona. Valid options: anshuman, abhimanyu, kshitij"
}
```

**Response (500 Server Error):**
```json
{
  "error": "Failed to get response from OpenAI. Please try again."
}
```

**Valid Persona Values:**
- `"anshuman"` — Anshuman Singh
- `"kshitij"` — Kshitij Mishra
- `"abhimanyu"` — Abhimanyu Saxena

---

## Prompt Design

Each persona's system prompt in `backend/prompts.js` includes all five required components:

### ✅ Persona Description
A detailed paragraph describing who the person is, their background, values, and why they matter.

**Example (Anshuman):**
```
"You are Anshuman Singh, co-founder of Scaler Academy and ex-Facebook engineer. 
You are a 2× ACM ICPC World Finalist known for your mission-driven leadership 
and uncompromising stance on engineering depth and fundamentals..."
```

### ✅ Few-Shot Examples
3+ embedded Q&A pairs showing the *exact tone and structure* you want in responses.

**Example:**
```javascript
examples: [
  {
    user: "What's the difference between a good engineer and a great engineer?",
    assistant: "The gap isn't talent—it's discipline. A good engineer ships features. 
    A great engineer ships systems that scale. It's about thinking in terms of 
    tradeoffs, not just code..."
  },
  // ... 2+ more examples
]
```

### ✅ Chain-of-Thought Instruction
Tells the model to reason internally before responding.

**Example:**
```
"Think step-by-step: First, understand what the user is really asking. 
Second, relate it to a real-world engineering principle. Third, give a direct, 
actionable answer. Do not be generic."
```

### ✅ Output Instruction
Specifies format, length, tone, and how to end responses.

**Example:**
```
"Keep your response to 3–5 sentences. Be direct and practical. 
If relevant, end with a question that pushes the user to think deeper."
```

### ✅ Constraints
Define what the persona must *never* do.

**Example:**
```
"Constraints:
- Never pretend to be someone else; you are only Anshuman Singh.
- Never give generic advice (e.g., 'work hard'); always tie to deeper principles.
- Never claim credentials you don't have.
- Never violate your core belief that 'skills are earned, not certified.'"
```

**See `prompts.md` for the complete annotated system prompts.**

---

## Error Handling

The backend is designed to handle:

| Error Type | Example | Handling |
|-----------|---------|----------|
| **Missing API Key** | `OPENAI_API_KEY` not set | Falls back to `DEMO_MODE` if enabled; otherwise returns 500 error |
| **Invalid Persona** | `"persona": "unknown"` | Returns 400 with valid persona list |
| **Empty Message** | `"messages": []` | Returns 400 with validation error |
| **OpenAI API Failure** | Service down (503) | Returns 500 with friendly message; logs error |
| **Rate Limit (429)** | Too many requests | Returns 429; frontend shows "Try again in a moment" |
| **Malformed JSON** | Invalid request body | Express middleware catches; returns 400 |

**Demo Mode Fallback:**
If `DEMO_MODE=true` in `.env`, the backend returns hardcoded persona-specific replies without calling the OpenAI API. Great for testing locally without an API key.

---

## Environment Variables

Create a `backend/.env` file with these variables:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | Yes (unless `DEMO_MODE=true`) | Your OpenAI API key | `sk-proj-abc123...` |
| `PORT` | No | Backend server port (default: 3001) | `3001` |
| `DEMO_MODE` | No | Enable hardcoded demo replies (default: false) | `true` or `false` |
| `CLIENT_ORIGIN` | No | Allowed frontend URL for CORS (default: http://localhost:5173) | `https://your-domain.com` |
| `MODEL` | No | OpenAI model to use (default: gpt-3.5-turbo) | `gpt-4`, `gpt-3.5-turbo` |

**Example `.env` file:**
```
OPENAI_API_KEY=sk-proj-your-key-here
PORT=3001
DEMO_MODE=false
CLIENT_ORIGIN=http://localhost:5173
MODEL=gpt-3.5-turbo
```

---

## Current Limitations

- **API Rate Limits** — Free-tier OpenAI usage can hit rate limits quickly during heavy testing
- **Conversation Memory** — No persistent history unless explicitly passed in messages array
- **Streaming** — Responses are not streamed; full response waits before displaying
- **Persona Behavior** — Quality depends entirely on prompt quality and model consistency
- **Local Storage** — Chat history cleared on page refresh; not persisted
- **No User Auth** — No authentication; any user can call the API
- **No Analytics** — No usage tracking or analytics on model behavior

---

## Future Improvements

- 📝 **Persistent Chat History** — Save conversations to localStorage or database
- 🌊 **Streaming Responses** — Stream tokens as they're generated for faster perceived performance
- 📊 **Usage Analytics** — Track model costs, response times, and user preferences
- 🔐 **User Authentication** — Add login/signup for personalized chat history
- 🎨 **Prompt Management UI** — Edit system prompts via admin panel without code redeploy
- 🌍 **Deployment Automation** — CI/CD pipeline for automatic deployment on push
- 🧪 **Prompt Testing Suite** — Automated tests to verify persona consistency
- 🔊 **Text-to-Speech** — Voice responses with persona-specific voices
- 📱 **Progressive Web App** — Offline support with service workers

---

## Why This Project Matters

This is **not just a chatbot UI**. It is a **prompt-engineering exercise** demonstrating how:

1. **Research → System Prompt Quality** — Investing time in understanding real people creates authentic prompts
2. **GIGO Principle in Practice** — Weak prompts (`"be helpful"`) = generic responses; strong prompts (grounded in research + CoT + few-shot) = distinctive voices
3. **Structure Matters** — Separating persona description, examples, output instructions, and constraints keeps the model aligned
4. **Frontend Doesn't See Secrets** — System prompts live server-side; frontend only sends user content
5. **Error Handling Wins** — Graceful fallbacks (demo mode, friendly error messages) improve UX without compromising safety

**The core lesson:** Prompt quality directly reflects the effort put into research, structure, and examples. There are no shortcuts.

---

## Deployment

### Build for Production

```bash
# Build the React frontend
npm run build --prefix frontend

# This creates `frontend/dist/` with optimized files
```

### Deploy to Railway / Render / Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to deployment platform** (Railway, Render, Netlify, Vercel, etc.)

3. **Configure Build & Start Commands**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

4. **Set Environment Variables**
   - `OPENAI_API_KEY=sk-...`
   - `PORT=3001`
   - `CLIENT_ORIGIN=https://your-deployed-domain.com`

5. **Deploy** and share your live URL in this README

---

## Documentation

- **[prompts.md](./prompts.md)** — Detailed annotation of all three system prompts with design rationale
- **[reflection.md](./reflection.md)** — 300–500 word reflection on what worked, GIGO learnings, and improvements

---

## Submission Checklist

- ✅ GitHub repository is public with clean structure
- ✅ README.md with setup instructions and deployment link (add link once live)
- ✅ `.env.example` file present; no real API keys in repo
- ✅ All three personas implemented with distinct, research-backed system prompts
- ✅ Frontend: persona switcher, suggestion chips, typing indicator, mobile-responsive
- ✅ Backend: API validation, system prompt injection, error handling
- ✅ `prompts.md` with annotated system prompts and design decisions
- ✅ `reflection.md` with GIGO learnings and improvements
- ✅ App is deployed and live (add URL at top of README)
- ✅ Persona switching resets conversation correctly
- ✅ Error handling works without crashes

---

## License

This is an open-source project demonstrating prompt engineering with multiple AI personas and real-time LLM integration.

---

## Questions?

- **How do system prompts work?** See `backend/prompts.js` and `prompts.md`
- **How is the frontend structured?** See `frontend/src/App.tsx` and components
- **Why is the chat reset on persona switch?** To prevent context mixing and keep conversations isolated
- **Can I test without an API key?** Yes! Set `DEMO_MODE=true` in `backend/.env`
- **How do I deploy this?** See Deployment section above

---



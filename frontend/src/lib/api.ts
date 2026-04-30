interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequestPayload {
  persona: string;
  messages: Message[];
}

interface ChatResponse {
  reply: string;
  error?: string;
}

export async function sendChatRequest({ persona, messages }: ChatRequestPayload): Promise<ChatResponse> {
  const apiUrl = import.meta.env.DEV 
    ? "http://localhost:3001/api/chat"
    : "https://persona-based-ai-chatbot-backend.vercel.app/api/chat";
  
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ persona, messages }),
  });

  const data: ChatResponse = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate a response.");
  }

  return data;
}

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
  const response = await fetch("https://persona-based-ai-chatbot-backend-1w.vercel.app/api/chat", {
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

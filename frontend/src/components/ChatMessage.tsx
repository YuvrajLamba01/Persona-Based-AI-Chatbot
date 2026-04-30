import React from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps): React.ReactElement {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[92%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-lg md:max-w-[80%] ${
          isUser
            ? "bg-slate-100 text-slate-950"
            : "border border-white/10 bg-slate-900/70 text-slate-100 backdrop-blur"
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}

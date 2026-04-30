import React from "react";

export default function TypingIndicator(): React.ReactElement {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-2 rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-200 backdrop-blur">
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.2s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.1s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" />
      </div>
    </div>
  );
}

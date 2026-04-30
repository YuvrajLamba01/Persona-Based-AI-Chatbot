import { useEffect, useMemo, useRef, useState, ChangeEvent, FormEvent, ReactElement } from "react";

import ChatMessage from "./components/ChatMessage.tsx";
import ErrorToast from "./components/ErrorToast.tsx";
import SuggestionChips from "./components/SuggestionChips.tsx";
import TypingIndicator from "./components/TypingIndicator.tsx";
import { personas } from "./lib/personas.ts";
import { sendChatRequest } from "./lib/api.ts";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const defaultPersona = "anshuman";

export default function App(): ReactElement {
  const [activePersona, setActivePersona] = useState<string>(defaultPersona);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const persona = personas[activePersona];
  const suggestionChips = useMemo(() => persona.quickPrompts, [persona]);

  // Reset the conversation whenever the persona changes so context never leaks across personas.
  useEffect(() => {
    setMessages([]);
    setInput("");
    setError("");
  }, [activePersona]);

  // Keep the latest message in view while the conversation grows.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  // Read backend health once so the UI can show whether it is using the demo fallback.
  useEffect(() => {
    const controller = new AbortController();

    const loadHealth = async (): Promise<void> => {
      try {
        const response = await fetch("/health", {
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setIsDemoMode(Boolean(data?.demoMode));
      } catch {
        // If the health check fails, keep the UI usable and leave the badge hidden.
      }
    };

    loadHealth();

    return () => controller.abort();
  }, []);

  const handlePersonaChange = (personaKey: string): void => {
    if (personaKey !== activePersona) {
      setActivePersona(personaKey);
    }
  };

  const submitMessage = async (value: string): Promise<void> => {
    const trimmed = value.trim();

    if (!trimmed || isSending) {
      return;
    }

    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setError("");

    try {
      // Send the full conversation slice for the active persona.
      const { reply } = await sendChatRequest({
        persona: activePersona,
        messages: nextMessages,
      });

      // Append the assistant response after the API resolves.
      setMessages((currentMessages) => [...currentMessages, { role: "assistant", content: reply }]);
    } catch (requestError) {
      // Surface network or API failures without breaking the chat flow.
      const message = requestError instanceof Error ? requestError.message : "Failed to send message.";
      setError(message);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    await submitMessage(input);
  };

  const handleChipSelect = async (chip: string): Promise<void> => {
    await submitMessage(chip);
  };

  return (
    <div className="h-screen overflow-hidden bg-[#07111f] text-white">
      <ErrorToast message={error} onDismiss={() => setError("")} />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.14),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.14),_transparent_35%)]" />

      <main className="relative h-screen w-full flex items-center justify-center px-2 md:px-3">
        <section className="w-full h-[95vh] md:h-[90vh] rounded-2xl md:rounded-[2rem] border border-white/10 bg-white/5 shadow-glow backdrop-blur-xl flex flex-col md:flex-row">
          {/* Personas sidebar */}
          <div className="w-full md:w-[28%] lg:w-[25%] border-b md:border-b-0 md:border-r border-white/10 p-2 md:p-4 overflow-x-auto md:overflow-y-auto flex-shrink-0">
            <div className="flex md:flex-col gap-2 md:gap-3 w-max md:w-full">
              {["anshuman", "abhimanyu", "kshitij"].map((personaKey) => {
                const persona = personas[personaKey];
                const isActive = activePersona === personaKey;

                return (
                  <button
                    key={personaKey}
                    type="button"
                    onClick={() => setActivePersona(personaKey)}
                    className={`rounded-lg md:rounded-2xl border px-2.5 md:px-4 py-2 md:py-4 text-left transition-all duration-200 whitespace-nowrap md:whitespace-normal flex-shrink-0 md:flex-shrink min-w-max md:min-w-0 ${
                      isActive
                        ? `border-white/20 bg-gradient-to-r ${persona.accent} text-slate-950 shadow-glow`
                        : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5 md:gap-2">
                      <div className="flex-1">
                        <p className={`text-xs font-semibold tracking-wide ${isActive ? "text-slate-950/70" : "text-slate-300"}`}>
                          Persona
                        </p>
                        <h2 className="mt-0.5 md:mt-1 text-sm md:text-lg font-semibold leading-tight">{persona.label}</h2>
                      </div>
                      <span className={`h-2 w-2 md:h-3 md:w-3 rounded-full flex-shrink-0 mt-1 ${isActive ? "bg-slate-950/70" : "bg-white/50"}`} />
                    </div>
                    <p className={`mt-1 md:mt-2 text-xs leading-4 md:leading-6 hidden md:block ${isActive ? "text-slate-950/80" : "text-slate-400"}`}>
                      {persona.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat area */}
          <section className="flex flex-col overflow-hidden flex-1 md:border-0">
            <div className="flex-1 space-y-1 md:space-y-3 overflow-y-auto p-2 md:p-4 min-h-0">
              {messages.length === 0 ? (
                <div className="rounded-lg md:rounded-2xl border border-dashed border-white/15 bg-white/5 p-2 md:p-4 text-xs md:text-sm leading-5 md:leading-6 text-slate-300">
                  Start a conversation. {persona.label} will respond.
                </div>
              ) : (
                messages.map((message, index) => <ChatMessage key={`${message.role}-${index}`} role={message.role} content={message.content} />)
              )}

              {isSending ? <TypingIndicator /> : null}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-white/10 p-1.5 md:p-3 flex-shrink-0">
              <div className="max-h-10 md:max-h-12 overflow-x-auto overflow-y-hidden mb-1.5 md:mb-2">
                <SuggestionChips chips={suggestionChips} onSelect={handleChipSelect} chipClassName={persona.chipClass} />
              </div>

              <form onSubmit={handleSubmit} className="flex gap-1 md:gap-2">
                <textarea
                  value={input}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
                  placeholder="Message..."
                  rows={1}
                  className="min-h-[1.75rem] md:min-h-[2.5rem] flex-1 resize-none rounded-lg md:rounded-xl border border-white/10 bg-white/5 px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-300/50 focus:bg-white/10 leading-tight"
                />

                <button
                  type="submit"
                  disabled={isSending || !input.trim()}
                  className="inline-flex items-center justify-center rounded-lg md:rounded-xl bg-white px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:bg-white/25 disabled:text-slate-400 min-w-[50px] md:min-w-[80px] flex-shrink-0"
                >
                  {isSending ? "..." : "Send"}
                </button>
              </form>

              {error ? <p className="mt-1 text-xs text-red-300">{error}</p> : null}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

// src/components/koshi/KoshiChat.jsx
import { useEffect, useRef, useState } from "react";
import koshi from "../../assets/koshi.svg";

export default function KoshiChat({
  open,
  onClose,
  userName = "Aarya",
  onOpen,
}) {
  // if parent already controls open/onClose, you can ignore onOpen; otherwise use internal button below
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("koshi:history");
    return saved
      ? JSON.parse(saved)
      : [
          {
            role: "assistant",
            content: `Hi ${userName}! I’m Koshi 🌱 — ask me anything about your footprint, receipts, or tips to go greener.`,
          },
        ];
  });

  const endRef = useRef(null);
  const popRef = useRef(null);

  // scroll new messages into view
  useEffect(() => {
    if (open)
      setTimeout(
        () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
        0
      );
  }, [open, history]);

  // esc to close
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && open && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  // click outside to close
  useEffect(() => {
    function handleClick(e) {
      if (!open) return;
      if (popRef.current && !popRef.current.contains(e.target)) onClose?.();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  useEffect(() => {
    localStorage.setItem("koshi:history", JSON.stringify(history));
  }, [history]);

  async function sendMessage(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setHistory((h) => [...h, { role: "user", content: text }]);
    setBusy(true);

    try {
      const res = await fetch("/api/koshi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      let data;
      if (res.ok) data = await res.json();
      else
        data = {
          reply:
            "Here’s a quick tip 🌿: choose transit twice this week to save about $6 and ~4.2 kg CO₂. Want me to set a reminder?",
        };
      setHistory((h) => [...h, { role: "assistant", content: data.reply }]);
    } catch {
      setHistory((h) => [
        ...h,
        {
          role: "assistant",
          content:
            "Hmm, I’m having trouble reaching the server. Try again in a moment!",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    // anchor cluster: launcher + popover
    <div className="fixed bottom-6 right-6 z-50">
      {/* launcher (logo button). If parent controls 'open', pass onOpen; else toggle here */}
      <button
        type="button"
        onClick={onOpen ?? (() => (open ? onClose?.() : onClose?.(false)))}
        // If parent passes onOpen, prefer that; else clicking the logo won’t change 'open'.
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg ring-1 ring-black/10 hover:scale-105 transition"
        aria-label="Open Koshi chat"
      >
        <img src={koshi} alt="" className="h-8 w-8" />
        {/* online dot */}
        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-200 ring-2 ring-emerald-500" />
      </button>

      {/* popover */}
      <div
        ref={popRef}
        role="dialog"
        aria-modal="true"
        aria-label="Koshi chat"
        className={`absolute bottom-16 right-0 w-[22rem] max-h-[60vh]
          overflow-hidden rounded-2xl bg-[rgb(14,23,19)]/98 text-white shadow-2xl ring-1 ring-white/10
          transition transform origin-bottom-right
          ${
            open
              ? "opacity-100 scale-100 translate-y-0"
              : "pointer-events-none opacity-0 scale-95 translate-y-2"
          }`}
      >
        {/* little arrow */}
        <div className="absolute -bottom-2 right-7 h-4 w-4 rotate-45 bg-[rgb(14,23,19)]/98 ring-1 ring-white/10"></div>

        {/* header (compact) */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-white/10">
          <img src={koshi} alt="" className="h-6 w-6" />
          <div className="leading-tight">
            <div className="font-semibold">Koshi</div>
            <div className="text-[10px] text-white/60">
              Your sustainability copilot
            </div>
          </div>
          <button
            onClick={() => onClose?.()}
            className="ml-auto rounded-md px-2 py-1 text-xs text-white/70 hover:bg-white/10"
          >
            Esc
          </button>
        </div>

        {/* messages */}
        <div className="flex max-h-[calc(60vh-110px)] min-h-[180px] flex-col gap-2 overflow-y-auto px-3 py-2">
          {history.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  m.role === "user"
                    ? "bg-emerald-500 text-black"
                    : "bg-white/5 text-white"
                } max-w-[80%] rounded-2xl px-3 py-2 text-[13px] shadow`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* input */}
        <form onSubmit={sendMessage} className="border-t border-white/10 p-2">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder="Ask Koshi… (Shift+Enter)"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) sendMessage(e);
              }}
              className="grow resize-none rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 placeholder:text-white/40 focus:ring-2 focus:ring-emerald-400"
            />
            <button
              disabled={busy}
              className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-50"
            >
              Send
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              "What’s my green score?",
              "How do I scan receipts?",
              "Give me a money + CO₂ tip",
            ].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setInput(s)}
                className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/80 ring-1 ring-white/10 hover:bg-white/10"
              >
                {s}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}

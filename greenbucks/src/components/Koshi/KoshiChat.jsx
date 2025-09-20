// src/components/koshi/KoshiChat.jsx
import { useEffect, useRef, useState } from "react";
import koshi from "../../assets/koshi.svg";

export default function KoshiChat({ open, onClose, userName = "Aarya" }) {
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

  useEffect(() => {
    if (open)
      setTimeout(
        () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
        0
      );
  }, [open, history]);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
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
      // --- swap this with your real backend later ---
      const res = await fetch("/api/koshi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      let data;
      if (res.ok) {
        data = await res.json();
      } else {
        // fallback mock
        data = {
          reply: `Here’s a quick tip 🌿: choose transit twice this week to save about $6 and ~4.2 kg CO₂. Want me to set a reminder?`,
        };
      }
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
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* dim backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md
          bg-[rgb(14,23,19)]/98 text-white shadow-2xl ring-1 ring-white/10
          transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        role="dialog"
        aria-modal="true"
        aria-label="Koshi chat"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={koshi} alt="" className="h-8 w-8" />
            <div>
              <div className="font-semibold">Koshi</div>
              <div className="text-xs text-white/60">
                Your sustainability copilot
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-white/70 hover:bg-white/10"
          >
            Esc
          </button>
        </div>

        {/* messages */}
        <div className="flex h-[calc(100%-140px)] flex-col gap-3 overflow-y-auto px-4 py-3">
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
                } max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* input */}
        <form onSubmit={sendMessage} className="border-t border-white/10 p-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder="Ask Koshi… (Shift+Enter for newline)"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) sendMessage(e);
              }}
              className="grow resize-none rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 placeholder:text-white/40 focus:ring-2 focus:ring-emerald-400"
            />
            <button
              disabled={busy}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-50"
            >
              Send
            </button>
          </div>
          {/* quick suggestions */}
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
                className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10 hover:bg-white/10"
              >
                {s}
              </button>
            ))}
          </div>
        </form>
      </aside>
    </div>
  );
}

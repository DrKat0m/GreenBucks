// src/components/koshi/FloatingKoshiButton.jsx
import { useEffect } from "react";
import koshi from "../../assets/koshi.svg";

export default function FloatingKoshiButton({ onOpen }) {
  useEffect(() => {
    const onKey = (e) => {
      const isK = (e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey);
      if (isK) {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpen]);

  return (
    <button
      onClick={onOpen}
      aria-label="Chat with Koshi"
      className="
        group fixed bottom-6 right-6 z-50
        rounded-full p-0.5 shadow-lg ring-1 ring-white/10
        bg-gradient-to-b from-emerald-400 to-emerald-500
        hover:from-emerald-300 hover:to-emerald-500
        focus:outline-none focus:ring-2 focus:ring-emerald-300
      "
    >
      <span className="relative block rounded-full bg-black/10">
        <img src={koshi} alt="" className="h-14 w-14 p-2" />
        {/* subtle pulse */}
        <span className="absolute inset-0 -z-10 rounded-full animate-[ping_2s_ease-in-out_infinite] bg-emerald-500/20" />
      </span>
      <span
        className="pointer-events-none absolute -top-9 right-0 translate-x-2 rounded-lg bg-black/70 px-2 py-1 text-xs text-white opacity-0 shadow
                       transition group-hover:opacity-100"
      >
        Chat with Koshi (⌘/Ctrl + K)
      </span>
    </button>
  );
}

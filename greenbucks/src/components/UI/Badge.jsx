import { cn } from "../../lib/cn";
export function Badge({ variant = "default", className, ...p }) {
  const map = {
    default: "bg-white/10 text-[var(--text)] ring-1 ring-[var(--ring)]",
    eco: "bg-[color:rgba(34,197,94,.18)] text-[var(--accent)] ring-1 ring-[color:rgba(34,197,94,.35)]",
    danger:
      "bg-[color:rgba(239,68,68,.15)] text-[color:#f87171] ring-1 ring-[color:rgba(239,68,68,.35)]",
  };
  return (
    <span
      className={cn("text-xs px-2 py-1 rounded-lg", map[variant], className)}
      {...p}
    />
  );
}

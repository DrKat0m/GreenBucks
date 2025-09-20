import { cn } from "../../lib/cn";
export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl bg-black/30 text-[var(--text)] placeholder-white/40 outline-none ring-1 ring-[var(--ring)] focus:ring-[var(--accent)] px-3 py-2",
        className
      )}
      {...props}
    />
  );
}

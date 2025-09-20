// src/components/UI/Card.jsx
import { cn } from "../../lib/cn";

export function Card({ className, children, glow = "teal", hover = true }) {
  // you can add more palettes if you want
  const palettes = {
    charcoalGreen:
      // darker muted green glow
      "shadow-[0_18px_50px_-18px_rgba(20,40,20,0.6)] " + // dark green shadow
      "before:bg-[radial-gradient(85%_60%_at_50%_-10%,rgba(20,40,20,0.35),transparent_70%)]",

    // keep emerald if you still want the option
    emerald:
      "shadow-[0_18px_50px_-18px_rgba(16,185,129,0.28)] " +
      "before:bg-[radial-gradient(85%_60%_at_50%_-10%,rgba(16,185,129,0.22),transparent_70%)]",
  };

  return (
    <div
      className={cn(
        // base surface
        "relative rounded-2xl bg-white/[0.04] backdrop-blur-[2px]",
        "ring-1 ring-white/10",
        // glow layer (behind the card via ::before)
        "before:pointer-events-none before:absolute before:inset-[-1px] before:-z-10",
        "before:rounded-2xl before:opacity-70 before:transition-opacity before:duration-300",
        palettes[glow] ?? palettes.charcoalGreen,
        // hover affordances
        hover &&
          "transition-all duration-300 hover:-translate-y-[1px] hover:before:opacity-100",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn("px-4 pt-4 pb-2", className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return (
    <h3 className={cn("text-base font-semibold tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children }) {
  return <p className={cn("text-sm text-white/60", className)}>{children}</p>;
}

export function CardContent({ className, children }) {
  return <div className={cn("px-4 pb-4", className)}>{children}</div>;
}

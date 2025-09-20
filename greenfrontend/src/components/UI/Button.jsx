import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-[var(--accent)] text-black hover:brightness-110",
        secondary: "bg-white/10 text-[var(--text)] hover:bg-white/15",
        outline: "border border-white/10 hover:bg-white/10",
        ghost: "hover:bg-white/10",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-9 px-4",
        lg: "h-11 px-5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

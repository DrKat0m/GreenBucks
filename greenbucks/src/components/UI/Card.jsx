import { cn } from "../../lib/cn";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-[var(--card)] ring-1 ring-[var(--ring)] shadow-sm",
        className
      )}
      {...props}
    />
  );
}
export function CardHeader({ className, ...p }) {
  return <div className={cn("p-5 pb-3", className)} {...p} />;
}
export function CardTitle({ className, ...p }) {
  return <h3 className={cn("text-lg font-semibold", className)} {...p} />;
}
export function CardDescription({ className, ...p }) {
  return <p className={cn("text-sm text-[var(--muted)]", className)} {...p} />;
}
export function CardContent({ className, ...p }) {
  return <div className={cn("p-5 pt-0", className)} {...p} />;
}
export function CardFooter({ className, ...p }) {
  return <div className={cn("p-5 pt-0", className)} {...p} />;
}

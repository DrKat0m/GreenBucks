export function Label({ className = "", ...p }) {
  return <label className={"block text-sm mb-1 " + className} {...p} />;
}

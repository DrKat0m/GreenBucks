import leaves from "../../assets/greenbkg.jpeg";
export default function EcoBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 bg-[var(--bg)]" />
      <div
        className="absolute right-[-8%] top-[-6%] h-[68vh] w-[68vw] opacity-[.16] blur-[6px] rounded-[80px] bg-cover bg-center rotate-[-2deg]"
        style={{ backgroundImage: `url(${leaves})` }}
      />
    </div>
  );
}

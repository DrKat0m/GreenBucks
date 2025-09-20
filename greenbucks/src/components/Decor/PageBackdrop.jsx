// src/components/Decor/PageBackdrop.jsx
import greenbkg from "../../assets/greenbkg.jpeg";

export default function PageBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <img
        src={greenbkg}
        alt=""
        className="
          absolute inset-0 h-full w-full object-cover
          scale-[1.15]
          blur-3xl
          brightness-[0.28]
          saturate-[0.8]
        "
      />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/50" />
    </div>
  );
}

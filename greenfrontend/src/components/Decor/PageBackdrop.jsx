// src/components/Decor/PageBackdrop.jsx
import greenbkg from "../../assets/greenbkg.jpeg";

export default function PageBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <img
        src={greenbkg}
        alt=""
        className="
          absolute inset-0 h-full w-full object-cover
          scale-[1.12]
          blur-2xl
          brightness-[0.45]   /* was too dark before */
          saturate-[0.95]
        "
      />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,transparent_35%,rgba(0,0,0,0.35)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/45" />
    </div>
  );
}

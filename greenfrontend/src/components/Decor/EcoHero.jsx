// src/components/Decor/EcoHero.jsx
import { useNavigate } from "react-router-dom";
import greenbkg from "../../assets/greenbkg.jpeg";

export default function EcoHero() {
  const name = "Aarya"; // you can pull from store if needed
  const NAVBAR_H = 72; // match your sticky header height
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative isolate w-full overflow-hidden"
      style={{ minHeight: `calc(100vh - ${NAVBAR_H}px)` }}
    >
      {/* Background image */}
      <img
        src={greenbkg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Darken & vignette for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
      <div className="absolute inset-0 [mask-image:radial-gradient(80%_60%_at_50%_35%,#000_20%,transparent_70%)]" />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 sm:py-28 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            Welcome back, <span className="text-emerald-300">{name}</span>
            <span className="align-super text-emerald-300/80">🌱</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">
            Sustainability is a daily habit, not a destination.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-2xl bg-emerald-500/90 px-5 py-3 font-semibold text-black hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              Open dashboard
            </button>

            <button
              onClick={() => navigate("/about")}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 hover:bg-white/10"
            >
              Learn more
            </button>
          </div>
        </div>
      </div>

      {/* Smooth blend into page background */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#0a0f0a]" />
    </section>
  );
}

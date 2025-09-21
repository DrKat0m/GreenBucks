// src/components/Decor/EcoHero.jsx
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import useStore from "../../lib/store";
import greenbkg from "../../assets/greenbkg.jpeg";

export default function EcoHero({ onOpenDashboard }) {
  const user = useStore((s) => s.user);
  const name = useMemo(
    () => (user?.name ? user.name.split(" ")[0] : "there"),
    [user]
  );
  const NAVBAR_H = 80; // match your sticky header height (h-20 = 80px)
  const navigate = useNavigate();

  const handleOpenDashboard = () => {
    navigate("/dashboard");
  };

  const handleLearnMore = () => {
    navigate("/about"); // ⬅️ Always navigate to About page
  };

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
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
            Welcome, <span className="text-emerald-300">{name}</span>
            <span className="align-super text-emerald-300/80">🌱</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-xl text-white/80">
            Sustainability is a daily habit, not a destination.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleOpenDashboard}
              className="rounded-2xl bg-emerald-500/90 px-6 py-4 text-lg font-semibold text-black hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              Dashboard
            </button>

            <button
              onClick={handleLearnMore}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-lg hover:bg-white/10"
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

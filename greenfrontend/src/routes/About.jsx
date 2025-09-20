// src/routes/About.jsx
import { Leaf, Sparkles, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const charcoalGlow =
  "shadow-[0_18px_50px_-18px_rgba(20,40,20,0.6)] " +
  "before:absolute before:inset-0 before:-z-10 " +
  "before:bg-[radial-gradient(85%_60%_at_50%_-10%,rgba(20,40,20,0.35),transparent_70%)]";

export default function About() {
  const nav = useNavigate();

  return (
    <div
      id="about"
      className="scroll-mt-24 mx-auto max-w-6xl px-6 sm:px-8 py-16 space-y-16"
    >
      {/* HERO */}
      <section aria-labelledby="about-title">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300 ring-1 ring-emerald-400/20">
          <Sparkles size={14} />
          <span className="text-xs font-medium tracking-wide">
            About GreenBucks
          </span>
        </div>

        <h1 id="about-title" className="mt-6 text-4xl font-bold sm:text-5xl">
          Spend smarter, <span className="text-emerald-300">live greener</span>.
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-white/80">
          GreenBucks turns everyday purchases into climate progress. We analyze
          your receipts or connected account activity to surface{" "}
          <em>low-impact choices</em>, reward them with points, and coach you
          toward habits that reduce emissions and save money.
        </p>
      </section>

      {/* WHAT WE DO */}
      <section className="grid gap-6 sm:grid-cols-3" aria-label="What we do">
        <InfoCard
          icon={<Leaf className="text-emerald-300" />}
          title="Detect greener buys"
          desc="We tag purchases like transit, local produce, and reusables as eco-positive and track your monthly green score."
        />
        <InfoCard
          icon={<Trophy className="text-emerald-300" />}
          title="Reward good habits"
          desc="Earn Eco Points for verified green activity. Climb leaderboards and unlock community challenges."
        />
        <InfoCard
          icon={<Sparkles className="text-emerald-300" />}
          title="Coach with facts"
          desc="Personalized, bite-size tips that swap high-carbon choices for greener alternatives you’ll actually use."
        />
      </section>

      {/* HOW IT HELPS THE ENVIRONMENT */}
      <section
        aria-labelledby="impact-title"
        className={`relative rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 ${charcoalGlow}`}
      >
        <h2 id="impact-title" className="text-2xl font-semibold">
          How your actions create impact
        </h2>
        <ul className="mt-4 space-y-3 text-white/80">
          <li>
            <b>Mode shift:</b> Choosing bus/rail over rideshare reduces
            transport emissions dramatically per trip.
          </li>
          <li>
            <b>Lower-impact goods:</b> Buying seasonal/local produce and durable
            goods cuts upstream supply-chain carbon.
          </li>
          <li>
            <b>Use, not waste:</b> Refill/reuse purchases decrease packaging and
            landfill impact over time.
          </li>
          <li>
            <b>Feedback loop:</b> Scores, points, and tips nudge repeat
            behavior—small wins compounded weekly add up.
          </li>
        </ul>

        <p className="mt-4 text-sm text-white/60">
          We translate these choices into an estimated CO₂e reduction using
          public factors (e.g., transit vs. car, typical food footprints).
          Numbers are directional—not medical-grade—so you focus on{" "}
          <i>better</i>, not perfect.
        </p>
      </section>

      {/* HOW IT WORKS (STEPS) */}
      <section aria-labelledby="how-title">
        <h2 id="how-title" className="text-2xl font-semibold">
          How it works
        </h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          <Step n="1" title="Connect or upload">
            Link an account or drop a receipt. We only read purchase data—not
            card numbers.
          </Step>
          <Step n="2" title="Get your green score">
            We tag eco-positive items and show your monthly trends and
            categories.
          </Step>
          <Step n="3" title="Earn & improve">
            Join challenges, collect Eco Points, and follow quick tips tailored
            to your spend.
          </Step>
        </ol>
      </section>

      {/* CTA */}
      <section
        className={`relative rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 ${charcoalGlow}`}
      >
        <h2 className="text-2xl font-semibold">
          Ready to start making greener moves?
        </h2>
        <p className="mt-2 text-white/75">
          Head to your dashboard to connect accounts or upload a receipt—your
          first points are one purchase away.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => nav("/")}
            className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            Home
          </button>
        </div>
      </section>
    </div>
  );
}

/* --- small internal components --- */

function InfoCard({ icon, title, desc }) {
  return (
    <div
      className={`
        relative rounded-2xl p-5 
        bg-white/5 ring-1 ring-white/10
        shadow-[0_18px_50px_-18px_rgba(20,40,20,0.6)]
        before:absolute before:inset-0 before:-z-10
        before:bg-[radial-gradient(85%_60%_at_50%_-10%,rgba(20,40,20,0.35),transparent_70%)]
      `}
    >
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-400/20">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-white/75">{desc}</p>
    </div>
  );
}

function Step({ n, title, children }) {
  return (
    <li
      className={`
        relative rounded-2xl p-5 
        bg-white/5 ring-1 ring-white/10
        shadow-[0_18px_50px_-18px_rgba(20,40,20,0.6)]
        before:absolute before:inset-0 before:-z-10
        before:bg-[radial-gradient(85%_60%_at_50%_-10%,rgba(20,40,20,0.35),transparent_70%)]
      `}
    >
      <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 text-sm font-semibold">
        {n}
      </div>
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-white/75">{children}</p>
    </li>
  );
}

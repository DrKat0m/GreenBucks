import { Leaf, Sparkles, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const nav = useNavigate();

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 py-16 space-y-14">
      {/* Hero */}
      <section>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300 ring-1 ring-emerald-400/20">
          <Sparkles size={14} />
          <span className="text-xs font-medium tracking-wide">
            About GreenBucks
          </span>
        </div>

        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">
          Small actions, <span className="text-emerald-300">big impact</span>.
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-white/70">
          GreenBucks helps you discover and reward sustainable spending. Upload
          receipts, connect your bank, and get clarity on your eco-positive
          purchases—while earning points, insights, and challenges along the
          way.
        </p>
      </section>

      {/* How it works */}
      <section className="grid gap-6 sm:grid-cols-3">
        <Card
          icon={<Leaf className="text-emerald-300" />}
          title="Track greener buys"
          desc="We flag eco-positive purchases and summarize your monthly green score."
        />
        <Card
          icon={<Trophy className="text-emerald-300" />}
          title="Earn eco points"
          desc="Rack up points for greener activity to unlock challenges and perks."
        />
        <Card
          icon={<Sparkles className="text-emerald-300" />}
          title="Coach tips"
          desc="Actionable nudges tailored to your spending patterns."
        />
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
        <h2 className="text-2xl font-semibold">Ready to make greener moves?</h2>
        <p className="mt-2 text-white/70">
          Head back to the dashboard to connect accounts or upload a receipt.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => nav("/")}
            className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            Go to dashboard
          </button>
          <button
            onClick={() => nav("/transactions")}
            className="rounded-xl bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/10"
          >
            Upload a receipt
          </button>
        </div>
      </section>
    </div>
  );
}

function Card({ icon, title, desc }) {
  return (
    <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-400/20">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-white/70">{desc}</p>
    </div>
  );
}

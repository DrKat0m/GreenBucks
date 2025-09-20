import { useEffect, useMemo, useState } from "react";
import useStore from "../../lib/store";
import { ChevronDown, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

const THOUGHTS = [
  "Small actions, big impact.",
  "Sustainability is a daily habit, not a destination.",
  "Choose greener, earn greener.",
  "Your purchases are your vote for the future.",
  "Every receipt is a chance to save the planet.",
];

export default function EcoHero() {
  const user = useStore((s) => s.user);
  const name = useMemo(
    () => (user?.name ? user.name.split(" ")[0] : "there"),
    [user]
  );

  const [idx, setIdx] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % THOUGHTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const goToDashboard = () => {
    nav("/dashboard");
  };

  return (
    <section className="relative isolate overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_0%,#0d2a1a40,transparent),radial-gradient(800px_400px_at_90%_10%,#0b3a1f40,transparent)]" />
        <div className="absolute inset-0 opacity-[0.08] [mask-image:radial-gradient(1000px_500px_at_50%_20%,black,transparent_70%)]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="dots"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
      </div>

      {/* center the content in viewport */}
      <div className="mx-auto grid min-h-[calc(100vh-72px)] place-items-center px-6 sm:px-8">
        <div className="w-full max-w-7xl">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Welcome back, <span className="text-emerald-300">{name}</span>{" "}
            <Leaf className="inline-block text-emerald-400" size={36} />
          </h1>

          <p className="mt-4 max-w-2xl text-xl text-white/70">
            {THOUGHTS[idx]}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              onClick={goToDashboard}
              className="inline-flex items-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              Open dashboard
            </button>

            <button
              onClick={() => nav("/about")}
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/10"
            >
              Learn more
              <ChevronDown size={16} className="opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

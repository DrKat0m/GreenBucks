// src/routes/Home.jsx
import { lazy, Suspense, useEffect } from "react";

// 🔻 only the hero on Home
const EcoHero = lazy(() => import("../components/Decor/EcoHero"));

// tiny requestIdleCallback polyfill for wider browser support
const rIC =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? window.requestIdleCallback
    : (cb) => setTimeout(() => cb({ timeRemaining: () => 50 }), 200);

export default function Home() {
  // Warm heavier routes in idle time for snappy navigation
  useEffect(() => {
    rIC(() => import("./Dashboard"));
    rIC(() => import("./Transactions"));
    rIC(() => import("./About"));
  }, []);

  return (
    <>
      <Suspense fallback={<SectionSkeleton title="Loading hero…" />}>
        <EcoHero />
      </Suspense>
    </>
  );
}

function SectionSkeleton({ title }) {
  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 py-16">
      <div className="h-8 w-64 rounded-lg bg-white/10" />
      <p className="mt-4 text-white/50">{title}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-40 rounded-2xl bg-white/5" />
        <div className="h-40 rounded-2xl bg-white/5" />
        <div className="h-40 rounded-2xl bg-white/5" />
      </div>
    </div>
  );
}

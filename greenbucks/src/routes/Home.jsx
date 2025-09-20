// src/routes/Home.jsx
import { lazy, Suspense, useEffect } from "react";
import LazyWhenVisible from "../components/Util/LazyWhenVisible";

// 🔻 lazy local sections
const EcoHero = lazy(() => import("../components/Decor/EcoHero"));
const Dashboard = lazy(() => import("./Dashboard"));
const Transactions = lazy(() => import("./Transactions"));
const About = lazy(() => import("./About"));

// tiny requestIdleCallback polyfill for wider browser support
const rIC =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? window.requestIdleCallback
    : (cb) => setTimeout(() => cb({ timeRemaining: () => 50 }), 200);

export default function Home() {
  // Warm the heavier chunks in idle time so in-view reveal feels instant
  useEffect(() => {
    rIC(() => {
      import("./Transactions");
    });
    rIC(() => {
      import("./About");
    });
  }, []);

  return (
    <>
      <Suspense fallback={<SectionSkeleton title="Loading hero…" />}>
        <EcoHero />
      </Suspense>

      <section id="dashboard" className="scroll-mt-24">
        <Suspense fallback={<SectionSkeleton title="Loading dashboard…" />}>
          <Dashboard />
        </Suspense>
      </section>

      <section id="transactions" className="scroll-mt-24">
        <Suspense fallback={<SectionSkeleton title="Loading transactions…" />}>
          {/* mount shortly before it enters viewport + animate in */}
          <LazyWhenVisible
            height={900}
            rootMargin="250px 0px"
            threshold={0.05}
            animate
          >
            <Transactions />
          </LazyWhenVisible>
        </Suspense>
      </section>

      <section id="about" className="scroll-mt-24">
        <Suspense fallback={<SectionSkeleton title="Loading about…" />}>
          {/* mount shortly before it enters viewport + animate in */}
          <LazyWhenVisible
            height={700}
            rootMargin="250px 0px"
            threshold={0.05}
            animate
          >
            <About />
          </LazyWhenVisible>
        </Suspense>
      </section>
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

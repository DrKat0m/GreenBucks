// src/routes/Home.jsx
import { lazy, Suspense } from "react";

// 🔻 lazy hero section
const EcoHero = lazy(() => import("../components/Decor/EcoHero"));

export default function Home() {
  return (
    <Suspense fallback={<SectionSkeleton title="Loading hero…" />}>
      <EcoHero />
    </Suspense>
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

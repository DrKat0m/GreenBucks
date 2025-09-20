import { useEffect, useState } from "react";

export default function useScrollSpy(ids = [], { rootMargin = "0px 0px -60% 0px" } = {}) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    // guard: nothing to observe
    if (!Array.isArray(ids) || ids.length === 0) return;

    const elements = ids
      .map((id) => (typeof id === "string" ? document.getElementById(id) : null))
      .filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { root: null, rootMargin, threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return activeId;
}

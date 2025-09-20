import { useEffect, useRef, useState } from "react";

export default function LazyWhenVisible({
  height = 800,
  root = null,
  rootMargin = "0px 0px",
  threshold = 0.15,
  once = true,
  animate = false, // 🔥 new
  children,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false); // for CSS transition start

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      setReady(true);
      return;
    }

    const onIntersect = (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setVisible(true);
        // wait one frame so CSS transitions can apply cleanly
        requestAnimationFrame(() => setReady(true));
        if (once) observer.disconnect();
      }
    };

    const observer = new IntersectionObserver(onIntersect, {
      root,
      rootMargin,
      threshold,
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold, once]);

  return (
    <div
      ref={ref}
      style={{ minHeight: visible ? 0 : height }}
      className={
        animate ? "will-change-transform will-change-opacity" : undefined
      }
    >
      {visible ? (
        <div
          className={
            animate
              ? [
                  "transition-all duration-500 ease-out",
                  ready
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3",
                ].join(" ")
              : undefined
          }
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

// src/components/Layout/AppLayout.jsx
import { useState, useEffect, lazy, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import useStore from "../../lib/store";
import { Button } from "../UI/Button";
import { cn } from "../../lib/cn";
import logo from "../../assets/greenbucks_logo.svg";
import FloatingKoshiButton from "../Koshi/FloatingKoshiButton";
import useScrollSpy from "../../lib/useScrollSpy";

// 🔻 lazy-loaded decor & chat (keep initial bundle lean)
const PageBackdrop = lazy(() => import("../Decor/PageBackdrop"));
const KoshiChat = lazy(() => import("../Koshi/KoshiChat"));

// prefetch helpers (matching your route file paths)
const prefetchTransactions = () => import("../../routes/Transactions");
const prefetchAbout = () => import("../../routes/About");

// show all sections on home (for scroll-spy)
const HOME_SECTIONS = ["home", "dashboard", "transactions", "about"];

export default function AppLayout() {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  const spyIds = pathname === "/" ? HOME_SECTIONS : [];
  const activeId = useScrollSpy(spyIds);

  useEffect(() => {
    if (pathname === "/" && activeId) {
      const newHash = `#${activeId}`;
      if (hash !== newHash) {
        try {
          window.history.replaceState(null, "", newHash);
        } catch {
          // some extensions throw on replaceState; ignore
        }
      }
    }
  }, [pathname, activeId, hash]);

  const doScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollTo = (id) => {
    if (pathname !== "/") {
      navigate("/", { replace: false });
      // tiny delay lets the home chunks mount before scrolling
      setTimeout(() => doScroll(id), 50);
    } else {
      doScroll(id);
    }
  };

  const linkCls = (active) =>
    cn(
      "relative text-sm font-medium transition-colors",
      active ? "text-amber-300" : "text-white/80 hover:text-amber-300"
    );

  return (
    <div className="relative min-h-screen w-full text-white">
      {/* ✅ blurred leaves backdrop on non-Home routes */}
      {pathname !== "/" && (
        <Suspense fallback={null}>
          <PageBackdrop />
        </Suspense>
      )}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--bg-2)]/80 backdrop-blur">
        <div className="shell h-16 flex items-center justify-between">
          <button
            onClick={() => scrollTo("home")}
            className="flex items-center gap-2 shrink-0"
          >
            <img src={logo} alt="GreenBucks" className="h-16 w-auto" />
            <span className="sr-only">GreenBucks</span>
          </button>

          <nav className="flex items-center gap-6">
            <button
              onClick={() => scrollTo("home")}
              className={linkCls(pathname === "/" && activeId === "home")}
            >
              Home
            </button>

            <button
              onClick={() => scrollTo("dashboard")}
              className={linkCls(pathname === "/" && activeId === "dashboard")}
            >
              Dashboard
            </button>

            <button
              onMouseEnter={prefetchTransactions}
              onFocus={prefetchTransactions}
              onClick={() =>
                pathname === "/"
                  ? scrollTo("transactions")
                  : navigate("/transactions")
              }
              className={linkCls(
                pathname === "/transactions" ||
                  (pathname === "/" && activeId === "transactions")
              )}
            >
              Transactions
            </button>

            <button
              onMouseEnter={prefetchAbout}
              onFocus={prefetchAbout}
              onClick={() =>
                pathname === "/" ? scrollTo("about") : navigate("/about")
              }
              className={linkCls(
                pathname === "/about" ||
                  (pathname === "/" && activeId === "about")
              )}
            >
              About
            </button>
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <span className="text-sm opacity-85">{user?.name}</span>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="w-full min-h-[calc(100vh-4rem)] relative z-10">
        <Outlet />
      </main>

      <FloatingKoshiButton onOpen={() => setChatOpen(true)} />

      {/* 🔻 load chat only when opened */}
      {chatOpen && (
        <Suspense fallback={null}>
          <KoshiChat
            open={chatOpen}
            onClose={() => setChatOpen(false)}
            userName={user?.name?.split(" ")[0] ?? "there"}
          />
        </Suspense>
      )}
    </div>
  );
}

// src/components/Layout/AppLayout.jsx
import { useState, lazy, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import useStore from "../../lib/store";
import { Button } from "../UI/Button";
import { cn } from "../../lib/cn";
import logo from "../../assets/greenbucks_logo.svg";
import KoshiHTMLButton from "../Koshi/KoshiHTMLButton";

// 🔻 lazy-loaded decor & chat (keep initial bundle lean)
const PageBackdrop = lazy(() => import("../Decor/PageBackdrop"));
const EcoBackground = lazy(() => import("../Decor/EcoBackground"));
const KoshiEmbeddedChat = lazy(() => import("../Koshi/KoshiEmbeddedChat"));

// prefetch helpers (matching your route file paths)
const prefetchDashboard = () => import("../../routes/Dashboard");
const prefetchTransactions = () => import("../../routes/Transactions");
const prefetchAbout = () => import("../../routes/About");

export default function AppLayout() {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

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

      {/* ✅ Eco background for dashboard, transactions, and about pages */}
      <Suspense fallback={null}>
        <EcoBackground />
      </Suspense>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--bg-2)]/80 backdrop-blur">
        <div className="shell h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 shrink-0"
          >
            <img src={logo} alt="GreenBucks" className="h-16 w-auto" />
            <span className="sr-only">GreenBucks</span>
          </button>

          <nav className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className={linkCls(pathname === "/")}
            >
              Home
            </button>

            <button
              onMouseEnter={prefetchDashboard}
              onFocus={prefetchDashboard}
              onClick={() => navigate("/dashboard")}
              className={linkCls(pathname === "/dashboard")}
            >
              Dashboard
            </button>

            <button
              onMouseEnter={prefetchTransactions}
              onFocus={prefetchTransactions}
              onClick={() => navigate("/transactions")}
              className={linkCls(pathname === "/transactions")}
            >
              Transactions
            </button>

            <button
              onMouseEnter={prefetchAbout}
              onFocus={prefetchAbout}
              onClick={() => navigate("/about")}
              className={linkCls(pathname === "/about")}
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

      <KoshiHTMLButton 
        onToggle={() => setChatOpen(!chatOpen)} 
        isOpen={chatOpen} 
      />

      {/* 🔻 load chat only when opened */}
      {chatOpen && (
        <Suspense fallback={null}>
          <KoshiEmbeddedChat
            open={chatOpen}
            onClose={() => setChatOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}

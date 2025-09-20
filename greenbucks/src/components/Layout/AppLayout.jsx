import { Outlet, NavLink, Link } from "react-router-dom";
import useStore from "../../lib/store";
import { Button } from "../UI/Button";
import EcoBackground from "../Decor/EcoBackground";
import { cn } from "../../lib/cn";
import logo from "../../assets/greenbucks_logo.svg";

const LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/transactions", label: "Transactions" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/coach", label: "Coach" },
];

export default function AppLayout() {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);

  return (
    <div className="min-h-screen text-[var(--text)]">
      <EcoBackground />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-[var(--bg-2)]/80 backdrop-blur border-b border-white/10">
        <div className="shell h-16 flex items-center justify-between">
          {/* LEFT: mini logo (tweak size here) */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="GreenBucks" className="h-12 w-auto md:h-17" />
            <span className="sr-only">GreenBucks</span>
          </Link>

          {/* CENTER/RIGHT: links laid out like your reference */}
          <nav className="flex items-center gap-6">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "relative text-sm font-medium transition-colors",
                    "hover:text-amber-300",
                    isActive
                      ? "text-amber-300 after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-0.5 after:bg-amber-300 after:rounded-full"
                      : "text-white/80"
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT: user + logout */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-sm opacity-85">{user?.name}</span>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="shell py-8">
        <Outlet />
      </main>
    </div>
  );
}

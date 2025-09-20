// src/routes/Dashboard.jsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../lib/store";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/UI/Card";
import { Button } from "../components/UI/Button";
import Progress from "../components/UI/Progress";
import { Badge } from "../components/UI/Badge";

import { CreditCard, Upload, Sparkles, TrendingUp, Leaf } from "lucide-react";

export default function Dashboard() {
  const tx = useStore((s) => s.transactions);
  const nav = useNavigate();

  const transactions = tx?.length
    ? tx
    : [
        {
          id: "t1",
          merchant: "CATA Bus Pass",
          amount: -14.0,
          eco: true,
          date: "2025-09-15",
        },
        {
          id: "t2",
          merchant: "Walmart (mixed)",
          amount: -38.25,
          eco: null,
          date: "2025-09-15",
        },
        {
          id: "t3",
          merchant: "Farmer's Market",
          amount: -22.9,
          eco: true,
          date: "2025-09-14",
        },
        {
          id: "t4",
          merchant: "Rideshare",
          amount: -11.8,
          eco: false,
          date: "2025-09-13",
        },
      ];

  const { ecoPct, ecoPoints, walletUSD } = useMemo(() => {
    const total = transactions.length || 1;
    const ecoCount = transactions.filter((t) => t.eco === true).length;
    return {
      ecoPct: Math.round((ecoCount / total) * 100),
      ecoPoints: ecoCount * 15 + (total - ecoCount) * 5,
      walletUSD: Math.max(0, ecoCount * 0.75).toFixed(2),
    };
  }, [transactions]);

  return (
    <>
      {/* ✅ Dashboard ONLY (no hero, no other page sections) */}
      <section
        id="dashboard"
        className="scroll-mt-24 mx-auto w-full max-w-7xl px-6 pt-10 pb-8 lg:px-8 space-y-6"
      >
        {/* Quick actions */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)]">
            Small actions, big impact — your latest sustainable wins.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => alert("TODO: Connect Plaid")}>
              <CreditCard size={16} /> Connect
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            title="Eco-Wallet"
            value={`$${walletUSD}`}
            icon={<Leaf size={18} />}
            desc="Cashback from green purchases"
          />
          <Stat
            title="Monthly Green Score"
            value={`${ecoPct}%`}
            icon={<TrendingUp size={18} />}
          >
            <div className="mt-2">
              <Progress value={ecoPct} />
            </div>
          </Stat>
          <Stat
            title="Eco Points"
            value={ecoPoints}
            icon={<Sparkles size={18} />}
          />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent activity</CardTitle>
              <CardDescription>Last 3 purchases</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-white/10 p-0">
              {transactions.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate">{t.merchant}</p>
                    <p className="text-xs text-[var(--muted)]">{t.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {t.eco === null ? (
                      <Badge variant="default">Unlabeled</Badge>
                    ) : t.eco ? (
                      <Badge variant="eco">Eco +</Badge>
                    ) : (
                      <Badge variant="danger">Not eco</Badge>
                    )}
                    <span className="tabular-nums">
                      {t.amount < 0 ? "-" : ""}${Math.abs(t.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function Stat({ title, value, icon, desc, children }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <span className="opacity-80">{icon}</span>
        </div>
        {desc && <CardDescription>{desc}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        {children}
      </CardContent>
    </Card>
  );
}

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
import Progress from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  CreditCard,
  Upload,
  Trophy,
  Sparkles,
  TrendingUp,
  Leaf,
} from "lucide-react";

export default function Dashboard() {
  const user = useStore((s) => s.user);
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
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 🌿
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Small actions, big impact — your latest sustainable wins.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => alert("TODO: Connect Plaid")}>
            <CreditCard size={16} /> Connect
          </Button>
          <Button variant="secondary" onClick={() => nav("/upload")}>
            <Upload size={16} /> Upload
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <CardTitle className="text-base">Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--muted)]">
            <Row rank={1} name="Aarya" pts={420} />
            <Row rank={2} name="Apoorv" pts={390} />
            <Row rank={3} name="Modak" pts={360} />
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent transactions</CardTitle>
            <CardDescription>
              Your latest purchases and eco tags
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-white/10 p-0">
            {transactions.map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate">{t.merchant}</p>
                  <p className="text-xs text-[var(--muted)]">{t.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      t.eco === true
                        ? "eco"
                        : t.eco === false
                        ? "danger"
                        : "default"
                    }
                  >
                    {t.eco === true
                      ? "Eco +"
                      : t.eco === false
                      ? "Not eco"
                      : "Needs receipt"}
                  </Badge>
                  <span className="tabular-nums">
                    {t.amount < 0 ? "-" : ""}${Math.abs(t.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Coach tip</CardTitle>
            <CardDescription>Powered by your spending patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[var(--muted)]">
              Replace two rideshares with transit this week to save <b>$6</b>{" "}
              and prevent <b>4.2 kg CO₂</b>. Want to start a roommate challenge?
            </p>
            <div className="flex gap-2">
              <Button>Start challenge</Button>
              <Button variant="secondary">
                <Trophy size={16} /> View leaderboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
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

function Row({ rank, name, pts }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs">
          {rank}
        </span>
        <span>{name}</span>
      </div>
      <span className="text-[var(--muted)]">{pts} pts</span>
    </div>
  );
}

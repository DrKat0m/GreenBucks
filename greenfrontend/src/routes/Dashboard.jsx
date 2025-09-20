// src/routes/Dashboard.jsx
import { useMemo, useEffect } from "react";
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
import PlaidLink from "../components/UI/PlaidLink";
// import ApiTest from "../components/Util/ApiTest";

export default function Dashboard() {
  const tx = useStore((s) => s.transactions);
  const transactionsLoading = useStore((s) => s.transactionsLoading);
  const transactionsError = useStore((s) => s.transactionsError);
  const fetchTransactions = useStore((s) => s.fetchTransactions);
  const user = useStore((s) => s.user);
  const nav = useNavigate();

  // Fetch transactions when component mounts
  useEffect(() => {
    if (user && tx.length === 0 && !transactionsLoading) {
      fetchTransactions();
    }
  }, [user, fetchTransactions, tx.length, transactionsLoading]);

  const transactions = tx;

  const { ecoPct, ecoPoints, walletUSD } = useMemo(() => {
    if (!transactions.length) return { ecoPct: 0, ecoPoints: 0, walletUSD: "0.00" };
    
    const total = transactions.length;
    const ecoCount = transactions.filter((t) => t.eco === true).length;
    const totalCashback = transactions.reduce((sum, t) => sum + (t.cashback || 0), 0);
    const avgEcoScore = transactions.reduce((sum, t) => sum + (t.ecoScore || 0), 0) / total;
    
    return {
      ecoPct: Math.round((ecoCount / total) * 100),
      ecoPoints: Math.round(avgEcoScore * 10), // Convert eco score to points
      walletUSD: totalCashback.toFixed(2),
    };
  }, [transactions]);

  const handlePlaidSuccess = (result, metadata) => {
    // Refresh transactions to show newly synced data
    setTimeout(() => {
      fetchTransactions();
    }, 2000);
  };

  const handlePlaidError = (error) => {
    console.error('Plaid connection error:', error);
  };

  return (
    <>
      {/* ✅ Dashboard ONLY (no hero, no other page sections) */}
      <section
        id="dashboard"
        className="scroll-mt-24 mx-auto w-full max-w-7xl px-6 pt-10 pb-8 lg:px-8 space-y-6"
      >
        {/* Quick actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[var(--muted)]">
              Small actions, big impact — your latest sustainable wins.
            </p>
          </div>
          
          {/* Plaid Connection */}
          <div className="max-w-md">
            <h3 className="text-sm font-medium text-white/80 mb-2">Connect Your Bank</h3>
            <PlaidLink 
              onSuccess={handlePlaidSuccess}
              onError={handlePlaidError}
            />
          </div>
        </div>

        {/* Loading/Error States */}
        {transactionsLoading && (
          <div className="text-center py-8">
            <p className="text-white/60">Loading transactions...</p>
          </div>
        )}
        
        {transactionsError && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">Error loading transactions: {transactionsError}</p>
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-2"
              onClick={() => fetchTransactions()}
            >
              Retry
            </Button>
          </div>
        )}

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

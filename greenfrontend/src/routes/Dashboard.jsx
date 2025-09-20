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
    const totalCashback = transactions.reduce((sum, t) => sum + (t.cashback || 0), 0);
    
    // Calculate average eco score from transactions with scores
    const scoredTransactions = transactions.filter(t => t.ecoScore && t.ecoScore > 0);
    const avgEcoScore = scoredTransactions.length > 0 
      ? scoredTransactions.reduce((sum, t) => sum + t.ecoScore, 0) / scoredTransactions.length
      : 0;
    
    // Convert average eco score (1-10) to percentage (0-100%)
    const greenScorePercent = Math.round((avgEcoScore / 10) * 100);
    
    // Calculate Eco Points: Sum of all eco scores with bonuses
    const totalEcoPoints = scoredTransactions.reduce((sum, t) => {
      let points = t.ecoScore;
      
      // Bonus points for high eco scores
      if (t.ecoScore >= 9) points += 5; // Eco++ bonus
      else if (t.ecoScore >= 7) points += 2; // Eco+ bonus
      else if (t.ecoScore >= 5) points += 1; // Neutral bonus
      
      // Bonus for high-value eco transactions
      if (t.ecoScore >= 7 && Math.abs(t.amount) > 50) points += 3;
      
      return sum + points;
    }, 0);
    
    return {
      ecoPct: greenScorePercent, // Now based on average eco score
      ecoPoints: Math.round(totalEcoPoints), // Sum of all eco scores with bonuses
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
            desc={`Total cashback from ${transactions.length} transactions`}
          >
            {transactions.length > 0 && (
              <div className="mt-2 text-xs text-white/60">
                <div>Avg rate: {((parseFloat(walletUSD) / transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)) * 100).toFixed(2)}%</div>
                <div className="text-green-400">
                  {transactions.filter(t => (t.cashback || 0) > 0).length} earning transactions
                </div>
              </div>
            )}
          </Stat>
          <Stat
            title="Green Score"
            value={`${ecoPct}%`}
            icon={<TrendingUp size={18} />}
            desc={`Average eco rating across ${transactions.filter(t => t.ecoScore && t.ecoScore > 0).length} scored transactions`}
          >
            <div className="mt-2">
              <Progress value={ecoPct} />
            </div>
          </Stat>
          <Stat
            title="Eco Points"
            value={ecoPoints}
            icon={<Sparkles size={18} />}
            desc="Accumulated from eco-friendly purchases"
          >
            {transactions.length > 0 && (() => {
              const scoredTxs = transactions.filter(t => t.ecoScore && t.ecoScore > 0);
              const basePoints = scoredTxs.reduce((sum, t) => sum + t.ecoScore, 0);
              const bonusPoints = ecoPoints - basePoints;
              
              return (
                <div className="mt-2 text-xs text-white/60">
                  <div>Base: {basePoints} pts</div>
                  <div className="text-yellow-400">
                    Bonuses: +{bonusPoints} pts
                  </div>
                </div>
              );
            })()}
          </Stat>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent activity</CardTitle>
              <CardDescription>Latest eco-scored purchases</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-white/10 p-0">
              {transactions.slice(0, 3).map((t) => {
                const getEcoLabel = (ecoScore) => {
                  if (!ecoScore) return { label: 'Needs receipt', variant: 'default', color: 'text-amber-400' };
                  if (ecoScore >= 9) return { label: 'Eco++', variant: 'eco', color: 'text-emerald-400' };
                  if (ecoScore >= 7) return { label: 'Eco+', variant: 'eco', color: 'text-green-400' };
                  if (ecoScore >= 5) return { label: 'Neutral', variant: 'default', color: 'text-yellow-400' };
                  if (ecoScore >= 3) return { label: 'Less-eco', variant: 'danger', color: 'text-orange-400' };
                  return { label: 'Non-eco', variant: 'danger', color: 'text-red-400' };
                };

                const ecoInfo = getEcoLabel(t.ecoScore);
                
                return (
                  <div
                    key={t.id}
                    className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => nav('/transactions')}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{t.merchant}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-white/60">{new Date(t.date).toLocaleDateString()}</p>
                        {t.ecoScore && (
                          <span className="text-xs text-white/50">
                            Score: {t.ecoScore}/10
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="tabular-nums font-medium">
                          ${Math.abs(t.amount).toFixed(2)}
                        </div>
                        {(t.cashback || 0) > 0 && (
                          <div className="text-xs text-green-400">
                            +${t.cashback.toFixed(2)}
                          </div>
                        )}
                      </div>
                      <Badge variant={ecoInfo.variant} className={`${ecoInfo.color} text-xs`}>
                        {ecoInfo.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
              
              {transactions.length > 3 && (
                <div className="p-3 text-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => nav('/transactions')}
                    className="text-xs text-white/60 hover:text-white"
                  >
                    View all {transactions.length} transactions →
                  </Button>
                </div>
              )}
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

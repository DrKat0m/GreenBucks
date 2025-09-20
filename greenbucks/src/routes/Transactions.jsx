// src/routes/Transactions.jsx
import useStore from "../lib/store";
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/UI/Card";
import { Button } from "../components/UI/Button";
import { Badge } from "../components/UI/Badge";
import { Upload } from "lucide-react";

export default function Transactions() {
  const tx = useStore((s) => s.transactions) ?? [];
  const [selectedId, setSelectedId] = useState(tx[0]?.id);

  const selected = useMemo(
    () => tx.find((t) => t.id === selectedId),
    [tx, selectedId]
  );

  return (
    <section
      id="transactions"
      className="scroll-mt-24 mx-auto w-full max-w-7xl px-6 pt-10 pb-16 lg:px-8"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="mt-1 text-white/60">
          Your recent purchases and eco tags.
        </p>
      </div>

      {/* 2-column: list (2fr) + uploader (1fr). On mobile it stacks */}
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        {/* Left: list */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent transactions</CardTitle>
            <CardDescription>Your latest activity</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-white/10 p-0">
            {tx.map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate">{t.merchant}</p>
                  <p className="text-xs text-white/60">{t.date}</p>
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

        {/* Right: uploader (constrained width, not full-bleed) */}
        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upload receipt</CardTitle>
            <CardDescription>
              JPG/PNG previewed here. OCR attaches the result to your selection.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-w-md">
              <label className="text-sm text-white/70">
                Attach to transaction
              </label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {tx.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.merchant} — {t.date} — ${Math.abs(t.amount).toFixed(2)}
                    {t.eco === null ? " (needs receipt)" : ""}
                  </option>
                ))}
              </select>
              {selected && (
                <p className="text-xs text-white/60">
                  Selected: <b>{selected.merchant}</b> ({selected.date})
                </p>
              )}
            </div>

            <div className="space-y-2 max-w-md">
              <label className="text-sm text-white/70">Receipt image</label>
              <div className="flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 hover:bg-white/10">
                  <Upload size={16} className="mr-2" />
                  <span>Choose file</span>
                  <input type="file" accept="image/*" className="hidden" />
                </label>
                <span className="text-sm text-white/60">No file chosen</span>
              </div>
            </div>

            <Button className="max-w-md">
              <Upload size={16} className="mr-2" />
              Scan Receipt
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

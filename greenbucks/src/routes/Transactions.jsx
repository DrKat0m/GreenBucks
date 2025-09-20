import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useStore from "../lib/store";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/UI/Card";
import { Button } from "../components/UI/Button";
import { FileText, Loader2, Upload } from "lucide-react";

const FALLBACK_TX = [
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

export default function Transactions() {
  const [params] = useSearchParams();
  const uploadFor = params.get("uploadFor");

  const storeTx = useStore((s) => s.transactions);
  const attachReceipt = useStore((s) => s.attachReceipt);

  const txList = storeTx?.length ? storeTx : FALLBACK_TX;
  const txOptions = useMemo(() => {
    const copy = [...txList];
    copy.sort((a, b) => {
      const av = a.eco === null ? 0 : 1;
      const bv = b.eco === null ? 0 : 1;
      return av - bv || a.date.localeCompare(b.date);
    });
    return copy;
  }, [txList]);

  const [targetId, setTargetId] = useState(
    uploadFor || (txOptions[0]?.id ?? "")
  );
  useEffect(() => {
    if (uploadFor) setTargetId(uploadFor);
  }, [uploadFor]);

  const chosenTx = useMemo(
    () => txOptions.find((t) => t.id === targetId) || null,
    [txOptions, targetId]
  );

  // file picker
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);
  const pickFile = () => inputRef.current?.click();
  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFileName(f.name);
    if (f.type.startsWith("image/")) {
      setPreview((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(f);
      });
    } else {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  // OCR state
  const [status, setStatus] = useState("idle");
  const [parsed, setParsed] = useState(null); // { merchant, date, subtotal, tax, total, items[] }
  const [normalized, setNormalized] = useState(null); // the schema you asked for
  const [rawText, setRawText] = useState("");

  async function runOcr() {
    if (!file || !targetId) return;
    setStatus("working");
    setParsed(null);
    setNormalized(null);
    setRawText("");

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/ocr", { method: "POST", body });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `OCR failed (${res.status})`);
      }
      const json = await res.json();
      setRawText(json.text || "");
      setParsed(json.parsed || null);
      setNormalized(json.normalized || null);

      // also stash it with the transaction in local store
      attachReceipt(targetId, {
        text: json.text || "",
        parsed: json.parsed || null,
        normalized: json.normalized || null,
        previewUrl: preview || undefined,
        fileName,
      });

      setStatus("done");
    } catch (err) {
      console.error("OCR error:", err);
      setStatus("error");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload receipt</CardTitle>
          <CardDescription>
            Upload a JPG/PNG (previewed here). OCR runs on the backend and we
            attach the structured result to your selected transaction.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* selector */}
          <div className="flex flex-col gap-2 text-sm">
            <label className="opacity-80">Attach to transaction</label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full bg-black/20 rounded-xl px-3 py-2 ring-1 ring-white/10 outline-none hover:ring-white/20 focus:ring-white/30"
            >
              <option value="" disabled>
                Select transaction…
              </option>
              {txOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.merchant} — {t.date} — ${Math.abs(t.amount).toFixed(2)}
                  {t.eco === null ? "  (needs receipt)" : ""}
                </option>
              ))}
            </select>
            {chosenTx && (
              <div className="text-[var(--muted)]">
                Selected: <b>{chosenTx.merchant}</b> ({chosenTx.date})
              </div>
            )}
          </div>

          {/* file picker */}
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={pickFile}>
              <Upload size={16} className="mr-2" /> Choose file
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={onFile}
            />
            <span className="text-sm text-[var(--muted)] truncate max-w-[60ch]">
              {fileName || "No file chosen"}
            </span>
          </div>

          {preview && (
            <img
              src={preview}
              alt="Receipt preview"
              className="max-h-72 rounded-xl ring-1 ring-white/10"
            />
          )}

          <div className="pt-1">
            <Button
              onClick={runOcr}
              disabled={!file || !targetId || status === "working"}
            >
              {status === "working" ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />{" "}
                  Processing…
                </>
              ) : (
                <>
                  <FileText className="mr-2" size={16} /> Run OCR
                </>
              )}
            </Button>
          </div>

          {status === "error" && (
            <p className="text-[var(--danger)] text-sm">
              Upload/OCR failed. Check console for details.
            </p>
          )}

          {/* pretty receipt summary */}
          {parsed && (
            <div className="grid lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Receipt summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <Info label="Merchant" value={parsed.merchant || "—"} />
                    <Info label="Date" value={parsed.date || "—"} />
                    <Info label="Subtotal" value={money(parsed.subtotal)} />
                    <Info label="Tax" value={money(parsed.tax)} />
                    <Info label="Total" value={money(parsed.total)} strong />
                  </div>

                  {parsed.items?.length ? (
                    <div className="pt-3">
                      <div className="text-sm opacity-80 mb-2">Items</div>
                      <div className="rounded-xl ring-1 ring-white/10 overflow-hidden">
                        <table className="w-full text-sm">
                          <tbody>
                            {parsed.items.map((it, i) => (
                              <tr
                                key={i}
                                className="divide-x divide-white/10 odd:bg-white/[0.03]"
                              >
                                <td className="px-3 py-2">{it.name}</td>
                                <td className="px-3 py-2 text-right">
                                  {money(it.amount)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Normalized JSON</CardTitle>
                  <CardDescription className="truncate">
                    (Ready to POST to your backend)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-black/20 rounded-xl p-3 ring-1 ring-white/10 overflow-auto max-h-80">
                    {JSON.stringify(normalized, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}

          {/* raw text for debugging */}
          {rawText && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm opacity-80">
                Show raw OCR text
              </summary>
              <div className="text-sm whitespace-pre-wrap bg-black/20 rounded-xl p-4 ring-1 ring-white/10 mt-2">
                {rawText}
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value, strong }) {
  return (
    <div>
      <div className="text-xs opacity-70">{label}</div>
      <div className={strong ? "font-semibold" : ""}>{value}</div>
    </div>
  );
}

function money(v) {
  if (v == null || Number.isNaN(v)) return "—";
  return `$${Number(v).toFixed(2)}`;
}

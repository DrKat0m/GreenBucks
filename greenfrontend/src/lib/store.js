import { create } from "zustand";
import { USERS } from "./authConfig";

// Simple, tweakable classifier for demo
function classifyEco(merchant, items) {
  const name = (merchant || "").toLowerCase();
  if (/bus|transit|metro|subway|pass/.test(name)) return true;
  if (/farmer|market|organic|co-op/.test(name)) return true;
  if (/rideshare|uber|lyft|gas|fuel|oil/.test(name)) return false;
  // fallback: eco if there is a veggie/plant keyword
  const joined = (items || []).map(i => i.name.toLowerCase()).join(" ");
  if (/vegetable|veggie|plant|green|recycle/.test(joined)) return true;
  return null; // unknown
}

const useStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("gb:user")) || null,
  transactions: [
    // your seed tx are still defined in pages
  ],

  login: ({ email, password }) => {
    const match = USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!match) throw new Error("Invalid email or password");
    const user = { id: match.id, name: match.name, email: match.email };
    localStorage.setItem("gb:user", JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("gb:user");
    set({ user: null });
  },

  // NEW: attach structured receipt to given tx id
  attachReceipt: (txId, payload) => {
    const { text, parsed, previewUrl, fileName } = payload || {};
    const txs = get().transactions || [];
    const next = txs.map((t) => {
      if (t.id !== txId) return t;

      const updated = {
        ...t,
        receipt: { text, parsed, fileName, previewUrl, attachedAt: new Date().toISOString() },
      };

      // If we parsed a total, ensure transaction amount matches (negative for purchases)
      if (parsed?.total && !Number.isNaN(parsed.total)) {
        updated.amount = -Math.abs(parsed.total);
      }

      // Mark eco guess if currently null
      if (updated.eco == null) {
        updated.eco = classifyEco(parsed?.merchant || t.merchant, parsed?.items);
      }

      return updated;
    });

    set({ transactions: next });
  },
}));

export default useStore;

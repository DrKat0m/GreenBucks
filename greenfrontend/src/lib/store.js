import { create } from "zustand";
import { authAPI, transactionsAPI, usersAPI } from "./api";

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
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,

  login: async ({ email, password }) => {
    try {
      const response = await authAPI.login(email, password);
      const user = {
        id: response.user.id,
        name: response.user.full_name,
        email: response.user.email,
        token: response.access_token
      };
      localStorage.setItem("gb:user", JSON.stringify(user));
      set({ user });
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Login failed");
    }
  },

  // Register new user
  register: async ({ email, password, full_name }) => {
    try {
      const newUser = await usersAPI.create({ email, password, full_name });
      // After successful registration, automatically log in
      const response = await authAPI.login(email, password);
      const user = {
        id: response.user.id,
        name: response.user.full_name,
        email: response.user.email,
        token: response.access_token
      };
      localStorage.setItem("gb:user", JSON.stringify(user));
      set({ user });
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Registration failed");
    }
  },

  logout: () => {
    localStorage.removeItem("gb:user");
    set({ user: null });
  },

  // Verify current user token
  verifyToken: async () => {
    try {
      const user = get().user;
      if (!user?.token) return false;
      
      const response = await authAPI.me();
      // Update user info if token is valid
      const updatedUser = {
        ...user,
        name: response.full_name,
        email: response.email,
        id: response.id
      };
      localStorage.setItem("gb:user", JSON.stringify(updatedUser));
      set({ user: updatedUser });
      return true;
    } catch (error) {
      // Token is invalid, clear user
      localStorage.removeItem("gb:user");
      set({ user: null });
      return false;
    }
  },

  // Fetch transactions for current user
  fetchTransactions: async (params = {}) => {
    const user = get().user;
    if (!user?.id) return;

    set({ transactionsLoading: true, transactionsError: null });
    try {
      const transactions = await transactionsAPI.list({
        user_id: user.id,
        limit: 50,
        sort_by: 'date',
        sort_dir: 'desc',
        ...params
      });
      
      // Transform backend transactions to frontend format
      const transformedTransactions = transactions.map(tx => ({
        id: tx.id.toString(),
        merchant: tx.merchant_name || tx.name,
        amount: parseFloat(tx.amount),
        date: tx.date,
        eco: tx.eco_score ? (tx.eco_score >= 7 ? true : tx.eco_score <= 3 ? false : null) : null,
        category: tx.category,
        cashback: tx.cashback_usd ? parseFloat(tx.cashback_usd) : 0,
        ecoScore: tx.eco_score,
        needsReceipt: tx.needs_receipt,
        // Keep original backend data for reference
        _original: tx
      }));

      set({ 
        transactions: transformedTransactions, 
        transactionsLoading: false 
      });
    } catch (error) {
      set({ 
        transactionsError: error.response?.data?.detail || "Failed to fetch transactions",
        transactionsLoading: false 
      });
    }
  },

  // Sync transactions from Plaid
  syncPlaidTransactions: async (userId, itemId = null) => {
    try {
      const result = await plaidAPI.syncTransactions(userId, itemId);
      // Refresh transactions after sync
      await get().fetchTransactions();
      return result;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Failed to sync transactions");
    }
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

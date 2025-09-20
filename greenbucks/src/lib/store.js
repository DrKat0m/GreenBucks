import { create } from "zustand";
import { USERS } from "./authConfig";

const useStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("gb:user")) || null,

  login: ({ email, password }) => {
    const match = USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!match) throw new Error("Invalid email or password");
    const user = { id: match.id, name: match.name, email: match.email };
    localStorage.setItem("gb:user", JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("gb:user");
    set({ user: null });
  },
}));

export default useStore;

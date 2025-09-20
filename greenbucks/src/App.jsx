import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout.jsx";
import Dashboard from "./routes/Dashboard.jsx";
import Transactions from "./routes/Transactions.jsx";
import Auth from "./routes/Auth.jsx";
import useStore from "./lib/store";

function PrivateRoute({ children }) {
  const user = useStore((s) => s.user);
  return user ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/leaderboard" element={<div>Leaderboard</div>} />
        <Route path="/coach" element={<div>Coach</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

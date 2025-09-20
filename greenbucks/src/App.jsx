import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import Auth from "./routes/Auth";
import Home from "./routes/Home";
import Dashboard from "./routes/Dashboard";
import Transactions from "./routes/Transactions";
import About from "./routes/About";
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
        {/* Home now includes Hero + Dashboard */}
        <Route index element={<Home />} />

        {/* keep direct routes too */}
        <Route path="transactions" element={<Transactions />} />
        <Route path="about" element={<About />} />
        {/* ...other routes */}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

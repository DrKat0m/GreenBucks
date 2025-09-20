// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import useStore from "./lib/store";

// 🔻 lazy pages & layout
const AppLayout = lazy(() => import("./components/Layout/AppLayout"));
const Auth = lazy(() => import("./routes/Auth"));
const Home = lazy(() => import("./routes/Home"));
const Transactions = lazy(() => import("./routes/Transactions"));
const About = lazy(() => import("./routes/About"));

function PrivateRoute({ children }) {
  const user = useStore((s) => s.user);
  return user ? children : <Navigate to="/auth" replace />;
}

function RouteFallback() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 text-white/70">Loading…</div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="about" element={<About />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import useStore from "../lib/store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/UI/Card";
import { Input } from "../components/UI/Input";
import { Label } from "../components/UI/Label";
import { Button } from "../components/UI/Button";
import EcoBackground from "../components/Decor/EcoBackground";
import logo from "../assets/greenbucks_logo.svg";

export default function Auth() {
  const { register, handleSubmit } = useForm();
  const [err, setErr] = useState("");
  const user = useStore((s) => s.user);
  const login = useStore((s) => s.login);
  const nav = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const onSubmit = (data) => {
    try {
      login(data);
      nav("/", { replace: true });
    } catch (e) {
      setErr(e.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center relative">
      <EcoBackground />
      <Card className="w-full max-w-md backdrop-blur">
        <CardHeader>
          <div className="flex items-center gap-2">
            <img src={logo} alt="GreenBucks" className="h-7 w-7" />
            <span className="font-semibold text-[var(--accent)]">
              GreenBucks
            </span>
          </div>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Welcome back. Use the demo credentials below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="aarya@greenbucks.app"
                {...register("email", { required: true })}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="test1234"
                {...register("password", { required: true })}
              />
            </div>
            {err && <p className="text-sm text-[var(--danger)]">{err}</p>}
            <Button className="w-full">Sign in</Button>
            <p className="text-xs text-[var(--muted)]">
              Demo: aarya@greenbucks.app / test1234
            </p>
            <p className="text-xs">
              <Link to="/" className="text-[var(--accent)]">
                Back to site
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

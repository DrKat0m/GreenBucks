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
  const { register, handleSubmit, reset } = useForm();
  const [err, setErr] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const user = useStore((s) => s.user);
  const login = useStore((s) => s.login);
  const registerUser = useStore((s) => s.register);
  const nav = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const onSubmit = async (data) => {
    try {
      setErr("");
      if (isLogin) {
        await login(data);
      } else {
        await registerUser(data);
      }
      nav("/", { replace: true });
    } catch (e) {
      setErr(e.message || `${isLogin ? 'Login' : 'Registration'} failed`);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErr("");
    reset();
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
          <CardTitle>{isLogin ? 'Sign in' : 'Create Account'}</CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Welcome back. Use the demo credentials below.' 
              : 'Join GreenBucks and start tracking your eco-friendly purchases.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  placeholder="Your full name"
                  {...register("full_name", { required: !isLogin })}
                />
              </div>
            )}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder={isLogin ? "apoorv@example.com" : "your@email.com"}
                {...register("email", { required: true })}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder={isLogin ? "password123" : "Choose a password"}
                {...register("password", { required: true })}
              />
            </div>
            {err && <p className="text-sm text-[var(--danger)]">{err}</p>}
            <Button className="w-full">
              {isLogin ? 'Sign in' : 'Create Account'}
            </Button>
            
            {isLogin && (
              <p className="text-xs text-[var(--muted)]">
                Demo: apoorv@example.com / password123
              </p>
            )}
            
            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
            
            <p className="text-xs text-center">
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

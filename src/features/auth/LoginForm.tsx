import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema, type LoginFormData } from "./authSchema";
import { loginThunk } from "./authThunk";
import type { AppDispatch, RootState } from "../../redux/store";
import { clearError } from "../../redux/auth/authSlice";
import { useEffect } from "react";
import { useToast } from "../../shared/context/useToast";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const REMEMBER_EMAIL_KEY = "rememberedEmail";

function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, token } = useSelector((state: RootState) => state.auth);
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const rememberedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY) ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: rememberedEmail, password: "", rememberMe: !!rememberedEmail },
  });

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token, navigate]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  useEffect(() => {
    if (error) addToast(error, "error");
  }, [error, addToast]);

  const onSubmit = (data: LoginFormData) => {
    if (data.rememberMe) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, data.email);
    } else {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }
    dispatch(loginThunk({ email: data.email, password: data.password }));
  };

  return (
    <div className="flex min-h-full items-center justify-center py-12">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm dark:border-border-dark dark:bg-surface-dark">
        <h1 className="text-xl font-bold text-text dark:text-text-dark">Sign in</h1>
        <p className="mt-1 text-sm text-muted dark:text-muted-dark">Enter your credentials to continue</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text dark:text-muted-dark">Email</label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="block w-full rounded-lg border border-border py-2 pl-9 pr-3 text-sm shadow-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark dark:placeholder:text-muted-dark"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-earth">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text dark:text-muted-dark">Password</label>
            <div className="relative mt-1">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="**********"
                className="block w-full rounded-lg border border-border py-2 pl-9 pr-9 text-sm shadow-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark dark:placeholder:text-muted-dark"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-muted"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-earth">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="rounded border-border text-primary focus:ring-primary dark:border-border-dark dark:bg-surface-dark-hover"
              />
              <span className="text-xs text-muted dark:text-muted-dark">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary hover:underline dark:text-primary-light"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="rounded-lg border border-earth/30 bg-earth/10 p-3 text-xs text-earth dark:border-earth/50 dark:bg-earth/20 dark:text-earth">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted dark:text-muted-dark">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline dark:text-primary-light">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;

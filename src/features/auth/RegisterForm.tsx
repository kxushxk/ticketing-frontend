import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerSchema, type RegisterFormData } from "./authSchema";
import { registerThunk } from "./authThunk";
import type { AppDispatch, RootState } from "../../redux/store";
import { clearError } from "../../redux/auth/authSlice";
import { useEffect } from "react";
import { useToast } from "../../shared/context/useToast";

function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, token } = useSelector((state: RootState) => state.auth);
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
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

  const onSubmit = (data: RegisterFormData) => {
    dispatch(registerThunk({ name: data.name, email: data.email, password: data.password }));
  };

  return (
    <div className="flex min-h-full items-center justify-center py-12">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm dark:border-border-dark dark:bg-surface-dark">
        <h1 className="text-xl font-bold text-text dark:text-text-dark">Create account</h1>
        <p className="mt-1 text-sm text-muted dark:text-muted-dark">Get started with a free account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text dark:text-muted-dark">Name</label>
            <input
              {...register("name")}
              placeholder="john"
              className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm shadow-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark dark:placeholder:text-muted-dark"
            />
            {errors.name && <p className="mt-1 text-xs text-earth">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text dark:text-muted-dark">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm shadow-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark dark:placeholder:text-muted-dark"
            />
            {errors.email && <p className="mt-1 text-xs text-earth">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text dark:text-muted-dark">Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="**********"
              className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm shadow-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark dark:placeholder:text-muted-dark"
            />
            {errors.password && <p className="mt-1 text-xs text-earth">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text dark:text-muted-dark">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="**********"
              className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm shadow-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark dark:placeholder:text-muted-dark"
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-earth">{errors.confirmPassword.message}</p>}
          </div>

          {error && (
            <div className="rounded-lg border border-earth/30 bg-earth/10 p-3 text-xs text-earth dark:border-earth/50 dark:bg-earth/20 dark:text-earth">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted dark:text-muted-dark">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline dark:text-primary-light">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;

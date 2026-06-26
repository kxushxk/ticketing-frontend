import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "./authSchema";
import { forgotPasswordApi } from "./authService";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

function ForgotPasswordForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setStatus("loading");
    try {
      const res = await forgotPasswordApi(data.email);
      setMessage(res.message);
      setStatus("success");
    } catch {
      setMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center py-12">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm dark:border-border-dark dark:bg-surface-dark">
        <h1 className="text-xl font-bold text-text dark:text-text-dark">Forgot password</h1>
        <p className="mt-1 text-sm text-muted dark:text-muted-dark">Enter your email and we'll send you a reset link.</p>

        {status === "success" ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success dark:border-success/50 dark:bg-success/20 dark:text-success">
              {message}
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline dark:text-primary-light"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        ) : (
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

            {status === "error" && (
              <div className="rounded-lg border border-earth/30 bg-earth/10 p-3 text-xs text-earth dark:border-earth/50 dark:bg-earth/20 dark:text-earth">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
              ) : (
                "Send reset link"
              )}
            </button>

            <p className="text-center text-xs text-muted dark:text-muted-dark">
              <Link to="/login" className="inline-flex items-center gap-1 font-medium text-primary hover:underline dark:text-primary-light">
                <ArrowLeft className="h-3 w-3" />
                Back to sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordForm;

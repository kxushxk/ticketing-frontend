import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPasswordSchema, type ResetPasswordFormData } from "./authSchema";
import { resetPasswordApi } from "./authService";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setStatus("loading");
    try {
      const res = await resetPasswordApi(data.token, data.password);
      setMessage(res.message);
      setStatus("success");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setMessage("Failed to reset password. The link may have expired.");
      setStatus("error");
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center py-12">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm dark:border-border-dark dark:bg-surface-dark">
        {status === "success" ? (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <h1 className="text-xl font-bold text-text dark:text-text-dark">Password reset</h1>
            <p className="text-sm text-muted dark:text-muted-dark">{message}</p>
            <p className="text-xs text-muted">Redirecting to sign in...</p>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-text dark:text-text-dark">Reset password</h1>
            <p className="mt-1 text-sm text-muted dark:text-muted-dark">Enter your new password.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <input type="hidden" {...register("token")} />

              <div>
                <label className="block text-sm font-medium text-text dark:text-muted-dark">New Password</label>
                <div className="relative mt-1">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    className="block w-full rounded-lg border border-border py-2 pl-9 pr-3 text-sm shadow-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark dark:placeholder:text-muted-dark"
                  />
                </div>
                {errors.password && <p className="mt-1 text-xs text-earth">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text dark:text-muted-dark">Confirm Password</label>
                <div className="relative mt-1">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    className="block w-full rounded-lg border border-border py-2 pl-9 pr-3 text-sm shadow-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark dark:placeholder:text-muted-dark"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-earth">{errors.confirmPassword.message}</p>}
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
                  <><Loader2 className="h-4 w-4 animate-spin" /> Resetting...</>
                ) : (
                  "Reset password"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordForm;

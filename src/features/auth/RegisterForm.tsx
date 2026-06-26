import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { registerSchema, type RegisterFormData } from "./authSchema";
import { sendOtpApi, verifyOtpApi, requestRegistrationApi } from "./authService";
import { Mail, ArrowLeft, Clock } from "lucide-react";

type Step = "form" | "otp" | "pending";

function RegisterForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const formDataRef = useRef<RegisterFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmitForm = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await sendOtpApi(data.email);
      formDataRef.current = data;
      setStep("otp");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : "Failed to send OTP";
      setError(msg ?? "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;  
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    otpRefs.current[nextIndex]?.focus();
  };

  const handleResendOtp = async () => {
    if (!formDataRef.current) return;
    setIsLoading(true);
    setError(null);
    try {
      await sendOtpApi(formDataRef.current.email);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : "Failed to resend OTP";
      setError(msg ?? "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }
    if (!formDataRef.current) return;
    setIsLoading(true);
    setError(null);
    try {
      await verifyOtpApi(formDataRef.current.email, otpCode);
      await requestRegistrationApi({
        name: formDataRef.current.name,
        email: formDataRef.current.email,
        password: formDataRef.current.password,
      });
      setStep("pending");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : "Verification failed";
      setError(msg ?? "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToForm = () => {
    setStep("form");
    setError(null);
  };

  if (step === "pending") {
    return (
      <div className="flex min-h-full items-center justify-center py-12">
        <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm dark:border-border-dark dark:bg-surface-dark text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-text dark:text-text-dark">Request Submitted</h1>
          <p className="mt-2 text-sm text-muted dark:text-muted-dark">
            Your registration request has been sent to the admin for approval. You'll be able to log in once an admin approves your account.
          </p>
          <div className="mt-4 rounded-lg bg-warning/10 p-3 text-xs text-warning dark:bg-warning/20">
            Waiting for admin approval
          </div>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full items-center justify-center py-12">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm dark:border-border-dark dark:bg-surface-dark">
        {step === "form" && (
          <>
            <h1 className="text-xl font-bold text-text dark:text-text-dark">Create account</h1>
            <p className="mt-1 text-sm text-muted dark:text-muted-dark">Get started with a free account</p>

            <form onSubmit={handleSubmit(onSubmitForm)} className="mt-6 space-y-4">
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
                {isLoading ? "Sending OTP..." : "Create account"}
              </button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <button
              onClick={goBackToForm}
              className="flex items-center gap-1 text-xs text-muted hover:text-text dark:text-muted-dark dark:hover:text-text-dark"
            >
              <ArrowLeft className="h-3 w-3" />
              Back
            </button>

            <div className="mt-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h1 className="mt-3 text-xl font-bold text-text dark:text-text-dark">Verify Email</h1>
              <p className="mt-1 text-sm text-muted dark:text-muted-dark">
                Enter the 6-digit code sent to{" "}
                <span className="font-medium text-text dark:text-text-dark">{formDataRef.current?.email}</span>
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="h-12 w-10 rounded-lg border border-border text-center text-lg font-semibold shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark sm:w-12"
                  />
                ))}
              </div>

              {error && (
                <div className="rounded-lg border border-earth/30 bg-earth/10 p-3 text-xs text-earth dark:border-earth/50 dark:bg-earth/20 dark:text-earth">
                  {error}
                </div>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.join("").length !== 6}
                className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify & Submit"}
              </button>

              <p className="text-center text-xs text-muted dark:text-muted-dark">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="font-medium text-primary hover:underline disabled:opacity-50"
                >
                  Resend
                </button>
              </p>
            </div>
          </>
        )}

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
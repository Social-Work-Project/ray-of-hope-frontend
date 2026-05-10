"use client";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, MailIcon, KeyRoundIcon, LockKeyholeIcon, CheckCircle2Icon } from "lucide-react";
import { AuthService } from "@/services/authService";

type ForgotStep = "email" | "otp" | "reset" | "success";

interface ForgotPasswordFlowProps {
  onBack: () => void;
}

export default function ForgotPasswordFlow({ onBack }: ForgotPasswordFlowProps) {
  const [step, setStep] = useState<ForgotStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const inputCls =
    "w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200";

  // ── Password strength ──────────────────────────────────────────────────────
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  const pwdStrength = getPasswordStrength(newPassword);

  // ── Step 1: Email ──────────────────────────────────────────────────────────
  const handleEmailSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      setLoading(true);
      // Replace with your actual API call:
      // await api.post("/auth/forgot-password", { email });
      await AuthService.forgotPassword({email}) // simulate
      toast.success("OTP sent to your email!");
      setResendCooldown(60);
      setStep("otp");
    } catch {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: OTP ────────────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const next = [...otp];
    next[index] = value.slice(-1); // single digit
    setOtp(next);
    setErrors({});
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(6).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleOtpSubmit = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setErrors({ otp: "Please enter all 6 digits" });
      return;
    }
    setErrors({});
    try {
      setLoading(true);
      // Replace with your actual API call:
      // await api.post("/auth/verify-otp", { email, otp: code });
      await AuthService.verifyOTP({email, otp: code})
      toast.success("OTP verified!");
      setStep("reset");
    } catch {
      toast.error("Invalid or expired OTP. Please try again.");
      setErrors({ otp: "Invalid or expired OTP" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      setLoading(true);
      // await api.post("/auth/forgot-password", { email });
      await AuthService.resendOTP({email})
      toast.success("New OTP sent!");
      setOtp(Array(6).fill(""));
      setErrors({});
      setResendCooldown(60);
      otpRefs.current[0]?.focus();
    } catch {
      toast.error("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ─────────────────────────────────────────────────
  const handleResetSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (pwdStrength < 2) {
      newErrors.newPassword = "Password is too weak. Add uppercase, numbers, or symbols.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      setLoading(true);
      const payload ={
        email,
        new_password: newPassword,
        confirm_password: confirmPassword
      }
      // Replace with your actual API call:
      // await api.post("/auth/reset-password", { email, otp: otp.join(""), newPassword });
      await AuthService.resetPassword(payload)
      toast.success("Password reset successfully!");
      setStep("success");
    } catch {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Shared back button ─────────────────────────────────────────────────────
  const BackBtn = ({ onClick }: { onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 cursor-pointer"
    >
      <ArrowLeftIcon className="w-4 h-4" />
      Back
    </button>
  );

  // ── STEP: EMAIL ────────────────────────────────────────────────────────────
  if (step === "email") {
    return (
      <div>
        <BackBtn onClick={onBack} />
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--blue-50, #eff6ff)" }}
          >
            <MailIcon className="w-5 h-5" style={{ color: "var(--blue)" }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-(--navy)">Forgot Password</h3>
            <p className="text-xs" style={{ color: "var(--gray-400)" }}>
              We'll send a 6-digit code to your email
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-(--gray-800)">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              autoFocus
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({});
              }}
              onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
              placeholder="admin@rayofhope.org"
              className={inputCls}
              style={{ borderColor: errors.email ? "#ef4444" : "var(--gray-200)" }}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.email}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleEmailSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-60 bg-(--blue) text-white cursor-pointer"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      </div>
    );
  }

  // ── STEP: OTP ──────────────────────────────────────────────────────────────
  if (step === "otp") {
    return (
      <div>
        <BackBtn onClick={() => { setOtp(Array(6).fill("")); setErrors({}); setStep("email"); }} />
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--blue-50, #eff6ff)" }}
          >
            <KeyRoundIcon className="w-5 h-5" style={{ color: "var(--blue)" }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-(--navy)">Enter OTP</h3>
            <p className="text-xs" style={{ color: "var(--gray-400)" }}>
              Sent to <span className="font-semibold text-(--gray-800)">{email}</span>
            </p>
          </div>
        </div>

        {/* 6-digit OTP boxes */}
        <div className="flex gap-2.5 justify-center mb-2" onPaste={handleOtpPaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { otpRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              autoFocus={i === 0}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              className="w-11 h-12 text-center text-lg font-bold border rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-200"
              style={{
                borderColor: errors.otp
                  ? "#ef4444"
                  : digit
                  ? "var(--blue)"
                  : "var(--gray-200)",
                color: "var(--navy)",
                background: digit ? "var(--blue-50, #eff6ff)" : "white",
              }}
            />
          ))}
        </div>

        {errors.otp && (
          <p className="text-red-500 text-xs mt-1 text-center flex items-center justify-center gap-1">
            <span>⚠</span> {errors.otp}
          </p>
        )}

        <p className="text-xs text-center mt-3 mb-5" style={{ color: "var(--gray-400)" }}>
          Didn't receive it?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || loading}
            className="font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            style={{ color: resendCooldown > 0 ? "var(--gray-400)" : "var(--blue)" }}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
          </button>
        </p>

        <button
          type="button"
          onClick={handleOtpSubmit}
          disabled={loading || otp.join("").length < 6}
          className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-60 bg-(--blue) text-white cursor-pointer"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    );
  }

  // ── STEP: RESET PASSWORD ───────────────────────────────────────────────────
  if (step === "reset") {
    return (
      <div>
        <BackBtn onClick={() => { setErrors({}); setNewPassword(""); setConfirmPassword(""); setStep("otp"); }} />
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--blue-50, #eff6ff)" }}
          >
            <LockKeyholeIcon className="w-5 h-5" style={{ color: "var(--blue)" }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-(--navy)">Set New Password</h3>
            <p className="text-xs" style={{ color: "var(--gray-400)" }}>
              Must be at least 8 characters
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-(--gray-800)">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                autoFocus
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, newPassword: "" }));
                }}
                placeholder="••••••••"
                className={inputCls}
                style={{ borderColor: errors.newPassword ? "#ef4444" : "var(--gray-200)", paddingRight: "2.5rem" }}
              />
              {showNew ? (
                <EyeIcon onClick={() => setShowNew(false)} className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-gray-400" />
              ) : (
                <EyeOffIcon onClick={() => setShowNew(true)} className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-gray-400" />
              )}
            </div>

            {/* Password strength bar */}
            {newPassword && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className="h-1 flex-1 rounded-full transition-all"
                      style={{
                        background: pwdStrength >= level ? strengthColor[pwdStrength] : "var(--gray-200)",
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs font-medium" style={{ color: strengthColor[pwdStrength] }}>
                  {strengthLabel[pwdStrength]}
                </p>
              </div>
            )}

            {/* Requirements checklist */}
            {newPassword && (
              <ul className="mt-2 space-y-0.5">
                {[
                  { label: "At least 8 characters", ok: newPassword.length >= 8 },
                  { label: "Uppercase letter", ok: /[A-Z]/.test(newPassword) },
                  { label: "Number", ok: /[0-9]/.test(newPassword) },
                  { label: "Symbol (!@#$...)", ok: /[^A-Za-z0-9]/.test(newPassword) },
                ].map(({ label, ok }) => (
                  <li key={label} className="flex items-center gap-1.5 text-xs" style={{ color: ok ? "#22c55e" : "var(--gray-400)" }}>
                    <span>{ok ? "✓" : "○"}</span> {label}
                  </li>
                ))}
              </ul>
            )}

            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-(--gray-800)">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                onKeyDown={(e) => e.key === "Enter" && handleResetSubmit()}
                placeholder="••••••••"
                className={inputCls}
                style={{ borderColor: errors.confirmPassword ? "#ef4444" : "var(--gray-200)", paddingRight: "2.5rem" }}
              />
              {showConfirm ? (
                <EyeIcon onClick={() => setShowConfirm(false)} className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-gray-400" />
              ) : (
                <EyeOffIcon onClick={() => setShowConfirm(true)} className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-gray-400" />
              )}
            </div>
            {confirmPassword && newPassword && confirmPassword === newPassword && (
              <p className="text-green-500 text-xs mt-1.5 flex items-center gap-1">
                <span>✓</span> Passwords match
              </p>
            )}
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleResetSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-60 bg-(--blue) text-white cursor-pointer mt-2"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </div>
    );
  }

  // ── STEP: SUCCESS ──────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="text-center py-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "#f0fdf4" }}
        >
          <CheckCircle2Icon className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-black text-(--navy) mb-2">Password Reset!</h3>
        <p className="text-sm mb-8" style={{ color: "var(--gray-400)" }}>
          Your password has been updated successfully.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90 bg-(--blue) text-white cursor-pointer"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return null;
}
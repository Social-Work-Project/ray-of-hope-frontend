"use client";
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AuthService } from "@/services/authService";
import z from "zod";

// ── Schema ────────────────────────────────────────────────────────────────────
export const editPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password cannot be empty"),
    newPassword:     z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordFormValues = z.infer<typeof editPasswordSchema>;

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200 bg-white pr-11";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--gray-800)" }}>
      {children}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1.5">{msg}</p>;
}

// ── Component ─────────────────────────────────────────────────────────────────
const ChangePasswordSection = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(editPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      const res = await AuthService.changeUserPassword({
        old_password:     data.currentPassword,
        new_password:     data.newPassword,
        confirm_password: data.confirmPassword,
      }) as any;
      reset();
      toast.success(res.message || "Password changed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    }
  };

  return (
    <div
      className="w-full bg-white rounded-xl shadow-sm border p-5 sm:p-6"
      style={{ borderColor: "var(--gray-100)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-1">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "#FFF3DC" }}
        >
          <Lock className="w-4 h-4" style={{ color: "#b87a10" }} />
        </div>
        <div>
          <h3 className="font-bold text-sm" style={{ color: "var(--navy)" }}>Password</h3>
          <p className="text-xs" style={{ color: "var(--gray-400)" }}>Change your account password</p>
        </div>
      </div>

      <div className="mt-5 h-px mb-5" style={{ background: "var(--gray-100)" }} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Current password */}
        <div>
          <FieldLabel>Current Password</FieldLabel>
          <div className="relative">
            <input
              id="current-password"
              type={showCurrent ? "text" : "password"}
              {...register("currentPassword")}
              className={inputCls}
              style={{ borderColor: errors.currentPassword ? "#ef4444" : "var(--gray-200)" }}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center transition-all"
              style={{ color: "var(--gray-400)" }}
              aria-label={showCurrent ? "Hide password" : "Show password"}
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <FieldError msg={errors.currentPassword?.message} />
        </div>

        {/* New password */}
        <div>
          <FieldLabel>New Password</FieldLabel>
          <div className="relative">
            <input
              id="new-password"
              type={showNew ? "text" : "password"}
              {...register("newPassword")}
              className={inputCls}
              style={{ borderColor: errors.newPassword ? "#ef4444" : "var(--gray-200)" }}
              placeholder="Min. 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowNew((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center transition-all"
              style={{ color: "var(--gray-400)" }}
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <FieldError msg={errors.newPassword?.message} />
        </div>

        {/* Confirm password */}
        <div>
          <FieldLabel>Confirm New Password</FieldLabel>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword")}
              className={inputCls}
              style={{ borderColor: errors.confirmPassword ? "#ef4444" : "var(--gray-200)" }}
              placeholder="Re-enter new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center transition-all"
              style={{ color: "var(--gray-400)" }}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <FieldError msg={errors.confirmPassword?.message} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer"
          style={{ background: "var(--navy)" }}
        >
          {isSubmitting ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordSection;
"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, UserPlus, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AdminService } from "@/services/adminService";
import { User } from "@/types";

// ── Schema ────────────────────────────────────────────────────────────────────
const schema = z.object({
  first_name: z.string().max(50).optional().or(z.literal("")),
  last_name:  z.string().max(50).optional().or(z.literal("")),
  email:      z.string().email("Enter a valid email"),
  username:   z.string().min(3, "Username must be at least 3 characters").max(30),
  password:   z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  is_admin:  z.boolean(),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

// ── UI helpers ────────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-green-700/30 bg-white";

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>
      {children}
      {optional && <span className="ml-1 font-normal" style={{ color: "var(--gray-400)" }}>(optional)</span>}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1.5">{msg}</p>;
}

function Toggle({
  label,
  name,
  register,
}: {
  label: string;
  name: "is_admin" | "is_active";
  register: ReturnType<typeof useForm<FormValues>>["register"];
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-sm font-medium" style={{ color: "var(--navy)" }}>{label}</span>
      <div className="relative">
        <input type="checkbox" {...register(name)} className="peer sr-only" />
        <div className="h-5 w-9 rounded-full border bg-gray-200 transition-colors peer-checked:border-green-700 peer-checked:bg-green-700" />
        <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </div>
    </label>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function CreateUserModal({ open, user, onClose, onSuccess }: Props) {
  const isEdit = Boolean(user);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { first_name: "", last_name: "", email: "", username: "", password: "", is_admin: true, is_active: true },
  });

  useEffect(() => {
    if (!open) return;
    if (!user) {
      reset({ first_name: "", last_name: "", email: "", username: "", password: "", is_admin: true, is_active: true });
      return;
    }
    const u = user as any;
    reset({
      first_name: u.first_name ?? "",
      last_name:  u.last_name  ?? "",
      email:      u.email      ?? "",
      username:   u.username   ?? "",
      password:   "",
      is_admin:   u.is_admin   ?? true,
      is_active:  u.is_active  ?? true,
    });
  }, [open, user, reset]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = { ...values, first_name: values.first_name || undefined, last_name: values.last_name || undefined };
      if (isEdit) {
        await AdminService.updateUser(user?.user_id || "", payload);
        toast.success("User updated successfully!");
      } else {
        await AdminService.createUser(payload);
        toast.success("User created successfully!");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? err.message ?? "Failed to save user");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl bg-white shadow-2xl flex flex-col"
        style={{ maxHeight: "92vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b shrink-0 rounded-t-2xl sm:rounded-t-2xl" style={{ borderColor: "var(--gray-100)" }}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0" style={{ background: "#dcfce7" }}>
              <UserPlus className="w-4 h-4 text-green-800" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold truncate" style={{ color: "var(--navy)" }}>
                {isEdit ? "Edit User" : "Create New User"}
              </h2>
              <p className="text-xs hidden sm:block" style={{ color: "var(--gray-400)" }}>
                {isEdit ? `Editing: ${user?.username}` : "Fill in the details below"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all shrink-0 ml-2">
            <X className="w-4 h-4" style={{ color: "var(--gray-500)" }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto flex-1 px-5 sm:px-6 py-5 space-y-4">
          {/* First + Last name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <FieldLabel optional>First Name</FieldLabel>
              <input {...register("first_name")} placeholder="John" className={inputCls} style={{ borderColor: errors.first_name ? "#ef4444" : "var(--gray-200)" }} />
              <FieldError msg={errors.first_name?.message} />
            </div>
            <div>
              <FieldLabel optional>Last Name</FieldLabel>
              <input {...register("last_name")} placeholder="Doe" className={inputCls} style={{ borderColor: errors.last_name ? "#ef4444" : "var(--gray-200)" }} />
              <FieldError msg={errors.last_name?.message} />
            </div>
          </div>

          {/* Email */}
          <div>
            <FieldLabel>Email</FieldLabel>
            <input {...register("email")} type="email" placeholder="john@example.com" className={inputCls} style={{ borderColor: errors.email ? "#ef4444" : "var(--gray-200)" }} />
            <FieldError msg={errors.email?.message} />
          </div>

          {/* Username */}
          <div>
            <FieldLabel>Username</FieldLabel>
            <input {...register("username")} placeholder="john_doe123" className={inputCls} style={{ borderColor: errors.username ? "#ef4444" : "var(--gray-200)" }} />
            <FieldError msg={errors.username?.message} />
          </div>

          {/* Password — hidden in edit mode */}
          {!isEdit && (
            <div>
              <FieldLabel>Password</FieldLabel>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 chars, uppercase, number, symbol"
                  className={inputCls + " pr-11"}
                  style={{ borderColor: errors.password ? "#ef4444" : "var(--gray-200)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center transition-all"
                  style={{ color: "var(--gray-400)" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError msg={errors.password?.message} />
            </div>
          )}

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border p-4" style={{ borderColor: "var(--gray-100)" }}>
            <Toggle label="Admin Access" name="is_admin"  register={register} />
            <Toggle label="Active"       name="is_active" register={register} />
          </div>

          {/* Footer actions */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:bg-gray-50"
              style={{ borderColor: "var(--gray-200)", color: "var(--navy)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "#166534" }}
            >
              {isSubmitting
                ? <><Loader2 className="w-4 h-4 animate-spin" />{isEdit ? "Updating…" : "Creating…"}</>
                : <><UserPlus className="w-4 h-4" />{isEdit ? "Save Changes" : "Create User"}</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
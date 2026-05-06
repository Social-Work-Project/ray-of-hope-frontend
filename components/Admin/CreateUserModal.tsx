"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { AdminService } from "@/services/adminService";

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  first_name:   z.string().max(50).optional().or(z.literal("")),
  last_name:    z.string().max(50).optional().or(z.literal("")),
  email:        z.string().email("Enter a valid email"),
  username:     z.string().min(3, "Username must be at least 3 characters").max(30),
  phone_number: z.string().regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number").optional().or(z.literal("")),
  password:     z.string().min(8, "Password must be at least 8 characters")
                  .regex(/[A-Z]/, "Must contain an uppercase letter")
                  .regex(/[0-9]/, "Must contain a number")
                  .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  is_admin:     z.boolean(),
  is_active:    z.boolean(),
});

type FormValues = z.infer<typeof schema>;

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ── Field component ───────────────────────────────────────────────────────────

function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: "var(--navy)" }}>
        {label}
        {optional && (
          <span className="ml-1 font-normal" style={{ color: "var(--gray-400, #9ca3af)" }}>
            (optional)
          </span>
        )}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-green-700/30 focus:border-green-700";

// ── Modal ─────────────────────────────────────────────────────────────────────

export function CreateUserModal({ open, onClose, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name:   "",
      last_name:    "",
      email:        "",
      username:     "",
      phone_number: "",
      password:     "",
      is_admin:     true,
      is_active:    true,
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      // Strip empty optional strings before sending
      const payload = {
        ...values,
        first_name:   values.first_name   || undefined,
        last_name:    values.last_name    || undefined,
        phone_number: values.phone_number || undefined,
      };
      await AdminService.createUser(payload);
      toast.success("User created successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? err.message ?? "Failed to create user");
    }
  };

  if (!open) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal card */}
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b bg-white px-6 py-4"
          style={{ borderColor: "var(--gray-100)" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-800/10">
              <UserPlus size={16} className="text-green-800" />
            </div>
            <h2 className="text-base font-bold" style={{ color: "var(--navy)" }}>
              Create New User
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name" error={errors.first_name?.message} optional>
              <input
                {...register("first_name")}
                placeholder="John"
                className={inputClass}
                style={{ borderColor: errors.first_name ? "#ef4444" : "var(--gray-200, #e5e7eb)" }}
              />
            </Field>
            <Field label="Last Name" error={errors.last_name?.message} optional>
              <input
                {...register("last_name")}
                placeholder="Doe"
                className={inputClass}
                style={{ borderColor: errors.last_name ? "#ef4444" : "var(--gray-200, #e5e7eb)" }}
              />
            </Field>
          </div>

          {/* Email */}
          <Field label="Email" error={errors.email?.message}>
            <input
              {...register("email")}
              type="email"
              placeholder="john@example.com"
              className={inputClass}
              style={{ borderColor: errors.email ? "#ef4444" : "var(--gray-200, #e5e7eb)" }}
            />
          </Field>

          {/* Username */}
          <Field label="Username" error={errors.username?.message}>
            <input
              {...register("username")}
              placeholder="john_doe123"
              className={inputClass}
              style={{ borderColor: errors.username ? "#ef4444" : "var(--gray-200, #e5e7eb)" }}
            />
          </Field>

          {/* Phone */}
          <Field label="Phone Number" error={errors.phone_number?.message} optional>
            <input
              {...register("phone_number")}
              placeholder="+91 9800000000"
              className={inputClass}
              style={{ borderColor: errors.phone_number ? "#ef4444" : "var(--gray-200, #e5e7eb)" }}
            />
          </Field>

          {/* Password */}
          <Field label="Password" error={errors.password?.message}>
            <input
              {...register("password")}
              type="password"
              placeholder="Min 8 chars, uppercase, number, symbol"
              className={inputClass}
              style={{ borderColor: errors.password ? "#ef4444" : "var(--gray-200, #e5e7eb)" }}
            />
          </Field>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3 rounded-xl border p-4" style={{ borderColor: "var(--gray-100)" }}>
            <Toggle label="Admin Access" name="is_admin" register={register} />
            <Toggle label="Active"       name="is_active" register={register} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: "var(--gray-200, #e5e7eb)", color: "var(--navy)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-green-800 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-60"
            >
              {isSubmitting ? (
                <><Loader2 size={14} className="animate-spin" /> Creating...</>
              ) : (
                <><UserPlus size={14} /> Create User</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Toggle helper ─────────────────────────────────────────────────────────────

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
      <span className="text-sm font-medium" style={{ color: "var(--navy)" }}>
        {label}
      </span>
      <div className="relative">
        <input type="checkbox" {...register(name)} className="peer sr-only" />
        <div className="h-5 w-9 rounded-full border bg-gray-200 transition-colors peer-checked:border-green-700 peer-checked:bg-green-700" />
        <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </div>
    </label>
  );
}
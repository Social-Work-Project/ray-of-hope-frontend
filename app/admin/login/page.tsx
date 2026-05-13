"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAdminStore } from "@/store/adminStore";
import AdminGuard from "@/components/Admin/AdminGuard";
import { ArrowBigLeft, ArrowLeft, ArrowLeftIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import ForgotPasswordFlow from "@/components/Admin/ForgotPasswordFlow"; // adjust path as needed
import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ email: "", pass: "" });
  const [showForgotModal, setShowForgotModal] = useState(false);
  const login = useAdminStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({ email: "", pass: "" });

    const newError = { email: "", pass: "" };
    if (!email.trim()) newError.email = "Email is required";
    if (!pass.trim()) newError.pass = "Password is required";
    if (newError.email || newError.pass) {
      setError(newError);
      return;
    }

    try {
      setLoading(true);
      const success = await login(email, pass);
      if (success) {
        toast.success("Welcome back, Admin!");
        router.push("/admin/dashboard");
      } else {
        toast.error("Invalid credentials.");
      }
    } catch {
      toast.error("An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200";

  return (
    <AdminGuard>
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "var(--gray-50)" }}
      >
        <div
          className="bg-white rounded-2xl p-10 shadow-xl border w-full max-w-sm"
          style={{ borderColor: "var(--gray-100)" }}
        >
          {/* ── Forgot Password Flow ── */}
          {showForgotModal ? (
            <ForgotPasswordFlow onBack={() => setShowForgotModal(false)} />
          ) : (
            <>
              {/* ── Logo + heading ── */}
              <div className="text-center mb-8">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-600"
                >
                 <Image src="/logo.png" alt="logo" width={100} height={100} />
                </div>
                <h2 className="text-2xl font-black text-(--navy)">Admin Panel</h2>
                <p className="text-sm mt-1" style={{ color: "var(--gray-400)" }}>
                  Ray of Hope Society — Staff Login
                </p>
              </div>

              {/* ── Login form ── */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-(--gray-800)">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError((prev) => ({ ...prev, email: "" }));
                    }}
                    placeholder="admin@rayofhope.org"
                    className={inputCls}
                    style={{ borderColor: "var(--gray-200)" }}
                  />
                  {error.email && (
                    <p className="text-red-500 text-sm mt-1">{error.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-(--gray-800)">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={pass}
                      onChange={(e) => {
                        setPass(e.target.value);
                        setError((prev) => ({ ...prev, pass: "" }));
                      }}
                      placeholder="••••••••"
                      className={inputCls}
                      style={{ borderColor: "var(--gray-200)" }}
                    />
                    {showPassword ? (
                      <EyeIcon
                        onClick={() => setShowPassword(false)}
                        className="absolute top-3 right-2 cursor-pointer"
                      />
                    ) : (
                      <EyeOffIcon
                        onClick={() => setShowPassword(true)}
                        className="absolute top-3 right-2 cursor-pointer"
                      />
                    )}
                  </div>
                  {error.pass && (
                    <p className="text-red-500 text-sm mt-1">{error.pass}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-60 mt-2 bg-(--blue) text-white cursor-pointer"
                >
                  {loading ? "Signing in..." : "Sign In to Dashboard"}
                </button>
              </form>
              <div className="flex flex-col gap-4 justify-between pt-4">
              <p
                onClick={() => setShowForgotModal(true)}
                className="hover:text-blue-600 text-gray-600 cursor-pointer hover:underline text-sm"
              >
                Forgot Password?
              </p>
              <Link href="/" className="flex items-center gap-2 hover:underline hover:text-blue-600"><ArrowLeftIcon className="w-4 h-4" />Go Back</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
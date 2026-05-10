"use client";
import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { toast } from "sonner";
import ChangePasswordSection from "@/components/Admin/ChangePasswordSection";
import AdminGuard from "@/components/Admin/AdminGuard";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import { AuthService } from "@/services/authService";

// ── Shared field style ────────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200 bg-white";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--gray-800)" }}>
      {children}
    </label>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Settings() {
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await AuthService.getProfile() as any;
        const r = res.data.results;
        setProfileData({
          username:   r.username   || "",
          email:      r.email      || "",
          first_name: r.first_name || "",
          last_name:  r.last_name  || "",
        });
      } catch {
        toast.error("Failed to load profile.");
      }
    }
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await AuthService.changeProfile(profileData);
      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Error updating profile. Try again!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 flex flex-col bg-gray-50 min-w-0">
          {/* Top bar */}
          <div
            className="bg-white border-b px-4 sm:px-8 py-4 sticky top-0 z-10"
            style={{ borderColor: "var(--gray-100)" }}
          >
            <h2
              className="font-bold text-base sm:text-lg pl-12 lg:pl-0"
              style={{ color: "var(--navy)", fontFamily: "'DM Sans',sans-serif" }}
            >
              Account Settings
            </h2>
          </div>

          {/* Content — stacks on mobile, side-by-side on md+ */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">

              {/* ── Profile card ── */}
              <div
                className="w-full md:max-w-md bg-white rounded-xl shadow-sm border p-5 sm:p-6"
                style={{ borderColor: "var(--gray-100)" }}
              >
                {/* Header */}
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#EEF2F7" }}
                  >
                    <User className="w-4 h-4" style={{ color: "var(--blue)" }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: "var(--navy)" }}>Profile</h3>
                    <p className="text-xs" style={{ color: "var(--gray-400)" }}>Update your personal information</p>
                  </div>
                </div>

                <div className="mt-5 h-px mb-5" style={{ background: "var(--gray-100)" }} />

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  {/* First + Last name side by side on sm+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>First Name</FieldLabel>
                      <input
                        value={profileData.first_name}
                        onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                        placeholder="John"
                        className={inputCls}
                        style={{ borderColor: "var(--gray-200)" }}
                      />
                    </div>
                    <div>
                      <FieldLabel>Last Name</FieldLabel>
                      <input
                        value={profileData.last_name}
                        onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                        placeholder="Doe"
                        className={inputCls}
                        style={{ borderColor: "var(--gray-200)" }}
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Username</FieldLabel>
                    <input
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      placeholder="johndoe"
                      className={inputCls}
                      style={{ borderColor: "var(--gray-200)" }}
                    />
                  </div>

                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      placeholder="john@example.com"
                      className={inputCls}
                      style={{ borderColor: "var(--gray-200)" }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer"
                    style={{ background: "var(--blue)" }}
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </form>
              </div>

              {/* ── Password card ── */}
              <div className="w-full md:max-w-md">
                <ChangePasswordSection />
              </div>

            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
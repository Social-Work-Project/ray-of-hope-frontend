"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthService } from "@/services/authService";

// ── Auth context — lets any child read the current role ───────────────────────
interface AuthCtx {
  role: "admin" | "super_admin" | null;
}

const AdminAuthContext = createContext<AuthCtx>({ role: null });

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

// ── Guard ─────────────────────────────────────────────────────────────────────
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [role, setRole]       = useState<"admin" | "super_admin" | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === "/admin/login") {
        setLoading(false);
        return;
      }
      try {
        const res = await AuthService.checkAuth();
        const results = res?.data?.results;

        if (!results?.isAuthenticated) {
          router.replace("/admin/login");
          return;
        }

        // Normalise role string — API may return "super admin" or "super_admin"
        const raw: string = (results.role ?? "admin").toLowerCase().replace(/\s+/g, "_");
        setRole(raw === "super_admin" ? "super_admin" : "admin");
      } catch {
        router.replace("/admin/login");
        return;
      }
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: "var(--blue)" }}
        />
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ role }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
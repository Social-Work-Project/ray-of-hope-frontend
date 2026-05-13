"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthService } from "@/services/authService";

type AdminRole = "admin" | "super_admin" | null;

let cachedRole: AdminRole = null;
let hasCheckedAuth = false;
let authCheckPromise: Promise<AdminRole> | null = null;

const normalizeRole = (role?: string): Exclude<AdminRole, null> => {
  const raw = (role ?? "admin").toLowerCase().replace(/\s+/g, "_");
  return raw === "super_admin" ? "super_admin" : "admin";
};

const getAdminRole = async () => {
  if (hasCheckedAuth) return cachedRole;

  authCheckPromise ??= AuthService.checkAuth()
    .then((res) => {
      const results = res?.data?.results;

      if (!results?.isAuthenticated) {
        cachedRole = null;
        return null;
      }

      cachedRole = normalizeRole(results.role);
      return cachedRole;
    })
    .finally(() => {
      hasCheckedAuth = true;
      authCheckPromise = null;
    });

  return authCheckPromise;
};

export function clearAdminAuthCache() {
  cachedRole = null;
  hasCheckedAuth = false;
  authCheckPromise = null;
}

interface AuthCtx {
  role: AdminRole;
}

const AdminAuthContext = createContext<AuthCtx>({ role: null });

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const [loading, setLoading] = useState(!isLoginPage && !hasCheckedAuth);
  const [role, setRole] = useState<AdminRole>(cachedRole);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      if (isLoginPage) {
        setLoading(false);
        return;
      }

      if (hasCheckedAuth) {
        setRole(cachedRole);
        setLoading(false);

        if (!cachedRole) router.replace("/admin/login");
        return;
      }

      setLoading(true);

      try {
        const nextRole = await getAdminRole();
        if (cancelled) return;

        if (!nextRole) {
          router.replace("/admin/login");
          return;
        }

        setRole(nextRole);
      } catch {
        if (cancelled) return;
        clearAdminAuthCache();
        router.replace("/admin/login");
        return;
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [isLoginPage, router]);

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

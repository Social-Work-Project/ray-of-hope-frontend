"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { toast } from "sonner";
import { AuthService } from "@/services/authService";

const navItems = [
  { href: "/admin/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/admin/events", icon: "📅", label: "Manage Events" },
  { href: "/admin/volunteers", icon: "👥", label: "General Volunteers" },
  { href: "/admin/event-volunteers", icon: "📢", label: "Event Volunteers" },
  { href: "/admin/testimonials", icon: "💬", label: "Testimonials" },
  { href: "/admin/gallery", icon: "🖼️", label: "Gallery" },
  { href: "/admin/team", icon: "👤", label: "Team Members" },
  { href: "/admin/cms", icon: "✏️", label: "CMS Editor" },
];

const accountItems = [
  { href: "/admin/users", icon: "👥", label: "Manage Users" },
  { href: "/admin/settings", icon: "⚙️", label: "Settings" },
];

// ─── Hamburger button rendered in the top bar on mobile ──────────────────────
export function SidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-all hover:bg-white/10"
      style={{ color: "var(--navy)" }}
      aria-label="Open navigation"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}

// ─── Main sidebar component ───────────────────────────────────────────────────
export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Close sheet on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Lock body scroll when sheet is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch {
      toast.error("An error occurred while logging out.");
    }
  };

  const NavLink = useCallback(
    ({ item }: { item: { href: string; icon: string; label: string } }) => {
      const active = pathname === item.href;
      return (
        <Link
          href={item.href}
          className={clsx(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
            active
              ? "text-white shadow-sm"
              : "hover:bg-white/10 active:bg-white/15"
          )}
          style={{
            color: active ? "white" : "rgba(255,255,255,0.65)",
            background: active ? "var(--sky)" : undefined,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <span className="text-base leading-none w-5 text-center shrink-0">
            {item.icon}
          </span>
          <span className="truncate">{item.label}</span>
          {active && (
            <span
              className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: "rgba(255,255,255,0.7)" }}
            />
          )}
        </Link>
      );
    },
    [pathname]
  );

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div
      className="text-xs uppercase tracking-widest px-3 py-2 mt-4 mb-0.5 first:mt-2"
      style={{ color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans', sans-serif" }}
    >
      {children}
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "var(--sky)" }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-white" strokeWidth={2}>
              <path d="M12 2 L4 8 L4 20 L20 20 L20 8 Z" strokeLinejoin="round" />
              <circle cx="12" cy="14" r="3" />
            </svg>
          </div>
          <div className="min-w-0">
            <div
              className="text-white text-sm font-bold truncate"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Admin Panel
            </div>
            <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.38)" }}>
              Ray of Hope Society
            </div>
          </div>
        </div>
        {/* Close button — visible only on mobile */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden ml-2 shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.5)" }}
          aria-label="Close navigation"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3" style={{ scrollbarWidth: "none" }}>
        <SectionLabel>Main</SectionLabel>
        {navItems.slice(0, 4).map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        <SectionLabel>Content</SectionLabel>
        {navItems.slice(4).map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        <SectionLabel>Account</SectionLabel>
        {accountItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-all duration-150 hover:bg-white/10 active:bg-white/15"
          style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}
        >
          <span className="text-base leading-none w-5 text-center shrink-0">🚪</span>
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );

  return (
    <>
      {/* ── Desktop: fixed sidebar ────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-64 shrink-0 fixed left-0 top-0 bottom-0 z-30"
        style={{ background: "var(--navy)" }}
      >
        {sidebarContent}
      </aside>

      {/* ── Desktop: spacer so main content isn't hidden behind fixed sidebar  */}
      <div className="hidden lg:block w-64 shrink-0" aria-hidden="true" />

      {/* ── Mobile: hamburger trigger ─────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-40 flex items-center justify-center w-9 h-9 rounded-xl shadow-md transition-all active:scale-95"
        style={{ background: "var(--navy)", color: "white" }}
        aria-label="Open navigation"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="15" y2="12" />
          <line x1="3" y1="18" x2="18" y2="18" />
        </svg>
      </button>

      {/* ── Mobile: backdrop ─────────────────────────────────────────────── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 transition-opacity duration-300"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile: sheet ────────────────────────────────────────────────── */}
      <aside
        className="lg:hidden fixed left-0 top-0 bottom-0 z-50 flex flex-col w-72 max-w-[85vw] transition-transform duration-300 ease-out"
        style={{
          background: "var(--navy)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          willChange: "transform",
          boxShadow: open ? "4px 0 32px rgba(0,0,0,0.35)" : "none",
        }}
        aria-modal="true"
        role="dialog"
        aria-label="Navigation"
      >
        {sidebarContent}
      </aside>
    </>
  );
}
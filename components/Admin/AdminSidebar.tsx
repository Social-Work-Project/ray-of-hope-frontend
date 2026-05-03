"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { AuthService } from "@/services/authService";

const navItems = [
  { href: "/admin/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/admin/events", icon: "📅", label: "Manage Events" },
  { href: "/admin/volunteers", icon: "👥", label: "Volunteers" },
  // { href: '/admin/donations', icon: '💰', label: 'Donations' },
  { href: "/admin/testimonials", icon: "💬", label: "Testimonials" },
  { href: "/admin/gallery", icon: "🖼️", label: "Gallery" },
  { href: "/admin/team", icon: "👤", label: "Team Members" },
  { href: "/admin/cms", icon: "✏️", label: "CMS Editor" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      toast.error("An error occurred while logging out.");
    }
  };

  return (
    <aside
      className="w-64 shrink-0 flex flex-col"
      style={{ background: "var(--navy)", minHeight: "100vh" }}
    >
      <div
        className="p-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "var(--sky)" }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-none stroke-white"
              strokeWidth={2}
            >
              <path
                d="M12 2 L4 8 L4 20 L20 20 L20 8 Z"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="14" r="3" />
            </svg>
          </div>
          <div>
            <div
              className="text-white text-sm font-bold"
              style={{ fontFamily: "'Playfair Display',serif" }}
            >
              Admin Panel
            </div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Ray of Hope Society
            </div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        <div
          className="text-xs uppercase tracking-widest px-3 py-2 mt-1 mb-1"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Main
        </div>
        {navItems.slice(0, 4).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all",
              pathname === item.href ? "text-white" : "hover:bg-white/8",
            )}
            style={{
              color: pathname === item.href ? "white" : "rgba(255,255,255,0.6)",
              background: pathname === item.href ? "var(--sky)" : undefined,
            }}
          >
            <span>{item.icon}</span> {item.label}
          </Link>
        ))}
        <div
          className="text-xs uppercase tracking-widest px-3 py-2 mt-3 mb-1"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Content
        </div>
        {navItems.slice(4).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all",
              pathname === item.href ? "text-white" : "hover:bg-white/8",
            )}
            style={{
              color: pathname === item.href ? "white" : "rgba(255,255,255,0.6)",
              background: pathname === item.href ? "var(--sky)" : undefined,
            }}
          >
            <span>{item.icon}</span> {item.label}
          </Link>
        ))}
        <div
          className="text-xs uppercase tracking-widest px-3 py-2 mt-3 mb-1"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Account
        </div>
        <Link href="/admin/settings">
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-all hover:bg-white/8" style={{ color: "rgba(255,255,255,0.6)" }}>
            <span>⚙️</span> Settings
          </button>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-all hover:bg-white/8"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          <span>🚪</span> Logout
        </button>
      </nav>
    </aside>
  );
}

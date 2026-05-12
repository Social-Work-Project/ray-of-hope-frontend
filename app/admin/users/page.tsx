"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Ban, CheckCircle, Loader2, MoreVertical,
  Pencil, Plus, Trash2, User2, Eye,
} from "lucide-react";
import { toast } from "sonner";
import { User } from "@/types";
import { AdminService } from "@/services/adminService";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import AdminGuard from "@/components/Admin/AdminGuard";
import { CreateUserModal } from "@/components/Admin/CreateUserModal";
import DeleteConfirmModal from "@/components/common/DeleteDialogModal";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formattedDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ── Portal Actions Menu ───────────────────────────────────────────────────────
type ActionDef = {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  fn: () => void;
};

function ActionsMenu({ actions }: { actions: ActionDef[] }) {
  const [open, setOpen]     = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef   = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuH = actions.length * 44 + 12;
    const top   = window.innerHeight - rect.bottom < menuH + 8
      ? rect.top  + window.scrollY - menuH - 4
      : rect.bottom + window.scrollY + 4;
    const left  = rect.right + window.scrollX - 148;
    setCoords({ top, left });
  }, [actions.length]);

  const handleOpen = () => { updatePosition(); setOpen(true); };

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (menuRef.current   && !menuRef.current.contains(e.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => { window.removeEventListener("scroll", close, true); window.removeEventListener("resize", close); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-gray-100"
        style={{ color: "var(--gray-400)" }}
        aria-label="Actions"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          role="menu"
          className="fixed bg-white rounded-xl border py-1.5"
          style={{ top: coords.top, left: coords.left, minWidth: 148, zIndex: 9999, borderColor: "var(--gray-100)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
        >
          {actions.map((a) => (
            <button
              key={a.label}
              role="menuitem"
              onClick={() => { setOpen(false); a.fn(); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-all"
              style={{ color: a.color }}
              onMouseEnter={(e) => (e.currentTarget.style.background = a.bg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {a.icon}
              <span className="font-medium">{a.label}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}

// ── View User Modal ───────────────────────────────────────────────────────────
function ViewUserModal({ user, onClose }: { user: User; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between shrink-0" style={{ borderColor: "var(--gray-100)" }}>
          <h2 className="font-bold text-base" style={{ color: "var(--navy)", fontFamily: "'DM Sans',sans-serif" }}>User Details</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all" style={{ color: "var(--gray-400)" }}>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: "var(--navy)" }}>{user.full_name}</p>
              <p className="text-sm" style={{ color: "var(--gray-400)" }}>@{user.username}</p>
              <div className="mt-1.5 flex gap-1.5 flex-wrap">
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                  style={{ background: "#fef3c7", color: "#92400e" }}
                >
                  {user.is_super_admin ? "Super Admin" : "Admin"}
                </span>
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                  style={!user.is_banned
                    ? { background: "#dcfce7", color: "#166534" }
                    : { background: "#fef9c3", color: "#854d0e" }}
                >
                  {!user.is_banned ? "Active" : "Banned"}
                </span>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Email",  value: user.email },
              { label: "Joined", value: formattedDate(user.date_joined) },
            ].map((row) => (
              <div key={row.label} className="p-3 rounded-xl" style={{ background: "var(--gray-50)" }}>
                <div className="text-xs mb-0.5" style={{ color: "var(--gray-400)" }}>{row.label}</div>
                <div className="text-sm font-semibold break-all" style={{ color: "var(--text)" }}>{row.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ banned }: { banned: boolean }) {
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-full font-semibold"
      style={!banned
        ? { background: "#dcfce7", color: "#166534" }
        : { background: "#fef9c3", color: "#854d0e" }}
    >
      {!banned ? "Active" : "Banned"}
    </span>
  );
}

function RoleBadge({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-full font-semibold"
      style={{ background: "#fef3c7", color: "#92400e" }}
    >
      {isSuperAdmin ? "Super Admin" : "Admin"}
    </span>
  );
}

// ── Mobile User Card ──────────────────────────────────────────────────────────
function UserCard({ user, actions }: { user: User; actions: ActionDef[] }) {
  return (
    <div className="p-4 rounded-xl border" style={{ borderColor: "var(--gray-100)", background: "var(--gray-50)" }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">{user.username.charAt(0).toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{user.full_name}</p>
            <p className="text-xs truncate" style={{ color: "var(--gray-400)" }}>{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <StatusBadge banned={user.is_banned} />
          <ActionsMenu actions={actions} />
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
        <RoleBadge isSuperAdmin={user.is_super_admin} />
        <span className="text-xs" style={{ color: "var(--gray-400)" }}>🗓 {shortDate(user.date_joined)}</span>
      </div>
    </div>
  );
}

// ── Simple Pagination ─────────────────────────────────────────────────────────
function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
      <p className="text-xs" style={{ color: "var(--gray-400)" }}>
        Page {current} of {total}
      </p>
      <div className="flex gap-1.5">
        <button
          onClick={() => onChange(1)}
          disabled={current === 1}
          className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all disabled:opacity-40"
          style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)" }}
        >«</button>
        <button
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
          className="px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all disabled:opacity-40"
          style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)" }}
        >‹ Prev</button>
        <button
          onClick={() => onChange(current + 1)}
          disabled={current === total}
          className="px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all disabled:opacity-40"
          style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)" }}
        >Next ›</button>
        <button
          onClick={() => onChange(total)}
          disabled={current === total}
          className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all disabled:opacity-40"
          style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)" }}
        >»</button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Users() {
  const [users, setUsers]           = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [openModal, setOpenModal]   = useState(false);
  const [viewUser, setViewUser]     = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting]     = useState(false);

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  useEffect(() => { fetchAllUsers(); }, [currentPage]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getAllUsers();
      setUsers(res.data.results || []);
      setTotalItems(res.data.count || 0);
    } catch (err: any) {
      toast.error(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = (userId: string) =>
    setUsers((prev) => prev.map((u) => u.user_id === userId ? { ...u, is_banned: !u.is_banned } : u));

  const handleBanUnban = async (user: User) => {
    try {
      await AdminService.banunbanUser(user.user_id, { is_banned: !user.is_banned });
      toast.success(user.is_banned ? "User unbanned!" : "User banned!");
      toggleUserStatus(user.user_id);
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await AdminService.deleteUser(id);
      toast.success("User deleted.");
      setUsers((prev) => prev.filter((u) => u.user_id !== id));
      setTotalItems((c) => c - 1);
    } catch (err: any) { toast.error(err.message);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleClose  = () => { setOpenModal(false); setSelectedUser(null); };
  const handleAddNew = () => { setSelectedUser(null); setOpenModal(true); };
  const handleEdit   = (user: User) => { setSelectedUser(user); setOpenModal(true); };

  const buildActions = (user: User): ActionDef[] => {
    const actions: ActionDef[] = [
      { label: "View", icon: <Eye className="w-4 h-4" />, color: "var(--navy)", bg: "var(--gray-50)", fn: () => setViewUser(user) },
    ];
    if (!user.is_super_admin) {
      actions.push(
        { label: "Edit",   icon: <Pencil className="w-4 h-4" />,                       color: "var(--sky)",  bg: "#eff6ff",  fn: () => handleEdit(user) },
        {
          label: user.is_banned ? "Unban" : "Ban",
          icon: user.is_banned
            ? <CheckCircle className="w-4 h-4" />
            : <Ban className="w-4 h-4" />,
          color: user.is_banned ? "#16a34a" : "#d97706",
          bg:    user.is_banned ? "#f0fdf4"  : "#fffbeb",
          fn: () => handleBanUnban(user),
        },
        { label: "Delete", icon: <Trash2 className="w-4 h-4" />,                       color: "#dc2626",     bg: "#fef2f2",  fn: () => setDeleteTarget(user) },
      );
    }
    return actions;
  };

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 flex flex-col bg-gray-50 min-w-0">
          {/* Top bar */}
          <div className="bg-white border-b px-4 sm:px-8 py-4 sticky top-0 z-10" style={{ borderColor: "var(--gray-100)" }}>
            <h2 className="font-bold text-base sm:text-lg pl-12 lg:pl-0" style={{ color: "var(--navy)", fontFamily: "'DM Sans',sans-serif" }}>
              Users Management
            </h2>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: "var(--gray-100)" }}>
              {/* Toolbar */}
              <div className="px-4 sm:px-5 py-4 border-b flex items-center justify-between gap-3" style={{ borderColor: "var(--gray-100)" }}>
                <h3 className="font-bold text-sm" style={{ color: "var(--navy)" }}>
                  All Users ({totalItems})
                </h3>
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all whitespace-nowrap"
                  style={{ background: "#166534" }}
                >
                  <Plus className="w-4 h-4" /> Add User
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-7 h-7 animate-spin" style={{ color: "var(--blue)" }} />
                </div>
              ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <User2 className="w-12 h-12 mb-4 text-muted-foreground" />
                  <p className="font-semibold text-sm" style={{ color: "var(--gray-400)" }}>No users found</p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: "var(--gray-50)" }}>
                          {["User", "Role", "Status", "Joined", "Actions"].map((h) => (
                            <th key={h} className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--gray-400)" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.user_id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--gray-100)" }}>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <span className="text-xs font-bold text-primary">{user.username.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                  <p className="font-medium whitespace-nowrap" style={{ color: "var(--text)" }}>{user.full_name}</p>
                                  <p className="text-xs" style={{ color: "var(--gray-400)" }}>{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3"><RoleBadge isSuperAdmin={user.is_super_admin} /></td>
                            <td className="px-5 py-3"><StatusBadge banned={user.is_banned} /></td>
                            <td className="px-5 py-3 whitespace-nowrap text-xs" style={{ color: "var(--gray-400)" }}>{shortDate(user.date_joined)}</td>
                            <td className="px-5 py-3"><ActionsMenu actions={buildActions(user)} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="sm:hidden p-3 space-y-3">
                    {users.map((user) => (
                      <UserCard key={user.user_id} user={user} actions={buildActions(user)} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="px-4 sm:px-5 pb-4">
                    <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* View modal */}
      {viewUser && <ViewUserModal user={viewUser} onClose={() => setViewUser(null)} />}

      {/* Create / Edit modal */}
      <CreateUserModal
        user={selectedUser}
        open={openModal}
        onClose={handleClose}
        onSuccess={fetchAllUsers}
      />

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget.user_id)}
          title="Confirm Deletion"
          description={`Are you sure you want to delete "${deleteTarget.username}"? This action cannot be undone.`}
          itemName={deleteTarget.username}
          isLoading={deleting}
        />
      )}
    </AdminGuard>
  );
}
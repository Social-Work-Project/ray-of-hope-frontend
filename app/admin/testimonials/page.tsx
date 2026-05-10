"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import { Badge } from "@/components/ui";
import { toast } from "sonner";
import AdminGuard from "@/components/Admin/AdminGuard";
import TestimonialModal from "@/components/Admin/TestimonialModal";
import { AdminService } from "@/services/adminService";
import { TestimonialsResponse } from "@/types";
import { Trash2, Eye, Pencil, MoreVertical } from "lucide-react";
import DeleteConfirmModal from "@/components/common/DeleteDialogModal";
import { createPortal } from "react-dom";

// ── Portal Actions Menu ───────────────────────────────────────────────────────
type ActionDef = {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  fn: () => void;
};

function ActionsMenu({ actions }: { actions: ActionDef[] }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef   = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = actions.length * 44 + 12;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top = spaceBelow < menuHeight + 8
      ? rect.top + window.scrollY - menuHeight - 4
      : rect.bottom + window.scrollY + 4;
    const left = rect.right + window.scrollX - 148;
    setCoords({ top, left });
  }, [actions.length]);

  const handleOpen = () => { updatePosition(); setOpen(true); };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (
        menuRef.current   && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
          style={{
            top: coords.top,
            left: coords.left,
            minWidth: 148,
            zIndex: 9999,
            borderColor: "var(--gray-100)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
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

// ── View Modal ────────────────────────────────────────────────────────────────
function ViewTestimonialModal({
  t,
  onClose,
}: {
  t: TestimonialsResponse;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
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
        <div
          className="px-5 py-4 border-b flex items-center justify-between shrink-0"
          style={{ borderColor: "var(--gray-100)" }}
        >
          <h2 className="font-bold text-base" style={{ color: "var(--navy)", fontFamily: "'DM Sans',sans-serif" }}>
            Testimonial
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all"
            style={{ color: "var(--gray-400)" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
          
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0"
                style={{ background: "var(--blue)" }}
              >
                {t.name.charAt(0).toUpperCase()}
              </div>
         
            <div>
              <div className="font-bold text-base" style={{ color: "var(--navy)" }}>{t.name}</div>
              <div className="text-sm" style={{ color: "var(--gray-400)" }}>{t.role}</div>
              <div className="mt-1">
                <Badge variant={t.is_active ? "green" : "yellow"}>
                  {t.is_active ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
          </div>

       

          {/* Message */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gray-400)" }}>Message</div>
            <p className="text-sm leading-relaxed p-3 rounded-xl italic" style={{ background: "var(--gray-50)", color: "var(--gray-600)" }}>
              "{t.message}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mobile Testimonial Card ───────────────────────────────────────────────────
function TestimonialCard({
  t,
  actions,
}: {
  t: TestimonialsResponse;
  actions: ActionDef[];
}) {
  return (
    <div
      className="p-4 rounded-xl border"
      style={{ borderColor: "var(--gray-100)", background: "var(--gray-50)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
         
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: "var(--blue)" }}
            >
              {t.name.charAt(0).toUpperCase()}
            </div>
        
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{t.name}</div>
            <div className="text-xs truncate" style={{ color: "var(--gray-400)" }}>{t.role}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant={t.is_active ? "green" : "yellow"}>
            {t.is_active ? "Published" : "Draft"}
          </Badge>
          <ActionsMenu actions={actions} />
        </div>
      </div>
      <p
        className="text-xs mt-3 line-clamp-2 italic"
        style={{ color: "var(--gray-400)" }}
      >
        "{t.message}"
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminTestimonialsPage() {
  const [openModal, setOpenModal]                   = useState(false);
  const [testimonials, setTestimonials]             = useState<TestimonialsResponse[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialsResponse | null>(null);
  const [deleteTarget, setDeleteTarget]             = useState<TestimonialsResponse | null>(null);
  const [viewTarget, setViewTarget]                 = useState<TestimonialsResponse | null>(null);
  const [loading, setLoading]                       = useState(false);

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await AdminService.getAllTestimonials();
      setTestimonials(res.data.results || []);
    } catch (err) {
      toast.error("Failed to fetch testimonials.");
    }
  };

  const handleClose = () => { setOpenModal(false); setSelectedTestimonial(null); };
  const handleAddNew = () => { setSelectedTestimonial(null); setOpenModal(true); };
  const handleEdit   = (t: TestimonialsResponse) => { setSelectedTestimonial(t); setOpenModal(true); };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await AdminService.deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((e) => e.reference_id !== id));
      toast.success("Testimonial deleted!");
    } catch {
      toast.error("Failed to delete testimonial. Please try again.");
    } finally {
      setLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedTestimonial) {
        await AdminService.patchTestimonial(selectedTestimonial.reference_id, data);
        toast.success("Testimonial updated!");
      } else {
        await AdminService.createTestimonial(data);
        toast.success("Testimonial created!");
      }
      handleClose();
      fetchTestimonials();
    } catch {
      toast.error("Failed to save testimonial. Please try again.");
    }
  };

  const handlePublishUnpublish = async (t: TestimonialsResponse) => {
    try {
      await AdminService.patchTestimonial(t.reference_id, { ...t, is_active: !t.is_active });
      toast.success(`Testimonial ${!t.is_active ? "published" : "set to draft"}.`);
      fetchTestimonials();
    } catch {
      toast.error("Error changing status. Try again!");
    }
  };

  const buildActions = (t: TestimonialsResponse): ActionDef[] => [
    {
      label: "View",
      icon: <Eye className="w-4 h-4" />,
      color: "var(--navy)",
      bg: "var(--gray-50)",
      fn: () => setViewTarget(t),
    },
    {
      label: t.is_active ? "Unpublish" : "Publish",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          {t.is_active
            ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
          }
        </svg>
      ),
      color: "var(--sky)",
      bg: "#eff6ff",
      fn: () => handlePublishUnpublish(t),
    },
    {
      label: "Edit",
      icon: <Pencil className="w-4 h-4" />,
      color: "var(--gray-600)",
      bg: "var(--gray-50)",
      fn: () => handleEdit(t),
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      color: "#dc2626",
      bg: "#fef2f2",
      fn: () => setDeleteTarget(t),
    },
  ];

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
              Testimonials Manager
            </h2>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
              style={{ borderColor: "var(--gray-100)" }}
            >
              {/* Toolbar */}
              <div
                className="px-4 sm:px-5 py-4 border-b flex items-center justify-between gap-3"
                style={{ borderColor: "var(--gray-100)" }}
              >
                <h3 className="font-bold text-sm" style={{ color: "var(--navy)" }}>
                  All Testimonials ({testimonials.length})
                </h3>
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all whitespace-nowrap"
                  style={{ background: "var(--blue)" }}
                >
                  + Add Testimonial
                </button>
              </div>

              {testimonials.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: "var(--gray-100)" }}>
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ color: "var(--gray-400)" }}>
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium" style={{ color: "var(--gray-400)" }}>
                    No testimonials yet. Add one to get started!
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: "var(--gray-50)" }}>
                          {["Name", "Role", "Preview", "Status", "Actions"].map((h) => (
                            <th
                              key={h}
                              className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                              style={{ color: "var(--gray-400)" }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {testimonials.map((t) => (
                          <tr
                            key={t.reference_id}
                            className="border-t hover:bg-gray-50 transition-colors"
                            style={{ borderColor: "var(--gray-100)" }}
                          >
                            {/* Name + avatar */}
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2.5">
                               
                                  <img src="/images/user.png" alt={t.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                              
                               
                                <span className="font-medium whitespace-nowrap" style={{ color: "var(--text)" }}>
                                  {t.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap" style={{ color: "var(--gray-600)" }}>
                              {t.role}
                            </td>
                            <td
                              className="px-5 py-3 max-w-65 truncate italic"
                              style={{ color: "var(--gray-400)" }}
                              title={t.message}
                            >
                              "{t.message}"
                            </td>
                            <td className="px-5 py-3">
                              <Badge variant={t.is_active ? "green" : "yellow"}>
                                {t.is_active ? "Published" : "Draft"}
                              </Badge>
                            </td>
                            <td className="px-5 py-3">
                              <ActionsMenu actions={buildActions(t)} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="sm:hidden p-3 space-y-3">
                    {testimonials.map((t) => (
                      <TestimonialCard key={t.reference_id} t={t} actions={buildActions(t)} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* View modal */}
      {viewTarget && (
        <ViewTestimonialModal t={viewTarget} onClose={() => setViewTarget(null)} />
      )}

      {/* Edit / Create modal */}
      {openModal && (
        <TestimonialModal
          isOpen={openModal}
          onClose={handleClose}
          onSave={handleSave}
          testimonial={selectedTestimonial}
        />
      )}

      {/* Delete confirm — rendered once at root, not inside the table */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget.reference_id)}
          title="Confirm Deletion"
          description={`Are you sure you want to delete the testimonial from "${deleteTarget.name}"? This action cannot be undone.`}
          itemName={deleteTarget.name}
          isLoading={loading}
        />
      )}
    </AdminGuard>
  );
}
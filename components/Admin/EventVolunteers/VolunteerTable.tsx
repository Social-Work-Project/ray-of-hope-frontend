"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye, MoreVertical, Trash2, XCircle } from "lucide-react";
import { EventVolunteer } from "@/types";

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  pending:  "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100  text-red-800  border-red-200",
};

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
      ? rect.top  + window.scrollY - menuHeight - 4
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
        className="h-8 w-8 flex items-center justify-center rounded-lg transition-all hover:bg-gray-100"
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

// Build context-aware action list per volunteer status
function buildActions(
  v: EventVolunteer,
  onView: () => void,
  onApprove: () => void,
  onReject: () => void,
  onDelete: () => void,
): ActionDef[] {
  const actions: ActionDef[] = [
    {
      label: "View",
      icon: <Eye className="w-4 h-4" />,
      color: "var(--navy)",
      bg: "var(--gray-50)",
      fn: onView,
    },
  ];

  if (v.status !== "approved") {
    actions.push({
      label: "Approve",
      icon: <CheckCircle className="w-4 h-4" />,
      color: "#16a34a",
      bg: "#f0fdf4",
      fn: onApprove,
    });
  }

  if (v.status !== "rejected") {
    actions.push({
      label: "Reject",
      icon: <XCircle className="w-4 h-4" />,
      color: "#d97706",
      bg: "#fffbeb",
      fn: onReject,
    });
  }

  // Delete only available for rejected applications
  if (v.status === "rejected") {
    actions.push({
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      color: "#dc2626",
      bg: "#fef2f2",
      fn: onDelete,
    });
  }

  return actions;
}

// ── Mobile volunteer card ─────────────────────────────────────────────────────
function VolunteerCard({
  v,
  onView,
  onApprove,
  onReject,
  onDelete,
}: {
  v: EventVolunteer;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  const actions = buildActions(v, onView, onApprove, onReject, onDelete);

  return (
    <div
      className="p-4 rounded-xl border"
      style={{ borderColor: "var(--gray-100)", background: "var(--gray-50)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">
              {v.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>
              {v.full_name}
            </p>
            <p className="text-xs truncate" style={{ color: "var(--gray-400)" }}>
              {v.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant="outline" className={STATUS_STYLES[v.status] ?? ""}>
            {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
          </Badge>
          <ActionsMenu actions={actions} />
        </div>
      </div>

      {/* Skills */}
      {v.skills && (
        <div className="flex flex-wrap gap-1 mt-3">
          {v.skills.split(",").map((s) => (
            <span key={s} className="text-xs bg-secondary px-2 py-0.5 rounded-full">
              {s.trim()}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs mt-2" style={{ color: "var(--gray-400)" }}>
        🗓 {shortDate(v.created_at)}
      </p>
    </div>
  );
}

// ── Main table component ──────────────────────────────────────────────────────
interface Props {
  volunteers: EventVolunteer[];
  onView: (v: EventVolunteer) => void;
  onApprove: (v: EventVolunteer) => void;
  onReject: (v: EventVolunteer) => void;
  onDelete: (v: EventVolunteer) => void;
}

export function VolunteerTable({ volunteers, onView, onApprove, onReject, onDelete }: Props) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b text-left text-xs uppercase tracking-wider"
              style={{ color: "var(--gray-400)", background: "var(--gray-50)" }}
            >
              <th className="py-3 px-4 font-bold">Volunteer</th>
              <th className="py-3 px-4 font-bold">Skills</th>
              <th className="py-3 px-4 font-bold whitespace-nowrap">Applied</th>
              <th className="py-3 px-4 font-bold">Status</th>
              <th className="py-3 px-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((v) => {
              const actions = buildActions(
                v,
                () => onView(v),
                () => onApprove(v),
                () => onReject(v),
                () => onDelete(v),
              );
              return (
                <tr
                  key={v.reference_id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  style={{ borderColor: "var(--gray-100)" }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-primary">
                          {v.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium leading-tight whitespace-nowrap">{v.full_name}</p>
                        <p className="text-xs text-muted-foreground">{v.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {v.skills.split(",").map((s) => (
                        <span key={s} className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-muted-foreground">
                    {formattedDate(v.created_at)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className={STATUS_STYLES[v.status] ?? ""}>
                      {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <ActionsMenu actions={actions} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden p-3 space-y-3">
        {volunteers.map((v) => (
          <VolunteerCard
            key={v.reference_id}
            v={v}
            onView={() => onView(v)}
            onApprove={() => onApprove(v)}
            onReject={() => onReject(v)}
            onDelete={() => onDelete(v)}
          />
        ))}
      </div>
    </>
  );
}
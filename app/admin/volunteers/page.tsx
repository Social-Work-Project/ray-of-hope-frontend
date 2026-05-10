"use client";
import { useEffect, useState, useRef } from "react";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import { Badge } from "@/components/ui";
import { toast } from "sonner";
import AdminGuard from "@/components/Admin/AdminGuard";
import { AdminService } from "@/services/adminService";
import { VolunteerResponse } from "@/types";
import DeleteConfirmModal from "@/components/common/DeleteDialogModal";
import { ActionsMenu } from "@/components/Admin/ActionMenu";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── View Modal ────────────────────────────────────────────────────────────────
function ViewVolunteerModal({
  volunteer,
  onClose,
  onAccept,
  onReject,
}: {
  volunteer: VolunteerResponse;
  onClose: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const isPending = volunteer.status === "pending";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 border-b flex items-start justify-between gap-3"
          style={{ borderColor: "var(--gray-100)" }}
        >
          <div className="min-w-0">
            <div
              className="font-bold text-base leading-tight"
              style={{
                fontFamily: "'Playfair Display',serif",
                color: "var(--navy)",
              }}
            >
              {volunteer.full_name}
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--gray-400)" }}>
              {volunteer.email}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant={
                volunteer.status === "accepted"
                  ? "green"
                  : volunteer.status === "rejected"
                    ? "red"
                    : "yellow"
              }
            >
              {volunteer.status}
            </Badge>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all"
              style={{ color: "var(--gray-400)" }}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "📍", label: "City", value: volunteer.city },
              { icon: "📞", label: "Phone", value: volunteer.phone_number },
              {
                icon: "🕒",
                label: "Availability",
                value: volunteer.availability,
              },
              {
                icon: "🗓",
                label: "Applied",
                value: formatDate(volunteer.created_at),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-xl"
                style={{ background: "var(--gray-50)" }}
              >
                <div
                  className="text-xs mb-0.5"
                  style={{ color: "var(--gray-400)" }}
                >
                  {item.icon} {item.label}
                </div>
                <div
                  className="text-sm font-semibold truncate"
                  style={{ color: "var(--text)" }}
                >
                  {item.value || "—"}
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          {volunteer.skills && (
            <div>
              <div
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: "var(--gray-400)" }}
              >
                Skills
              </div>
              <div className="flex flex-wrap gap-1.5">
                {volunteer.skills.split(",").map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: "var(--gray-100)",
                      color: "var(--gray-600)",
                    }}
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Areas of interest */}
          {volunteer.areas_of_interest &&
            volunteer.areas_of_interest.length > 0 && (
              <div>
                <div
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: "var(--gray-400)" }}
                >
                  Areas of Interest
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {volunteer.areas_of_interest.map((area) => (
                    <span
                      key={area.reference_id}
                      className="text-xs px-2.5 py-1 rounded-full capitalize font-medium"
                      style={{ background: "#dbeafe", color: "#1d4ed8" }}
                    >
                      {area.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Message */}
          {/* {volunteer.message && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--gray-400)' }}>
                Message
              </div>
              <p className="text-sm leading-relaxed p-3 rounded-xl" style={{ background: 'var(--gray-50)', color: 'var(--gray-600)' }}>
                {volunteer.message}
              </p>
            </div>
          )} */}
        </div>

        {/* Footer actions for pending */}
        {isPending && (
          <div
            className="px-5 py-4 border-t flex gap-3"
            style={{ borderColor: "var(--gray-100)" }}
          >
            <button
              onClick={() => {
                onAccept?.();
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: "#16a34a" }}
            >
              ✓ Accept
            </button>
            <button
              onClick={() => {
                onReject?.();
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border"
              style={{ borderColor: "#f87171", color: "#dc2626" }}
            >
              ✕ Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Three-dot Actions Menu ────────────────────────────────────────────────────

// ── Mobile Volunteer Card ─────────────────────────────────────────────────────
function VolunteerCard({
  volunteer,
  onView,
  onAccept,
  onReject,
  onDelete,
}: {
  volunteer: VolunteerResponse;
  onView: () => void;
  onAccept: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="p-4 rounded-xl border"
      style={{ borderColor: "var(--gray-100)", background: "var(--gray-50)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div
            className="font-semibold text-sm truncate"
            style={{ color: "var(--text)" }}
          >
            {volunteer.full_name}
          </div>
          <div
            className="text-xs mt-0.5 truncate"
            style={{ color: "var(--gray-400)" }}
          >
            {volunteer.email}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge
            variant={
              volunteer.status === "accepted"
                ? "green"
                : volunteer.status === "rejected"
                  ? "red"
                  : "yellow"
            }
          >
            {volunteer.status}
          </Badge>
          <ActionsMenu
            actions={[
              { label: "View", icon: "👁", color: "var(--navy)", fn: onView },
              ...(volunteer.status === "pending"
                ? [
                    {
                      label: "Accept",
                      icon: "✓",
                      color: "#16a34a",
                      fn: onAccept,
                    },
                    {
                      label: "Reject",
                      icon: "✕",
                      color: "#dc2626",
                      fn: onReject,
                    },
                  ]
                : []),
              ...(volunteer.status === "rejected"
                ? [
                    {
                      label: "Delete",
                      icon: "🗑",
                      color: "#dc2626",
                      fn: onDelete,
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        <span className="text-xs" style={{ color: "var(--gray-400)" }}>
          📍 {volunteer.city}
        </span>
        <span className="text-xs" style={{ color: "var(--gray-400)" }}>
          🕒 {volunteer.availability}
        </span>
        {volunteer.skills && (
          <span
            className="text-xs truncate"
            style={{ color: "var(--gray-400)" }}
          >
            🛠 {volunteer.skills}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<VolunteerResponse[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewVolunteer, setViewVolunteer] = useState<VolunteerResponse | null>(
    null,
  );
  const [deleteVolunteer, setDeleteVolunteer] =
    useState<VolunteerResponse | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const res = await AdminService.getVolunteers();
      setVolunteers(res.data.results);
    } catch {
      toast.error(
        "Failed to fetch volunteer applications. Please try again later.",
      );
    }
  };

  const filtered = volunteers.filter(
    (v) =>
      (filterStatus === "all" || v.status === filterStatus) &&
      (v.full_name.toLowerCase().includes(search.toLowerCase()) ||
        v.city.toLowerCase().includes(search.toLowerCase())),
  );

  const handleStatus = async (id: string, status: "accepted" | "rejected") => {
    try {
      await AdminService.updateVolunteerStatus(id, status);
      toast.success(`Application ${status}`);
      fetchVolunteers();
    } catch {
      toast.error("Failed to update volunteer status. Please try again later.");
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    try {
      await AdminService.deleteVolunteer(id);
      setVolunteers((prev) => prev.filter((v) => v.reference_id !== id));
      toast.success("Volunteer application deleted.");
    } catch {
      toast.error("Failed to delete. Please try again.");
    } finally {
      setDeleteLoading(false);
      setDeleteVolunteer(null);
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
              style={{
                color: "var(--navy)",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Volunteer Applications
            </h2>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
              style={{ borderColor: "var(--gray-100)" }}
            >
              {/* Toolbar */}
              <div
                className="px-4 sm:px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center gap-3"
                style={{ borderColor: "var(--gray-100)" }}
              >
                <h3
                  className="font-bold text-sm sm:mr-auto"
                  style={{ color: "var(--navy)" }}
                >
                  All Applications ({filtered.length})
                </h3>
                <div className="flex gap-2 flex-1 sm:flex-none">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or city..."
                    className="flex-1 sm:w-52 px-3 py-2 border rounded-lg text-sm outline-none"
                    style={{ borderColor: "var(--gray-200)" }}
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm outline-none shrink-0"
                    style={{ borderColor: "var(--gray-200)" }}
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "var(--gray-50)" }}>
                      {[
                        "Name",
                        "Email",
                        "City",
                        "Skills",
                        "Availability",
                        "Status",
                        "Actions",
                      ].map((h) => (
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
                    {filtered.map((v) => (
                      <tr
                        key={v.reference_id}
                        className="border-t hover:bg-gray-50 transition-colors"
                        style={{ borderColor: "var(--gray-100)" }}
                      >
                        <td
                          className="px-5 py-3 font-medium whitespace-nowrap"
                          style={{ color: "var(--text)" }}
                        >
                          {v.full_name}
                        </td>
                        <td
                          className="px-5 py-3 max-w-40 truncate"
                          style={{ color: "var(--gray-600)" }}
                        >
                          {v.email}
                        </td>
                        <td
                          className="px-5 py-3 whitespace-nowrap"
                          style={{ color: "var(--gray-600)" }}
                        >
                          {v.city}
                        </td>
                        <td
                          className="px-5 py-3 max-w-35 truncate"
                          style={{ color: "var(--gray-600)" }}
                        >
                          {v.skills}
                        </td>
                        <td
                          className="px-5 py-3 whitespace-nowrap"
                          style={{ color: "var(--gray-600)" }}
                        >
                          {v.availability}
                        </td>
                        <td className="px-5 py-3">
                          <Badge
                            variant={
                              v.status === "accepted"
                                ? "green"
                                : v.status === "rejected"
                                  ? "red"
                                  : "yellow"
                            }
                          >
                            {v.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <ActionsMenu
                            actions={[
                              {
                                label: "View",
                                icon: "👁",
                                color: "var(--navy)",
                                fn: () => setViewVolunteer(v),
                              },
                              ...(v.status === "pending"
                                ? [
                                    {
                                      label: "Accept",
                                      icon: "✓",
                                      color: "#16a34a",
                                      fn: () =>
                                        handleStatus(
                                          v.reference_id,
                                          "accepted",
                                        ),
                                    },
                                    {
                                      label: "Reject",
                                      icon: "✕",
                                      color: "#dc2626",
                                      fn: () =>
                                        handleStatus(
                                          v.reference_id,
                                          "rejected",
                                        ),
                                    },
                                  ]
                                : []),
                              ...(v.status === "rejected"
                                ? [
                                    {
                                      label: "Delete",
                                      icon: "🗑",
                                      color: "#dc2626",
                                      fn: () => setDeleteVolunteer(v),
                                    },
                                  ]
                                : []),
                            ]}
                          />
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-5 py-10 text-center text-sm"
                          style={{ color: "var(--gray-400)" }}
                        >
                          No applications found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden p-3 space-y-3">
                {filtered.length === 0 ? (
                  <p
                    className="text-center text-sm py-8"
                    style={{ color: "var(--gray-400)" }}
                  >
                    No applications found.
                  </p>
                ) : (
                  filtered.map((v) => (
                    <VolunteerCard
                      key={v.reference_id}
                      volunteer={v}
                      onView={() => setViewVolunteer(v)}
                      onAccept={() => handleStatus(v.reference_id, "accepted")}
                      onReject={() => handleStatus(v.reference_id, "rejected")}
                      onDelete={() => setDeleteVolunteer(v)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* View modal */}
      {viewVolunteer && (
        <ViewVolunteerModal
          volunteer={viewVolunteer}
          onClose={() => setViewVolunteer(null)}
          onAccept={() => handleStatus(viewVolunteer.reference_id, "accepted")}
          onReject={() => handleStatus(viewVolunteer.reference_id, "rejected")}
        />
      )}

      {/* Delete confirm */}
      {deleteVolunteer && (
        <DeleteConfirmModal
          isOpen={!!deleteVolunteer}
          onClose={() => setDeleteVolunteer(null)}
          onConfirm={() => handleDelete(deleteVolunteer.reference_id)}
          title="Delete Application"
          description={`Are you sure you want to delete ${deleteVolunteer.full_name}'s application? This cannot be undone.`}
          itemName={deleteVolunteer.full_name}
          isLoading={deleteLoading}
        />
      )}
    </AdminGuard>
  );
}

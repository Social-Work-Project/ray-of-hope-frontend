"use client";
import { useEffect, useState, useRef } from "react";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import { Badge } from "@/components/ui";
import { toast } from "sonner";
import AdminGuard from "@/components/Admin/AdminGuard";
import { EventModal } from "@/components/Admin/EventModal";
import { AdminService } from "@/services/adminService";
import { EventResponse } from "@/types";
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

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// ── View Modal ────────────────────────────────────────────────────────────────
function ViewEventModal({
  event,
  onClose,
}: {
  event: EventResponse;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const fill =
    event.volunteers_needed > 0
      ? Math.min(
          100,
          Math.round(
            (event.registered_volunteers_count / event.volunteers_needed) * 100
          )
        )
      : 0;

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
              className="font-bold text-base leading-tight truncate"
              style={{ fontFamily: "'Playfair Display',serif", color: "var(--navy)" }}
            >
              {event.name}
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--gray-400)" }}>
              {event.category}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={event.status === "published" ? "green" : "yellow"}>
              {event.status}
            </Badge>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all"
              style={{ color: "var(--gray-400)" }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Key info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🗓", label: "Date", value: formatDate(event.event_date) },
              { icon: "📍", label: "Location", value: event.location },
              { icon: "🕐", label: "Start", value: formatTime(event.start_time) },
              { icon: "🕔", label: "End", value: formatTime(event.end_time) },
              { icon: "🏢", label: "Organizer", value: event.organizer_name },
              // { icon: "📞", label: "Phone", value: event.phone_number },
              
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-xl"
                style={{ background: "var(--gray-50)" }}
              >
                <div className="text-xs mb-0.5" style={{ color: "var(--gray-400)" }}>
                  {item.icon} {item.label}
                </div>
                <div className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Volunteer fill bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gray-400)" }}>
                Volunteer Fill
              </span>
              <span className="text-xs font-semibold" style={{ color: "var(--navy)" }}>
                {event.registered_volunteers_count}/{event.volunteers_needed}
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--gray-100)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${fill}%`, background: fill >= 80 ? "#22c55e" : fill >= 40 ? "#f59e0b" : "var(--sky)" }}
              />
            </div>
            <div className="text-xs mt-1 text-right" style={{ color: "var(--gray-400)" }}>
              {fill}% filled
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--gray-400)" }}>
                Description
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--gray-600)" }}>
                {event.description}
              </p>
            </div>
          )}

          {/* Schedule */}
          {/* {event.schedule && event.schedule.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--gray-400)" }}>
                Schedule
              </div>
              <div className="space-y-2">
                {event.schedule.map((item) => (
                  <div key={item.reference_id} className="flex items-center gap-3">
                    <span
                      className="text-xs font-mono font-semibold px-2 py-1 rounded-lg shrink-0"
                      style={{ background: "var(--gray-100)", color: "var(--navy)" }}
                    >
                      {formatTime(item.time)}
                    </span>
                    <span className="text-sm" style={{ color: "var(--text)" }}>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* Email */}
          <div
            className="flex items-center gap-2 p-3 rounded-xl"
            style={{ background: "var(--gray-50)" }}
          >
            <span className="text-sm">✉️</span>
            {/* <span className="text-sm" style={{ color: "var(--gray-600)" }}>{event.email}</span> */}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Three-dot Actions Menu ────────────────────────────────────────────────────

// ── Mobile event card ─────────────────────────────────────────────────────────
function EventCard({
  event,
  onView,
  onEdit,
  onDelete,
}: {
  event: EventResponse;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="p-4 rounded-xl border"
      style={{ borderColor: "var(--gray-100)", background: "var(--gray-50)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>
            {event.name}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--gray-400)" }}>
            🗓 {formatDate(event.event_date)} · 📍 {event.location}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant={event.status === "published" ? "green" : "yellow"}>
            {event.status}
          </Badge>
          <ActionsMenu actions={[
  { label: 'View',   icon: '👁', color: 'var(--navy)', fn: () => onView() },
  { label: 'Edit',   icon: '✏️', color: 'var(--sky)',  fn: () => onEdit() },
  { label: 'Delete', icon: '🗑', color: '#dc2626',     fn: () => onDelete() },
]} />
        </div>
      </div>
      <div className="text-xs mt-2" style={{ color: "var(--gray-400)" }}>
        👥 {event.registered_volunteers_count ?? 0}/{event.volunteers_needed} volunteers
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminEventsPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(null);
  const [viewEvent, setViewEvent] = useState<EventResponse | null>(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await AdminService.getEvents();
      setEvents(res.data.results);
    } catch {
      toast.error("Failed to fetch events. Please try again later.");
    }
  };

  const filtered = events.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await AdminService.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.reference_id !== id));
      toast.success("Event deleted!");
    } catch {
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setSelectedEventId("");
    }
  };

  const handleAddNew = () => { setSelectedEvent(null); setShowModal(true); };
  const handleEdit = (event: EventResponse) => { setSelectedEvent(event); setShowModal(true); };
  const handleClose = () => { setShowModal(false); setSelectedEvent(null); };

  const handleSave = async (formData: FormData) => {
    try {
      if (selectedEvent) {
        await AdminService.patchEvent(selectedEvent.reference_id, formData);
        toast.success("Event updated!");
      } else {
        await AdminService.createEvent(formData);
        toast.success("Event created!");
      }
      fetchEvents();
    } catch {
      toast.error("Failed to save event. Please try again.");
    }
  };

  const openDelete = (event: EventResponse) => {
    setSelectedEventId(event.reference_id);
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const openView = (event: EventResponse) => {
    setViewEvent(event);
    setShowViewModal(true);
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
              Manage Events
            </h2>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
              style={{ borderColor: "var(--gray-100)" }}
            >
              {/* Toolbar */}
              <div
                className="px-4 sm:px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                style={{ borderColor: "var(--gray-100)" }}
              >
                <h3 className="font-bold text-sm" style={{ color: "var(--navy)" }}>
                  All Events ({filtered.length})
                </h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search events..."
                    className="flex-1 sm:flex-none px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2"
                    style={{
                      borderColor: "var(--gray-200)",
                      width: undefined,
                      minWidth: 0,
                    }}
                  />
                  <button
                    onClick={handleAddNew}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer transition-all whitespace-nowrap"
                    style={{ background: "var(--blue)" }}
                  >
                    + Add Event
                  </button>
                </div>
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "var(--gray-50)" }}>
                      {["Event Name", "Date", "Location", "Volunteers", "Status", "Actions"].map((h) => (
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
                    {filtered.map((e) => (
                      <tr
                        key={e.reference_id}
                        className="border-t hover:bg-gray-50 transition-colors"
                        style={{ borderColor: "var(--gray-100)" }}
                      >
                        <td className="px-5 py-3 font-medium" style={{ color: "var(--text)" }}>
                          {e.name}
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap" style={{ color: "var(--gray-600)" }}>
                          {formatDate(e.event_date)}
                        </td>
                        <td className="px-5 py-3" style={{ color: "var(--gray-600)" }}>
                          {e.location}
                        </td>
                        <td className="px-5 py-3" style={{ color: "var(--gray-600)" }}>
                          {e.registered_volunteers_count ?? 0}/{e.volunteers_needed}
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={e.status === "published" ? "green" : "yellow"}>
                            {e.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <ActionsMenu actions={[
  { label: 'View',   icon: '👁', color: 'var(--navy)', fn: () => openView(e) },
  { label: 'Edit',   icon: '✏️', color: 'var(--sky)',  fn: () => handleEdit(e) },
  { label: 'Delete', icon: '🗑', color: '#dc2626',     fn: () => openDelete(e) },
]} />
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-10 text-center text-sm"
                          style={{ color: "var(--gray-400)" }}
                        >
                          No events found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden p-3 space-y-3">
                {filtered.length === 0 ? (
                  <p className="text-center text-sm py-8" style={{ color: "var(--gray-400)" }}>
                    No events found.
                  </p>
                ) : (
                  filtered.map((e) => (
                    <EventCard
                      key={e.reference_id}
                      event={e}
                      onView={() => openView(e)}
                      onEdit={() => handleEdit(e)}
                      onDelete={() => openDelete(e)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* View modal */}
      {showViewModal && viewEvent && (
        <ViewEventModal event={viewEvent} onClose={() => setShowViewModal(false)} />
      )}

      {/* Edit / Create modal */}
      {showModal && (
        <EventModal
          isOpen
          event={selectedEvent}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}

      {/* Delete confirm */}
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDelete(selectedEventId)}
          title="Confirm Deletion"
          description={`Are you sure you want to delete "${selectedEvent?.name}"? This action cannot be undone.`}
          itemName={selectedEvent?.name ?? ""}
          isLoading={loading}
        />
      )}
    </AdminGuard>
  );
}
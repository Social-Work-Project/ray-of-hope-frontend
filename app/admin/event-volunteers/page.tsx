"use client";
import { useEffect, useState } from "react";
import AdminGuard from "@/components/Admin/AdminGuard";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import { AdminService } from "@/services/adminService";
import { EventVolunteer, EventVolunteerDetail } from "@/types";
import { EventVolunteerGroup } from "@/components/Admin/EventVolunteers/EventVolunteerGroup";
import { VolunteerDetailDialog } from "@/components/Admin/EventVolunteers/VolunteerDetailDialog";
import { Loader2, Users } from "lucide-react";
import { toast } from "sonner";

function groupByEvent(volunteers: EventVolunteer[]) {
  return volunteers.reduce<Record<string, { name: string; items: EventVolunteer[] }>>(
    (acc, v) => {
      if (!acc[v.event_id]) acc[v.event_id] = { name: v.event_name, items: [] };
      acc[v.event_id].items.push(v);
      return acc;
    },
    {}
  );
}

const EventVolunteerPage = () => {
  const [volunteers, setVolunteers]       = useState<EventVolunteer[]>([]);
  const [loading, setLoading]             = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData]       = useState<EventVolunteerDetail | null>(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getAllEventVolunteers();
      setVolunteers(res.data.results ?? []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (v: EventVolunteer) => {
    try {
      setDetailLoading(true);
      const res = await AdminService.getEventVolunteerDetails(v.reference_id);
      setDetailData(res.data.results ?? null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleApprove = async (v: EventVolunteer) => {
    try {
      await AdminService.updateEventVolunteersStatus(v.reference_id, "approved");
      toast.success(`${v.full_name} approved.`);
      setVolunteers((prev) =>
        prev.map((x) => x.reference_id === v.reference_id ? { ...x, status: "approved" } : x)
      );
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleReject = async (v: EventVolunteer) => {
    try {
      await AdminService.updateEventVolunteersStatus(v.reference_id, "rejected");
      toast.success(`${v.full_name} rejected.`);
      setVolunteers((prev) =>
        prev.map((x) => x.reference_id === v.reference_id ? { ...x, status: "rejected" } : x)
      );
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (v: EventVolunteer) => {
    if (!confirm(`Delete application from "${v.full_name}"? This cannot be undone.`)) return;
    try {
      await AdminService.deleteEventVolunteer(v.reference_id);
      toast.success("Application deleted.");
      setVolunteers((prev) => prev.filter((x) => x.reference_id !== v.reference_id));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const grouped = groupByEvent(volunteers);

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 bg-gray-50/50 min-w-0">
          {/* Sticky header */}
          <div
            className="bg-white border-b px-4 sm:px-8 py-4 sticky top-0 z-10"
            style={{ borderColor: "var(--gray-100)" }}
          >
            <h2
              className="font-bold text-base sm:text-lg pl-12 lg:pl-0"
              style={{ color: "var(--navy)", fontFamily: "'DM Sans',sans-serif" }}
            >
              Event Volunteers
            </h2>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : Object.keys(grouped).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-1">No volunteer applications</h3>
                <p className="text-sm text-muted-foreground">
                  Applications will appear here once submitted.
                </p>
              </div>
            ) : (
              Object.entries(grouped).map(([eventId, { name, items }]) => (
                <EventVolunteerGroup
                  key={eventId}
                  eventId={eventId}
                  eventName={name}
                  volunteers={items}
                  onView={handleView}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </main>
      </div>

      <VolunteerDetailDialog
        volunteer={detailLoading ? null : detailData}
        onClose={() => setDetailData(null)}
      />

      {detailLoading && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 flex items-center gap-3 shadow-xl">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Loading details…</span>
          </div>
        </div>
      )}
    </AdminGuard>
  );
};

export default EventVolunteerPage;
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Mail, MapPin, Phone, Users, X } from "lucide-react";
import { EventVolunteerDetail } from "@/types";

interface Props {
  volunteer: EventVolunteerDetail | null;
  onClose: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  pending:  "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100  text-red-800",
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium break-all">{value}</span>
    </div>
  );
}

export function VolunteerDetailDialog({ volunteer: v, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    if (!v) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [v, onClose]);

  // Lock body scroll on mobile while open
  useEffect(() => {
    if (!v) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [v]);

  if (!v) return null;
  const ed = v.event_details;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "92vh" }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 border-b flex items-center justify-between shrink-0"
          style={{ borderColor: "var(--gray-100)" }}
        >
          <h2 className="font-bold text-base" style={{ color: "var(--navy)", fontFamily: "'DM Sans',sans-serif" }}>
            Volunteer Application
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all"
            style={{ color: "var(--gray-400)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">

          {/* ── Applicant ── */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Applicant
            </h3>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                {v.full_name.charAt(0).toUpperCase()}
              </div>
              {/* Responsive grid: 1 col on mobile, 2 on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 min-w-0">
                <InfoRow label="Full Name" value={v.full_name} />
                <InfoRow label="Email"     value={v.email} />
                <InfoRow label="Phone"     value={v.phone} />
                <InfoRow label="Skills"    value={v.skills} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Status
                  </span>
                  <Badge className={STATUS_STYLES[v.status] ?? ""} variant="secondary">
                    {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                  </Badge>
                </div>
                {v.message && (
                  <div className="sm:col-span-2 flex flex-col gap-0.5">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Message
                    </span>
                    <p className="text-sm italic text-muted-foreground">"{v.message}"</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <hr />

          {/* ── Event ── */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Event
            </h3>
            <div className="rounded-xl border bg-muted/30 p-4 space-y-3" style={{ borderColor: "var(--gray-100)" }}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-semibold text-sm sm:text-base" style={{ color: "var(--navy)" }}>
                  {ed.name}
                </p>
                <Badge variant="outline" className="capitalize shrink-0">{ed.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{ed.description}</p>

              {/* Info grid — 1 col on mobile, 2 on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{new Date(ed.event_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{ed.start_time.slice(0, 5)} – {ed.end_time.slice(0, 5)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{ed.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span>{ed.registered_volunteers_count} / {ed.volunteers_needed} volunteers</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{ed.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{ed.phone_number}</span>
                </div>
              </div>

              {/* Schedule */}
              {ed.schedule?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Schedule
                  </p>
                  <div className="space-y-1.5">
                    {ed.schedule.map((s) => (
                      <div key={s.reference_id} className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground font-mono text-xs w-12 shrink-0">
                          {s.time.slice(0, 5)}
                        </span>
                        <span>{s.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
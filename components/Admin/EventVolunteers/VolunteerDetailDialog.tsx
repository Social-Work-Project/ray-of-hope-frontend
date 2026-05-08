import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Mail, MapPin, Phone, Users } from "lucide-react";
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
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export function VolunteerDetailDialog({ volunteer: v, onClose }: Props) {
  if (!v) return null;
  const ed = v.event_details;

  return (
    <Dialog open={!!v} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Volunteer Application</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Volunteer info */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Applicant
            </h3>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary shrink-0">
                {v.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="grid grid-cols-2 gap-3 flex-1">
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
                  <div className="col-span-2 flex flex-col gap-0.5">
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

          {/* Event info */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Event
            </h3>
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-base">{ed.name}</p>
                <Badge variant="outline" className="capitalize shrink-0">{ed.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{ed.description}</p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(ed.event_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {ed.start_time.slice(0, 5)} – {ed.end_time.slice(0, 5)}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  {ed.location}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  {ed.registered_volunteers_count} / {ed.volunteers_needed} volunteers
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  {ed.email}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  {ed.phone_number}
                </div>
              </div>

              {/* Schedule */}
              {ed.schedule?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Schedule
                  </p>
                  <div className="space-y-1">
                    {ed.schedule.map((s) => (
                      <div key={s.reference_id} className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground font-mono text-xs w-14 shrink-0">
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
      </DialogContent>
    </Dialog>
  );
}
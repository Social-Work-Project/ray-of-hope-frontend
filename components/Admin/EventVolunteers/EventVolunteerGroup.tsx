import { useState } from "react";
import { ChevronDown, ChevronUp, CalendarDays } from "lucide-react";
import { EventVolunteer } from "@/types";
import { VolunteerTable } from "./VolunteerTable";

interface Props {
  eventName: string;
  eventId: string;
  volunteers: EventVolunteer[];
  onView: (v: EventVolunteer) => void;
  onApprove: (v: EventVolunteer) => void;
  onReject: (v: EventVolunteer) => void;
  onDelete: (v: EventVolunteer) => void;
}

export function EventVolunteerGroup({
  eventName,
  volunteers,
  onView,
  onApprove,
  onReject,
  onDelete,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const pendingCount  = volunteers.filter((v) => v.status === "pending").length;
  const approvedCount = volunteers.filter((v) => v.status === "approved").length;
  const rejectedCount = volunteers.filter((v) => v.status === "rejected").length;

  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm" style={{ borderColor: "var(--gray-100)" }}>
      {/* Group header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-4 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
      >
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="font-semibold text-sm truncate" style={{ color: "var(--navy)" }}>
            {eventName}
          </span>
          <span className="text-xs text-muted-foreground shrink-0">
            {volunteers.length} applicant{volunteers.length !== 1 ? "s" : ""}
          </span>
          {/* Status pills — hide some on tiny screens */}
          {pendingCount > 0 && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium shrink-0">
              {pendingCount} pending
            </span>
          )}
          {approvedCount > 0 && (
            <span className="hidden sm:inline-flex text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium shrink-0">
              {approvedCount} approved
            </span>
          )}
          {rejectedCount > 0 && (
            <span className="hidden sm:inline-flex text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium shrink-0">
              {rejectedCount} rejected
            </span>
          )}
        </div>
        {collapsed
          ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
          : <ChevronUp   className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
        }
      </button>

      {/* Table / cards */}
      {!collapsed && (
        <VolunteerTable
          volunteers={volunteers}
          onView={onView}
          onApprove={onApprove}
          onReject={onReject}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
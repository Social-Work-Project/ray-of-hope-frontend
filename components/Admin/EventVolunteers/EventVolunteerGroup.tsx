import { useState } from "react";
import { ChevronDown, ChevronUp, CalendarDays } from "lucide-react";
import { EventVolunteer, EventVolunteerDetail } from "@/types";
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

  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Group header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-5 py-4 bg-muted/40 hover:bg-muted/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-sm">{eventName}</span>
          <span className="text-xs text-muted-foreground">
            {volunteers.length} applicant{volunteers.length !== 1 ? "s" : ""}
          </span>
          {pendingCount > 0 && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
              {pendingCount} pending
            </span>
          )}
          {approvedCount > 0 && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
              {approvedCount} approved
            </span>
          )}
        </div>
        {collapsed ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Table */}
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
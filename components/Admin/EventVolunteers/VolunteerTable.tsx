import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle, Eye, MoreVertical, Trash2, XCircle } from "lucide-react";
import { EventVolunteer } from "@/types";

interface Props {
  volunteers: EventVolunteer[];
  onView: (v: EventVolunteer) => void;
  onApprove: (v: EventVolunteer) => void;
  onReject: (v: EventVolunteer) => void;
  onDelete: (v: EventVolunteer) => void;
}

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

export function VolunteerTable({ volunteers, onView, onApprove, onReject, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground text-xs uppercase tracking-wider">
            <th className="py-3 px-4 font-medium">Volunteer</th>
            <th className="py-3 px-4 font-medium">Skills</th>
            <th className="py-3 px-4 font-medium">Applied</th>
            <th className="py-3 px-4 font-medium">Status</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {volunteers.map((v) => (
            <tr key={v.reference_id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-primary">
                      {v.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium leading-tight">{v.full_name}</p>
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
              <td className="py-3 px-4 text-muted-foreground">{formattedDate(v.created_at)}</td>
              <td className="py-3 px-4">
                <Badge variant="outline" className={STATUS_STYLES[v.status] ?? ""}>
                  {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                </Badge>
              </td>
              <td className="py-3 px-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onView(v)}>
                      <Eye className="w-4 h-4 mr-2" /> View
                    </DropdownMenuItem>

                    {v.status !== "approved" && (
                      <DropdownMenuItem onClick={() => onApprove(v)} className="text-green-700 focus:text-green-700 focus:bg-green-50">
                        <CheckCircle className="w-4 h-4 mr-2" /> Accept
                      </DropdownMenuItem>
                    )}

                    {v.status !== "rejected" && (
                      <DropdownMenuItem onClick={() => onReject(v)} className="text-amber-700 focus:text-amber-700 focus:bg-amber-50">
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </DropdownMenuItem>
                    )}

                    {v.status === "rejected" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDelete(v)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
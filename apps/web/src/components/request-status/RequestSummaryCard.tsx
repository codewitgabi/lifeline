import type { BloodRequest } from "@lifeline/shared";
import BloodTypeBadge from "../BloodTypeBadge";
import UrgencyChip from "../UrgencyChip";
import { timeUntil } from "../../lib/time";

interface RequestSummaryCardProps {
  request: BloodRequest;
}

function RequestSummaryCard({ request }: RequestSummaryCardProps) {
  return (
    <div className="bg-white rounded-[18px] p-5 mb-4" style={{ border: "1px solid #EBD9DC" }}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <BloodTypeBadge type={request.bloodType} size="lg" />
          <UrgencyChip urgency={request.urgency} />
          <span
            className="font-mono text-[11px] font-medium px-2.5 py-1 rounded-full"
            style={{ background: "#FBF8F6", color: "#6E5A5E", border: "1px solid #EBD9DC" }}
          >
            {request.unitsNeeded} unit{request.unitsNeeded !== 1 ? "s" : ""}
          </span>
        </div>
        <span
          className="font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={
            request.status === "fulfilled"
              ? { background: "#E4F2EC", color: "#15805A", border: "1px solid #BFE0D2" }
              : { background: "#F7E9EB", color: "#C8102E", border: "1px solid #EBD9DC" }
          }
        >
          {request.status === "open" ? timeUntil(request.expiresAt) : request.status}
        </span>
      </div>
      <p className="font-semibold mt-3" style={{ color: "#231518" }}>{request.hospitalName}</p>
      <p className="text-[13px] mt-0.5" style={{ color: "#6E5A5E" }}>Posted by {request.requesterName}</p>
      {request.notes && (
        <p
          className="text-[13px] rounded-[10px] px-3 py-2 mt-3"
          style={{ color: "#6E5A5E", background: "#FBF8F6", border: "1px solid #EBD9DC" }}
        >
          {request.notes}
        </p>
      )}
    </div>
  );
}

export default RequestSummaryCard;

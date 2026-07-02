import { MapPin, Clock, Droplets, Phone } from "lucide-react";
import type { BloodRequest } from "@lifeline/shared";
import { formatDistance } from "@lifeline/shared";
import BloodTypeBadge from "./BloodTypeBadge";
import UrgencyChip from "./UrgencyChip";
import { timeAgo, timeUntil } from "../lib/time";

interface Props {
  request: BloodRequest;
  onRespond?: (id: string) => void;
  responding?: boolean;
}

function RequestCard({ request, onRespond, responding }: Props) {
  const expired = new Date(request.expiresAt) < new Date();

  return (
    <div
      className="bg-white rounded-[18px] p-5 transition-shadow hover:shadow-[0_4px_20px_rgba(60,10,20,.08)]"
      style={{ border: "1px solid #EBD9DC" }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <BloodTypeBadge type={request.bloodType} />
          <UrgencyChip urgency={request.urgency} />
          {request.unitsNeeded > 1 && (
            <span
              className="inline-flex items-center gap-1 font-mono text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{ background: "#FBF8F6", color: "#6E5A5E", border: "1px solid #EBD9DC" }}
            >
              <Droplets className="w-3 h-3" />
              {request.unitsNeeded} units
            </span>
          )}
        </div>
        <span className="font-mono text-[11px] shrink-0" style={{ color: "#6E5A5E" }}>
          {timeAgo(request.createdAt)}
        </span>
      </div>

      <h3 className="font-semibold text-[14.5px] mb-1" style={{ color: "#231518" }}>
        {request.hospitalName}
      </h3>
      {request.requesterName && (
        <p className="text-[13px] mb-3" style={{ color: "#6E5A5E" }}>
          Posted by {request.requesterName}
        </p>
      )}
      {request.notes && (
        <p
          className="text-[13px] rounded-[10px] px-3 py-2 mb-3"
          style={{ color: "#231518", background: "#FBF8F6", border: "1px solid #EBD9DC" }}
        >
          {request.notes}
        </p>
      )}

      <div
        className="flex items-center justify-between font-mono text-[11px] mt-3 pt-3"
        style={{ color: "#6E5A5E", borderTop: "1px dashed #EBD9DC" }}
      >
        <div className="flex items-center gap-3">
          {request.distanceMeters !== undefined && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {formatDistance(request.distanceMeters)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {expired ? "Expired" : timeUntil(request.expiresAt)}
          </span>
        </div>

        {request.requesterPhone && (
          <a
            href={`tel:${request.requesterPhone}`}
            className="flex items-center gap-1 font-semibold"
            style={{ color: "#C8102E" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="w-3 h-3" />
            {request.requesterPhone}
          </a>
        )}
      </div>

      {onRespond && !expired && request.status === "open" && (
        <button
          onClick={() => onRespond(request._id)}
          disabled={responding}
          className="mt-4 w-full py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:-translate-y-px active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "#C8102E", boxShadow: "0 1px 0 #9E0C24" }}
        >
          {responding ? "Responding…" : "I can help"}
        </button>
      )}

      {request.status !== "open" && (
        <div
          className="mt-4 text-center font-mono text-[11px] font-medium py-2 rounded-full"
          style={
            request.status === "fulfilled"
              ? { background: "#E4F2EC", color: "#15805A" }
              : { background: "#FBF8F6", color: "#6E5A5E", border: "1px solid #EBD9DC" }
          }
        >
          {request.status === "matched" ? "Donor matched" : "Fulfilled"}
        </div>
      )}
    </div>
  );
}

export default RequestCard;

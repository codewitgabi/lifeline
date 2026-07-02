import { Phone } from "lucide-react";
import type { Responder } from "@lifeline/shared";
import { formatDistance } from "@lifeline/shared";
import BloodTypeBadge from "./BloodTypeBadge";

interface Props {
  responder: Responder;
}

function ResponderCard({ responder }: Props) {
  const initials = (responder.donorName ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      className="flex items-center justify-between gap-4 bg-white rounded-[18px] px-4 py-3.5"
      style={{ border: "1px solid #EBD9DC" }}
    >
      <div className="flex items-center gap-3">
        <span
          className="w-9 h-9 rounded-full flex-none flex items-center justify-center font-semibold text-[13px] text-white"
          style={{ background: "#C8102E" }}
        >
          {initials}
        </span>
        <div>
          <p className="font-semibold text-[14px]" style={{ color: "#231518" }}>
            {responder.donorName ?? "Anonymous Donor"}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {responder.bloodType && (
              <BloodTypeBadge type={responder.bloodType} size="sm" />
            )}
            {responder.distanceMeters !== undefined && (
              <span className="font-mono text-[11px]" style={{ color: "#6E5A5E" }}>
                {formatDistance(responder.distanceMeters)}
              </span>
            )}
          </div>
        </div>
      </div>

      {responder.phone && (
        <a
          href={`tel:${responder.phone}`}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-px shrink-0"
          style={{ background: "#C8102E", boxShadow: "0 1px 0 #9E0C24" }}
        >
          <Phone className="w-3.5 h-3.5" />
          Call
        </a>
      )}
    </div>
  );
}

export default ResponderCard;

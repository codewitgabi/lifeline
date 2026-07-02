import { ArrowRight, X } from "lucide-react";
import BloodTypeBadge from "../BloodTypeBadge";
import UrgencyChip from "../UrgencyChip";
import { timeUntil } from "../../lib/time";
import type { StoredRequest } from "../../store/activeRequestStore";

interface ActiveRequestBannerProps {
  active: StoredRequest;
  onView: () => void;
  onDismiss: () => void;
}

function ActiveRequestBanner({ active, onView, onDismiss }: ActiveRequestBannerProps) {
  return (
    <div
      className="rounded-[18px] p-4 mb-8 flex items-start justify-between gap-4"
      style={{ background: "#F7E9EB", border: "1.5px solid #EBD9DC" }}
    >
      <div className="flex-1 min-w-0">
        <p
          className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5"
          style={{ color: "#C8102E" }}
        >
          You have an active request
        </p>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <BloodTypeBadge type={active.bloodType} size="sm" />
          <UrgencyChip urgency={active.urgency} />
          <span className="font-mono text-[11px]" style={{ color: "#6E5A5E" }}>
            {timeUntil(active.expiresAt)}
          </span>
        </div>
        <p className="text-[13px] font-medium truncate" style={{ color: "#231518" }}>
          {active.hospitalName}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onView}
          className="flex items-center gap-1.5 rounded-full px-3.5 py-2 font-mono text-[12px] font-semibold text-white transition-all hover:-translate-y-px"
          style={{ background: "#C8102E", boxShadow: "0 1px 0 #9E0C24" }}
        >
          View status
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDismiss}
          className="p-1.5 rounded-full transition-colors"
          style={{ color: "#6E5A5E" }}
          title="Post a new request anyway"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default ActiveRequestBanner;

import { ArrowRight } from "lucide-react";
import BloodTypeBadge from "../BloodTypeBadge";
import UrgencyChip from "../UrgencyChip";
import { timeUntil } from "../../lib/time";
import type { StoredRequest } from "../../store/activeRequestStore";

interface ActiveRequestBarProps {
  active: StoredRequest;
  onContinue: () => void;
}

function ActiveRequestBar({ active, onContinue }: ActiveRequestBarProps) {
  return (
    <div style={{ background: "#F7E9EB", borderBottom: "1px solid #EBD9DC" }}>
      <div className="max-w-280 mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "#C8102E" }}
          >
            Active request
          </span>
          <BloodTypeBadge type={active.bloodType} size="sm" />
          <UrgencyChip urgency={active.urgency} />
          <span className="font-mono text-[11.5px]" style={{ color: "#6E5A5E" }}>
            {active.hospitalName} · {timeUntil(active.expiresAt)}
          </span>
        </div>
        <button
          onClick={onContinue}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-[12px] font-semibold text-white shrink-0 transition-all hover:-translate-y-px"
          style={{ background: "#C8102E", boxShadow: "0 1px 0 #9E0C24" }}
        >
          Continue tracking
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default ActiveRequestBar;

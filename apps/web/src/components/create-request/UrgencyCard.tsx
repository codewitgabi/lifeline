import { AlertTriangle, Clock, Info } from "lucide-react";
import { URGENCY_LEVELS, type Urgency } from "@lifeline/shared";

const urgencyConfig: Record<Urgency, { label: string; description: string; expiry: string; icon: typeof AlertTriangle }> = {
  critical: { label: "Critical", description: "Life-threatening", expiry: "Expires in 6h", icon: AlertTriangle },
  urgent: { label: "Urgent", description: "Needed soon", expiry: "Expires in 12h", icon: Clock },
  standard: { label: "Standard", description: "Planned ahead", expiry: "Expires in 24h", icon: Info },
};

interface UrgencyCardProps {
  urgency: Urgency;
  onChange: (u: Urgency) => void;
}

function UrgencyCard({ urgency, onChange }: UrgencyCardProps) {
  return (
    <div className="bg-white rounded-[18px] p-6" style={{ border: "1px solid #EBD9DC" }}>
      <p
        className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] mb-4"
        style={{ color: "#6E5A5E" }}
      >
        Urgency Level
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {URGENCY_LEVELS.map((u) => {
          const cfg = urgencyConfig[u];
          const Icon = cfg.icon;
          const isActive = urgency === u;
          const accentColor = u === "standard" ? "#15805A" : "#C8102E";
          const activeBorder = u === "standard" ? "#BFE0D2" : "#C8102E";
          const activeBg = u === "standard" ? "#E4F2EC" : "#F7E9EB";
          return (
            <button
              key={u}
              type="button"
              onClick={() => onChange(u)}
              className="flex flex-col gap-2 rounded-[14px] p-4 text-left transition-all"
              style={
                isActive
                  ? { background: activeBg, border: `1.5px solid ${activeBorder}` }
                  : { background: "#fff", border: "1.5px solid #EBD9DC" }
              }
            >
              <Icon className="w-4 h-4" style={{ color: isActive ? accentColor : "#6E5A5E" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: isActive ? accentColor : "#231518" }}>
                  {cfg.label}
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: "#6E5A5E" }}>{cfg.description}</p>
                <p className="font-mono text-[11px] mt-1" style={{ color: "#6E5A5E" }}>{cfg.expiry}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default UrgencyCard;

import type { Urgency } from "@lifeline/shared";

interface Props {
  urgency: Urgency;
}

const styles: Record<Urgency, { background: string; color: string; border: string }> = {
  critical: { background: "#C8102E", color: "#fff", border: "1px solid #C8102E" },
  urgent:   { background: "#F7E9EB", color: "#C8102E", border: "1px solid #EBD9DC" },
  standard: { background: "#E4F2EC", color: "#15805A", border: "1px solid #BFE0D2" },
};

const labels: Record<Urgency, string> = {
  critical: "Critical",
  urgent: "Urgent",
  standard: "Standard",
};

function UrgencyChip({ urgency }: Props) {
  return (
    <span
      className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={styles[urgency]}
    >
      {urgency === "critical" && (
        <span className="relative flex h-1.5 w-1.5 flex-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
        </span>
      )}
      {labels[urgency]}
    </span>
  );
}

export default UrgencyChip;

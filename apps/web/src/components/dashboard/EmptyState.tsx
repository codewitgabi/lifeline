import { Loader, Droplets } from "lucide-react";

const FILTERS = ["all", "critical", "urgent", "standard"] as const;
type FilterType = (typeof FILTERS)[number];

interface EmptyStateProps {
  filter: FilterType;
  loading: boolean;
}

function EmptyState({ filter, loading }: EmptyStateProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader className="w-6 h-6 animate-spin" style={{ color: "#C8102E" }} />
        <p className="font-mono text-[12.5px]" style={{ color: "#6E5A5E" }}>
          Loading nearby requests…
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-[18px] flex items-center justify-center mb-5" style={{ background: "#F7E9EB" }}>
        <Droplets className="w-7 h-7" style={{ color: "#C8102E" }} />
      </div>
      <h3
        className="font-display font-semibold mb-2"
        style={{ fontSize: "18px", color: "#231518", letterSpacing: "-0.01em" }}
      >
        No active requests
      </h3>
      <p className="text-[13.5px] max-w-xs" style={{ color: "#6E5A5E" }}>
        {filter !== "all"
          ? `No ${filter} requests right now. Try viewing all.`
          : "You'll be alerted the moment a compatible request appears near you."}
      </p>
    </div>
  );
}

export default EmptyState;

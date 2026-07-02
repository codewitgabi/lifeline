import { RefreshCw, Droplets, Wifi, WifiOff } from "lucide-react";
import type { Donor } from "@lifeline/shared";
import BloodTypeBadge from "../BloodTypeBadge";

interface DashboardHeaderProps {
  donor: Donor;
  isLive: boolean;
  loading: boolean;
  onRefresh: () => void;
  onPostRequest: () => void;
}

function DashboardHeader({ donor, isLive, loading, onRefresh, onPostRequest }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-1.5">
          <h1
            className="font-display font-semibold"
            style={{ fontSize: "clamp(22px, 3vw, 30px)", letterSpacing: "-0.015em", color: "#231518" }}
          >
            Your Dashboard
          </h1>
          <span
            className="flex items-center gap-1.5 font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={
              isLive
                ? { background: "#E4F2EC", color: "#15805A", border: "1px solid #BFE0D2" }
                : { background: "#FBF8F6", color: "#6E5A5E", border: "1px solid #EBD9DC" }
            }
          >
            {isLive ? (
              <>
                <i className="block w-1.5 h-1.5 rounded-full animate-blink" style={{ background: "#15805A" }} />
                <Wifi className="w-3 h-3" />
                Live
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                Offline
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[12px]" style={{ color: "#6E5A5E" }}>
          <span>
            Signed in as{" "}
            <span className="font-semibold" style={{ color: "#231518" }}>{donor.name}</span>
          </span>
          <BloodTypeBadge type={donor.bloodType} size="sm" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPostRequest}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full text-white transition-all hover:-translate-y-px"
          style={{ background: "#C8102E", boxShadow: "0 1px 0 #9E0C24" }}
        >
          <Droplets className="w-4 h-4" />
          Post Request
        </button>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2.5 rounded-full transition-all disabled:opacity-40"
          style={{ border: "1px solid #EBD9DC", color: "#6E5A5E", background: "#fff" }}
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}

export default DashboardHeader;

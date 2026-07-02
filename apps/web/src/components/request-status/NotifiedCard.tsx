import { Users } from "lucide-react";

const RADII = ["5km", "15km", "50km"];

interface NotifiedCardProps {
  donorsNotified: number;
  radiusStep: number;
}

function NotifiedCard({ donorsNotified, radiusStep }: NotifiedCardProps) {
  return (
    <div className="bg-white rounded-[18px] p-5 mb-4" style={{ border: "1px solid #EBD9DC" }}>
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-none"
          style={{ background: "#F7E9EB" }}
        >
          <Users className="w-5 h-5" style={{ color: "#C8102E" }} />
        </div>
        <div>
          <p className="font-semibold text-[16px]" style={{ color: "#231518" }}>
            {donorsNotified} compatible donor{donorsNotified !== 1 ? "s" : ""} alerted
          </p>
          <p className="font-mono text-[12px] mt-0.5" style={{ color: "#6E5A5E" }}>
            Within {RADII[radiusStep]} radius · Updating live
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotifiedCard;

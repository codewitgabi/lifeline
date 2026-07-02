import { CheckCircle } from "lucide-react";
import type { Responder } from "@lifeline/shared";
import ResponderCard from "../ResponderCard";

interface ResponderListProps {
  responders: Responder[];
}

function ResponderList({ responders }: ResponderListProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-4 h-4" style={{ color: "#15805A" }} />
        <h2 className="font-semibold text-[14.5px]" style={{ color: "#231518" }}>
          {responders.length} donor{responders.length !== 1 ? "s" : ""} responded
        </h2>
      </div>
      <div className="space-y-3">
        {responders.map((r, i) => (
          <ResponderCard key={r.donorId + i} responder={r} />
        ))}
      </div>
    </div>
  );
}

export default ResponderList;

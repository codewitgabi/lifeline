import { Users } from "lucide-react";

function WaitingCard() {
  return (
    <div className="text-center py-12 bg-white rounded-[18px]" style={{ border: "1px solid #EBD9DC" }}>
      <div className="relative flex items-center justify-center w-14 h-14 mx-auto mb-4">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-10"
          style={{ background: "#C8102E" }}
        />
        <div
          className="relative w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "#F7E9EB" }}
        >
          <Users className="w-5 h-5" style={{ color: "#C8102E" }} />
        </div>
      </div>
      <p className="font-semibold text-[14.5px]" style={{ color: "#231518" }}>
        Waiting for donors to respond…
      </p>
      <p className="text-[13px] mt-1 max-w-xs mx-auto" style={{ color: "#6E5A5E" }}>
        This page updates in real time. Responder cards will appear here instantly.
      </p>
    </div>
  );
}

export default WaitingCard;

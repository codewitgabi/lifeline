import { CheckCircle } from "lucide-react";

function FulfilledBanner() {
  return (
    <div
      className="mt-4 flex items-center gap-3 rounded-[18px] px-5 py-4"
      style={{ background: "#E4F2EC", border: "1px solid #BFE0D2" }}
    >
      <CheckCircle className="w-5 h-5 flex-none" style={{ color: "#15805A" }} />
      <div>
        <p className="font-semibold text-[14.5px]" style={{ color: "#15805A" }}>Request fulfilled</p>
        <p className="text-[13px] mt-0.5" style={{ color: "#15805A", opacity: 0.8 }}>
          This request has been closed. Thank you!
        </p>
      </div>
    </div>
  );
}

export default FulfilledBanner;

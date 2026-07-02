import { CheckCircle, XCircle, Loader } from "lucide-react";

interface CloseRequestCardProps {
  confirmClose: boolean;
  fulfilling: boolean;
  onInitConfirm: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function CloseRequestCard({ confirmClose, fulfilling, onInitConfirm, onConfirm, onCancel }: CloseRequestCardProps) {
  return (
    <div className="mt-4 rounded-[18px] p-5" style={{ background: "#fff", border: "1px solid #EBD9DC" }}>
      {!confirmClose ? (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-semibold text-[14px]" style={{ color: "#231518" }}>Found a donor?</p>
            <p className="text-[13px] mt-0.5" style={{ color: "#6E5A5E" }}>
              Close this request once the blood need is met.
            </p>
          </div>
          <button
            onClick={onInitConfirm}
            className="flex items-center gap-2 rounded-full px-4 py-2.5 font-semibold text-[13.5px] transition-all hover:-translate-y-px shrink-0"
            style={{ background: "#E4F2EC", color: "#15805A", border: "1px solid #BFE0D2" }}
          >
            <CheckCircle className="w-4 h-4" />
            Mark as fulfilled
          </button>
        </div>
      ) : (
        <div>
          <p className="font-semibold text-[14px] mb-1" style={{ color: "#231518" }}>
            Close this request?
          </p>
          <p className="text-[13px] mb-4" style={{ color: "#6E5A5E" }}>
            This will remove the request from all donor dashboards immediately. This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onConfirm}
              disabled={fulfilling}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-[13.5px] text-white transition-all hover:-translate-y-px disabled:opacity-60"
              style={{ background: "#15805A", boxShadow: "0 1px 0 #0f6045" }}
            >
              {fulfilling ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {fulfilling ? "Closing…" : "Yes, close it"}
            </button>
            <button
              onClick={onCancel}
              disabled={fulfilling}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-[13.5px] transition-all"
              style={{ background: "#FBF8F6", color: "#6E5A5E", border: "1px solid #EBD9DC" }}
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CloseRequestCard;

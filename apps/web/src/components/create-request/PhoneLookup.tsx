import { useState, type FormEvent } from "react";
import { Loader } from "lucide-react";
import type { BloodRequest } from "@lifeline/shared";
import { api } from "../../lib/api";
import { useActiveRequestStore } from "../../store/activeRequestStore";

interface PhoneLookupProps {
  onFound: (id: string) => void;
}

function PhoneLookup({ onFound }: PhoneLookupProps) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { setActive } = useActiveRequestStore();

  async function handleLookup(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const req = await api.post<BloodRequest>("/api/requests/lookup", { phone });
      setActive({
        id: req._id,
        bloodType: req.bloodType,
        urgency: req.urgency,
        hospitalName: req.hospitalName,
        requesterName: req.requesterName,
        requesterPhone: req.requesterPhone,
        expiresAt: req.expiresAt,
        donorsNotified: 0,
      });
      onFound(req._id);
    } catch {
      setErr("No active request found for that number.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <p className="text-center font-mono text-[11.5px] pt-2" style={{ color: "#6E5A5E" }}>
        Posted before?{" "}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-semibold underline underline-offset-2"
          style={{ color: "#C8102E" }}
        >
          Find your request by phone
        </button>
      </p>
    );
  }

  return (
    <div
      className="rounded-[14px] p-4 space-y-3"
      style={{ background: "#FBF8F6", border: "1px solid #EBD9DC" }}
    >
      <p className="text-sm font-semibold" style={{ color: "#231518" }}>Find your active request</p>
      <div className="flex gap-2">
        <input
          type="tel"
          autoFocus
          placeholder="+234 800 000 0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 rounded-[10px] px-3.5 py-2.5 text-sm outline-none"
          style={{ border: "1.5px solid #EBD9DC", color: "#231518", background: "#fff" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#C8102E")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#EBD9DC")}
        />
        <button
          type="button"
          disabled={!phone || loading}
          onClick={handleLookup}
          className="px-4 rounded-[10px] font-semibold text-sm text-white transition-all disabled:opacity-50"
          style={{ background: "#C8102E" }}
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Find"}
        </button>
      </div>
      {err && (
        <p className="font-mono text-[11.5px]" style={{ color: "#C8102E" }}>{err}</p>
      )}
    </div>
  );
}

export default PhoneLookup;

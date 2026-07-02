import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { type BloodType, type Urgency } from "@lifeline/shared";
import type { BloodRequest } from "@lifeline/shared";
import { api } from "../lib/api";
import { useActiveRequestStore } from "../store/activeRequestStore";
import ActiveRequestBanner from "../components/create-request/ActiveRequestBanner";
import BloodDetailsCard from "../components/create-request/BloodDetailsCard";
import UrgencyCard from "../components/create-request/UrgencyCard";
import ContactLocationCard from "../components/create-request/ContactLocationCard";
import PhoneLookup from "../components/create-request/PhoneLookup";

type FormState = {
  bloodType: BloodType | "";
  unitsNeeded: number;
  urgency: Urgency;
  hospitalName: string;
  requesterName: string;
  requesterPhone: string;
  notes: string;
};

function CreateRequest() {
  const navigate = useNavigate();
  const { active, setActive } = useActiveRequestStore();

  const stillActive = active && new Date(active.expiresAt) > new Date();
  const [dismissed, setDismissed] = useState(false);

  const [form, setForm] = useState<FormState>({
    bloodType: "",
    unitsNeeded: 1,
    urgency: "urgent",
    hospitalName: "",
    requesterName: "",
    requesterPhone: "",
    notes: "",
  });
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function detectLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCoords([pos.coords.longitude, pos.coords.latitude]); setLocating(false); },
      () => { setError("Unable to detect location."); setLocating(false); },
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.bloodType) return setError("Please select the required blood type.");
    if (!coords) return setError("Please detect your location first.");
    setSubmitting(true);
    try {
      const result = await api.post<{ request: BloodRequest; donorsNotified: number }>("/api/requests", {
        ...form,
        location: { type: "Point", coordinates: coords },
      });
      setActive({
        id: result.request._id,
        bloodType: result.request.bloodType,
        urgency: result.request.urgency,
        hospitalName: result.request.hospitalName,
        requesterName: result.request.requesterName,
        requesterPhone: result.request.requesterPhone,
        expiresAt: result.request.expiresAt,
        donorsNotified: result.donorsNotified,
      });
      navigate(`/request/${result.request._id}`, { state: { donorsNotified: result.donorsNotified } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-4">
      {stillActive && !dismissed && (
        <ActiveRequestBanner
          active={active}
          onView={() => navigate(`/request/${active.id}`)}
          onDismiss={() => setDismissed(true)}
        />
      )}

      <span
        className="inline-flex items-center gap-2 font-mono text-[12px] font-medium uppercase tracking-[0.08em] mb-5"
        style={{ color: "#C8102E" }}
      >
        <span className="inline-block w-5.5 flex-none" style={{ height: 1.5, background: "#C8102E" }} />
        Emergency Request
      </span>
      <h1
        className="font-display font-semibold mb-3"
        style={{ fontSize: "clamp(26px, 3.2vw, 38px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#231518" }}
      >
        Post a blood request
      </h1>
      <p className="text-[15px] mb-8" style={{ color: "#6E5A5E" }}>
        Compatible donors near you will be alerted immediately.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <BloodDetailsCard
          bloodType={form.bloodType}
          onSelectBloodType={(t) => setForm((f) => ({ ...f, bloodType: t }))}
          unitsNeeded={form.unitsNeeded}
          onSelectUnits={(n) => setForm((f) => ({ ...f, unitsNeeded: n }))}
        />
        <UrgencyCard urgency={form.urgency} onChange={(u) => setForm((f) => ({ ...f, urgency: u }))} />
        <ContactLocationCard
          form={{
            hospitalName: form.hospitalName,
            requesterName: form.requesterName,
            requesterPhone: form.requesterPhone,
            notes: form.notes,
          }}
          onFieldChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))}
          coords={coords}
          locating={locating}
          onDetectLocation={detectLocation}
        />

        {error && (
          <div
            className="rounded-[10px] px-4 py-3 text-sm font-medium"
            style={{ background: "#F7E9EB", border: "1px solid #EBD9DC", color: "#C8102E" }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-full font-semibold text-base text-white transition-all hover:-translate-y-px active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "#C8102E", boxShadow: "0 1px 0 #9E0C24" }}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              Alerting donors…
            </span>
          ) : (
            "Post Blood Request"
          )}
        </button>

        <PhoneLookup onFound={(id) => navigate(`/request/${id}`)} />
      </form>
    </div>
  );
}

export default CreateRequest;

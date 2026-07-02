import { useState, type FormEvent } from "react";
import { MapPin, Loader, CheckCircle } from "lucide-react";
import { BLOOD_TYPES, type BloodType, type Donor } from "@lifeline/shared";
import { api } from "../../lib/api";
import { d } from "../landing/utils";

const baseInput: React.CSSProperties = { border: "1.5px solid #EBD9DC", color: "#231518", background: "#fff" };
const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = "#C8102E");
const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = "#EBD9DC");

interface RegisterFormProps {
  onSuccess: (donor: Donor, token: string) => void;
  onSwitchToReturn: () => void;
}

function RegisterForm({ onSuccess, onSwitchToReturn }: RegisterFormProps) {
  const [form, setForm] = useState({ name: "", phone: "", bloodType: "" as BloodType | "" });
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
      () => { setError("Unable to detect location. Please allow location access."); setLocating(false); },
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.bloodType) return setError("Please select your blood type.");
    if (!coords) return setError("Please detect your location first.");
    setSubmitting(true);
    try {
      const { donor, token } = await api.post<{ donor: Donor; token: string }>("/api/donors", {
        ...form,
        location: { type: "Point", coordinates: coords },
      });
      onSuccess(donor, token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[18px] p-6.5 space-y-5" style={{ border: "1px solid #EBD9DC" }}>
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "#231518" }}>Full Name</label>
        <input
          type="text"
          required
          placeholder="John Doe"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full rounded-[10px] px-4 py-3 text-sm outline-none transition-all"
          style={baseInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "#231518" }}>Phone Number</label>
        <input
          type="tel"
          required
          placeholder="+234 800 000 0000"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full rounded-[10px] px-4 py-3 text-sm outline-none transition-all"
          style={baseInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: "#231518" }}>Blood Type</label>
        <div className="flex flex-wrap gap-2">
          {BLOOD_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm((f) => ({ ...f, bloodType: t }))}
              className="font-mono text-sm font-semibold px-3.75 py-2.25 rounded-[10px] transition-all duration-150 cursor-pointer"
              style={{
                background: form.bloodType === t ? "#C8102E" : "#FBF8F6",
                border: `1.5px solid ${form.bloodType === t ? "#C8102E" : "#EBD9DC"}`,
                color: form.bloodType === t ? "#fff" : "#231518",
              }}
            >
              {d(t)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "#231518" }}>Your Location</label>
        <button
          type="button"
          onClick={detectLocation}
          disabled={locating}
          className="flex items-center gap-3 w-full rounded-[10px] px-4 py-3 text-sm transition-all disabled:opacity-60"
          style={
            coords
              ? { background: "#E4F2EC", border: "1.5px solid #BFE0D2", color: "#15805A" }
              : { background: "#FBF8F6", border: "1.5px dashed #EBD9DC", color: "#6E5A5E" }
          }
        >
          {locating ? (
            <Loader className="w-4 h-4 animate-spin shrink-0" />
          ) : coords ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <MapPin className="w-4 h-4 shrink-0" />
          )}
          <span>
            {coords
              ? `${coords[1].toFixed(5)}, ${coords[0].toFixed(5)}`
              : locating
                ? "Detecting location…"
                : "Detect my location"}
          </span>
        </button>
      </div>

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
        className="w-full py-3 rounded-full font-semibold text-sm text-white transition-all hover:-translate-y-px active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: "#C8102E", boxShadow: "0 1px 0 #9E0C24" }}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            Registering…
          </span>
        ) : (
          "Register as Donor"
        )}
      </button>

      <p className="text-center font-mono text-[11.5px]" style={{ color: "#6E5A5E" }}>
        Already registered?{" "}
        <button
          type="button"
          onClick={onSwitchToReturn}
          className="font-semibold underline underline-offset-2"
          style={{ color: "#C8102E" }}
        >
          Sign in with your phone
        </button>
      </p>
    </form>
  );
}

export default RegisterForm;

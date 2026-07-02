import { MapPin, Loader, CheckCircle } from "lucide-react";

interface FormFields {
  hospitalName: string;
  requesterName: string;
  requesterPhone: string;
  notes: string;
}

interface ContactLocationCardProps {
  form: FormFields;
  onFieldChange: (field: keyof FormFields, value: string) => void;
  coords: [number, number] | null;
  locating: boolean;
  onDetectLocation: () => void;
}

const baseInput: React.CSSProperties = { border: "1.5px solid #EBD9DC", color: "#231518", background: "#fff" };
const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  (e.currentTarget.style.borderColor = "#C8102E");
const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  (e.currentTarget.style.borderColor = "#EBD9DC");

function ContactLocationCard({ form, onFieldChange, coords, locating, onDetectLocation }: ContactLocationCardProps) {
  return (
    <div className="bg-white rounded-[18px] p-6 space-y-4" style={{ border: "1px solid #EBD9DC" }}>
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#6E5A5E" }}>
        Contact & Location
      </p>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "#231518" }}>
          Hospital / Location Name
        </label>
        <input
          type="text"
          required
          placeholder="Lagos University Teaching Hospital"
          value={form.hospitalName}
          onChange={(e) => onFieldChange("hospitalName", e.target.value)}
          className="w-full rounded-[10px] px-4 py-3 text-sm outline-none transition-all"
          style={baseInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#231518" }}>Your Name</label>
          <input
            type="text"
            required
            placeholder="Jane Doe"
            value={form.requesterName}
            onChange={(e) => onFieldChange("requesterName", e.target.value)}
            className="w-full rounded-[10px] px-4 py-3 text-sm outline-none transition-all"
            style={baseInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#231518" }}>Your Phone</label>
          <input
            type="tel"
            required
            placeholder="+234 800 000 0000"
            value={form.requesterPhone}
            onChange={(e) => onFieldChange("requesterPhone", e.target.value)}
            className="w-full rounded-[10px] px-4 py-3 text-sm outline-none transition-all"
            style={baseInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "#231518" }}>
          Notes <span className="font-normal" style={{ color: "#6E5A5E" }}>(optional)</span>
        </label>
        <textarea
          maxLength={280}
          rows={3}
          placeholder="Any extra details for donors…"
          value={form.notes}
          onChange={(e) => onFieldChange("notes", e.target.value)}
          className="w-full rounded-[10px] px-4 py-3 text-sm outline-none resize-none transition-all"
          style={baseInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <p className="font-mono text-[11px] mt-1 text-right" style={{ color: "#6E5A5E" }}>
          {form.notes.length}/280
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "#231518" }}>Location</label>
        <button
          type="button"
          onClick={onDetectLocation}
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
                ? "Detecting…"
                : "Detect my location"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default ContactLocationCard;

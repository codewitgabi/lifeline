import { BLOOD_TYPES, type BloodType } from "@lifeline/shared";
import { d } from "../landing/utils";

interface BloodDetailsCardProps {
  bloodType: BloodType | "";
  onSelectBloodType: (t: BloodType) => void;
  unitsNeeded: number;
  onSelectUnits: (n: number) => void;
}

function BloodDetailsCard({ bloodType, onSelectBloodType, unitsNeeded, onSelectUnits }: BloodDetailsCardProps) {
  return (
    <div className="bg-white rounded-[18px] p-6" style={{ border: "1px solid #EBD9DC" }}>
      <p
        className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] mb-4"
        style={{ color: "#6E5A5E" }}
      >
        Blood Details
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-3" style={{ color: "#231518" }}>
            Blood Type Needed
          </label>
          <div className="flex flex-wrap gap-2">
            {BLOOD_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onSelectBloodType(t)}
                className="font-mono text-sm font-semibold px-3.75 py-2.25 rounded-[10px] transition-all duration-150 cursor-pointer"
                style={{
                  background: bloodType === t ? "#C8102E" : "#FBF8F6",
                  border: `1.5px solid ${bloodType === t ? "#C8102E" : "#EBD9DC"}`,
                  color: bloodType === t ? "#fff" : "#231518",
                }}
              >
                {d(t)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3" style={{ color: "#231518" }}>
            Units Needed
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onSelectUnits(n)}
                className="w-10 h-10 rounded-[10px] font-mono text-sm font-semibold transition-all"
                style={{
                  background: unitsNeeded === n ? "#C8102E" : "#FBF8F6",
                  border: `1.5px solid ${unitsNeeded === n ? "#C8102E" : "#EBD9DC"}`,
                  color: unitsNeeded === n ? "#fff" : "#231518",
                }}
              >
                {n}
              </button>
            ))}
            <span className="font-mono text-[12px] ml-1" style={{ color: "#6E5A5E" }}>pints</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BloodDetailsCard;

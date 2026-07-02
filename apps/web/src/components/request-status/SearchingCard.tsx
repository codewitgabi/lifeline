import SearchingPulse from "../SearchingPulse";

const RADII = ["5km", "15km", "50km"];

interface SearchingCardProps {
  radiusStep: number;
}

function SearchingCard({ radiusStep }: SearchingCardProps) {
  return (
    <div className="bg-white rounded-[18px] p-10 text-center mb-4" style={{ border: "1px solid #EBD9DC" }}>
      <SearchingPulse label={`Alerting compatible donors within ${RADII[radiusStep]}…`} />
      <p className="font-mono text-[11px] mt-1" style={{ color: "#6E5A5E" }}>
        Radius expands automatically if fewer than 5 donors are found.
      </p>
    </div>
  );
}

export default SearchingCard;

import type { BloodType } from "@lifeline/shared";

interface Props {
  type: BloodType;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "text-[11px] px-2 py-0.5",
  md: "text-[12px] px-2.5 py-1",
  lg: "text-[14px] px-3 py-1.5",
};

function BloodTypeBadge({ type, size = "md" }: Props) {
  return (
    <span
      className={`inline-flex items-center font-mono font-semibold rounded-lg tracking-wide ${sizes[size]}`}
      style={{ background: "#C8102E", color: "#fff" }}
    >
      {type}
    </span>
  );
}

export default BloodTypeBadge;

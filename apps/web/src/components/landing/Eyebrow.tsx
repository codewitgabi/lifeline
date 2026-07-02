import type { ReactNode } from "react";

export default function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 font-mono text-[12.5px] font-medium uppercase tracking-[0.08em] mb-5"
      style={{ color: "#C8102E" }}
    >
      <span
        className="inline-block w-5.5 flex-none"
        style={{ height: 1.5, background: "#C8102E" }}
      />
      {children}
    </span>
  );
}

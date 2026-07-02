import { useState } from "react";
import { CAN_RECEIVE_FROM } from "@lifeline/shared";
import type { BloodType } from "@lifeline/shared";
import Eyebrow from "./Eyebrow";
import { BLOOD_TYPES, d } from "./utils";

export default function CompatExplorer() {
  const [selected, setSelected] = useState<BloodType>("B+");
  const compatible = CAN_RECEIVE_FROM[selected] ?? [];

  const countText =
    compatible.length === 8
      ? "Universal recipient — every donor lights up."
      : compatible.length === 1
        ? "Only O− can give here. Rare match — LifeLine widens the search radius automatically."
        : `${compatible.length} of 8 blood types can donate — LifeLine alerts all of them.`;

  return (
    <section
      id="compat"
      className="border-y"
      style={{ background: "white", borderColor: "#EBD9DC" }}
    >
      <div className="max-w-280 mx-auto px-6 py-14 md:py-22 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 md:gap-14">
        {/* Left */}
        <div>
          <Eyebrow>Compatibility, handled</Eyebrow>
          <h2
            className="font-display font-semibold mb-3.5"
            style={{
              fontSize: "clamp(28px, 3.4vw, 38px)",
              lineHeight: 1.12,
              letterSpacing: "-0.015em",
            }}
          >
            You never have to remember who can give to whom.
          </h2>
          <p className="text-[16.5px]" style={{ color: "#6E5A5E" }}>
            Blood compatibility is easy to get wrong under pressure. LifeLine
            encodes it once and applies it to every request automatically —
            donors are only ever alerted to requests they can actually help
            with.
          </p>
          <div
            className="flex flex-wrap gap-2.5 mt-5.5"
            role="group"
            aria-label="Choose a blood type to see compatible donors"
          >
            {BLOOD_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setSelected(t)}
                className="font-mono text-sm font-semibold px-3.75 py-2.25 rounded-[10px] transition-all duration-150 cursor-pointer"
                style={{
                  background: selected === t ? "#C8102E" : "#FBF8F6",
                  border: `1.5px solid ${selected === t ? "#C8102E" : "#EBD9DC"}`,
                  color: selected === t ? "#fff" : "#231518",
                }}
              >
                {d(t)}
              </button>
            ))}
          </div>
        </div>

        {/* Right */}
        <div
          className="rounded-[18px] p-6.5"
          style={{ background: "#FBF8F6", border: "1px solid #EBD9DC" }}
        >
          <div
            className="font-mono text-[12px] tracking-[0.06em] uppercase mb-4"
            style={{ color: "#6E5A5E" }}
          >
            Patient needs{" "}
            <strong style={{ color: "#C8102E" }}>{d(selected)}</strong> ·
            compatible donors light up
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {BLOOD_TYPES.map((t) => {
              const on = compatible.includes(t);
              return (
                <div
                  key={t}
                  className="font-mono font-semibold text-[15px] text-center py-4 rounded-xl transition-all duration-[250ms]"
                  style={{
                    background: on ? "#F7E9EB" : "#fff",
                    border: on ? "1px solid #C8102E" : "1px solid #EBD9DC",
                    color: on ? "#C8102E" : "#C9B8BB",
                    transform: on ? "scale(1.03)" : "scale(1)",
                  }}
                >
                  {d(t)}
                </div>
              );
            })}
          </div>
          <div
            className="mt-4.5 font-mono text-[12.5px] pt-3.5"
            style={{ color: "#6E5A5E", borderTop: "1px dashed #EBD9DC" }}
          >
            {countText}
          </div>
        </div>
      </div>
    </section>
  );
}

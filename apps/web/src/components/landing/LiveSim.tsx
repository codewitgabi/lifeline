import { useState, useEffect } from "react";
import { d, wait } from "./utils";

const SIM_DONORS = [
  { name: "Ada Okafor", type: "O+", dist: "1.2 km away", color: "#C8102E" },
  { name: "Chinedu Eze", type: "B-", dist: "2.8 km away", color: "#8A5A44" },
  { name: "Ngozi Adeyemi", type: "B+", dist: "3.4 km away", color: "#3E6B8C" },
];

export default function LiveSim() {
  const [reqVisible, setReqVisible] = useState(false);
  const [radarActive, setRadarActive] = useState(false);
  const [statusText, setStatusText] = useState("Waiting for requests…");
  const [shownDonors, setShownDonors] = useState<number[]>([]);
  const [matchedIdx, setMatchedIdx] = useState<number | null>(null);

  useEffect(() => {
    let dead = false;

    async function run() {
      while (!dead) {
        setReqVisible(false);
        setRadarActive(false);
        setStatusText("Waiting for requests…");
        setShownDonors([]);
        setMatchedIdx(null);

        await wait(1400);
        if (dead) break;

        setReqVisible(true);
        await wait(700);
        if (dead) break;

        setRadarActive(true);
        setStatusText("Alerting compatible donors within 5 km…");
        await wait(1300);
        if (dead) break;

        for (let i = 0; i < SIM_DONORS.length; i++) {
          if (dead) break;
          setShownDonors((p) => [...p, i]);
          await wait(650);
        }
        if (dead) break;

        setStatusText("3 compatible donors alerted");
        await wait(1400);
        if (dead) break;

        setMatchedIdx(0);
        setRadarActive(false);
        setStatusText('Ada tapped "I can help" — contact shared.');
        await wait(3400);
      }
    }

    run();
    return () => {
      dead = true;
    };
  }, []);

  return (
    <div
      className="bg-white rounded-[20px] p-5.5 relative"
      style={{
        border: "1px solid #EBD9DC",
        boxShadow:
          "0 20px 50px -24px rgba(60,10,20,.25), 0 2px 6px rgba(60,10,20,.05)",
      }}
      aria-label="Live demonstration of a blood request being matched to nearby donors"
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between pb-4 mb-4"
        style={{ borderBottom: "1px dashed #EBD9DC" }}
      >
        <span
          className="text-[13px] font-semibold tracking-[0.02em]"
          style={{ color: "#6E5A5E" }}
        >
          Donor alerts near you
        </span>
        <span
          className="font-mono text-[11px] font-semibold tracking-[0.06em] flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ color: "#C8102E", background: "#F7E9EB" }}
        >
          <i
            className="block w-1.5 h-1.5 rounded-full animate-blink"
            style={{ background: "#C8102E" }}
            aria-hidden="true"
          />
          LIVE
        </span>
      </div>

      {/* Incoming request card */}
      <div
        className="rounded-[14px] p-4 mb-3.5"
        style={{
          background: "linear-gradient(135deg, #FFF6F7, #F7E9EB)",
          border: "1px solid #EBD9DC",
          opacity: reqVisible ? 1 : 0,
          transform: reqVisible ? "none" : "translateY(6px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <span
            className="font-mono font-semibold text-[15px] text-white px-2.5 py-0.75 rounded-lg leading-snug"
            style={{ background: "#C8102E" }}
          >
            B+
          </span>
          <span
            className="font-mono text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "#C8102E" }}
          >
            Critical · 2 units
          </span>
        </div>
        <div className="text-[14.5px] font-semibold">
          Central Hospital, Benin City
        </div>
        <div className="font-mono text-[12px]" style={{ color: "#6E5A5E" }}>
          Posted just now · expires in 6h
        </div>
      </div>

      {/* Search status */}
      <div
        className="flex items-center gap-2.5 my-3.5 min-h-5.5 font-mono text-[12.5px]"
        style={{ color: "#6E5A5E" }}
      >
        <span className="w-4 h-4 relative flex-none">
          {radarActive ? (
            <>
              <span
                className="absolute inset-0 rounded-full border-[1.5px] animate-radar-pulse"
                style={{ borderColor: "#C8102E" }}
              />
              <span
                className="absolute inset-0 rounded-full border-[1.5px] animate-radar-pulse-delay"
                style={{ borderColor: "#C8102E" }}
              />
            </>
          ) : (
            <span
              className="absolute inset-0 rounded-full border-[1.5px]"
              style={{
                borderColor: "#C8102E",
                opacity: 0.3,
                transform: "scale(0.6)",
              }}
            />
          )}
        </span>
        <span>{statusText}</span>
      </div>

      {/* Donor rows */}
      <div className="flex flex-col gap-2.5 min-h-46.5" aria-live="polite">
        {SIM_DONORS.map((donor, i) => {
          const visible = shownDonors.includes(i);
          const matched = matchedIdx === i;
          const initials = donor.name
            .split(" ")
            .map((w) => w[0])
            .join("");
          return (
            <div
              key={i}
              className="flex items-center gap-3 rounded-[14px] px-3.5 py-3"
              style={{
                background: matched ? "#E4F2EC" : "#FBF8F6",
                border: matched ? "1px solid #BFE0D2" : "1px solid #EBD9DC",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateX(10px)",
                transition:
                  "opacity 0.35s ease, transform 0.35s ease, background 0.35s ease, border-color 0.35s ease",
              }}
            >
              <span
                className="w-8.5 h-8.5 rounded-full flex-none flex items-center justify-center font-semibold text-[13px] text-white"
                style={{ background: donor.color }}
              >
                {initials}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold leading-snug">
                  {donor.name}
                </span>
                <span className="font-mono text-[11.5px]" style={{ color: "#6E5A5E" }}>
                  {d(donor.type)} · {donor.dist}
                </span>
              </span>
              <span
                className="font-mono text-[11px] font-semibold tracking-[0.04em] flex-none"
                style={{ color: matched ? "#15805A" : "#6E5A5E" }}
              >
                {matched ? "RESPONDING" : "ALERTED"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

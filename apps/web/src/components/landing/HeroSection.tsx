import LiveSim from "./LiveSim";
import Eyebrow from "./Eyebrow";

interface HeroSectionProps {
  onRegister: () => void;
  onRequest: () => void;
}

function HeroSection({ onRegister, onRequest }: HeroSectionProps) {
  return (
    <header className="max-w-280 mx-auto px-6 py-14 pb-16 md:py-22 md:pb-24">
      <div className="grid grid-cols-1 md:grid-cols-[1.05fr_.95fr] gap-10 md:gap-16 items-center">
        <div>
          <Eyebrow>Emergency blood matching</Eyebrow>
          <h1
            className="font-display font-semibold mb-5.5"
            style={{ fontSize: "clamp(34px, 5.2vw, 60px)", lineHeight: 1.06, letterSpacing: "-0.02em" }}
          >
            Blood, found in{" "}
            <em style={{ fontStyle: "italic", color: "#C8102E" }}>minutes</em>{" "}
            — not forwarded messages.
          </h1>
          <p className="text-lg mb-8.5 max-w-[46ch]" style={{ color: "#6E5A5E" }}>
            When someone needs blood urgently, the search shouldn't happen on WhatsApp. LifeLine
            alerts compatible donors near the hospital the moment a request goes up — and connects
            the first yes directly to the person who needs it.
          </p>
          <div className="flex gap-3.5 flex-wrap items-center">
            <button
              onClick={onRegister}
              className="flex items-center gap-2 rounded-full px-5.5 py-2.75 text-[14.5px] font-semibold text-white transition-all duration-150 hover:-translate-y-px"
              style={{ background: "#C8102E", boxShadow: "0 1px 0 #9E0C24" }}
            >
              Register as a donor
            </button>
            <button
              onClick={onRequest}
              className="flex items-center gap-2 rounded-full px-5.5 py-2.75 text-[14.5px] font-semibold transition-all duration-150"
              style={{ background: "transparent", color: "#231518", border: "1.5px solid #EBD9DC" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#6E5A5E")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#EBD9DC")}
            >
              Post an emergency request
            </button>
          </div>
          <div className="mt-6.5 flex gap-4.5 flex-wrap font-mono text-[12.5px]" style={{ color: "#6E5A5E" }}>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full flex-none" style={{ background: "#15805A" }} />
              Free, always
            </span>
            <span>One-time signup · 30 seconds</span>
            <span>You choose when you're available</span>
          </div>
        </div>

        <div className="hidden md:block">
          <LiveSim />
        </div>
      </div>
    </header>
  );
}

export default HeroSection;

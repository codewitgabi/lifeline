interface JoinSectionProps {
  onRegister: () => void;
}

function JoinSection({ onRegister }: JoinSectionProps) {
  return (
    <section id="join" className="py-14 md:py-22">
      <div className="max-w-280 mx-auto px-6">
        <div
          className="rounded-3xl px-6 py-12 sm:px-12 sm:py-16 text-center relative overflow-hidden"
          style={{ background: "#231518", color: "#FBF8F6" }}
        >
          <div
            className="absolute pointer-events-none"
            style={{
              width: 520,
              height: 520,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(200,16,46,.35), transparent 65%)",
              top: -260,
              right: -140,
            }}
          />
          <h2
            className="font-display font-semibold text-white mx-auto mb-3.5 relative"
            style={{
              fontSize: "clamp(26px, 3.4vw, 38px)",
              lineHeight: 1.12,
              letterSpacing: "-0.015em",
              maxWidth: "22ch",
            }}
          >
            Thirty seconds today could be someone's tomorrow.
          </h2>
          <p className="mx-auto mb-8 text-[16.5px] relative" style={{ color: "#C7B6BA", maxWidth: "48ch" }}>
            Register once with your blood type and area. You'll only hear from us when someone
            nearby genuinely needs what you can give — and you can pause anytime.
          </p>
          <button
            onClick={onRegister}
            className="inline-flex items-center gap-2 rounded-full font-semibold text-white transition-all duration-150 hover:-translate-y-px relative"
            style={{ background: "#C8102E", boxShadow: "0 1px 0 #9E0C24", padding: "14px 30px", fontSize: "15.5px" }}
          >
            Become a donor
          </button>
        </div>
      </div>
    </section>
  );
}

export default JoinSection;

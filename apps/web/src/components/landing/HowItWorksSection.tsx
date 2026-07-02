import Eyebrow from "./Eyebrow";

const steps = [
  {
    n: "01",
    title: "A request goes up",
    body: "Hospital staff or family post the blood type, urgency, and location. That's the whole form — because nobody in an emergency fills out a long one.",
    time: "~20 seconds",
  },
  {
    n: "02",
    title: "Compatible donors get pinged",
    body: "LifeLine works out exactly which blood types can give safely, then alerts matching donors nearby — starting at 5 km and widening until it finds enough.",
    time: "under 1 second",
  },
  {
    n: "03",
    title: "One tap connects both sides",
    body: "A donor taps 'I can help' and phone numbers are exchanged instantly. The request closes itself once fulfilled — or quietly expires so no one chases a stale emergency.",
    time: "the moment someone says yes",
  },
];

function HowItWorksSection() {
  return (
    <section id="how" className="py-14 md:py-22">
      <div className="max-w-280 mx-auto px-6">
        <div className="mb-8 md:mb-13">
          <Eyebrow>How it works</Eyebrow>
          <h2
            className="font-display font-semibold mb-3.5"
            style={{ fontSize: "clamp(26px, 3.4vw, 38px)", lineHeight: 1.12, letterSpacing: "-0.015em" }}
          >
            Three steps between a request and a donor at the door.
          </h2>
          <p className="text-[16.5px] max-w-140" style={{ color: "#6E5A5E" }}>
            No accounts to manage, no feeds to scroll. LifeLine does one thing: it closes the
            distance between need and supply, fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((step) => (
            <div
              key={step.n}
              className="rounded-[18px] p-6.5 relative"
              style={{ background: "#fff", border: "1px solid #EBD9DC" }}
            >
              <span
                className="block font-mono text-[12px] font-semibold tracking-[0.08em] mb-4"
                style={{ color: "#C8102E" }}
              >
                {step.n}
              </span>
              <h3 className="font-semibold mb-2" style={{ fontSize: "17.5px", letterSpacing: "-0.01em" }}>
                {step.title}
              </h3>
              <p className="text-[14.5px]" style={{ color: "#6E5A5E" }}>{step.body}</p>
              <span
                className="block font-mono text-[11.5px] mt-4.5 pt-3"
                style={{ color: "#6E5A5E", borderTop: "1px dashed #EBD9DC" }}
              >
                {step.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;

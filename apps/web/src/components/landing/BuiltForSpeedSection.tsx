import Eyebrow from "./Eyebrow";

const features = [
  {
    glyph: "<1s",
    title: "Real-time, not refresh-time",
    body: "Alerts arrive over a live connection the instant a request is posted. No polling, no 'pull to refresh', no missed emergencies.",
  },
  {
    glyph: "5→50 km",
    title: "Search that widens itself",
    body: "Matching starts close to the hospital and expands its radius automatically until enough compatible donors have been reached.",
  },
  {
    glyph: "6h",
    title: "Requests that clean up after themselves",
    body: "Every request carries an expiry. Once it passes, the request disappears from every dashboard — so donors only ever see emergencies that are still real.",
  },
];

function BuiltForSpeedSection() {
  return (
    <section id="built" className="py-14 md:py-22">
      <div className="max-w-280 mx-auto px-6">
        <div className="mb-8 md:mb-13">
          <Eyebrow>Built for speed</Eyebrow>
          <h2
            className="font-display font-semibold"
            style={{ fontSize: "clamp(26px, 3.4vw, 38px)", lineHeight: 1.12, letterSpacing: "-0.015em" }}
          >
            Everything about LifeLine is designed for the worst hour of someone's day.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.glyph}
              className="p-6.5 rounded-[18px]"
              style={{ background: "#fff", border: "1px solid #EBD9DC" }}
            >
              <span
                className="inline-block font-mono text-[13px] font-semibold px-2.75 py-1.5 rounded-lg mb-4"
                style={{ color: "#C8102E", background: "#F7E9EB" }}
              >
                {f.glyph}
              </span>
              <h3 className="font-semibold mb-2" style={{ fontSize: "17px", letterSpacing: "-0.01em" }}>
                {f.title}
              </h3>
              <p className="text-[14.5px]" style={{ color: "#6E5A5E" }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BuiltForSpeedSection;

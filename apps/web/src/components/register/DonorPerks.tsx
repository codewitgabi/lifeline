import { Zap, Shield, Heart } from "lucide-react";

const perks = [
  {
    icon: Zap,
    title: "Instant alerts",
    body: "Dashboard updates live the moment a compatible request appears nearby.",
  },
  {
    icon: Shield,
    title: "No friction",
    body: "No password, no email verification. Just your name and blood type.",
  },
  {
    icon: Heart,
    title: "Pause anytime",
    body: "Toggle your availability off to stop receiving alerts instantly.",
  },
];

function DonorPerks() {
  return (
    <div className="flex flex-col gap-4 lg:pt-32">
      {perks.map((p) => {
        const Icon = p.icon;
        return (
          <div
            key={p.title}
            className="flex gap-4 bg-white rounded-[18px] p-5"
            style={{ border: "1px solid #EBD9DC" }}
          >
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-none"
              style={{ background: "#F7E9EB" }}
            >
              <Icon className="w-4 h-4" style={{ color: "#C8102E" }} />
            </div>
            <div>
              <p className="font-semibold text-sm mb-0.5" style={{ color: "#231518" }}>{p.title}</p>
              <p className="text-[13px]" style={{ color: "#6E5A5E" }}>{p.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DonorPerks;

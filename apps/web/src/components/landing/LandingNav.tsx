import LogoDrop from "./LogoDrop";

interface LandingNavProps {
  onRegister: () => void;
}

function LandingNav({ onRegister }: LandingNavProps) {
  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-[10px]"
      style={{ background: "color-mix(in srgb, #FBF8F6 88%, transparent)", borderColor: "#EBD9DC" }}
    >
      <div className="max-w-280 mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          className="flex items-center gap-2.5 font-semibold text-[17px] tracking-[-0.01em]"
          style={{ color: "#231518" }}
        >
          <LogoDrop size={26} />
          LifeLine
        </a>

        <div className="hidden md:flex items-center gap-7 text-[14.5px]" style={{ color: "#6E5A5E" }}>
          <a href="#how" className="hover:text-ink transition-colors">How it works</a>
          <a href="#compat" className="hover:text-ink transition-colors">Compatibility</a>
          <a href="#built" className="hover:text-ink transition-colors">Built for speed</a>
          <button
            onClick={onRegister}
            className="flex items-center gap-2 rounded-full px-5.5 py-2.75 text-[14.5px] font-semibold text-white transition-all duration-150 hover:-translate-y-px"
            style={{ background: "#C8102E", boxShadow: "0 1px 0 #9E0C24" }}
          >
            Become a donor
          </button>
        </div>

        <button
          onClick={onRegister}
          className="flex md:hidden items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-semibold text-white transition-all"
          style={{ background: "#C8102E", boxShadow: "0 1px 0 #9E0C24" }}
        >
          Become a donor
        </button>
      </div>
    </nav>
  );
}

export default LandingNav;

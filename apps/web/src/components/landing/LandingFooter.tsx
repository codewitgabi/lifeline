import LogoDrop from "./LogoDrop";

function LandingFooter() {
  return (
    <footer
      className="py-8 pb-10 text-[13.5px]"
      style={{ color: "#6E5A5E", borderTop: "1px solid #EBD9DC" }}
    >
      <div className="max-w-280 mx-auto px-6 flex justify-between items-center gap-5 flex-wrap">
        <a href="#" className="flex items-center gap-2.5 font-semibold text-[15px]" style={{ color: "#231518" }}>
          <LogoDrop size={20} />
          LifeLine
        </a>
        <span className="font-mono text-[12px]">
          © {new Date().getFullYear()} LifeLine. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

export default LandingFooter;

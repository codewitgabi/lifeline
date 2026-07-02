interface Props {
  label?: string;
}

function SearchingPulse({ label = "Searching for donors…" }: Props) {
  return (
    <div className="flex flex-col items-center gap-5 py-8">
      <div className="relative flex items-center justify-center w-24 h-24">
        <span className="animate-radar absolute inline-flex w-24 h-24 rounded-full opacity-20" style={{ background: "#C8102E" }} />
        <span className="animate-radar-delay absolute inline-flex w-24 h-24 rounded-full opacity-15" style={{ background: "#C8102E" }} />
        <span className="animate-radar-delay-2 absolute inline-flex w-24 h-24 rounded-full opacity-10" style={{ background: "#C8102E" }} />
        <div
          className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full"
          style={{ background: "#C8102E", boxShadow: "0 4px 20px rgba(200,16,46,.35)" }}
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
          </svg>
        </div>
      </div>
      <p className="font-mono text-[12.5px] font-medium" style={{ color: "#6E5A5E" }}>
        {label}
      </p>
    </div>
  );
}

export default SearchingPulse;

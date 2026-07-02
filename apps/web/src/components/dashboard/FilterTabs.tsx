const FILTERS = ["all", "critical", "urgent", "standard"] as const;
type FilterType = (typeof FILTERS)[number];

interface FilterTabsProps {
  filter: FilterType;
  counts: Record<FilterType, number>;
  onChange: (f: FilterType) => void;
}

function FilterTabs({ filter, counts, onChange }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full font-mono text-[12px] font-semibold whitespace-nowrap transition-all"
          style={
            filter === f
              ? { background: "#C8102E", color: "#fff", boxShadow: "0 1px 0 #9E0C24" }
              : { background: "#fff", color: "#6E5A5E", border: "1px solid #EBD9DC" }
          }
        >
          <span className="capitalize">{f}</span>
          {counts[f] > 0 && (
            <span
              className="font-mono text-[11px] px-1.5 py-0.5 rounded-full font-bold"
              style={
                filter === f
                  ? { background: "rgba(255,255,255,0.25)", color: "#fff" }
                  : { background: "#FBF8F6", color: "#6E5A5E" }
              }
            >
              {counts[f]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;

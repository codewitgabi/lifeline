type Tab = "register" | "returning";

interface TabSwitcherProps {
  active: Tab;
  onChange: (t: Tab) => void;
}

function TabSwitcher({ active, onChange }: TabSwitcherProps) {
  return (
    <div
      className="flex gap-1 p-1 rounded-full mb-6 w-fit"
      style={{ background: "#F0E9EB", border: "1px solid #EBD9DC" }}
    >
      {(["register", "returning"] as Tab[]).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className="px-5 py-2 rounded-full font-mono text-[12.5px] font-semibold transition-all"
          style={
            active === t
              ? { background: "#fff", color: "#231518", boxShadow: "0 1px 3px rgba(35,21,24,.12)" }
              : { background: "transparent", color: "#6E5A5E" }
          }
        >
          {t === "register" ? "New donor" : "Returning donor"}
        </button>
      ))}
    </div>
  );
}

export default TabSwitcher;

import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Droplets } from "lucide-react";
import { useDonorStore } from "../store/donorStore";
import { api } from "../lib/api";
import BloodTypeBadge from "./BloodTypeBadge";
import LogoDrop from "./landing/LogoDrop";
import type { Donor } from "@lifeline/shared";

function Layout() {
  const { donor, updateAvailability } = useDonorStore();
  const navigate = useNavigate();

  async function toggleAvailability() {
    if (!donor) return;
    const next = !donor.available;
    updateAvailability(next);
    try {
      await api.patch<Donor>(`/api/donors/${donor._id}`, { available: next });
    } catch {
      updateAvailability(!next);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FBF8F6" }}>
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-[10px]"
        style={{
          background: "color-mix(in srgb, #FBF8F6 88%, transparent)",
          borderColor: "#EBD9DC",
        }}
      >
        <div className="max-w-280 mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 font-semibold text-[17px] tracking-[-0.01em]"
            style={{ color: "#231518" }}
          >
            <LogoDrop size={26} />
            LifeLine
          </button>

          <div className="flex items-center gap-1.5">
            {donor && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 font-mono text-[12.5px] font-medium px-3.5 py-2 rounded-full transition-colors ${
                    isActive
                      ? "bg-[#F7E9EB] text-[#C8102E]"
                      : "text-[#6E5A5E] hover:text-[#231518]"
                  }`
                }
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dashboard</span>
              </NavLink>
            )}

            <NavLink
              to="/request/new"
              className={({ isActive }) =>
                `flex items-center gap-1.5 font-mono text-[12.5px] font-medium px-3.5 py-2 rounded-full transition-colors ${
                  isActive
                    ? "bg-[#F7E9EB] text-[#C8102E]"
                    : "text-[#6E5A5E] hover:text-[#231518]"
                }`
              }
            >
              <Droplets className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Need Blood</span>
            </NavLink>

            {donor ? (
              <div
                className="flex items-center gap-2.5 ml-1 pl-3"
                style={{ borderLeft: "1px solid #EBD9DC" }}
              >
                <div className="hidden sm:flex items-center gap-2">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#231518" }}
                  >
                    {donor.name.split(" ")[0]}
                  </span>
                  <BloodTypeBadge type={donor.bloodType} size="sm" />
                </div>
                <button
                  onClick={toggleAvailability}
                  title={donor.available ? "Pause alerts" : "Resume alerts"}
                  className="flex items-center gap-1.5 font-mono text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all"
                  style={
                    donor.available
                      ? { background: "#E4F2EC", color: "#15805A", border: "1px solid #BFE0D2" }
                      : { background: "#FBF8F6", color: "#6E5A5E", border: "1px solid #EBD9DC" }
                  }
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-none"
                    style={{ background: donor.available ? "#15805A" : "#C9B8BB" }}
                  />
                  {donor.available ? "Available" : "Paused"}
                </button>
              </div>
            ) : (
              <NavLink
                to="/register"
                className="ml-1 flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-[13.5px] text-white transition-all hover:-translate-y-px"
                style={{ background: "#C8102E", boxShadow: "0 1px 0 #9E0C24" }}
              >
                Register
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-280 mx-auto w-full px-4 sm:px-6 py-6 md:py-10">
        <Outlet />
      </main>

      <footer
        className="py-8 border-t font-mono text-[12px]"
        style={{ borderColor: "#EBD9DC", color: "#6E5A5E" }}
      >
        <div className="max-w-280 mx-auto px-4 sm:px-6 flex items-center justify-between gap-5 flex-wrap">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 font-semibold text-[15px]"
            style={{ color: "#231518", fontFamily: "inherit" }}
          >
            <LogoDrop size={20} />
            LifeLine
          </button>
          <span>Real-time emergency blood donor matching</span>
        </div>
      </footer>
    </div>
  );
}

export default Layout;

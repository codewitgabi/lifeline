import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Donor } from "@lifeline/shared";
import { connectSocket } from "../lib/socket";
import { useDonorStore } from "../store/donorStore";
import { isPushSupported, saveDonorSubscription } from "../utils/push";
import TabSwitcher from "../components/register/TabSwitcher";
import RegisterForm from "../components/register/RegisterForm";
import ReturnForm from "../components/register/ReturnForm";
import DonorPerks from "../components/register/DonorPerks";

type Tab = "register" | "returning";

function RegisterDonor() {
  const navigate = useNavigate();
  const setDonor = useDonorStore((s) => s.setDonor);
  const [tab, setTab] = useState<Tab>("register");

  async function handleSuccess(donor: Donor, token: string) {
    setDonor(donor, token);
    const socket = connectSocket();
    socket.emit("donor:online", { bloodType: donor.bloodType });

    // We are still inside the user-gesture call stack (form submit → handleSuccess).
    // Request permission now so the browser shows the popup immediately without
    // requiring the user to find and click the banner on the dashboard.
    if (isPushSupported() && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        saveDonorSubscription().catch(() => null);
      }
    }

    navigate("/dashboard");
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start py-4">
      <div>
        <span
          className="inline-flex items-center gap-2 font-mono text-[12px] font-medium uppercase tracking-[0.08em] mb-5"
          style={{ color: "#C8102E" }}
        >
          <span className="inline-block w-5.5 flex-none" style={{ height: 1.5, background: "#C8102E" }} />
          Donor Portal
        </span>
        <h1
          className="font-display font-semibold mb-6"
          style={{ fontSize: "clamp(28px, 3.6vw, 42px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#231518" }}
        >
          {tab === "register" ? (
            <>Register once,<br />save lives forever.</>
          ) : (
            <>Welcome back.<br />Pick up where you left off.</>
          )}
        </h1>

        <TabSwitcher active={tab} onChange={setTab} />

        {tab === "register" ? (
          <RegisterForm onSuccess={handleSuccess} onSwitchToReturn={() => setTab("returning")} />
        ) : (
          <ReturnForm onSuccess={handleSuccess} onSwitchToRegister={() => setTab("register")} />
        )}
      </div>

      <DonorPerks />
    </div>
  );
}

export default RegisterDonor;

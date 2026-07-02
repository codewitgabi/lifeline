import { useState } from "react";
import { Bell, BellOff, X } from "lucide-react";
import { isPushSupported, currentPermission, saveDonorSubscription } from "../../utils/push";

type State = "idle" | "loading" | "done" | "dismissed";

function PushPromptBanner() {
  const [state, setState] = useState<State>("idle");

  // Hard guards — never render if unsupported or already granted
  if (!isPushSupported()) return null;
  if (state === "done" || state === "dismissed") return null;
  if (currentPermission() === "granted") return null;

  // Permission was previously blocked — show how to unblock
  if (currentPermission() === "denied") {
    return (
      <div
        className="flex items-center gap-3 rounded-[14px] px-4 py-3.5 mb-5"
        style={{ background: "#F7E9EB", border: "1px solid #EBD9DC" }}
      >
        <span
          className="flex-none flex items-center justify-center w-7 h-7 rounded-full"
          style={{ background: "#EBD9DC" }}
        >
          <BellOff className="w-3.5 h-3.5" style={{ color: "#C8102E" }} />
        </span>
        <p className="text-[12.5px] flex-1" style={{ color: "#6E5A5E" }}>
          Notifications are blocked for this site. To enable:{" "}
          <span style={{ color: "#231518", fontWeight: 500 }}>
            click the lock icon in your browser's address bar → Site settings → Notifications → Allow.
          </span>
        </p>
        <button
          onClick={() => setState("dismissed")}
          className="flex-none p-1 rounded-[6px]"
          style={{ color: "#6E5A5E" }}
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // permission === "default" — ask the user
  async function handleEnable() {
    setState("loading");

    // ← requestPermission MUST be called directly here, as the first async
    //   operation inside a user-gesture handler. Putting it inside a helper
    //   function further down the call chain risks the browser treating it
    //   as non-gesture-gated and silently denying it.
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      // User clicked Block or dismissed — component will re-render and show
      // the "denied" UI on the next paint because currentPermission() changed.
      setState("idle");
      return;
    }

    // Permission granted — now set up the actual push subscription
    try {
      await saveDonorSubscription();
    } catch (err) {
      console.warn("[push] Subscription failed after permission grant:", err);
    }

    setState("done");
  }

  return (
    <div
      className="flex items-start sm:items-center justify-between gap-3 rounded-[14px] px-4 py-3.5 mb-5"
      style={{ background: "#F7E9EB", border: "1px solid #EBD9DC" }}
    >
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <span
          className="flex-none flex items-center justify-center w-8 h-8 rounded-full mt-0.5 sm:mt-0"
          style={{ background: "#C8102E" }}
        >
          <Bell className="w-4 h-4" style={{ color: "white" }} />
        </span>
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold" style={{ color: "#231518" }}>
            Get alerted when blood is needed nearby
          </p>
          <p className="text-[12.5px] mt-0.5" style={{ color: "#6E5A5E" }}>
            Push notifications reach you even when this tab is closed.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-none">
        <button
          onClick={handleEnable}
          disabled={state === "loading"}
          className="font-mono text-[12px] font-semibold px-3.5 py-1.5 rounded-[8px] transition-opacity disabled:opacity-60 whitespace-nowrap"
          style={{ background: "#C8102E", color: "white" }}
        >
          {state === "loading" ? "Enabling…" : "Enable"}
        </button>
        <button
          onClick={() => setState("dismissed")}
          className="p-1 rounded-[6px] transition-colors"
          style={{ color: "#6E5A5E" }}
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default PushPromptBanner;

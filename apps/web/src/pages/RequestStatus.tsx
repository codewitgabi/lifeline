import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import type { BloodRequest, Responder } from "@lifeline/shared";
import { api } from "../lib/api";
import { connectSocket } from "../lib/socket";
import { useActiveRequestStore } from "../store/activeRequestStore";
import { subscribeRequestPush } from "../utils/push";
import RequestSummaryCard from "../components/request-status/RequestSummaryCard";
import SearchingCard from "../components/request-status/SearchingCard";
import NotifiedCard from "../components/request-status/NotifiedCard";
import WaitingCard from "../components/request-status/WaitingCard";
import ResponderList from "../components/request-status/ResponderList";
import CloseRequestCard from "../components/request-status/CloseRequestCard";
import FulfilledBanner from "../components/request-status/FulfilledBanner";

type Phase = "searching" | "notified" | "responded";

function RequestStatus() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const donorsNotified: number =
    (location.state as { donorsNotified?: number })?.donorsNotified ?? 0;

  const { active, clearActive } = useActiveRequestStore();
  const isOwner = active?.id === id;

  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [responders, setResponders] = useState<Responder[]>([]);
  const [phase, setPhase] = useState<Phase>(donorsNotified > 0 ? "notified" : "searching");
  const [radiusStep, setRadiusStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fulfilling, setFulfilling] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Subscribe so the requester gets a push when a donor responds, even if tab closes
    subscribeRequestPush(id).catch(() => null);

    api
      .get<BloodRequest>(`/api/requests/${id}`)
      .then((r) => {
        setRequest(r);
        if (r.status === "fulfilled") clearActive();
        if (r.responders.length > 0) {
          setResponders(r.responders);
          setPhase("responded");
        }
      })
      .catch(() => setError("Request not found."))
      .finally(() => setLoading(false));

    const t1 = setTimeout(() => setRadiusStep(1), 6_000);
    const t2 = setTimeout(() => {
      setRadiusStep(2);
      setPhase((p) => (p === "searching" ? "notified" : p));
    }, 12_000);

    const socket = connectSocket();
    socket.emit("request:watch", { requestId: id });
    socket.on("request:accepted", (responder: Responder) => {
      setResponders((prev) => [responder, ...prev]);
      setPhase("responded");
    });
    socket.on("request:fulfilled", ({ requestId }: { requestId: string }) => {
      if (requestId === id) {
        setRequest((r) => (r ? { ...r, status: "fulfilled" } : r));
        clearActive();
      }
    });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      socket.off("request:accepted");
      socket.off("request:fulfilled");
    };
  }, [id]);

  async function handleFulfill() {
    if (!id) return;
    setFulfilling(true);
    try {
      await api.post(`/api/requests/${id}/fulfill`, {});
      setRequest((r) => (r ? { ...r, status: "fulfilled" } : r));
      clearActive();
      setConfirmClose(false);
    } catch {
      // socket event will also update state
    } finally {
      setFulfilling(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader className="w-6 h-6 animate-spin" style={{ color: "#C8102E" }} />
        <p className="font-mono text-[12.5px]" style={{ color: "#6E5A5E" }}>Loading request…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <p className="font-semibold" style={{ color: "#C8102E" }}>{error}</p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 font-mono text-[12.5px] transition-colors"
          style={{ color: "#6E5A5E" }}
        >
          <ArrowLeft className="w-4 h-4" /> Go home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 font-mono text-[12.5px] transition-colors mb-6"
        style={{ color: "#6E5A5E" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {request && <RequestSummaryCard request={request} />}
      {phase === "searching" && <SearchingCard radiusStep={radiusStep} />}
      {phase !== "searching" && <NotifiedCard donorsNotified={donorsNotified} radiusStep={radiusStep} />}
      {responders.length > 0 && <ResponderList responders={responders} />}
      {phase === "notified" && responders.length === 0 && <WaitingCard />}

      {isOwner && request && request.status !== "fulfilled" && (
        <CloseRequestCard
          confirmClose={confirmClose}
          fulfilling={fulfilling}
          onInitConfirm={() => setConfirmClose(true)}
          onConfirm={handleFulfill}
          onCancel={() => setConfirmClose(false)}
        />
      )}

      {request?.status === "fulfilled" && <FulfilledBanner />}
    </div>
  );
}

export default RequestStatus;

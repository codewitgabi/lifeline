import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import type { BloodRequest, Urgency } from "@lifeline/shared";
import { api } from "../lib/api";
import { connectSocket } from "../lib/socket";
import { useDonorStore } from "../store/donorStore";
import { useRequestStore } from "../store/requestStore";
import RequestCard from "../components/RequestCard";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import FilterTabs from "../components/dashboard/FilterTabs";
import EmptyState from "../components/dashboard/EmptyState";
import PushPromptBanner from "../components/dashboard/PushPromptBanner";

const FILTERS = ["all", "critical", "urgent", "standard"] as const;
type FilterType = (typeof FILTERS)[number];

const urgencyOrder: Record<Urgency, number> = { critical: 0, urgent: 1, standard: 2 };

function DonorDashboard() {
  const donor = useDonorStore((s) => s.donor);
  const { requests, setRequests, addRequest, removeRequest } = useRequestStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!donor) return;
    fetchRequests();
    const socket = connectSocket();
    socket.emit("donor:online", { bloodType: donor.bloodType });
    setIsLive(socket.connected);
    socket.on("connect", () => setIsLive(true));
    socket.on("disconnect", () => setIsLive(false));
    socket.on("request:new", (req: BloodRequest) => addRequest(req));
    socket.on("request:fulfilled", ({ requestId }: { requestId: string }) => removeRequest(requestId));
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("request:new");
      socket.off("request:fulfilled");
    };
  }, [donor]);

  if (!donor) return <Navigate to="/" replace />;

  async function fetchRequests() {
    if (!donor) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.get<BloodRequest[]>("/api/requests/nearby");
      setRequests(data);
    } catch {
      setError("Failed to load requests. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRespond(requestId: string) {
    if (!donor) return;
    setRespondingId(requestId);
    try {
      await api.post(`/api/requests/${requestId}/respond`, {});
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to respond.");
    } finally {
      setRespondingId(null);
    }
  }

  const active = requests
    .filter((r) => new Date(r.expiresAt) > new Date())
    .filter((r) => filter === "all" || r.urgency === filter)
    .sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency] || (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));

  const counts = {
    all: requests.filter((r) => new Date(r.expiresAt) > new Date()).length,
    critical: requests.filter((r) => r.urgency === "critical" && new Date(r.expiresAt) > new Date()).length,
    urgent: requests.filter((r) => r.urgency === "urgent" && new Date(r.expiresAt) > new Date()).length,
    standard: requests.filter((r) => r.urgency === "standard" && new Date(r.expiresAt) > new Date()).length,
  };

  return (
    <div>
      <DashboardHeader
        donor={donor}
        isLive={isLive}
        loading={loading}
        onRefresh={fetchRequests}
        onPostRequest={() => navigate("/request/new")}
      />
      <PushPromptBanner />
      <FilterTabs filter={filter} counts={counts} onChange={setFilter} />

      {error && (
        <div
          className="rounded-[14px] px-4 py-3 mb-6 text-sm font-medium"
          style={{ background: "#F7E9EB", border: "1px solid #EBD9DC", color: "#C8102E" }}
        >
          {error}
        </div>
      )}

      {loading && requests.length === 0 && <EmptyState filter={filter} loading={true} />}
      {!loading && active.length === 0 && <EmptyState filter={filter} loading={false} />}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {active.map((req) => (
          <RequestCard
            key={req._id}
            request={req}
            onRespond={handleRespond}
            responding={respondingId === req._id}
          />
        ))}
      </div>
    </div>
  );
}

export default DonorDashboard;

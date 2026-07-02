import { create } from "zustand";
import type { BloodRequest } from "@lifeline/shared";

interface RequestState {
  requests: BloodRequest[];
  setRequests: (requests: BloodRequest[]) => void;
  addRequest: (request: BloodRequest) => void;
  removeRequest: (id: string) => void;
  updateRequest: (id: string, patch: Partial<BloodRequest>) => void;
}

export const useRequestStore = create<RequestState>()((set) => ({
  requests: [],
  setRequests: (requests) => set({ requests }),
  addRequest: (request) => set((s) => ({ requests: [request, ...s.requests] })),
  removeRequest: (id) =>
    set((s) => ({ requests: s.requests.filter((r) => r._id !== id) })),
  updateRequest: (id, patch) =>
    set((s) => ({
      requests: s.requests.map((r) => (r._id === id ? { ...r, ...patch } : r)),
    })),
}));

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BloodType, Urgency } from "@lifeline/shared";

export interface StoredRequest {
  id: string;
  bloodType: BloodType;
  urgency: Urgency;
  hospitalName: string;
  requesterName: string;
  requesterPhone: string;
  expiresAt: string;
  donorsNotified: number;
}

interface ActiveRequestState {
  active: StoredRequest | null;
  setActive: (r: StoredRequest) => void;
  clearActive: () => void;
}

export const useActiveRequestStore = create<ActiveRequestState>()(
  persist(
    (set) => ({
      active: null,
      setActive: (active) => set({ active }),
      clearActive: () => set({ active: null }),
    }),
    { name: "lifeline-active-request" },
  ),
);

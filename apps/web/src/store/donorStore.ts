import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Donor } from "@lifeline/shared";

interface DonorState {
  donor: Donor | null;
  token: string | null;
  setDonor: (donor: Donor, token: string) => void;
  updateAvailability: (available: boolean) => void;
  clearDonor: () => void;
}

export const useDonorStore = create<DonorState>()(
  persist(
    (set) => ({
      donor: null,
      token: null,
      setDonor: (donor, token) => set({ donor, token }),
      updateAvailability: (available) =>
        set((s) => (s.donor ? { donor: { ...s.donor, available } } : {})),
      clearDonor: () => set({ donor: null, token: null }),
    }),
    { name: "lifeline-donor" },
  ),
);

export function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem("lifeline-donor");
    if (!raw) return null;
    return (JSON.parse(raw) as { state?: { token?: string } }).state?.token ?? null;
  } catch {
    return null;
  }
}

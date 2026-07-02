import type { BloodType } from "@lifeline/shared";

export const BLOOD_TYPES: BloodType[] = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

export function d(t: string) {
  return t.replace("-", "−");
}

export function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

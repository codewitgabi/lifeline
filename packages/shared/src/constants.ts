export const BLOOD_TYPES = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const URGENCY_LEVELS = ["critical", "urgent", "standard"] as const;

export const SEARCH_RADII_METERS = [5_000, 15_000, 50_000] as const;

export const EXPIRY_HOURS: Record<Urgency, number> = {
  critical: 6,
  urgent: 12,
  standard: 24,
};

export const MIN_DONORS_BEFORE_EXPAND = 5;

export type BloodType = (typeof BLOOD_TYPES)[number];
export type Urgency = (typeof URGENCY_LEVELS)[number];

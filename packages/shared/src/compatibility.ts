import type { BloodType } from "./constants";

export const CAN_RECEIVE_FROM: Record<BloodType, BloodType[]> = {
  "O-": ["O-"],
  "O+": ["O-", "O+"],
  "A-": ["O-", "A-"],
  "A+": ["O-", "O+", "A-", "A+"],
  "B-": ["O-", "B-"],
  "B+": ["O-", "O+", "B-", "B+"],
  "AB-": ["O-", "A-", "B-", "AB-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
};

export function compatibleDonorsFor(requestedType: BloodType): BloodType[] {
  return CAN_RECEIVE_FROM[requestedType] ?? [];
}

export function canDonateToRequest(
  donorType: BloodType,
  requestedType: BloodType,
): boolean {
  return CAN_RECEIVE_FROM[requestedType]?.includes(donorType) ?? false;
}

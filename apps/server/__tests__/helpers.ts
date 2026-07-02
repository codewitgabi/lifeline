import supertest from "supertest";
import { createApp } from "../createApp";
import { signToken } from "../utils/token";
import Donor from "../models/donor.model";
import Request from "../models/request.model";
import type { BloodType, Urgency } from "@lifeline/shared";

export const app = createApp();
export const api = supertest(app);

export const LAGOS_COORDS = {
  type: "Point" as const,
  coordinates: [3.3792, 6.5244] as [number, number],
};

export const NEARBY_COORDS = {
  type: "Point" as const,
  coordinates: [3.3800, 6.5200] as [number, number],
};

interface DonorOverrides {
  name?: string;
  phone?: string;
  bloodType?: BloodType;
  location?: typeof LAGOS_COORDS;
}

export async function createDonor(overrides: DonorOverrides = {}) {
  const donor = await Donor.create({
    name: overrides.name ?? "Test Donor",
    phone: overrides.phone ?? "+2348000000001",
    bloodType: overrides.bloodType ?? "O+",
    location: overrides.location ?? LAGOS_COORDS,
  });
  const token = signToken(String(donor._id));
  return { donor, token };
}

interface RequestOverrides {
  bloodType?: BloodType;
  urgency?: Urgency;
  requesterPhone?: string;
  location?: typeof LAGOS_COORDS;
  expiresAt?: Date;
}

export async function createRequest(overrides: RequestOverrides = {}) {
  return Request.create({
    bloodType: overrides.bloodType ?? "A+",
    unitsNeeded: 1,
    urgency: overrides.urgency ?? "urgent",
    hospitalName: "Test General Hospital",
    requesterName: "Test Requester",
    requesterPhone: overrides.requesterPhone ?? "+2349000000099",
    location: overrides.location ?? NEARBY_COORDS,
    expiresAt: overrides.expiresAt ?? new Date(Date.now() + 6 * 60 * 60 * 1000),
  });
}

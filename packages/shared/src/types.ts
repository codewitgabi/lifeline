import type { BloodType, Urgency } from "./constants";

export interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}

export interface Donor {
  _id: string;
  name: string;
  phone: string;
  bloodType: BloodType;
  available: boolean;
  location: GeoPoint;
  lastDonatedAt: string | null;
  createdAt: string;
}

export interface Responder {
  donorId: string;
  respondedAt: string;
  donorName?: string;
  bloodType?: BloodType;
  distanceMeters?: number;
  phone?: string;
}

export interface BloodRequest {
  _id: string;
  bloodType: BloodType;
  unitsNeeded: number;
  urgency: Urgency;
  hospitalName: string;
  requesterName: string;
  requesterPhone: string;
  location: GeoPoint;
  notes?: string;
  status: "open" | "matched" | "fulfilled";
  responders: Responder[];
  expiresAt: string;
  createdAt: string;
  distanceMeters?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

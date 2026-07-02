import mongoose, { Schema, Document, Model } from "mongoose";
import { BLOOD_TYPES, URGENCY_LEVELS } from "@lifeline/shared";
import type { BloodType, Urgency } from "@lifeline/shared";

export interface IResponder {
  donorId: mongoose.Types.ObjectId;
  donorName: string;
  phone: string;
  bloodType: string;
  respondedAt: Date;
}

export interface IRequest extends Document {
  bloodType: BloodType;
  unitsNeeded: number;
  urgency: Urgency;
  hospitalName: string;
  requesterName: string;
  requesterPhone: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  notes?: string;
  status: "open" | "matched" | "fulfilled";
  responders: IResponder[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const requestSchema = new Schema<IRequest>(
  {
    bloodType: { type: String, required: true, enum: BLOOD_TYPES },
    unitsNeeded: { type: Number, required: true, min: 1, max: 10 },
    urgency: { type: String, required: true, enum: URGENCY_LEVELS },
    hospitalName: { type: String, required: true, trim: true },
    requesterName: { type: String, required: true, trim: true },
    requesterPhone: { type: String, required: true, trim: true },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    notes: { type: String, trim: true, maxlength: 280 },
    status: {
      type: String,
      enum: ["open", "matched", "fulfilled"],
      default: "open",
    },
    responders: [
      {
        donorId: { type: Schema.Types.ObjectId, ref: "Donor", required: true },
        donorName: { type: String, required: true },
        phone: { type: String, required: true },
        bloodType: { type: String, required: true },
        respondedAt: { type: Date, default: Date.now },
      },
    ],
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

requestSchema.index({ location: "2dsphere" });
requestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Request: Model<IRequest> = mongoose.model<IRequest>(
  "Request",
  requestSchema,
);
export default Request;

import mongoose, { Schema, Document, Model } from "mongoose";
import { BLOOD_TYPES } from "@lifeline/shared";
import type { BloodType } from "@lifeline/shared";

export interface IDonor extends Document {
  name: string;
  phone: string;
  bloodType: BloodType;
  available: boolean;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  lastDonatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const donorSchema = new Schema<IDonor>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    bloodType: { type: String, required: true, enum: BLOOD_TYPES },
    available: { type: Boolean, default: true },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    lastDonatedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

donorSchema.index({ location: "2dsphere" });

const Donor: Model<IDonor> = mongoose.model<IDonor>("Donor", donorSchema);
export default Donor;

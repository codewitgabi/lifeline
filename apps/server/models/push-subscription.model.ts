import mongoose, { Document, Schema } from "mongoose";

export interface IPushSubscription extends Document {
  endpoint: string;
  keys: { auth: string; p256dh: string };
  donorId?: mongoose.Types.ObjectId;
  requestId?: mongoose.Types.ObjectId;
}

const PushSubscriptionSchema = new Schema<IPushSubscription>(
  {
    endpoint: { type: String, required: true, unique: true },
    keys: {
      auth: { type: String, required: true },
      p256dh: { type: String, required: true },
    },
    donorId: { type: Schema.Types.ObjectId, ref: "Donor", index: true },
    requestId: { type: Schema.Types.ObjectId, ref: "Request", index: true },
  },
  { timestamps: true },
);

export default mongoose.model<IPushSubscription>("PushSubscription", PushSubscriptionSchema);

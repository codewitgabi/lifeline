import webpush, { WebPushError } from "web-push";
import mongoose from "mongoose";
import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL } from "../utils/constants";
import PushSubscription from "../models/push-subscription.model";
import Donor from "../models/donor.model";
import Request from "../models/request.model";
import { compatibleDonorsFor } from "@lifeline/shared";
import type { BloodType } from "@lifeline/shared";
import sysLogger from "../utils/logger";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(`mailto:${VAPID_EMAIL}`, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export interface PushPayload {
  title: string;
  body: string;
  icon: string;
  badge: string;
  tag: string;
  requireInteraction: boolean;
  data: { url: string };
  actions?: { action: string; title: string }[];
}

async function send(
  sub: { endpoint: string; keys: { auth: string; p256dh: string } },
  payload: PushPayload,
): Promise<void> {
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: sub.keys },
      JSON.stringify(payload),
      { TTL: 60 * 60 * 24 }, // 24-hour TTL
    );
  } catch (err) {
    const wpErr = err as WebPushError;
    // 410 Gone / 404 Not Found: subscription is dead — purge it
    if (wpErr.statusCode === 410 || wpErr.statusCode === 404) {
      await PushSubscription.deleteOne({ endpoint: sub.endpoint });
    } else {
      sysLogger.warn(`Push send failed (${wpErr.statusCode}): ${wpErr.message}`);
    }
  }
}

export async function notifyNearbyDonors(requestId: string): Promise<void> {
  if (!VAPID_PUBLIC_KEY) return;

  const req = await Request.findById(requestId).lean();
  if (!req) return;

  const compatibleTypes = compatibleDonorsFor(req.bloodType as BloodType);

  // Find available, compatible donors within 50 km who have a push subscription
  const nearbyDonors = await Donor.find({
    bloodType: { $in: compatibleTypes },
    available: true,
    location: {
      $nearSphere: {
        $geometry: req.location,
        $maxDistance: 50_000,
      },
    },
  })
    .select("_id")
    .lean();

  if (nearbyDonors.length === 0) return;

  const donorIds = nearbyDonors.map((d) => d._id);
  const subs = await PushSubscription.find({ donorId: { $in: donorIds } }).lean();
  if (subs.length === 0) return;

  const urgencyLabel =
    req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1);

  const payload: PushPayload = {
    title: "🩸 Blood Needed Nearby",
    body: `${req.bloodType} blood needed at ${req.hospitalName} — ${urgencyLabel}`,
    icon: "/icons/notification-icon-192.svg",
    badge: "/icons/badge-72.svg",
    tag: `request-${req._id}`,
    requireInteraction: req.urgency === "critical",
    data: { url: "/dashboard" },
    actions: [{ action: "view", title: "View on Dashboard" }],
  };

  await Promise.allSettled(subs.map((s) => send(s, payload)));
}

export async function notifyRequestOwner(
  requestId: string,
  donorName: string,
  donorBloodType: string,
): Promise<void> {
  if (!VAPID_PUBLIC_KEY) return;

  const subs = await PushSubscription.find({
    requestId: new mongoose.Types.ObjectId(requestId),
  }).lean();

  if (subs.length === 0) return;

  const req = await Request.findById(requestId).select("hospitalName").lean();

  const payload: PushPayload = {
    title: "✅ A Donor Is On Their Way",
    body: `${donorName} (${donorBloodType}) is heading to ${req?.hospitalName ?? "the hospital"}`,
    icon: "/icons/notification-icon-192.svg",
    badge: "/icons/badge-72.svg",
    tag: `donor-${requestId}`,
    requireInteraction: true,
    data: { url: `/request/${requestId}` },
    actions: [{ action: "view", title: "View Details" }],
  };

  await Promise.allSettled(subs.map((s) => send(s, payload)));
}

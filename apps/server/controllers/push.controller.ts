import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catch-async";
import PushSubscription from "../models/push-subscription.model";
import { SuccessResponse } from "../utils/response";
import { VAPID_PUBLIC_KEY } from "../utils/constants";

export const getVapidPublicKey = (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(
    SuccessResponse({ message: "VAPID public key", data: { key: VAPID_PUBLIC_KEY } }),
  );
};

// POST /api/push/subscribe  — requires auth (donor push)
export const subscribeDonor = catchAsync(async (req: Request, res: Response) => {
  const { endpoint, keys } = req.body as {
    endpoint: string;
    keys: { auth: string; p256dh: string };
  };
  const donorId = req.donor._id;

  await PushSubscription.findOneAndUpdate(
    { endpoint },
    { endpoint, keys, donorId, requestId: undefined },
    { upsert: true, new: true },
  );

  res.status(StatusCodes.OK).json(
    SuccessResponse({ message: "Push subscription saved", data: null }),
  );
});

// POST /api/push/subscribe-request  — no auth (requester watches their own request)
export const subscribeRequest = catchAsync(async (req: Request, res: Response) => {
  const { endpoint, keys, requestId } = req.body as {
    endpoint: string;
    keys: { auth: string; p256dh: string };
    requestId: string;
  };

  await PushSubscription.findOneAndUpdate(
    { endpoint },
    { endpoint, keys, requestId, donorId: undefined },
    { upsert: true, new: true },
  );

  res.status(StatusCodes.OK).json(
    SuccessResponse({ message: "Push subscription saved", data: null }),
  );
});

// DELETE /api/push/unsubscribe
export const unsubscribe = catchAsync(async (req: Request, res: Response) => {
  const { endpoint } = req.body as { endpoint: string };
  await PushSubscription.deleteOne({ endpoint });
  res.status(StatusCodes.OK).json(SuccessResponse({ message: "Unsubscribed", data: null }));
});

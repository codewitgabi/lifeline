import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catch-async";
import requestService from "../services/request.service";
import { SuccessResponse } from "../utils/response";
import { getIo } from "../sockets";
import { compatibleDonorsFor } from "@lifeline/shared";
import type { BloodType } from "@lifeline/shared";

export const createRequest = catchAsync(async (req: Request, res: Response) => {
  const { request, donors } = await requestService.create(req.body);

  // Broadcast to all compatible blood-type rooms
  const io = getIo();
  const compatibleTypes = compatibleDonorsFor(request.bloodType as BloodType);
  const payload = request.toObject();

  for (const bloodType of compatibleTypes) {
    io.to(`donors:${bloodType}`).emit("request:new", payload);
  }

  res.status(StatusCodes.CREATED).json(
    SuccessResponse({
      message: "Blood request posted successfully",
      data: { request, donorsNotified: donors.length },
    }),
  );
});

export const getNearbyRequests = catchAsync(
  async (req: Request, res: Response) => {
    const requests = await requestService.findNearby(String(req.donor._id));

    res.status(StatusCodes.OK).json(
      SuccessResponse({
        message: "Nearby requests retrieved",
        data: requests,
      }),
    );
  },
);

export const lookupRequest = catchAsync(async (req: Request, res: Response) => {
  const request = await requestService.findByRequesterPhone(req.body.phone as string);
  if (!request) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "No active request found for that phone number.",
    });
    return;
  }

  res.status(StatusCodes.OK).json(
    SuccessResponse({ message: "Request found", data: request }),
  );
});

export const getRequest = catchAsync(async (req: Request, res: Response) => {
  const request = await requestService.findById(req.params.id as string);

  res.status(StatusCodes.OK).json(
    SuccessResponse({
      message: "Request retrieved successfully",
      data: request,
    }),
  );
});

export const respondToRequest = catchAsync(
  async (req: Request, res: Response) => {
    const { request, donor } = await requestService.respond(
      req.params.id as string,
      String(req.donor._id),
    );

    // Notify the requester's room
    const io = getIo();
    io.to(`request:${request._id}`).emit("request:accepted", {
      donorId: donor._id,
      donorName: donor.name,
      bloodType: donor.bloodType,
      phone: donor.phone,
    });

    res.status(StatusCodes.OK).json(
      SuccessResponse({
        message: "Response recorded. Contact details shared.",
        data: {
          requesterPhone: request.requesterPhone,
          requesterName: request.requesterName,
          hospitalName: request.hospitalName,
        },
      }),
    );
  },
);

export const fulfillRequest = catchAsync(
  async (req: Request, res: Response) => {
    const request = await requestService.fulfill(req.params.id as string);

    // Notify all compatible donor rooms to remove the card
    const io = getIo();
    const compatibleTypes = compatibleDonorsFor(request.bloodType as BloodType);
    for (const bloodType of compatibleTypes) {
      io.to(`donors:${bloodType}`).emit("request:fulfilled", {
        requestId: request._id,
      });
    }

    res.status(StatusCodes.OK).json(
      SuccessResponse({
        message: "Request marked as fulfilled",
        data: request,
      }),
    );
  },
);

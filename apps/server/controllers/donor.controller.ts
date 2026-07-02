import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catch-async";
import donorService from "../services/donor.service";
import { SuccessResponse } from "../utils/response";
import { NotFoundError, UnauthorizedError } from "../utils/api.errors";
import { signToken } from "../utils/token";

export const registerDonor = catchAsync(async (req: Request, res: Response) => {
  const { donor, created } = await donorService.register(req.body);
  const token = signToken(String(donor._id));

  res.status(created ? StatusCodes.CREATED : StatusCodes.OK).json(
    SuccessResponse({
      message: created ? "Donor registered successfully" : "Welcome back",
      data: { donor, token },
    }),
  );
});

export const lookupDonor = catchAsync(async (req: Request, res: Response) => {
  const donor = await donorService.findByPhone(req.body.phone);
  if (!donor) throw new NotFoundError("No account found with that phone number.");

  const token = signToken(String(donor._id));

  res.status(StatusCodes.OK).json(
    SuccessResponse({ message: "Donor found", data: { donor, token } }),
  );
});

export const getDonor = catchAsync(async (req: Request, res: Response) => {
  const donor = await donorService.findById(req.params.id as string);

  res.status(StatusCodes.OK).json(
    SuccessResponse({ message: "Donor retrieved successfully", data: donor }),
  );
});

export const updateDonor = catchAsync(async (req: Request, res: Response) => {
  if (String(req.donor._id) !== req.params.id) {
    throw new UnauthorizedError("You can only update your own account.");
  }

  const donor = await donorService.update(req.params.id as string, req.body);

  res.status(StatusCodes.OK).json(
    SuccessResponse({ message: "Donor updated successfully", data: donor }),
  );
});

import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";
import Donor, { IDonor } from "../models/donor.model";
import { UnauthorizedError } from "../utils/api.errors";
import catchAsync from "../utils/catch-async";

declare global {
  namespace Express {
    interface Request {
      donor: IDonor;
    }
  }
}

export const authenticate = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authentication token required.");
    }

    const token = header.slice(7);
    let payload: { donorId: string };
    try {
      payload = verifyToken(token);
    } catch {
      throw new UnauthorizedError("Invalid or expired token.");
    }

    const donor = await Donor.findById(payload.donorId);
    if (!donor) throw new UnauthorizedError("Donor account not found.");

    req.donor = donor;
    next();
  },
);

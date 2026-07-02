import mongoose from "mongoose";
import Request, { IRequest } from "../models/request.model";
import Donor, { IDonor } from "../models/donor.model";
import matchingService, { MatchedDonor } from "./matching.service";
import { NotFoundError, BadRequestError } from "../utils/api.errors";
import {
  BLOOD_TYPES,
  canDonateToRequest,
  EXPIRY_HOURS,
} from "@lifeline/shared";
import type { BloodType, Urgency } from "@lifeline/shared";

interface CreateRequestDto {
  bloodType: BloodType;
  unitsNeeded: number;
  urgency: Urgency;
  hospitalName: string;
  requesterName: string;
  requesterPhone: string;
  location: { type: "Point"; coordinates: [number, number] };
  notes?: string;
}

interface RespondResult {
  request: IRequest;
  donor: IDonor;
}

class RequestService {
  async create(
    data: CreateRequestDto,
  ): Promise<{ request: IRequest; donors: MatchedDonor[] }> {
    const expiresAt = new Date(
      Date.now() + EXPIRY_HOURS[data.urgency] * 60 * 60 * 1000,
    );

    const request = await Request.create({ ...data, expiresAt });
    const { donors } = await matchingService.findCompatibleDonors(
      data.bloodType,
      data.location.coordinates,
    );

    return { request, donors };
  }

  async findNearby(
    donorId: string,
  ): Promise<(IRequest & { distanceMeters: number })[]> {
    const donor = await Donor.findById(donorId);
    if (!donor) throw new NotFoundError("Donor not found");

    // Blood types whose requests this donor can respond to
    const compatibleTypes = [...BLOOD_TYPES].filter((t) =>
      canDonateToRequest(donor.bloodType, t),
    );

    return Request.aggregate([
      {
        $geoNear: {
          near: donor.location,
          distanceField: "distanceMeters",
          maxDistance: 50_000,
          query: {
            bloodType: { $in: compatibleTypes },
            status: "open",
            expiresAt: { $gt: new Date() },
          },
          spherical: true,
        },
      },
      {
        $addFields: {
          urgencyOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$urgency", "critical"] }, then: 0 },
                { case: { $eq: ["$urgency", "urgent"] }, then: 1 },
                { case: { $eq: ["$urgency", "standard"] }, then: 2 },
              ],
              default: 3,
            },
          },
        },
      },
      { $sort: { urgencyOrder: 1, distanceMeters: 1 } },
      { $limit: 50 },
    ]);
  }

  async findByRequesterPhone(phone: string): Promise<IRequest | null> {
    return Request.findOne({
      requesterPhone: phone.trim(),
      status: { $in: ["open", "matched"] },
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IRequest> {
    const request = await Request.findById(id);
    if (!request) throw new NotFoundError("Request not found");
    return request;
  }

  async respond(requestId: string, donorId: string): Promise<RespondResult> {
    const donor = await Donor.findById(donorId);
    if (!donor) throw new NotFoundError("Donor not found");

    const request = await Request.findOneAndUpdate(
      {
        _id: requestId,
        status: "open",
        "responders.donorId": { $ne: new mongoose.Types.ObjectId(donorId) },
      },
      {
        $push: {
          responders: {
            donorId,
            donorName: donor.name,
            phone: donor.phone,
            bloodType: donor.bloodType,
            respondedAt: new Date(),
          },
        },
        $set: { status: "matched" },
      },
      { new: true },
    );

    if (!request) {
      throw new BadRequestError(
        "This request is no longer available or you have already responded.",
      );
    }

    return { request, donor };
  }

  async fulfill(requestId: string): Promise<IRequest> {
    const request = await Request.findByIdAndUpdate(
      requestId,
      { $set: { status: "fulfilled" } },
      { new: true },
    );
    if (!request) throw new NotFoundError("Request not found");
    return request;
  }
}

export default new RequestService();

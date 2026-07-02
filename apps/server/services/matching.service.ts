import Donor, { IDonor } from "../models/donor.model";
import { compatibleDonorsFor } from "@lifeline/shared";
import type { BloodType } from "@lifeline/shared";

const RADII_METERS = [5_000, 15_000, 50_000] as const;
const MIN_DONORS_BEFORE_EXPAND = 5;

export interface MatchedDonor extends IDonor {
  distanceMeters: number;
}

class MatchingService {
  async findCompatibleDonors(
    bloodType: BloodType,
    coordinates: [number, number],
  ): Promise<{ donors: MatchedDonor[]; radiusUsed: number }> {
    const compatibleTypes = compatibleDonorsFor(bloodType);

    for (const radiusMeters of RADII_METERS) {
      const donors = await Donor.aggregate<MatchedDonor>([
        {
          $geoNear: {
            near: { type: "Point", coordinates },
            distanceField: "distanceMeters",
            maxDistance: radiusMeters,
            query: { bloodType: { $in: compatibleTypes }, available: true },
            spherical: true,
          },
        },
        { $limit: 50 },
      ]);

      const isLastRadius =
        radiusMeters === RADII_METERS[RADII_METERS.length - 1];
      if (donors.length >= MIN_DONORS_BEFORE_EXPAND || isLastRadius) {
        return { donors, radiusUsed: radiusMeters };
      }
    }

    return { donors: [], radiusUsed: RADII_METERS[0] };
  }
}

export default new MatchingService();

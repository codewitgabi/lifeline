import Donor, { IDonor } from "../models/donor.model";
import { NotFoundError } from "../utils/api.errors";
import type { BloodType } from "@lifeline/shared";

interface RegisterDonorDto {
  name: string;
  phone: string;
  bloodType: BloodType;
  location: { type: "Point"; coordinates: [number, number] };
}

interface UpdateDonorDto {
  available?: boolean;
  location?: { type: "Point"; coordinates: [number, number] };
}

class DonorService {
  async register(data: RegisterDonorDto): Promise<{ donor: IDonor; created: boolean }> {
    const existing = await Donor.findOne({ phone: data.phone });

    if (existing) {
      existing.name = data.name;
      existing.bloodType = data.bloodType;
      existing.location = data.location;
      existing.available = true;
      await existing.save();
      return { donor: existing, created: false };
    }

    const donor = await Donor.create(data);
    return { donor, created: true };
  }

  async findById(id: string): Promise<IDonor> {
    const donor = await Donor.findById(id);
    if (!donor) throw new NotFoundError("Donor not found");
    return donor;
  }

  async findByPhone(phone: string): Promise<IDonor | null> {
    return Donor.findOne({ phone: phone.trim() });
  }

  async update(id: string, patch: UpdateDonorDto): Promise<IDonor> {
    const donor = await Donor.findByIdAndUpdate(
      id,
      { $set: patch },
      { new: true },
    );
    if (!donor) throw new NotFoundError("Donor not found");
    return donor;
  }
}

export default new DonorService();

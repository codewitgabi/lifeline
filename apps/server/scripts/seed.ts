import mongoose from "mongoose";
import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(__dirname, "../.env") });

import Donor from "../models/donor.model";
import Request from "../models/request.model";
import type { BloodType, Urgency } from "@lifeline/shared";

// Lagos Island centre coordinates [lng, lat]
const CENTRE: [number, number] = [3.3792, 6.5244];

function offset(metres: number): [number, number] {
  const DEG_PER_METRE = 1 / 111_320;
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * metres;
  return [
    CENTRE[0] + Math.cos(angle) * distance * DEG_PER_METRE,
    CENTRE[1] + Math.sin(angle) * distance * DEG_PER_METRE,
  ];
}

// Realistic blood type distribution (roughly matches global averages)
const BLOOD_TYPE_POOL: BloodType[] = [
  "O+",
  "O+",
  "O+",
  "O+",
  "O+",
  "O+",
  "O+",
  "A+",
  "A+",
  "A+",
  "A+",
  "A+",
  "B+",
  "B+",
  "B+",
  "AB+",
  "AB+",
  "O-",
  "O-",
  "A-",
  "B-",
  "AB-",
];

const NAMES = [
  "Chukwuemeka Obi",
  "Adaeze Nwosu",
  "Babatunde Adeyemi",
  "Ngozi Eze",
  "Emeka Okafor",
  "Fatima Bello",
  "Oluwaseun Adesanya",
  "Chiamaka Igwe",
  "Tunde Fashola",
  "Amina Suleiman",
  "Kelechi Nnadi",
  "Blessing Okoro",
  "Seun Abiodun",
  "Chioma Obi",
  "Ibrahim Musa",
  "Yetunde Adeleke",
  "Femi Alabi",
  "Nkechi Eze",
  "Musa Abdullahi",
  "Sade Ogunleye",
  "Chidi Nwankwo",
  "Halima Garba",
  "Rotimi Afolabi",
  "Adunola Lawal",
  "Obiajulu Eze",
  "Zainab Danjuma",
  "Tokunbo Williams",
  "Onyinye Dike",
  "Adeyinka Coker",
  "Ifeanyi Okonkwo",
];

const HOSPITALS = [
  "Lagos University Teaching Hospital",
  "St. Nicholas Hospital, Lagos",
  "Ikeja General Hospital",
  "Lagos Island General Hospital",
  "Reddington Hospital",
  "Eko Hospital",
];

async function seed() {
  await mongoose.connect(process.env.DATABASE_URI as string);
  console.log("Connected to database");

  await Donor.deleteMany({});
  await Request.deleteMany({});
  console.log("Cleared existing data");

  // Seed donors — scattered 0.5 km to 20 km from centre
  const donors = await Donor.insertMany(
    NAMES.map((name, i) => ({
      name,
      phone: `+234 ${800_000_0000 + i}`.replace(/(\d{4})(\d{4})/, "$1 $2"),
      bloodType: BLOOD_TYPE_POOL[i % BLOOD_TYPE_POOL.length],
      available: true,
      location: {
        type: "Point",
        coordinates: offset(20_000),
      },
    })),
  );
  console.log(`Seeded ${donors.length} donors`);

  // Seed 3 open requests close to centre
  const requests: object[] = [
    {
      bloodType: "O-" as BloodType,
      unitsNeeded: 2,
      urgency: "critical" as Urgency,
      hospitalName: HOSPITALS[0],
      requesterName: "Dr. Amaka Nwosu",
      requesterPhone: "+234 802 000 0001",
      notes: "Post-surgical emergency. Patient in ICU.",
      location: { type: "Point", coordinates: offset(3_000) },
      status: "open",
      expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
    },
    {
      bloodType: "B+" as BloodType,
      unitsNeeded: 1,
      urgency: "urgent" as Urgency,
      hospitalName: HOSPITALS[2],
      requesterName: "Nurse Bello Rashida",
      requesterPhone: "+234 803 000 0002",
      location: { type: "Point", coordinates: offset(5_000) },
      status: "open",
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
    },
    {
      bloodType: "A+" as BloodType,
      unitsNeeded: 3,
      urgency: "standard" as Urgency,
      hospitalName: HOSPITALS[4],
      requesterName: "Tunde Okonkwo",
      requesterPhone: "+234 805 000 0003",
      notes: "Scheduled surgery on Friday.",
      location: { type: "Point", coordinates: offset(8_000) },
      status: "open",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  ];

  const seededRequests = await Request.insertMany(requests);
  console.log(`Seeded ${seededRequests.length} blood requests`);

  await mongoose.disconnect();
  console.log("Done. Database seeded successfully.");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

import { Router } from "express";
import { registerDonor, lookupDonor, updateDonor, getDonor } from "../controllers/donor.controller";
import { RegisterDonorSchema, LookupDonorSchema, UpdateDonorSchema } from "../validators/donor.validators";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", RegisterDonorSchema, registerDonor);
router.post("/lookup", LookupDonorSchema, lookupDonor);
router.get("/:id", getDonor);
router.patch("/:id", authenticate, UpdateDonorSchema, updateDonor);

export default router;

import { Router } from "express";
import {
  createRequest,
  getNearbyRequests,
  lookupRequest,
  getRequest,
  respondToRequest,
  fulfillRequest,
} from "../controllers/request.controller";
import {
  CreateRequestSchema,
  LookupRequestSchema,
  RespondSchema,
  FulfillSchema,
} from "../validators/request.validators";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", CreateRequestSchema, createRequest);
router.post("/lookup", LookupRequestSchema, lookupRequest);
router.get("/nearby", authenticate, getNearbyRequests);
router.get("/:id", getRequest);
router.post("/:id/respond", authenticate, RespondSchema, respondToRequest);
router.post("/:id/fulfill", FulfillSchema, fulfillRequest);

export default router;

import { Router } from "express";
import {
  getVapidPublicKey,
  subscribeDonor,
  subscribeRequest,
  unsubscribe,
} from "../controllers/push.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/vapid-key", getVapidPublicKey);
router.post("/subscribe", authenticate, subscribeDonor);
router.post("/subscribe-request", subscribeRequest);
router.delete("/unsubscribe", unsubscribe);

export default router;

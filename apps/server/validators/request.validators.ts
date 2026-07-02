import { body, param } from "express-validator";
import { BLOOD_TYPES, URGENCY_LEVELS } from "@lifeline/shared";
import { validateRequest } from "../middlewares/validation.middleware";

export const CreateRequestSchema = [
  body("bloodType")
    .notEmpty()
    .withMessage("Blood type is required")
    .isIn(BLOOD_TYPES)
    .withMessage(`Blood type must be one of: ${BLOOD_TYPES.join(", ")}`),

  body("unitsNeeded")
    .notEmpty()
    .withMessage("Units needed is required")
    .isInt({ min: 1, max: 10 })
    .withMessage("Units needed must be between 1 and 10"),

  body("urgency")
    .notEmpty()
    .withMessage("Urgency is required")
    .isIn(URGENCY_LEVELS)
    .withMessage(`Urgency must be one of: ${URGENCY_LEVELS.join(", ")}`),

  body("hospitalName")
    .trim()
    .notEmpty()
    .withMessage("Hospital name is required")
    .isLength({ max: 200 })
    .withMessage("Hospital name cannot exceed 200 characters"),

  body("requesterName")
    .trim()
    .notEmpty()
    .withMessage("Requester name is required"),

  body("requesterPhone")
    .trim()
    .notEmpty()
    .withMessage("Requester phone is required"),

  body("location.type")
    .equals("Point")
    .withMessage("Location type must be 'Point'"),

  body("location.coordinates")
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must be [longitude, latitude]"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 280 })
    .withMessage("Notes cannot exceed 280 characters"),

  validateRequest,
];

export const LookupRequestSchema = [
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  validateRequest,
];

export const RespondSchema = [
  param("id").isMongoId().withMessage("Invalid request ID"),
  validateRequest,
];

export const FulfillSchema = [
  param("id").isMongoId().withMessage("Invalid request ID"),
  validateRequest,
];

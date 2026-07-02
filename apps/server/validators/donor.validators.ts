import { body } from "express-validator";
import { BLOOD_TYPES } from "@lifeline/shared";
import { validateRequest } from "../middlewares/validation.middleware";

export const RegisterDonorSchema = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("phone").trim().notEmpty().withMessage("Phone number is required"),

  body("bloodType")
    .notEmpty()
    .withMessage("Blood type is required")
    .isIn(BLOOD_TYPES)
    .withMessage(`Blood type must be one of: ${BLOOD_TYPES.join(", ")}`),

  body("location.type")
    .equals("Point")
    .withMessage("Location type must be 'Point'"),

  body("location.coordinates")
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must be [longitude, latitude]"),

  body("location.coordinates.*")
    .isFloat()
    .withMessage("Coordinates must be valid numbers"),

  validateRequest,
];

export const LookupDonorSchema = [
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  validateRequest,
];

export const UpdateDonorSchema = [
  body("available")
    .optional()
    .isBoolean()
    .withMessage("Available must be a boolean"),

  body("location.coordinates")
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must be [longitude, latitude]"),

  validateRequest,
];

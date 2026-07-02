import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ValidationError } from "../utils/api.errors";

export const validateRequest = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError("Validation failed", errors.array()));
  }
  next();
};

import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "./constants";

export function signToken(donorId: string): string {
  return jwt.sign({ donorId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { donorId: string } {
  return jwt.verify(token, JWT_SECRET) as { donorId: string };
}

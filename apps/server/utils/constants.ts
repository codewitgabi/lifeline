import { config } from "dotenv";

config();

export const DATABASE_URI = process.env.DATABASE_URI as string;
export const PORT = process.env.PORT ?? "5000";
export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const CORS_ORIGINS = (process.env.CORS_ORIGINS ?? "http://localhost:5173").split(",");
export const JWT_SECRET = process.env.JWT_SECRET ?? "lifeline-dev-secret-change-in-prod";
export const JWT_EXPIRES_IN = "30d";

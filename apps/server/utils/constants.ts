import { config } from "dotenv";

config();

export const DATABASE_URI = process.env.DATABASE_URI as string;
export const PORT = process.env.PORT as string;

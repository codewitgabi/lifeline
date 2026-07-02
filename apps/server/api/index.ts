import { createApp } from "../createApp";
import connectDb from "../config/db.config";

const app = createApp();

// Each cold start needs a DB connection. Vercel reuses warm instances
// so connectDb is effectively called once per container lifecycle.
connectDb().catch(() => null);

export default app;

import express, { Express, Request, Response } from "express";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { StatusCodes } from "http-status-codes";
import { RequestErrorHandler, NotFoundErrorHandler } from "./middlewares/errors.middleware";
import { SuccessResponse } from "./utils/response";
import { CORS_ORIGINS, NODE_ENV } from "./utils/constants";
import donorRoutes from "./routes/donor.routes";
import requestRoutes from "./routes/request.routes";

export function createApp(): Express {
  const app = express();

  app.set("trust proxy", 1);
  app.use(cors({ origin: CORS_ORIGINS, credentials: true }));
  app.use(helmet());
  if (NODE_ENV !== "test") app.use(logger("combined"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());

  app.get("/api/health", (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).json(
      SuccessResponse({ message: "LifeLine API is running", data: { status: "ok" } }),
    );
  });

  app.use("/api/donors", donorRoutes);
  app.use("/api/requests", requestRoutes);

  app.use(NotFoundErrorHandler);
  app.use(RequestErrorHandler);

  return app;
}

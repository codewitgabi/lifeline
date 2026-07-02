import { createServer } from "http";
import express, { Express, Request, Response } from "express";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { StatusCodes } from "http-status-codes";

import connectDb from "./config/db.config";
import {
  RequestErrorHandler,
  NotFoundErrorHandler,
} from "./middlewares/errors.middleware";
import { SuccessResponse } from "./utils/response";
import { PORT, CORS_ORIGINS } from "./utils/constants";
import sysLogger from "./utils/logger";
import { initializeSockets } from "./sockets";

import donorRoutes from "./routes/donor.routes";
import requestRoutes from "./routes/request.routes";

const app: Express = express();
const httpServer = createServer(app);

app.set("trust proxy", 1);

app.use(cors({ origin: CORS_ORIGINS, credentials: true }));
app.use(helmet());
app.use(logger("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Routes
app.get("/api/health", (_req: Request, res: Response) => {
  res
    .status(StatusCodes.OK)
    .json(
      SuccessResponse({
        message: "LifeLine API is running",
        data: { status: "ok" },
      }),
    );
});

app.use("/api/donors", donorRoutes);
app.use("/api/requests", requestRoutes);

// Error handlers
app.use(NotFoundErrorHandler);
app.use(RequestErrorHandler);

// Bootstrap
(() => {
  connectDb()
    .then(() => {
      sysLogger.info("Database connected");
      initializeSockets(httpServer);

      httpServer.listen(PORT, () => {
        sysLogger.info(`Server running on port ${PORT}`);
      });
    })
    .catch((e) => {
      sysLogger.error(`Database connection failed: ${e}`);
      process.exit(1);
    });
})();

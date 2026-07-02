import express, { Express, Request, Response } from "express";
import logger from "morgan";
import connectDb from "./config/db.config";
import {
  RequestErrorHandler,
  NotFoundErrorHandler,
} from "./middlewares/errors.middleware";
import cors from "cors";
import { SuccessResponse } from "./utils/response";
import { StatusCodes } from "http-status-codes";
import compression from "compression";
import sysLogger from "./utils/logger";
import helmet from "helmet";
import { PORT } from "./utils/constants";

const app: Express = express();

// Trust proxy - required when behind reverse proxy (Vercel, AWS, nginx, etc.)
// This ensures express-rate-limit correctly identifies users by their real IP
app.set("trust proxy", 1);

const corsOrigin = ["http://localhost:3000"];

app.use(
  cors({
    origin: corsOrigin,
  }),
);

app.use(helmet());
app.use(logger("combined"));
app.set("port", PORT);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Routes

// app.use("/api/v1/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  const response = SuccessResponse({
    status: "success",
    message: "Lifeline API",
    data: null,
  });

  res.status(StatusCodes.OK).json(response);
});

// Middlewares

app.use(NotFoundErrorHandler);
app.use(RequestErrorHandler);

// Start server using IIFE

(() => {
  connectDb()
    .then(() => {
      sysLogger.info("Database connection successful");

      app.listen(app.get("port"), () => {
        sysLogger.info(`Server is running on port ${app.get("port")}`);
      });
    })
    .catch((e) => {
      sysLogger.error(`An error occurred connecting to database: ${e}`);
    });
})();

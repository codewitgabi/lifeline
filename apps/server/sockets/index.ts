import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { CORS_ORIGINS } from "../utils/constants";
import sysLogger from "../utils/logger";

let io: Server;

export function initializeSockets(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: CORS_ORIGINS,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    sysLogger.info(`Socket connected: ${socket.id}`);

    socket.on("donor:online", ({ bloodType }: { bloodType: string }) => {
      socket.join(`donors:${bloodType}`);
      sysLogger.info(`Donor ${socket.id} joined room donors:${bloodType}`);
    });

    socket.on("request:watch", ({ requestId }: { requestId: string }) => {
      socket.join(`request:${requestId}`);
      sysLogger.info(`Socket ${socket.id} watching request:${requestId}`);
    });

    socket.on("disconnect", () => {
      sysLogger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIo(): Server {
  if (!io) throw new Error("Socket.io has not been initialized");
  return io;
}

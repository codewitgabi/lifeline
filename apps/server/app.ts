import { createServer } from "http";
import { createApp } from "./createApp";
import connectDb from "./config/db.config";
import { PORT } from "./utils/constants";
import sysLogger from "./utils/logger";
import { initializeSockets } from "./sockets";

const app = createApp();
const httpServer = createServer(app);

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

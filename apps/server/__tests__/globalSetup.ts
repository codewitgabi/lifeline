import { MongoMemoryServer } from "mongodb-memory-server";
import os from "os";
import path from "path";

export default async function globalSetup() {
  process.env.MONGOMS_SYSTEM_BINARY = path.join(
    os.homedir(),
    ".cache",
    "mongodb-binaries",
    "mongod-x64-win32-6.0.14.exe",
  );

  const mongod = await MongoMemoryServer.create();

  // With --runInBand, global is shared between globalSetup, tests, and globalTeardown
  (global as Record<string, unknown>).__MONGOD__ = mongod;
  (global as Record<string, unknown>).__MMS_URI__ = mongod.getUri();
}

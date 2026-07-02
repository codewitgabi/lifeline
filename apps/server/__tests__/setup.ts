import mongoose from "mongoose";

beforeAll(async () => {
  const uri = (global as Record<string, unknown>).__MMS_URI__ as string;
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
});

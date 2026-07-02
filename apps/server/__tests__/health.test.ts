import { api } from "./helpers";

describe("GET /api/health", () => {
  it("returns 200 with status ok", async () => {
    const res = await api.get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("ok");
    expect(res.body.message).toBe("LifeLine API is running");
  });

  it("returns 404 for an unknown route", async () => {
    const res = await api.get("/api/does-not-exist");

    expect(res.status).toBe(404);
  });
});

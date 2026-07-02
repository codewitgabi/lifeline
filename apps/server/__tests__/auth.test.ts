import jwt from "jsonwebtoken";
import { api, createDonor } from "./helpers";

// Any protected endpoint works; GET /api/requests/nearby requires Bearer auth
const PROTECTED = "/api/requests/nearby";

describe("Authentication middleware", () => {
  describe("missing / malformed token", () => {
    it("returns 401 when Authorization header is absent", async () => {
      const res = await api.get(PROTECTED);

      expect(res.status).toBe(401);
    });

    it("returns 401 when Authorization header does not start with 'Bearer '", async () => {
      const res = await api.get(PROTECTED).set("Authorization", "Token abc123");

      expect(res.status).toBe(401);
    });

    it("returns 401 when token is an empty string after 'Bearer '", async () => {
      const res = await api.get(PROTECTED).set("Authorization", "Bearer ");

      expect(res.status).toBe(401);
    });
  });

  describe("invalid token", () => {
    it("returns 401 for a randomly forged token", async () => {
      const res = await api.get(PROTECTED).set("Authorization", "Bearer not.a.jwt");

      expect(res.status).toBe(401);
    });

    it("returns 401 for a token signed with the wrong secret", async () => {
      const badToken = jwt.sign({ donorId: "abc123" }, "wrong-secret");
      const res = await api.get(PROTECTED).set("Authorization", `Bearer ${badToken}`);

      expect(res.status).toBe(401);
    });

    it("returns 401 for an expired token", async () => {
      const expiredToken = jwt.sign(
        { donorId: "abc123" },
        process.env.JWT_SECRET ?? "lifeline-dev-secret-change-in-prod",
        { expiresIn: "0s" },
      );
      const res = await api.get(PROTECTED).set("Authorization", `Bearer ${expiredToken}`);

      expect(res.status).toBe(401);
    });

    it("returns 401 when the token references a deleted donor", async () => {
      const { donor, token } = await createDonor({ phone: "+2348011111111" });
      await donor.deleteOne();

      const res = await api.get(PROTECTED).set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(401);
    });
  });

  describe("valid token", () => {
    it("allows through a request with a valid token", async () => {
      const { token } = await createDonor({ phone: "+2348022222222" });

      const res = await api.get(PROTECTED).set("Authorization", `Bearer ${token}`);

      // 200 (empty array is fine) — the key is it is not 401
      expect(res.status).toBe(200);
    });
  });
});

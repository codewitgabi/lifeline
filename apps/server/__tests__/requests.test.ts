import { api, createDonor, createRequest, NEARBY_COORDS } from "./helpers";

// createRequest, respondToRequest, and fulfillRequest all call getIo()
jest.mock("../sockets", () => ({
  getIo: jest.fn().mockReturnValue({
    to: jest.fn().mockReturnValue({ emit: jest.fn() }),
  }),
  initializeSockets: jest.fn(),
}));

const VALID_REQUEST_BODY = {
  bloodType: "A+",
  unitsNeeded: 2,
  urgency: "urgent",
  hospitalName: "Lagos Island General Hospital",
  requesterName: "John Doe",
  requesterPhone: "+2348011111111",
  notes: "Needed for surgery",
  location: NEARBY_COORDS,
};

describe("POST /api/requests — create request", () => {
  it("creates a blood request and returns 201", async () => {
    const res = await api.post("/api/requests").send(VALID_REQUEST_BODY);

    expect(res.status).toBe(201);
    expect(res.body.data.request.bloodType).toBe("A+");
    expect(res.body.data.request.status).toBe("open");
    expect(res.body.data.request.urgency).toBe("urgent");
    expect(typeof res.body.data.donorsNotified).toBe("number");
  });

  it("sets expiresAt according to urgency level", async () => {
    const res = await api.post("/api/requests").send({
      ...VALID_REQUEST_BODY,
      urgency: "critical",
      requesterPhone: "+2348022222222",
    });

    expect(res.status).toBe(201);
    const expiresAt = new Date(res.body.data.request.expiresAt);
    const createdAt = new Date(res.body.data.request.createdAt);
    const diffHours = (expiresAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    // Critical = 6 h TTL
    expect(diffHours).toBeCloseTo(6, 0);
  });

  it("returns 422 when blood type is missing", async () => {
    const { bloodType: _bt, ...rest } = VALID_REQUEST_BODY;
    const res = await api.post("/api/requests").send(rest);

    expect(res.status).toBe(422);
  });

  it("returns 422 when urgency is not a valid value", async () => {
    const res = await api.post("/api/requests").send({
      ...VALID_REQUEST_BODY,
      urgency: "kinda-urgent",
      requesterPhone: "+2348033333333",
    });

    expect(res.status).toBe(422);
  });

  it("returns 422 when location is missing", async () => {
    const { location: _loc, ...rest } = VALID_REQUEST_BODY;
    const res = await api.post("/api/requests").send(rest);

    expect(res.status).toBe(422);
  });

  it("returns 422 when requester phone is missing", async () => {
    const { requesterPhone: _p, ...rest } = VALID_REQUEST_BODY;
    const res = await api.post("/api/requests").send(rest);

    expect(res.status).toBe(422);
  });
});

describe("GET /api/requests/:id — get request", () => {
  it("returns the full request document", async () => {
    const req = await createRequest();

    const res = await api.get(`/api/requests/${req._id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.bloodType).toBe("A+");
    expect(res.body.data.hospitalName).toBe("Test General Hospital");
    expect(res.body.data.status).toBe("open");
  });

  it("returns 404 for a valid ObjectId that does not exist", async () => {
    const res = await api.get("/api/requests/64a000000000000000000001");

    expect(res.status).toBe(404);
  });

  it("returns 400 for a malformed ID", async () => {
    const res = await api.get("/api/requests/bad-id");

    expect(res.status).toBe(400);
  });
});

describe("POST /api/requests/lookup — find request by phone", () => {
  it("returns an active request for a known requester phone", async () => {
    await createRequest({ requesterPhone: "+2348055555555" });

    const res = await api
      .post("/api/requests/lookup")
      .send({ phone: "+2348055555555" });

    expect(res.status).toBe(200);
    expect(res.body.data.requesterPhone).toBe("+2348055555555");
    expect(res.body.data.status).toBe("open");
  });

  it("returns 404 when no active request matches the phone", async () => {
    const res = await api
      .post("/api/requests/lookup")
      .send({ phone: "+2349999999999" });

    expect(res.status).toBe(404);
  });

  it("returns 422 when phone field is absent", async () => {
    const res = await api.post("/api/requests/lookup").send({});

    expect(res.status).toBe(422);
  });
});

describe("GET /api/requests/nearby — compatible nearby requests", () => {
  it("returns 401 when no token is provided", async () => {
    const res = await api.get("/api/requests/nearby");

    expect(res.status).toBe(401);
  });

  it("returns an array of compatible requests for an authenticated donor", async () => {
    const { token } = await createDonor({ bloodType: "O+", phone: "+2348066666666" });
    // A+ requests accept O+ blood — should appear in results
    await createRequest({ bloodType: "A+" });

    const res = await api
      .get("/api/requests/nearby")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("returns only requests compatible with the donor's blood type", async () => {
    const { token } = await createDonor({ bloodType: "AB+", phone: "+2348077777777" });
    // AB+ can only donate to AB+
    await createRequest({ bloodType: "A+", requesterPhone: "+2340000000001" });
    await createRequest({ bloodType: "AB+", requesterPhone: "+2340000000002" });

    const res = await api
      .get("/api/requests/nearby")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    const bloodTypes: string[] = res.body.data.map((r: { bloodType: string }) => r.bloodType);
    // A+ should not appear; AB+ should
    expect(bloodTypes.every((bt) => bt === "AB+")).toBe(true);
  });
});

describe("POST /api/requests/:id/respond — donor responds to request", () => {
  it("records the response and returns requester contact info", async () => {
    const { token } = await createDonor({ bloodType: "O+", phone: "+2348088888881" });
    const req = await createRequest({ bloodType: "A+" });

    const res = await api
      .post(`/api/requests/${req._id}/respond`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.data.requesterPhone).toBeDefined();
    expect(res.body.data.hospitalName).toBe("Test General Hospital");
  });

  it("stores the donor snapshot (name, phone, blood type) in responders list", async () => {
    const { token } = await createDonor({
      name: "Snapshot Donor",
      bloodType: "O+",
      phone: "+2348088888882",
    });
    const req = await createRequest({ bloodType: "A+" });

    await api
      .post(`/api/requests/${req._id}/respond`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    const statusRes = await api.get(`/api/requests/${req._id}`);
    const responders = statusRes.body.data.responders;

    expect(responders).toHaveLength(1);
    expect(responders[0].donorName).toBe("Snapshot Donor");
    expect(responders[0].bloodType).toBe("O+");
  });

  it("returns 400 when the same donor responds twice", async () => {
    const { token } = await createDonor({ bloodType: "O+", phone: "+2348099999991" });
    const req = await createRequest({ bloodType: "A+" });

    await api
      .post(`/api/requests/${req._id}/respond`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    const res = await api
      .post(`/api/requests/${req._id}/respond`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("returns 401 without a token", async () => {
    const req = await createRequest();

    const res = await api.post(`/api/requests/${req._id}/respond`).send({});

    expect(res.status).toBe(401);
  });

  it("returns 400 for an unknown request ID (same as 'already responded' — merged error)", async () => {
    const { token } = await createDonor({ bloodType: "O+", phone: "+2348099999992" });

    const res = await api
      .post("/api/requests/64a000000000000000000001/respond")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });
});

describe("POST /api/requests/:id/fulfill — close request", () => {
  it("marks the request as fulfilled and returns the updated document", async () => {
    const req = await createRequest();

    const res = await api.post(`/api/requests/${req._id}/fulfill`).send({});

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("fulfilled");
  });

  it("returns 404 for a request that does not exist", async () => {
    const res = await api.post("/api/requests/64a000000000000000000001/fulfill").send({});

    expect(res.status).toBe(404);
  });
});

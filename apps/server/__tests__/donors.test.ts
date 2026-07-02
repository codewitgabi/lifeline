import { api, createDonor, LAGOS_COORDS } from "./helpers";

const VALID_PAYLOAD = {
  name: "Gabriel Ojomakpene",
  phone: "+2348099999999",
  bloodType: "O+",
  location: LAGOS_COORDS,
};

describe("POST /api/donors — registration", () => {
  it("creates a new donor and returns 201 with a token", async () => {
    const res = await api.post("/api/donors").send(VALID_PAYLOAD);

    expect(res.status).toBe(201);
    expect(res.body.data.donor.name).toBe("Gabriel Ojomakpene");
    expect(res.body.data.donor.bloodType).toBe("O+");
    expect(typeof res.body.data.token).toBe("string");
  });

  it("returns 200 (not 201) when re-registering with the same phone number", async () => {
    await api.post("/api/donors").send(VALID_PAYLOAD);

    const res = await api.post("/api/donors").send({
      ...VALID_PAYLOAD,
      name: "Gabriel Updated",
      bloodType: "A+",
    });

    expect(res.status).toBe(200);
    expect(res.body.data.donor.name).toBe("Gabriel Updated");
    expect(res.body.data.donor.bloodType).toBe("A+");
  });

  it("updates fields and keeps a single donor record on re-registration", async () => {
    await api.post("/api/donors").send(VALID_PAYLOAD);
    await api.post("/api/donors").send({ ...VALID_PAYLOAD, name: "New Name" });

    const lookupRes = await api
      .post("/api/donors/lookup")
      .send({ phone: VALID_PAYLOAD.phone });

    // Only one account should exist for this phone
    expect(lookupRes.status).toBe(200);
    expect(lookupRes.body.data.donor.name).toBe("New Name");
  });

  it("returns 422 when name is missing", async () => {
    const { name: _name, ...rest } = VALID_PAYLOAD;
    const res = await api.post("/api/donors").send(rest);

    expect(res.status).toBe(422);
    expect(res.body.error.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: "name" })]),
    );
  });

  it("returns 422 when phone is missing", async () => {
    const { phone: _phone, ...rest } = VALID_PAYLOAD;
    const res = await api.post("/api/donors").send(rest);

    expect(res.status).toBe(422);
  });

  it("returns 422 when blood type is not a valid enum value", async () => {
    const res = await api.post("/api/donors").send({ ...VALID_PAYLOAD, bloodType: "Z-" });

    expect(res.status).toBe(422);
  });

  it("returns 422 when location coordinates are missing", async () => {
    const res = await api.post("/api/donors").send({
      name: "Test",
      phone: "+2348000000002",
      bloodType: "B+",
    });

    expect(res.status).toBe(422);
  });
});

describe("POST /api/donors/lookup — phone sign-in", () => {
  it("returns 200 with donor and token for a registered phone", async () => {
    await api.post("/api/donors").send(VALID_PAYLOAD);

    const res = await api
      .post("/api/donors/lookup")
      .send({ phone: VALID_PAYLOAD.phone });

    expect(res.status).toBe(200);
    expect(res.body.data.donor.phone).toBe(VALID_PAYLOAD.phone);
    expect(typeof res.body.data.token).toBe("string");
  });

  it("returns 404 for an unregistered phone number", async () => {
    const res = await api
      .post("/api/donors/lookup")
      .send({ phone: "+2340000000000" });

    expect(res.status).toBe(404);
  });

  it("returns 422 when phone field is absent", async () => {
    const res = await api.post("/api/donors/lookup").send({});

    expect(res.status).toBe(422);
  });
});

describe("GET /api/donors/:id — fetch donor", () => {
  it("returns the donor document for a valid ID", async () => {
    const { donor } = await createDonor({ phone: "+2348011111110" });

    const res = await api.get(`/api/donors/${donor._id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.phone).toBe("+2348011111110");
  });

  it("returns 404 for a valid ObjectId that does not exist", async () => {
    const res = await api.get("/api/donors/64a000000000000000000001");

    expect(res.status).toBe(404);
  });

  it("returns 400 for a malformed ID", async () => {
    const res = await api.get("/api/donors/not-an-object-id");

    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/donors/:id — update donor", () => {
  it("updates availability for the authenticated donor's own account", async () => {
    const { donor, token } = await createDonor({ phone: "+2348033333333" });

    const res = await api
      .patch(`/api/donors/${donor._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ available: false });

    expect(res.status).toBe(200);
    expect(res.body.data.available).toBe(false);
  });

  it("returns 401 when trying to update another donor's account", async () => {
    const { donor: other } = await createDonor({ phone: "+2348044444444" });
    const { token } = await createDonor({ phone: "+2348055555555" });

    const res = await api
      .patch(`/api/donors/${other._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ available: false });

    expect(res.status).toBe(401);
  });

  it("returns 401 when no token is provided", async () => {
    const { donor } = await createDonor({ phone: "+2348066666666" });

    const res = await api.patch(`/api/donors/${donor._id}`).send({ available: false });

    expect(res.status).toBe(401);
  });
});

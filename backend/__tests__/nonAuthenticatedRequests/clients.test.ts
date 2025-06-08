import request from "supertest";
import app from "../../app";
import { startServer } from "../../connections/mongoDB/connections";

describe("Client API Tests without Authentication", () => {
  let clientId = "";

  beforeAll(async () => {
    await startServer();
  });

  test("POST /api/v1/clients/ should create a new client", async () => {
    const response = await request(app)
      .post("/api/v1/clients/")
      .send({
        uid: "test-client-uid",
        username: "test-client",
        email: "test.client@example.com",
        phone: "2313",
        shippingAddress: "string",
        roles: "client",
        orders: [],
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    clientId = response.body.data._id;
    return response;
  });

  test("POST /api/v1/clients/ should return an error - No username", async () => {
    const response = await request(app)
      .post("/api/v1/clients/")
      .send({
        uid: "test-client-uid-no-username",
        email: "test.missing@example.com",
        phone: "2313",
        shippingAddress: "string",
        roles: "client",
        orders: [],
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    return response;
  });

  test("POST /api/v1/clients/ should return an error - No email", async () => {
    const response = await request(app)
      .post("/api/v1/clients/")
      .send({
        uid: "test-client-uid-no-email",
        username: "test-no-email",
        phone: "2313",
        shippingAddress: "string",
        roles: "client",
        orders: [],
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    return response;
  });

  test("GET /api/v1/clients/ should return a list of clients", async () => {
    const response = await request(app)
      .get("/api/v1/clients/")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("GET /api/v1/clients/:id should return a single client", async () => {
    const response = await request(app)
      .get(`/api/v1/clients/${clientId}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("GET /api/v1/clients/:id should return an error - Fake clientId", async () => {
    const response = await request(app)
      .get(`/api/v1/clients/fakeClientId`)
      .set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    return response;
  });

  test("PUT /api/v1/clients/:id should update a client", async () => {
    const response = await request(app)
      .put(`/api/v1/clients/${clientId}`)
      .send({
        uid: "test-client-uid",
        username: "Updated Test Client",
        email: "updated.test.client@example.com",
        phone: "3456",
        shippingAddress: "updated string",
        roles: "client",
        orders: [],
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("PATCH /api/v1/clients/:id should partially update a client", async () => {
    const response = await request(app)
      .patch(`/api/v1/clients/${clientId}`)
      .send({
        username: "Partially Updated Client",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("DELETE /api/v1/clients/:id should delete a client", async () => {
    const response = await request(app)
      .delete(`/api/v1/clients/${clientId}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("GET /api/v1/clients/:id should return an error - client deleted", async () => {
    const response = await request(app)
      .get(`/api/v1/clients/${clientId}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    return response;
  });
});
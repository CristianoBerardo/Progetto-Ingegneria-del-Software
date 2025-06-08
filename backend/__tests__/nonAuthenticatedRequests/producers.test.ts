import request from "supertest";
import app from "../../app";
import { startServer } from "../../connections/mongoDB/connections";

describe("Producer API Tests without Authentication", () => {
  let producerId = "";

  beforeAll(async () => {
    await startServer();
  });

  test("POST /api/v1/producers/ should create a new producer", async () => {
    const response = await request(app)
      .post("/api/v1/producers/")
      .send({
        uid: "test-producer-uid",
        name: "Test Producer Company",
        email: "test.producer@example.com",
        phone: "1234567890",
        address: "Via Test 123, Test City",
        products: [],
        roles: "producer",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    producerId = response.body.data._id;
    return response;
  });

  test("POST /api/v1/producers/ should return an error - No name", async () => {
    const response = await request(app)
      .post("/api/v1/producers/")
      .send({
        uid: "test-producer-uid-no-name",
        email: "test.missing.name@example.com",
        phone: "1234567890",
        address: "Via Test 123, Test City",
        products: [],
        roles: "producer",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    return response;
  });

  test("POST /api/v1/producers/ should return an error - No email", async () => {
    const response = await request(app)
      .post("/api/v1/producers/")
      .send({
        uid: "test-producer-uid-no-email",
        name: "Producer Without Email",
        phone: "1234567890",
        address: "Via Test 123, Test City",
        products: [],
        roles: "producer",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    return response;
  });

  test("POST /api/v1/producers/ should return an error - No phone", async () => {
    const response = await request(app)
      .post("/api/v1/producers/")
      .send({
        uid: "test-producer-uid-no-phone",
        name: "Producer Without Phone",
        email: "test.no.phone@example.com",
        address: "Via Test 123, Test City",
        products: [],
        roles: "producer",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    return response;
  });

  test("GET /api/v1/producers/ should return a list of producers", async () => {
    const response = await request(app)
      .get("/api/v1/producers/")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("GET /api/v1/producers/names should return producer names", async () => {
    const response = await request(app)
      .get("/api/v1/producers/names")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("GET /api/v1/producers/:id should return a single producer", async () => {
    const response = await request(app)
      .get(`/api/v1/producers/${producerId}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("GET /api/v1/producers/:id should return an error - Fake producerId", async () => {
    const response = await request(app)
      .get(`/api/v1/producers/fakeProducerId`)
      .set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    return response;
  });

  test("GET /api/v1/producers/:id/products should return producer products", async () => {
    const response = await request(app)
      .get(`/api/v1/producers/${producerId}/products`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("PUT /api/v1/producers/:id should update a producer", async () => {
    const response = await request(app)
      .put(`/api/v1/producers/${producerId}`)
      .send({
        uid: "test-producer-uid",
        name: "Updated Test Producer",
        email: "updated.test.producer@example.com",
        phone: "0987654321",
        address: "Via Updated 456, Updated City",
        products: [],
        roles: "producer",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("GET /api/v1/producers?name=Updated Test Producer should return the updated producer", async () => {
    const response = await request(app)
      .get("/api/v1/producers?name=Updated Test Producer")
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].name).toBe("Updated Test Producer");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("PATCH /api/v1/producers/:id should partially update a producer", async () => {
    const response = await request(app)
      .patch(`/api/v1/producers/${producerId}`)
      .send({
        name: "Partially Updated Producer",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("DELETE /api/v1/producers/:id should delete a producer", async () => {
    const response = await request(app)
      .delete(`/api/v1/producers/${producerId}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("GET /api/v1/producers/:id should return an error - producer deleted", async () => {
    const response = await request(app)
      .get(`/api/v1/producers/${producerId}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    return response;
  });
});
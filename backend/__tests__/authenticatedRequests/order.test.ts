import request from "supertest";
import app from "../../app";
import { startServer } from "../../connections/mongoDB/connections";
import { getFirebaseToken } from "../utils/getFirebaseToken";
import { TEST_USERS } from "../utils/loginUsers";

describe("Order API Tests with Authentication", () => {
  let orderId = "";

  beforeAll(async () => {
    await startServer();
  });

  test("POST /api/v1/orders/ create order with client authentication", async () => {
    const token = await getFirebaseToken({
      email: TEST_USERS.client.email,
      password: TEST_USERS.client.password,
    });

    const response = await request(app)
      .post("/api/v1/orders/")
      .set("Authorization", `Bearer ${token?.firebaseToken}`)
      .send({
        products: [
          {
            productId: "6842b79046519ddb7febaed6",
            quantity: 100,
          },
        ],
        totalPrice: 100,
        pickupDate: "07/07/2025",
      });

    orderId = response.body.savedOrder._id;

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  test("GET /api/v1/orders/ get order with client authentication", async () => {
    const token = await getFirebaseToken({
      email: TEST_USERS.client.email,
      password: TEST_USERS.client.password,
    });

    const response = await request(app)
      .get("/api/v1/orders/")
      .set("Authorization", `Bearer ${token?.firebaseToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("DELETE /api/v1/orders/:orderId delete order with client authentication", async () => {
    const token = await getFirebaseToken({
      email: TEST_USERS.client.email,
      password: TEST_USERS.client.password,
    });

    const response = await request(app)
      .delete(`/api/v1/orders/${orderId}`)
      .set("Authorization", `Bearer ${token?.firebaseToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("POST /api/v1/orders/ create order with client authentication - Fake token", async () => {
    const response = await request(app)
      .post("/api/v1/orders/")
      .set("Authorization", `Bearer FAKE TOKEN`)
      .send({
        products: [
          {
            productId: "6842b79046519ddb7febaed6",
            quantity: 100,
          },
        ],
        totalPrice: 100,
        pickupDate: "07/07/2025",
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    return response;
  });

  test("GET /api/v1/orders/ get order with client authentication - Fake token", async () => {
    const response = await request(app)
      .get("/api/v1/orders/")
      .set("Authorization", `Bearer FAKE TOKEN`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("DELETE /api/v1/orders/:orderId delete order with client authentication - Fake token", async () => {
    const response = await request(app)
      .delete(`/api/v1/orders/${orderId}`)
      .set("Authorization", `Bearer FAKE TOKEN`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("POST /api/v1/orders/ create order with client authentication - Fake producerID", async () => {
    const token = await getFirebaseToken({
      email: TEST_USERS.client.email,
      password: TEST_USERS.client.password,
    });

    const response = await request(app)
      .post("/api/v1/orders/")
      .set("Authorization", `Bearer ${token?.firebaseToken}`)
      .send({
        products: [
          {
            productId: "FAKE_PRODUCT_ID",
            quantity: 100,
          },
        ],
        totalPrice: 100,
        pickupDate: "07/07/2025",
      });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(undefined);
  });

  test("DELETE /api/v1/orders/:orderId delete order with producer authentication", async () => {
    const token = await getFirebaseToken({
      email: TEST_USERS.producer.email,
      password: TEST_USERS.producer.password,
    });

    const response = await request(app)
      .delete(`/api/v1/orders/${orderId}`)
      .set("Authorization", `Bearer ${token?.firebaseToken}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(undefined);
  });
});

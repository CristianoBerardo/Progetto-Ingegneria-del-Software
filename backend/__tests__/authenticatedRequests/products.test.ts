import request from "supertest";
import app from "../../app";
import { startServer } from "../../connections/mongoDB/connections";
import { getFirebaseToken } from "../utils/getFirebaseToken";
import { TEST_USERS } from "../utils/loginUsers";

describe("Product API Tests with Authentication", () => {
  let productId = "";

  beforeAll(async () => {
    await startServer();
  });

  test("POST /api/v2/products/ with producer authentication", async () => {
    const token = await getFirebaseToken({
      email: TEST_USERS.producer.email,
      password: TEST_USERS.producer.password,
    });

    const response = await request(app)
      .post("/api/v2/products/")
      .set("Authorization", `Bearer ${token?.firebaseToken}`)
      .send({
        name: "Test Product",
        description: "This is a test product",
        price: 100,
        available: 150,
      });

    productId = response.body.data._id;
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe("Test Product");
  });

  test("PATCH /api/v2/products/:id with producer authentication", async () => {
    const token = await getFirebaseToken({
      email: TEST_USERS.producer.email,
      password: TEST_USERS.producer.password,
    });

    const response = await request(app)
      .patch(`/api/v2/products/${productId}`)
      .set("Authorization", `Bearer ${token?.firebaseToken}`)
      .send({
        name: "Updated Product",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe("Updated Product");
  });

  test("GET /api/v1/products/:id (no authentication) and check PATCH results", async () => {
    const response = await request(app).get(`/api/v1/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe("Updated Product");
  });

  test("DELETE /api/v2/products/:id with client authentication (Not allowed)", async () => {
    const token = await getFirebaseToken({
      email: TEST_USERS.client.email,
      password: TEST_USERS.client.password,
    });

    const response = await request(app)
      .delete(`/api/v2/products/fakeProductId`)
      .set("Authorization", `Bearer ${token?.firebaseToken}`);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
  });

  test("DELETE /api/v2/products/:id with administrator authentication (Not allowed)", async () => {
    const token = await getFirebaseToken({
      email: TEST_USERS.admin.email,
      password: TEST_USERS.admin.password,
    });

    const response = await request(app)
      .delete(`/api/v2/products/fakeProductId`)
      .set("Authorization", `Bearer ${token?.firebaseToken}`);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
  });

  test("DELETE /api/v2/products/:id with producer authentication", async () => {
    const token = await getFirebaseToken({
      email: TEST_USERS.producer.email,
      password: TEST_USERS.producer.password,
    });

    const response = await request(app)
      .delete(`/api/v2/products/${productId}`)
      .set("Authorization", `Bearer ${token?.firebaseToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("DELETE /api/v2/products/:id with producer authentication but fake productId", async () => {
    const token = await getFirebaseToken({
      email: TEST_USERS.producer.email,
      password: TEST_USERS.producer.password,
    });

    const response = await request(app)
      .delete(`/api/v2/products/fakeProductId`)
      .set("Authorization", `Bearer ${token?.firebaseToken}`);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
  });
});

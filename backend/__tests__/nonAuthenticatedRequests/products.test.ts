import request from "supertest";
import app from "../../app";
import { startServer } from "../../connections/mongoDB/connections";

describe("Product API Tests without Authentication", () => {
  let productId = "";
  const producerId = "6825ad2b3b9cc63357f309d4"; // Replace with a valid producer ID from your database

  beforeAll(async () => {
    await startServer();
  });

  test("POST /api/v1/products/ should create a new product", async () => {
    const response = await request(app)
      .post("/api/v1/products/")
      .send({
        name: "Test Product",
        description: "This is a test product",
        price: "100",
        available: "50",
        producer: producerId,
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    productId = response.body.data._id;
    return response;
  });

  test("POST /api/v1/products/ should return an error - Enter a fake producer ID", async () => {
    const response = await request(app)
      .post("/api/v1/products/")
      .send({
        name: "Test Product",
        description: "This is a test product",
        price: "100",
        available: "50",
        producer: "Fake Producer ID",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    return response;
  });

  test("POST /api/v1/products/ should return an error - No name", async () => {
    const response = await request(app)
      .post("/api/v1/products/")
      .send({
        description: "This is a test product",
        price: "100",
        available: "50",
        producer: productId,
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    return response;
  });

  test("GET /api/v1/products/ should return a list of products", async () => {
    const response = await request(app)
      .get("/api/v1/products/")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("GET /api/v1/products/:id should return a single product", async () => {
    const response = await request(app)
      .get(`/api/v1/products/${productId}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("GET /api/v1/products/:id should return an error - Fake productId", async () => {
    const response = await request(app)
      .get(`/api/v1/products/fakeProductId`)
      .set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    return response;
  });

  test("PUT /api/v1/products/:id should update a product", async () => {
    const response = await request(app)
      .put(`/api/v1/products/${productId}`)
      .send({
        name: "Updated Test Product",
        description: "This is an updated test product",
        price: 150,
        available: 75,
        producer: producerId,
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("GET /api/v1/products?name=Updated Test Product should return the updated product", async () => {
    const response = await request(app)
      .get("/api/v1/products?name=Updated Test Product")
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].name).toBe("Updated Test Product");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("DELETE /api/v1/products/:id should delete a product", async () => {
    const response = await request(app)
      .delete(`/api/v1/products/${productId}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
    return response;
  });

  test("GET /api/v1/products/:id should retun an error - product deleted", async () => {
    const response = await request(app)
      .get(`/api/v1/products/${productId}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    return response;
  });
});

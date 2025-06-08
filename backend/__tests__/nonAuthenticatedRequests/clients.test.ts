import request from "supertest";
import app from "../../app";

describe("Client API Tests without Authentication", () => {
  test("POST /api/v1/clients/ create a new client", async () => {
    const response = await request(app).post("/api/v1/clients/").send({
      uid: "test",
      username: "test",
      email: "test",
      phone: "2313",
      shippingAddress: "string",
      roles: "client",
      orders: [],
    });

    expect(response.status).toBe(201);
  });

  // Altri test
});

import request from "supertest";
import app from "../../app";
import { startServer } from "../../connections/mongoDB/connections";
import { TEST_USERS } from "../utils/loginUsers";
import { getFirebaseToken } from "../utils/getFirebaseToken";

describe("Client, Producer and Administrator login", () => {
  beforeAll(async () => {
    await startServer();
  });

  test("POST /auth/login/ with client credentials", async () => {
    const token = await getFirebaseToken({
      email: TEST_USERS.client.email,
      password: TEST_USERS.client.password,
    });

    const response = await request(app)
      .post("/auth/login/")
      .set("Authorization", `Bearer ${token?.firebaseToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.userRole).toBe("client");
  });

  test("POST /auth/login/ with producer credentials", async () => {
    const token = await getFirebaseToken({
      email: TEST_USERS.producer.email,
      password: TEST_USERS.producer.password,
    });

    const response = await request(app)
      .post("/auth/login/")
      .set("Authorization", `Bearer ${token?.firebaseToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.userRole).toBe("producer");
  });

  test("POST /auth/login/ with admin credentials", async () => {
    const token = await getFirebaseToken({
      email: TEST_USERS.admin.email,
      password: TEST_USERS.admin.password,
    });

    const response = await request(app)
      .post("/auth/login/")
      .set("Authorization", `Bearer ${token?.firebaseToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.userRole).toBe("administrator");
  });

  test("POST /auth/login/ with missing token", async () => {
    const response = await request(app).post("/auth/login/");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("POST /auth/login/ with invalid token", async () => {
    const response = await request(app)
      .post("/auth/login/")
      .set("Authorization", "Bearer invalid_token");

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("POST /auth/login/ with invalid email", async () => {
    const token = await getFirebaseToken({
      email: "Fake email",
      password: TEST_USERS.admin.password,
    });

    const response = await request(app)
      .post("/auth/login/")
      .set("Authorization", `Bearer ${token?.firebaseToken}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("POST /auth/login/ with invalid password", async () => {
    const token = await getFirebaseToken({
      email: TEST_USERS.client.email,
      password: "Fake password",
    });

    const response = await request(app)
      .post("/auth/login/")
      .set("Authorization", `Bearer ${token?.firebaseToken}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
});

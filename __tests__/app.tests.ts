import request from "supertest";
import { app } from "../src/index";
import { db } from "../src/db/db";

describe("GET /", () => {
  it("should return Hello World message", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Hello World - NLW04" });
  });
});

describe("POST /users", () => {
  it("should create a user and return a success message", async () => {
    const uniqueEmail = `test_${Date.now()}@gmail.com`;
    const userData = {
      email: uniqueEmail,
      password: "password123",
      default_currency: "USD",
    };
    const response = await request(app).post("/users").send(userData);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "User created successfully" });
  });
});

describe("POST /update_user/:id", () => {
  it("should update a user and return a success message", async () => {
    const updatedUserData = {
      email: `updated_${Date.now()}@gmail.com`,
      default_currency: "EUR",
    };
    const response = await request(app)
      .post(`/update_user/10`)
      .send(updatedUserData);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "User updated successfully" });
  });
});

describe("GET /balances/:user_id", () => {
  it("should return the balances for a given user", async () => {
    const response = await request(app).get(`/balances/${1}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("balances");
    expect(Array.isArray(response.body.balances)).toBe(true);
  });
});

import request from "supertest";
import { app } from "../src/index";

describe("GET /", () => {
  it("should return Hello World message", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Hello World - NLW04" });
  });
});

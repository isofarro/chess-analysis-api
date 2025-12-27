import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../app.js";
import type { FastifyInstance } from "fastify";

describe("GET /analysis/:fen", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 200 and analysis data for a valid FEN", async () => {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    // User requires FEN to be URL encoded
    const encodedFen = encodeURIComponent(fen);

    const response = await app.inject({
      method: "GET",
      url: `/analysis/${encodedFen}`,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      expect(body[0]).toHaveProperty("fen");
      expect(body[0]).toHaveProperty("bestMove");
    }
  });

  it("should return 400 for an invalid FEN", async () => {
    const invalidFen = "invalid-fen-string";
    const response = await app.inject({
      method: "GET",
      url: `/analysis/${invalidFen}`,
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty("error", "Invalid FEN");
  });

  it("should return 400 if FEN is missing", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/analysis/",
    });
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toHaveProperty(
      "error",
      "Missing FEN string",
    );
  });
});

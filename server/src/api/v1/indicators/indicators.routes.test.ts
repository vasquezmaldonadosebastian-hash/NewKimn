import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../createApp";
import { initializeIndicators } from "../../../services/indicatorService";
import type { RawIndicator } from "../../../../../shared/types/indicators";

process.env.NODE_ENV = "test";

function seed() {
  const rawIndicators: RawIndicator[] = [
    {
      id: "1",
      codigo: "IND-001",
      nombre: "Indicador 1",
      descripcion: "Descripcion",
      objetivo: "Objetivo",
      area: "Salud",
      enlaceVisualizacion: "https://example.com/powerbi",
      fechaCorte: "2026-01-01",
    },
  ];

  initializeIndicators(rawIndicators, []);
}

describe("GET /api/indicadores", () => {
  it("returns indicators list", async () => {
    seed();
    const app = createApp();

    const res = await request(app).get("/api/indicadores");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe("1");
  });
});

describe("GET /api/indicadores/:id", () => {
  it("returns a single indicator", async () => {
    seed();
    const app = createApp();

    const res = await request(app).get("/api/indicadores/1");
    expect(res.status).toBe(200);
    expect(res.body.id).toBe("1");
  });

  it("returns unified 404 error payload when missing", async () => {
    seed();
    const app = createApp();

    const res = await request(app).get("/api/indicadores/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.code).toBe("NOT_FOUND");
    expect(res.body.error).toBe("Indicator not found");
  });
});

describe("GET /api/categorias/:categoryId/indicadores", () => {
  it("rejects invalid categoryId", async () => {
    seed();
    const app = createApp();

    const res = await request(app).get("/api/categorias/invalid%20id/indicadores");
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("VALIDATION_ERROR");
    expect(res.body.error).toBe("Invalid request parameters");
  });
});

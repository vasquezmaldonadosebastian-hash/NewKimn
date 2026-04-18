import express from "express";
import { createIndicatorRoutes } from "./api/v1/indicators/indicators.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { AppError } from "./errors/AppError";
import type { IndicatorService } from "./services/indicatorService";
import { createHttpLogger } from "./observability/logger";
import { getMetricsSnapshot, metricsMiddleware } from "./middleware/metrics.middleware";

type CreateAppDeps = {
  indicatorService: IndicatorService;
};

export function createApp(deps: CreateAppDeps) {
  const app = express();

  if (process.env.NODE_ENV !== "test") {
    app.use(createHttpLogger());
    app.use(metricsMiddleware());
  }
  app.use(express.json({ limit: "100kb" }));

  app.use("/api", createIndicatorRoutes(deps.indicatorService));

  app.get("/api/reportes-agrupados", (_req, res, next) => {
    try {
      res.json(deps.indicatorService.getGroupedReports());
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/metrics", (_req, res) => {
    res.json(getMetricsSnapshot());
  });

  // Consistent error payload for API routes.
  app.use("/api", (_req, _res, next) => {
    next(new AppError("NOT_FOUND", "Route not found", 404));
  });

  app.use(errorMiddleware);

  return app;
}

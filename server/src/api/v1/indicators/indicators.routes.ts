import { Router } from "express";
import { z } from "zod";
import { AppError } from "../../../errors/AppError";
import { validateParams, validateQuery } from "../../../middleware/validate.middleware";
import type { IndicatorService } from "../../../services/indicatorService";

const idParamsSchema = z.object({ id: z.string().min(1) });
const categoryParamsSchema = z.object({
  categoryId: z.string().regex(/^[a-z0-9-]+$/, "Invalid categoryId"),
});

const indicatorsQuerySchema = z.object({
  area: z.string().min(1).optional(),
  dimension: z.string().min(1).optional(),
});

export function createIndicatorRoutes(indicatorService: IndicatorService) {
  const router = Router();

  router.get("/indicadores", validateQuery(indicatorsQuerySchema), (req, res) => {
    const query = req.query as z.infer<typeof indicatorsQuerySchema>;
    const hasQuery = Boolean(query.area || query.dimension);
    res.json(hasQuery ? indicatorService.queryIndicators(query) : indicatorService.getIndicators());
  });

  router.get("/indicadores/:id", validateParams(idParamsSchema), (req, res) => {
    const { id } = req.params as z.infer<typeof idParamsSchema>;
    const indicator = indicatorService.getIndicator(id);

    if (!indicator) {
      throw new AppError("NOT_FOUND", "Indicator not found", 404);
    }

    res.json(indicator);
  });

  router.get("/categorias", (_req, res) => {
    res.json(indicatorService.getCategories());
  });

  router.get(
    "/categorias/:categoryId/indicadores",
    validateParams(categoryParamsSchema),
    (req, res) => {
      const { categoryId } = req.params as z.infer<typeof categoryParamsSchema>;
      res.json(indicatorService.getIndicatorsByCategory(categoryId));
    }
  );

  return router;
}

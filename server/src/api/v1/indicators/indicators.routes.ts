import { Router } from "express";
import { z } from "zod";
import {
  getIndicators,
  getIndicator,
  getCategories,
  getIndicatorsByCategory,
} from '../../../services/indicatorService';
import { AppError } from "../../../errors/AppError";
import { validateParams } from "../../../middleware/validate.middleware";

const router = Router();

const idParamsSchema = z.object({ id: z.string().min(1) });
const categoryParamsSchema = z.object({
  categoryId: z.string().regex(/^[a-z0-9-]+$/, "Invalid categoryId"),
});

router.get("/indicadores", (_req, res) => {
  res.json(getIndicators());
});

router.get("/indicadores/:id", validateParams(idParamsSchema), (req, res) => {
  const { id } = req.params as z.infer<typeof idParamsSchema>;
  const indicator = getIndicator(id);

  if (!indicator) {
    throw new AppError("NOT_FOUND", "Indicator not found", 404);
  }

  res.json(indicator);
});

router.get("/categorias", (_req, res) => {
  res.json(getCategories());
});

router.get(
  "/categorias/:categoryId/indicadores",
  validateParams(categoryParamsSchema),
  (req, res) => {
    const { categoryId } = req.params as z.infer<typeof categoryParamsSchema>;
    res.json(getIndicatorsByCategory(categoryId));
  }
);

export default router;

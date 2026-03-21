import { Router } from 'express';
import {
  getIndicators,
  getIndicator,
  getCategories,
  getIndicatorsByCategory,
} from '../services/indicatorService';

const router = Router();

router.get('/indicadores', (_req, res) => {
  try {
    const indicators = getIndicators();
    res.json(indicators);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch indicators' });
  }
});

router.get('/indicadores/:id', (req, res) => {
  try {
    const { id } = req.params;
    const indicator = getIndicator(id);

    if (!indicator) {
      return res.status(404).json({ error: 'Indicator not found' });
    }

    res.json(indicator);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch indicator' });
  }
});

router.get('/categorias', (_req, res) => {
  try {
    const categories = getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/categorias/:categoryId/indicadores', (req, res) => {
  try {
    const { categoryId } = req.params;
    const indicators = getIndicatorsByCategory(categoryId);
    res.json(indicators);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category indicators' });
  }
});

export default router;
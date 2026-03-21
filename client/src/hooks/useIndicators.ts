import { useIndicatorsContext } from '@/contexts/IndicatorsContext';
import type { Indicator } from '@/lib/types';

export function useIndicators() {
  const context = useIndicatorsContext();

  const getIndicatorById = (id: string): Indicator | undefined => {
    return context.indicators.find(ind => ind.id === id);
  };

  const getIndicatorsByCategory = (categoryId: string): Indicator[] => {
    return context.indicators.filter(ind => ind.categoria === categoryId);
  };

  return {
    ...context,
    getIndicatorById,
    getIndicatorsByCategory,
  };
}
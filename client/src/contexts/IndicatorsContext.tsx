import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Indicator, IndicatorCategory } from '@shared/types';

interface IndicatorsContextType {
  indicators: Indicator[];
  categories: IndicatorCategory[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;
}

const IndicatorsContext = createContext<IndicatorsContextType | undefined>(undefined);

interface IndicatorsProviderProps {
  children: ReactNode;
}

export function IndicatorsProvider({ children }: IndicatorsProviderProps) {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [categories, setCategories] = useState<IndicatorCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [indicatorsRes, categoriesRes] = await Promise.all([
          fetch('/api/indicadores'),
          fetch('/api/categorias'),
        ]);

        if (!indicatorsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data from API');
        }

        const indicatorsData = await indicatorsRes.json();
        const categoriesData = await categoriesRes.json();

        setIndicators(indicatorsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <IndicatorsContext.Provider
      value={{
        indicators,
        categories,
        loading,
        error,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </IndicatorsContext.Provider>
  );
}

export function useIndicatorsContext() {
  const context = useContext(IndicatorsContext);
  if (!context) {
    throw new Error('useIndicatorsContext must be used within IndicatorsProvider');
  }
  return context;
}

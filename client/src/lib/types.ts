// Re-export types from shared for client-side use
export type { Indicator, IndicatorCategory, Dashboard } from "@shared/types";

// Client-specific types if needed
export interface IndicatorListItem {
  id: string;
  titulo: string;
  descripcion: string;
  codigo: string;
  area: string;
}

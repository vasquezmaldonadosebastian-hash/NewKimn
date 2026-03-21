import type { Indicator, IndicatorCategory } from "../shared/types";

let indicators: Indicator[] = [];
let categories: IndicatorCategory[] = [];

// Helper para agrupar indicadores por categoría
const groupByCategory = (data: any[]): IndicatorCategory[] => {
  const categoryMap = new Map<string, IndicatorCategory>();

  data.forEach((item) => {
    const categoryName = item.area;
    if (!categoryName) return;

    let category = categoryMap.get(categoryName);
    if (!category) {
      category = {
        id: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-*|-*$/g, ""),
        label: categoryName,
        icono: "",
        descripcion: `Indicadores relacionados con ${categoryName.toLowerCase()}`,
        indicadores: [],
      };
      categoryMap.set(categoryName, category);
    }

    const iframeSrc = item.enlaceVisualizacion || "";
    const indicator: Indicator = {
      id: item.nro.toString(),
      titulo: item.nombre,
      descripcion: item.descripcion,
      iframeSrc: iframeSrc,
      iframeHeight: 600,
      tipo: iframeSrc ? (iframeSrc.includes("powerbi") ? "powerbi" : "tableau") : "placeholder",
      fuentes: item.fuente ? [item.fuente] : [],
      ultimaActualizacion: item.fechaCorte || "",
      notasMetodologicas: item.formula || "",
      unidad: item.unidadMedida || "",
      codigo: item.codigo,
      objetivo: item.objetivo,
      formula: item.formula,
      frecuenciaMedicion: item.frecuenciaMedicion,
      estado: item.estado,
      lineaBase: item.lineaBase,
      dimension: item.dimension,
      fuenteAdministrativa: item.fuenteAdministrativa || "",
      responsableCalculo: item.responsableCalculo || "",
      responsableVerificar: item.responsableVerificar || "",
      fechaCorte: item.fechaCorte || "",
      instructivoCalculo: item.instructivoCalculo || "",
    };
    category.indicadores.push(indicator);
  });

  return Array.from(categoryMap.values());
};

export const initializeIndicators = (data: any[]) => {
  indicators = data.map((item) => {
    const iframeSrc = item.enlaceVisualizacion || "";
    return {
      id: item.nro.toString(),
      titulo: item.nombre,
      descripcion: item.descripcion,
      iframeSrc: iframeSrc,
      iframeHeight: 600,
      tipo: iframeSrc ? (iframeSrc.includes("powerbi") ? "powerbi" : "tableau") : "placeholder",
      fuentes: item.fuente ? [item.fuente] : [],
      ultimaActualizacion: item.fechaCorte || "",
      notasMetodologicas: item.formula || "",
      unidad: item.unidadMedida || "",
      codigo: item.codigo,
      objetivo: item.objetivo,
      formula: item.formula,
      frecuenciaMedicion: item.frecuenciaMedicion,
      estado: item.estado,
      lineaBase: item.lineaBase,
      dimension: item.dimension,
      fuenteAdministrativa: item.fuenteAdministrativa || "",
      responsableCalculo: item.responsableCalculo || "",
      responsableVerificar: item.responsableVerificar || "",
      fechaCorte: item.fechaCorte || "",
      instructivoCalculo: item.instructivoCalculo || "",
    };
  });
  categories = groupByCategory(data);
};

export const getIndicators = (): Indicator[] => {
  return indicators;
};

export const getIndicator = (id: string): Indicator | undefined => {
  return indicators.find((ind) => ind.id === id);
};

export const getCategories = (): IndicatorCategory[] => {
  return categories;
};

export const getIndicatorsByCategory = (categoryId: string): Indicator[] => {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.indicadores : [];
};

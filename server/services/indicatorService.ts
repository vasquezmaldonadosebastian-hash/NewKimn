import type { Indicator, IndicatorCategory } from "../../shared/types";

let indicators: Indicator[] = [];
let categories: IndicatorCategory[] = [];

// Determina el src del iframe y el tipo de visualización
const resolveIframe = (item: any): { iframeSrc: string; tipo: "powerbi" | "tableau" | "placeholder" } => {
  const enlace = item["Enlace visualizacion"] || item.enlaceVisualizacion || "";
  // Descartamos valores que no son URLs reales
  if (!enlace || enlace === "Visible" || enlace === "falta" || enlace === "-" || enlace === "None") {
    return { iframeSrc: "", tipo: "placeholder" };
  }
  const tipo = enlace.includes("powerbi") ? "powerbi" : "tableau";
  return { iframeSrc: enlace, tipo };
};

// Convierte un ítem crudo del JSON al tipo Indicator
const mapItem = (item: any): Indicator => {
  const { iframeSrc, tipo } = resolveIframe(item);

  return {
    // Identificadores
    id: (item["ID"] ?? item["Nro indicador"] ?? item.nro ?? item.id)?.toString() ?? "",
    codigo: item["Código del indicador"] ?? item.codigo ?? "",

    // Textos principales
    titulo: item["Nombre del indicador"] ?? item.nombre ?? "",
    descripcion: item["Descripción"] ?? item.descripcion ?? "",
    objetivo: item["Objetivo del Indicador"] ?? item.objetivo ?? "",

    // Fórmulas — campo clave para mostrar en la tarjeta y en metodología
    formula: item["Formula del cálculo"] ?? item.formula ?? "",
    formulaSimplificada: item["Formula simplificada"] ?? null,
    variables: item["variables"] ?? null,

    // Visualización
    iframeSrc,
    iframeHeight: 600,
    tipo,

    // Metadatos
    unidad: item["Unidad de medida"] ?? item.unidadMedida ?? "",
    frecuenciaMedicion: item["Frecuencia de Medición"] ?? item.frecuenciaMedicion ?? "",
    estado: item["Estado del Indicador"] ?? item.estado ?? "",
    lineaBase: item["Linea Base"] ?? item.lineaBase ?? null,
    dimension: item["Dimensión"] ?? item.dimension ?? "",
    fechaCorte: item["Fecha de Corte"] ?? item.fechaCorte ?? "",

    // Fuentes y responsables
    fuentes: item["Fuente de Dato"] ? [item["Fuente de Dato"]] : item.fuente ? [item.fuente] : [],
    fuenteAdministrativa: item["Fuente administrativa"] ?? item.fuenteAdministrativa ?? "",
    responsableCalculo: item["Responsable de Calculo"] ?? item.responsableCalculo ?? "",
    responsableVerificar: item["Responsable de verificar"] ?? item.responsableVerificar ?? "",
    instructivoCalculo: item["Instructivo de Cálculo"] ?? item.instructivoCalculo ?? "",

    // Campos heredados
    ultimaActualizacion: item["Fecha de Corte"] ?? item.fechaCorte ?? "",
    notasMetodologicas: item["Formula del cálculo"] ?? item.formula ?? "",
  } as Indicator;
};

// Helper para agrupar indicadores por categoría
const groupByCategory = (data: any[]): IndicatorCategory[] => {
  const categoryMap = new Map<string, IndicatorCategory>();

  data.forEach((item) => {
    const categoryName = item["Área"] ?? item.area;
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

    category.indicadores.push(mapItem(item));
  });

  return Array.from(categoryMap.values());
};

export const initializeIndicators = (data: any[]) => {
  indicators = data.map(mapItem);
  categories = groupByCategory(data);
};

export const getIndicators = (): Indicator[] => indicators;

export const getIndicator = (id: string): Indicator | undefined =>
  indicators.find((ind) => ind.id === id);

export const getCategories = (): IndicatorCategory[] => categories;

export const getIndicatorsByCategory = (categoryId: string): Indicator[] => {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.indicadores : [];
};

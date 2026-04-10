import type { Indicator, IndicatorCategory } from "../../shared/types";

let indicators: Indicator[] = [];
let categories: IndicatorCategory[] = [];

const resolveIframe = (item: any): { iframeSrc: string; tipo: "powerbi" | "tableau" | "placeholder" } => {
  const enlace = item.enlaceVisualizacion || item["Enlace visualizacion"] || "";
  if (!enlace || enlace === "None" || enlace === "Visible" || enlace === "falta" || enlace === "-") {
    return { iframeSrc: "", tipo: "placeholder" };
  }
  return { iframeSrc: enlace, tipo: enlace.includes("powerbi") ? "powerbi" : "tableau" };
};

const mapItem = (item: any): Indicator => {
  const { iframeSrc, tipo } = resolveIframe(item);

  return {
    id: (item.id ?? item.nro ?? item["ID"] ?? item["Nro indicador"])?.toString() ?? "",
    codigo: item.codigo ?? item["Código del indicador"] ?? "",
    titulo: item.nombre ?? item["Nombre del indicador"] ?? "",
    descripcion: item.descripcion ?? item["Descripción"] ?? "",
    objetivo: item.objetivo ?? item["Objetivo del Indicador"] ?? "",

    // Fórmulas — camelCase (JSON del proyecto) con fallback a claves originales
    formula: item.formula ?? item["Formula del cálculo"] ?? "",
    formulaSimplificada: item.formulaSimplificada ?? item["Formula simplificada"] ?? null,
    variables: item.variables ?? null,

    iframeSrc,
    iframeHeight: 600,
    tipo,

    unidad: item.unidadMedida ?? item["Unidad de medida"] ?? "",
    frecuenciaMedicion: item.frecuenciaMedicion ?? item["Frecuencia de Medición"] ?? "",
    estado: item.estado ?? item["Estado del Indicador"] ?? "",
    lineaBase: (!item.lineaBase || item.lineaBase === "None") ? null : item.lineaBase,
    dimension: item.dimension ?? item["Dimensión"] ?? "",
    area: item.area ?? item["Área"] ?? "",
    fechaCorte: item.fechaCorte ?? item["Fecha de Corte"] ?? "",

    fuentes: item.fuente ? [item.fuente] : item["Fuente de Dato"] ? [item["Fuente de Dato"]] : [],
    fuenteAdministrativa: item.fuenteAdministrativa ?? item["Fuente administrativa"] ?? "",
    responsableCalculo: item.responsableCalculo ?? item["Responsable de Calculo"] ?? "",
    responsableVerificar: item.responsableVerificar ?? item["Responsable de verificar"] ?? "",
    instructivoCalculo: item.instructivoCalculo ?? item["Instructivo de Cálculo"] ?? "",

    ultimaActualizacion: item.fechaCorte ?? item["Fecha de Corte"] ?? "",
    notasMetodologicas: item.formula ?? item["Formula del cálculo"] ?? "",
  };
};

const groupByCategory = (data: any[]): IndicatorCategory[] => {
  const categoryMap = new Map<string, IndicatorCategory>();
  data.forEach((item) => {
    const categoryName = item.area ?? item["Área"];
    if (!categoryName) return;
    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, {
        id: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-*|-*$/g, ""),
        label: categoryName,
        icono: "",
        descripcion: `Indicadores relacionados con ${categoryName.toLowerCase()}`,
        indicadores: [],
      });
    }
    categoryMap.get(categoryName)!.indicadores.push(mapItem(item));
  });
  return Array.from(categoryMap.values());
};

export const initializeIndicators = (data: any[]) => {
  indicators = data.map(mapItem);
  categories = groupByCategory(data);
};

export const getIndicators = (): Indicator[] => indicators;
export const getIndicator = (id: string): Indicator | undefined => indicators.find((ind) => ind.id === id);
export const getCategories = (): IndicatorCategory[] => categories;
export const getIndicatorsByCategory = (categoryId: string): Indicator[] => {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.indicadores : [];
};

import type {
  GroupedReport,
  Indicator,
  IndicatorCategory,
  RawGroupedReport,
  RawIndicator,
} from "../../../shared/types/indicators";
import type { IndicatorRepository } from "./IndicatorRepository";

type ResolveIframeResult = {
  iframeSrc: string;
  tipo: "powerbi" | "tableau" | "placeholder";
};

function resolveIframe(item: RawIndicator): ResolveIframeResult {
  const enlace = item.enlaceVisualizacion || item["Enlace visualizacion"] || "";
  if (!enlace || enlace === "None" || enlace === "Visible" || enlace === "falta" || enlace === "-") {
    return { iframeSrc: "", tipo: "placeholder" };
  }
  return { iframeSrc: enlace, tipo: enlace.includes("powerbi") ? "powerbi" : "tableau" };
}

function mapItem(item: RawIndicator): Indicator {
  const { iframeSrc, tipo } = resolveIframe(item);

  return {
    id: (item.id ?? item.nro ?? item.ID ?? item["Nro indicador"])?.toString() ?? "",
    codigo: item.codigo ?? item["Código del indicador"] ?? "",
    titulo: item.nombre ?? item["Nombre del indicador"] ?? "",
    descripcion: item.descripcion ?? item["Descripción"] ?? "",
    objetivo: item.objetivo ?? item["Objetivo del Indicador"] ?? "",

    formula: item.formula ?? item["Formula del cálculo"] ?? "",
    formulaSimplificada: item.formulaSimplificada ?? item["Formula simplificada"] ?? null,
    variables: item.variables ?? null,

    iframeSrc,
    iframeHeight: 600,
    tipo,

    unidad: item.unidadMedida ?? item["Unidad de medida"] ?? "",
    frecuenciaMedicion: item.frecuenciaMedicion ?? item["Frecuencia de Medición"] ?? "",
    estado: item.estado ?? item["Estado del Indicador"] ?? "",
    lineaBase: !item.lineaBase || item.lineaBase === "None" ? null : item.lineaBase,
    dimension: item.dimension ?? item["Dimensión"] ?? "",
    area: item.area ?? item["Área"] ?? "",
    fechaCorte: item.fechaCorte ?? item["Fecha de Corte"] ?? "",

    fuentes: item.fuente ? [item.fuente] : item["Fuente de Dato"] ? [item["Fuente de Dato"]] : [],
    fuenteAdministrativa: item.fuenteAdministrativa ?? item["Fuente administrativa"] ?? "",
    responsableCalculo: item.responsableCalculo ?? item["Responsable de Calculo"] ?? "",
    responsableVerificar: item.responsableVerificar ?? item["Responsable de verificar"] ?? "",
    instructivoCalculo: item.instructivoCalculo ?? item["Instructivo de Cálculo"] ?? "",

    ultimaActualizacion: item.fechaCorte ?? item["Fecha de Corte"] ?? "",
    notasMetodologicas: item.notasMetodologicas ?? item.formula ?? item["Formula del cálculo"] ?? "",
  };
}

function mapGroupedReport(item: RawGroupedReport): GroupedReport {
  return {
    id: item.id,
    titulo: item.titulo,
    descripcion: item.descripcion,
    iframeSrc: item.iframeSrc,
    tipo: item.tipo,
  };
}

function groupByCategory(data: RawIndicator[]): IndicatorCategory[] {
  const categoryMap = new Map<string, IndicatorCategory>();
  data.forEach((item) => {
    const categoryName = item.area ?? item["Área"];
    if (!categoryName) return;
    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, {
        id: categoryName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-*|-*$/g, ""),
        label: categoryName,
        icono: "",
        descripcion: `Indicadores relacionados con ${categoryName.toLowerCase()}`,
        indicadores: [],
      });
    }
    categoryMap.get(categoryName)!.indicadores.push(mapItem(item));
  });
  return Array.from(categoryMap.values());
}

type InMemoryIndicatorRepositoryOptions = {
  indicatorsData: RawIndicator[];
  reportsData?: RawGroupedReport[];
};

export class InMemoryIndicatorRepository implements IndicatorRepository {
  private initialized = false;
  private readonly rawIndicators: RawIndicator[];
  private readonly rawReports: RawGroupedReport[];

  private indicators: Indicator[] = [];
  private categories: IndicatorCategory[] = [];
  private groupedReports: GroupedReport[] = [];

  constructor(options: InMemoryIndicatorRepositoryOptions) {
    this.rawIndicators = options.indicatorsData;
    this.rawReports = options.reportsData ?? [];
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.indicators = this.rawIndicators.map(mapItem);
    this.categories = groupByCategory(this.rawIndicators);
    this.groupedReports = this.rawReports.map(mapGroupedReport);
    this.initialized = true;
  }

  getIndicators(): Indicator[] {
    return this.indicators;
  }

  getIndicator(id: string): Indicator | undefined {
    return this.indicators.find((ind) => ind.id === id);
  }

  getCategories(): IndicatorCategory[] {
    return this.categories;
  }

  getIndicatorsByCategory(categoryId: string): Indicator[] {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.indicadores : [];
  }

  getGroupedReports(): GroupedReport[] {
    return this.groupedReports;
  }
}


// server/index.ts
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

// server/services/indicatorService.ts
var indicators = [];
var categories = [];
var groupedReports = [];
var resolveIframe = (item) => {
  const enlace = item.enlaceVisualizacion || item["Enlace visualizacion"] || "";
  if (!enlace || enlace === "None" || enlace === "Visible" || enlace === "falta" || enlace === "-") {
    return { iframeSrc: "", tipo: "placeholder" };
  }
  return { iframeSrc: enlace, tipo: enlace.includes("powerbi") ? "powerbi" : "tableau" };
};
var mapItem = (item) => {
  const { iframeSrc, tipo } = resolveIframe(item);
  return {
    id: (item.id ?? item.nro ?? item["ID"] ?? item["Nro indicador"])?.toString() ?? "",
    codigo: item.codigo ?? item["C\xF3digo del indicador"] ?? "",
    titulo: item.nombre ?? item["Nombre del indicador"] ?? "",
    descripcion: item.descripcion ?? item["Descripci\xF3n"] ?? "",
    objetivo: item.objetivo ?? item["Objetivo del Indicador"] ?? "",
    // Fórmulas — camelCase (JSON del proyecto) con fallback a claves originales
    formula: item.formula ?? item["Formula del c\xE1lculo"] ?? "",
    formulaSimplificada: item.formulaSimplificada ?? item["Formula simplificada"] ?? null,
    variables: item.variables ?? null,
    iframeSrc,
    iframeHeight: 600,
    tipo,
    unidad: item.unidadMedida ?? item["Unidad de medida"] ?? "",
    frecuenciaMedicion: item.frecuenciaMedicion ?? item["Frecuencia de Medici\xF3n"] ?? "",
    estado: item.estado ?? item["Estado del Indicador"] ?? "",
    lineaBase: !item.lineaBase || item.lineaBase === "None" ? null : item.lineaBase,
    dimension: item.dimension ?? item["Dimensi\xF3n"] ?? "",
    area: item.area ?? item["\xC1rea"] ?? "",
    fechaCorte: item.fechaCorte ?? item["Fecha de Corte"] ?? "",
    fuentes: item.fuente ? [item.fuente] : item["Fuente de Dato"] ? [item["Fuente de Dato"]] : [],
    fuenteAdministrativa: item.fuenteAdministrativa ?? item["Fuente administrativa"] ?? "",
    responsableCalculo: item.responsableCalculo ?? item["Responsable de Calculo"] ?? "",
    responsableVerificar: item.responsableVerificar ?? item["Responsable de verificar"] ?? "",
    instructivoCalculo: item.instructivoCalculo ?? item["Instructivo de C\xE1lculo"] ?? "",
    ultimaActualizacion: item.fechaCorte ?? item["Fecha de Corte"] ?? "",
    notasMetodologicas: item.formula ?? item["Formula del c\xE1lculo"] ?? ""
  };
};
var mapGroupedReport = (item) => {
  return {
    id: item.id,
    titulo: item.titulo,
    descripcion: item.descripcion,
    iframeSrc: item.iframeSrc,
    tipo: item.tipo
  };
};
var groupByCategory = (data) => {
  const categoryMap = /* @__PURE__ */ new Map();
  data.forEach((item) => {
    const categoryName = item.area ?? item["\xC1rea"];
    if (!categoryName) return;
    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, {
        id: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-*|-*$/g, ""),
        label: categoryName,
        icono: "",
        descripcion: `Indicadores relacionados con ${categoryName.toLowerCase()}`,
        indicadores: []
      });
    }
    categoryMap.get(categoryName).indicadores.push(mapItem(item));
  });
  return Array.from(categoryMap.values());
};
var initializeIndicators = (data, reportsData = []) => {
  indicators = data.map(mapItem);
  categories = groupByCategory(data);
  groupedReports = reportsData.map(mapGroupedReport);
};
var getIndicators = () => indicators;
var getIndicator = (id) => indicators.find((ind) => ind.id === id);
var getCategories = () => categories;
var getIndicatorsByCategory = (categoryId) => {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.indicadores : [];
};
var getGroupedReports = () => groupedReports;

// server/routes/indicators.ts
import { Router } from "express";
var router = Router();
router.get("/indicadores", (_req, res) => {
  try {
    const indicators2 = getIndicators();
    res.json(indicators2);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch indicators" });
  }
});
router.get("/indicadores/:id", (req, res) => {
  try {
    const { id } = req.params;
    const indicator = getIndicator(id);
    if (!indicator) {
      return res.status(404).json({ error: "Indicator not found" });
    }
    res.json(indicator);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch indicator" });
  }
});
router.get("/categorias", (_req, res) => {
  try {
    const categories2 = getCategories();
    res.json(categories2);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});
router.get("/categorias/:categoryId/indicadores", (req, res) => {
  try {
    const { categoryId } = req.params;
    const indicators2 = getIndicatorsByCategory(categoryId);
    res.json(indicators2);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category indicators" });
  }
});
var indicators_default = router;

// indicadores.json
var indicadores_default = {
  indicadores: [
    {
      id: 1,
      nro: 1,
      codigo: "01INGE-01",
      nombre: "Normativas institucionales priorizadas con perspectiva de g\xE9nero",
      descripcion: "Mide el avance en la integraci\xF3n de la perspectiva de g\xE9nero en las normativas institucionales priorizadas, cuantificando la proporci\xF3n de normas actualizadas con enfoque de g\xE9nero.",
      objetivo: "Asegurar que la perspectiva de g\xE9nero est\xE9 presente en las normativas priorizadas que orientan el quehacer universitario.",
      area: "Gesti\xF3n",
      dimension: "1.- Institucionalizaci\xF3n",
      unidadMedida: "%",
      formula: "(N\xB0 de normativas con perspectiva de g\xE9nero / N\xB0 total de normativas priorizadas en la UCT) \xD7 100",
      frecuenciaMedicion: "Anual",
      estado: "Faltante",
      lineaBase: null,
      enlaceVisualizacion: null,
      formulaSimplificada: "\\left( \\frac{ n_{ng} }{ N_{np} } \\right) \\times 100",
      variables: "n_{ng}: Normas con G\xE9nero; N_{np}: Normas Priorizadas",
      fuenteAdministrativa: "Secretaria General",
      responsableCalculo: "Obs G\xE9nero",
      responsableVerificar: "OEG Oficina de atenci\xF3n",
      instructivoCalculo: "https://drive.google.com/file/d/1P7b-CAxhI4b7bJcFeAtDbTDzE5InSsoC/view?usp=drive_link",
      fechaCorte: "2025-12-30"
    },
    {
      id: 2,
      nro: 2,
      codigo: "01INGE-02",
      nombre: "Visualizaciones de indicadores con perspectiva de g\xE9nero",
      descripcion: "Mide el grado de incorporaci\xF3n de la perspectiva de g\xE9nero en KIMN, cuantificando el porcentaje de visualizaciones principales de indicadores institucionales referidos a personas que incluyen datos desagregados por g\xE9nero.",
      objetivo: "Garantizar que las visualizaciones principales de indicadores institucionales disponibles en KIMN incorporen la perspectiva de g\xE9nero.",
      area: "Gesti\xF3n",
      dimension: "1.- Institucionalizaci\xF3n",
      unidadMedida: "%",
      formula: "(N\xB0 de visualizaciones de indicadores sobre personas desagregados por g\xE9nero / N\xB0 total de visualizaciones de indicadores sobre personas) \xD7 100",
      frecuenciaMedicion: "Anual",
      estado: "Oficializado",
      lineaBase: null,
      enlaceVisualizacion: null,
      formulaSimplificada: "\\left( \\frac{ v_{g} }{ V_{t} } \\right) \\times 100",
      variables: "v_{g}: Visualizaciones con G\xE9nero; V_{t}: Total Visualizaciones",
      fuenteAdministrativa: "DGOB",
      responsableCalculo: "OEG",
      responsableVerificar: "DGOB",
      instructivoCalculo: "https://drive.google.com/file/d/1EvA-1sUn5O23c3MmO7PPKvscG9lo63Cf/view?usp=drive_link",
      fechaCorte: "2025-12-30"
    },
    {
      id: 3,
      nro: 3,
      codigo: "01INGE-03",
      nombre: "Autoridades de Direcci\xF3n Superior formadas en perspectiva de g\xE9nero",
      descripcion: "Mide el nivel de formaci\xF3n del cuerpo directivo superior en materia de perspectiva de g\xE9nero, evaluando la proporci\xF3n de autoridades que han participado en procesos de formaci\xF3n con un m\xEDnimo de 4 horas.",
      objetivo: "Promover la formaci\xF3n con perspectiva de g\xE9nero en autoridades de la instituci\xF3n.",
      area: "Gesti\xF3n",
      dimension: "1.- Institucionalizaci\xF3n",
      unidadMedida: "%",
      formula: "(N\xB0 de autoridades de Direcci\xF3n Superior formadas en perspectiva de g\xE9nero / N\xB0 total de autoridades de Direcci\xF3n Superior) \xD7 100",
      frecuenciaMedicion: "Anual",
      estado: "Faltante",
      lineaBase: null,
      enlaceVisualizacion: null,
      formulaSimplificada: "\\left( \\frac{ a_{f} }{ A_{t} } \\right) \\times 100",
      variables: "a_{f}: Autoridades Formadas; A_{t}: Total Autoridades",
      fuenteAdministrativa: "DG",
      responsableCalculo: "OEG",
      responsableVerificar: "DG",
      instructivoCalculo: "falta",
      fechaCorte: "2025-12-30"
    },
    {
      id: 4,
      nro: 4,
      codigo: "02VGGE-04",
      nombre: "Conocimiento de la comunidad UC Temuco de la normativa sobre Violencia de G\xE9nero",
      descripcion: "Eval\xFAa el nivel de conocimiento de la comunidad UC Temuco sobre el protocolo de violencia de g\xE9nero, midiendo el porcentaje de personas que declaran conocer este procedimiento.",
      objetivo: "Promover el conocimiento del protocolo de actuaci\xF3n frente a casos de violencia de g\xE9nero.",
      area: "Gesti\xF3n",
      dimension: "2.- Violencia de G\xE9nero",
      unidadMedida: "%",
      formula: "(N\xB0 de personas que se\xF1alan conocer el protocolo sobre Violencia de G\xE9nero / N\xB0 total de personas que contestan la pregunta en la encuesta) \xD7 100",
      frecuenciaMedicion: "Bienal",
      estado: "Oficializado",
      lineaBase: 0.427,
      enlaceVisualizacion: "https://app.powerbi.com/view?r=eyJrIjoiODY2ZGRjNGEtZDEzMC00ZmMyLWFlY2YtOGM3N2E1ZTMwODFkIiwidCI6IjBkODQ5NzNiLThiYjctNDQ1OC05YzI5LTIxZmFiNDZmMTUyYyIsImMiOjR9&pageName=69cd2d313a87a0e17e24",
      formulaSimplificada: "\\left( \\frac{ p_{c} }{ P_{r} } \\right) \\times 100",
      variables: "p_{c}: Personas que conocen; P_{r}: Total Respuestas",
      fuenteAdministrativa: "OEG",
      responsableCalculo: "OEG",
      responsableVerificar: "OAA",
      instructivoCalculo: "https://drive.google.com/file/d/1PEE2ye8jg-Pnp7dnkTYEk7vbuwWRsrn1/view?usp=drive_link",
      fechaCorte: "2025-12-30"
    },
    {
      id: 5,
      nro: 5,
      codigo: "02VGGE-05",
      nombre: "Calidad y Cumplimiento del Proceso de Denuncia",
      descripcion: "Mide de forma integral la experiencia de la persona denunciante a trav\xE9s de la calidad del servicio y acompa\xF1amiento (OAA), y el cumplimiento normativo y debido proceso (SG).",
      objetivo: "Evaluar la calidad de atenci\xF3n y el cumplimiento normativo para determinar si el proceso de denuncia cumple con los est\xE1ndares de trato digno y debido proceso.",
      area: "Gesti\xF3n",
      dimension: "2.- Violencia de G\xE9nero",
      unidadMedida: "N\xFAmero",
      formula: "(IOAA \xD7 0.50) + (ISG \xD7 0.50)",
      frecuenciaMedicion: "Anual",
      estado: "Faltante",
      lineaBase: 0,
      enlaceVisualizacion: null,
      formulaSimplificada: "(I_{oaa} \\times 0.5) + (I_{sg} \\times 0.5)",
      variables: "I_{oaa}: \xCDndice Acompa\xF1amiento; I_{sg}: \xCDndice Secretar\xEDa Gral.",
      fuenteAdministrativa: "OAA",
      responsableCalculo: "OEG",
      responsableVerificar: "OAA",
      instructivoCalculo: "A la espera de validaci\xF3n",
      fechaCorte: "2025-12-30"
    },
    {
      id: 6,
      nro: 6,
      codigo: "02VGGE-06",
      nombre: "Actores clave formados en temas de violencia de g\xE9nero y uso del protocolo institucional",
      descripcion: "Mide el porcentaje de personas por estamento en la UC Temuco que han recibido capacitaci\xF3n formal sobre violencia de g\xE9nero y el uso del protocolo institucional de actuaci\xF3n.",
      objetivo: "Promover el avance progresivo en la capacitaci\xF3n de los estamentos estables de la universidad respecto a tem\xE1ticas de violencia de g\xE9nero y activaci\xF3n del protocolo.",
      area: "Gesti\xF3n",
      dimension: "2.- Violencia de G\xE9nero",
      unidadMedida: "%",
      formula: "(N\xB0 de personas formadas en temas de violencia de g\xE9nero y uso del protocolo / N\xB0 total de personas por estamento) \xD7 100",
      frecuenciaMedicion: "Bienal",
      estado: "Faltante",
      lineaBase: null,
      enlaceVisualizacion: null,
      formulaSimplificada: "\\left( \\frac{ k_{f} }{ K_{t} } \\right) \\times 100",
      variables: "k_{f}: Actores Clave Formados; K_{t}: Total Actores Clave",
      fuenteAdministrativa: "Obs. G\xE9nero",
      responsableCalculo: "OEG",
      responsableVerificar: "OAA",
      instructivoCalculo: "",
      fechaCorte: "2025-12-30"
    },
    {
      id: 7,
      nro: 7,
      codigo: "03CCGE-07",
      nombre: "Nivel de uso y satisfacci\xF3n del Plan de Conciliaci\xF3n de la Vida Personal, Familiar y Laboral",
      descripcion: "Mide de forma integrada el grado de utilizaci\xF3n y la valoraci\xF3n que los funcionarios y funcionarias hacen del Plan de Conciliaci\xF3n, combinando uso efectivo y satisfacci\xF3n percibida.",
      objetivo: "Promover la mejora continua del plan y su difusi\xF3n, tomando como insumo el nivel de uso y satisfacci\xF3n de los funcionarios respecto del plan de conciliaci\xF3n.",
      area: "Gesti\xF3n",
      dimension: "3.- Corresponsabilidad en los cuidados",
      unidadMedida: "N\xFAmero",
      formula: "IUS = (0.5 \xD7 U) + (0.5 \xD7 S)",
      frecuenciaMedicion: "Bienal",
      estado: "Oficializado",
      lineaBase: 0,
      enlaceVisualizacion: null,
      formulaSimplificada: "(0.5 \\times U) + (0.5 \\times S)",
      variables: "U: Grado de Uso; S: Grado de Satisfacci\xF3n",
      fuenteAdministrativa: "Obs. G\xE9nero",
      responsableCalculo: "OEG",
      responsableVerificar: "DDPER",
      instructivoCalculo: "https://docs.google.com/document/d/1cejVFv3gzpjNU-sDFs-wDP6JzIwa-GdV/edit?usp=sharing&ouid=100736699336938496947&rtpof=true&sd=true",
      fechaCorte: "2025-12-30"
    },
    {
      id: 8,
      nro: 8,
      codigo: "03CCGE-08",
      nombre: "Brecha de g\xE9nero en el uso del Plan de Conciliaci\xF3n",
      descripcion: "Mide la diferencia en el uso del Plan de Conciliaci\xF3n entre mujeres y hombres en la UCT, ajustada por la poblaci\xF3n potencial, como indicador de avance hacia la igualdad en la corresponsabilidad.",
      objetivo: "Cuantificar la diferencia de uso del Plan de Conciliaci\xF3n entre mujeres y hombres, donde la reducci\xF3n de esta brecha se interpreta como avance hacia la corresponsabilidad.",
      area: "Gesti\xF3n",
      dimension: "3.- Corresponsabilidad en los cuidados",
      unidadMedida: "N\xFAmero",
      formula: "Bg = T_uso_mujeres - T_uso_hombres",
      frecuenciaMedicion: "Bienal",
      estado: "Oficializado",
      lineaBase: 0.656,
      enlaceVisualizacion: null,
      formulaSimplificada: "T_{m} - T_{h}",
      variables: "T_{m}: Tasa uso mujeres; T_{h}: Tasa uso hombres",
      fuenteAdministrativa: "DG",
      responsableCalculo: "OEG",
      responsableVerificar: "DG",
      instructivoCalculo: "-",
      fechaCorte: "2025-12-30"
    },
    {
      id: 9,
      nro: 9,
      codigo: "04TRGE-09",
      nombre: "Mujeres acad\xE9micas de la planta permanente en opci\xF3n investigaci\xF3n",
      descripcion: "Mide la representaci\xF3n porcentual de las mujeres acad\xE9micas de planta permanente en opci\xF3n investigaci\xF3n, en relaci\xF3n con el total del personal acad\xE9mico de planta permanente en esta categor\xEDa.",
      objetivo: "Promover la equidad de g\xE9nero dentro de la planta acad\xE9mica permanente con opci\xF3n investigaci\xF3n.",
      area: "Gesti\xF3n",
      dimension: "4.- Trayectorias laborales",
      unidadMedida: "%",
      formula: "(N\xB0 de mujeres acad\xE9micas de planta permanente en opci\xF3n investigaci\xF3n / N\xB0 total de acad\xE9micos de planta permanente en opci\xF3n investigaci\xF3n) \xD7 100",
      frecuenciaMedicion: "Anual",
      estado: "Oficializado",
      lineaBase: 0.28,
      enlaceVisualizacion: null,
      formulaSimplificada: "\\left( \\frac{ m_{i} }{ T_{i} } \\right) \\times 100",
      variables: "m_{i}: Mujeres en Investigaci\xF3n; T_{i}: Total planta Investigaci\xF3n",
      fuenteAdministrativa: "PENDIENTE",
      responsableCalculo: "PENDIENTE",
      responsableVerificar: "PENDIENTE",
      instructivoCalculo: "-",
      fechaCorte: "2025-12-30"
    },
    {
      id: 10,
      nro: 10,
      codigo: "04TRGE-10",
      nombre: "Representaci\xF3n de mujeres en cargos de liderazgo universitario",
      descripcion: "Mide la representaci\xF3n porcentual de mujeres en cargos de liderazgo universitario (decana, directora, jefa de departamento, etc.) en relaci\xF3n con el total de cargos de liderazgo.",
      objetivo: "Promover la equidad de g\xE9nero en los cargos de liderazgo de la universidad.",
      area: "Gesti\xF3n",
      dimension: "4.- Trayectorias laborales",
      unidadMedida: "%",
      formula: "(N\xB0 de mujeres en cargos de liderazgo universitario / N\xB0 total de cargos de liderazgo universitario) \xD7 100",
      frecuenciaMedicion: "Anual",
      estado: "Faltante",
      lineaBase: null,
      enlaceVisualizacion: null,
      formulaSimplificada: "\\left( \\frac{ m_{l} }{ T_{l} } \\right) \\times 100",
      variables: "m_{l}: Mujeres en Liderazgo; T_{l}: Total Liderazgo",
      fuenteAdministrativa: "PENDIENTE",
      responsableCalculo: "PENDIENTE",
      responsableVerificar: "PENDIENTE",
      instructivoCalculo: "-",
      fechaCorte: "2025-12-30"
    },
    {
      id: 11,
      nro: 11,
      codigo: "05EDGE-11",
      nombre: "Brecha de g\xE9nero en el acceso a la educaci\xF3n superior",
      descripcion: "Mide la diferencia en el acceso a la educaci\xF3n superior entre mujeres y hombres, considerando la tasa de matr\xEDcula de primer a\xF1o en la UC Temuco.",
      objetivo: "Promover la equidad de g\xE9nero en el acceso a la educaci\xF3n superior.",
      area: "Acad\xE9mica",
      dimension: "5.- Trayectorias educativas",
      unidadMedida: "%",
      formula: "(Tasa de matr\xEDcula de mujeres en primer a\xF1o - Tasa de matr\xEDcula de hombres en primer a\xF1o)",
      frecuenciaMedicion: "Anual",
      estado: "Faltante",
      lineaBase: null,
      enlaceVisualizacion: null,
      formulaSimplificada: "T_{mf} - T_{mh}",
      variables: "T_{mf}: Tasa Matr\xEDcula Femenina; T_{mh}: Tasa Matr\xEDcula Masculina",
      fuenteAdministrativa: "PENDIENTE",
      responsableCalculo: "PENDIENTE",
      responsableVerificar: "PENDIENTE",
      instructivoCalculo: "-",
      fechaCorte: "2025-12-30"
    },
    {
      id: 12,
      nro: 12,
      codigo: "05EDGE-12",
      nombre: "Brecha de g\xE9nero en la titulaci\xF3n oportuna",
      descripcion: "Mide la diferencia en la tasa de titulaci\xF3n oportuna entre mujeres y hombres en la UC Temuco.",
      objetivo: "Promover la equidad de g\xE9nero en la titulaci\xF3n oportuna.",
      area: "Acad\xE9mica",
      dimension: "5.- Trayectorias educativas",
      unidadMedida: "%",
      formula: "(Tasa de titulaci\xF3n oportuna de mujeres - Tasa de titulaci\xF3n oportuna de hombres)",
      frecuenciaMedicion: "Anual",
      estado: "Faltante",
      lineaBase: null,
      enlaceVisualizacion: null,
      formulaSimplificada: "T_{tof} - T_{toh}",
      variables: "T_{tof}: Tasa Titulaci\xF3n Oportuna Femenina; T_{toh}: Tasa Titulaci\xF3n Oportuna Masculina",
      fuenteAdministrativa: "PENDIENTE",
      responsableCalculo: "PENDIENTE",
      responsableVerificar: "PENDIENTE",
      instructivoCalculo: "-",
      fechaCorte: "2025-12-30"
    },
    {
      id: 13,
      nro: 13,
      codigo: "06MEGE-13",
      nombre: "Programas de estudio con perspectiva de g\xE9nero",
      descripcion: "Mide el porcentaje de programas de estudio que incorporan la perspectiva de g\xE9nero en sus planes de estudio.",
      objetivo: "Promover la incorporaci\xF3n de la perspectiva de g\xE9nero en los programas de estudio.",
      area: "Acad\xE9mica",
      dimension: "6.- Modelo educativo con perspectiva de g\xE9nero",
      unidadMedida: "%",
      formula: "(N\xB0 de programas de estudio con perspectiva de g\xE9nero / N\xB0 total de programas de estudio) \xD7 100",
      frecuenciaMedicion: "Anual",
      estado: "Faltante",
      lineaBase: null,
      enlaceVisualizacion: null,
      formulaSimplificada: "\\left( \\frac{ p_{g} }{ P_{t} } \\right) \\times 100",
      variables: "p_{g}: Programas con G\xE9nero; P_{t}: Total Programas",
      fuenteAdministrativa: "PENDIENTE",
      responsableCalculo: "PENDIENTE",
      responsableVerificar: "PENDIENTE",
      instructivoCalculo: "-",
      fechaCorte: "2025-12-30"
    },
    {
      id: 14,
      nro: 14,
      codigo: "06MEGE-14",
      nombre: "Docentes capacitados en perspectiva de g\xE9nero",
      descripcion: "Mide el porcentaje de docentes que han recibido capacitaci\xF3n en perspectiva de g\xE9nero.",
      objetivo: "Promover la capacitaci\xF3n de docentes en perspectiva de g\xE9nero.",
      area: "Acad\xE9mica",
      dimension: "6.- Modelo educativo con perspectiva de g\xE9nero",
      unidadMedida: "%",
      formula: "(N\xB0 de docentes capacitados en perspectiva de g\xE9nero / N\xB0 total de docentes) \xD7 100",
      frecuenciaMedicion: "Anual",
      estado: "Faltante",
      lineaBase: null,
      enlaceVisualizacion: null,
      formulaSimplificada: "\\left( \\frac{ d_{c} }{ D_{t} } \\right) \\times 100",
      variables: "d_{c}: Docentes Capacitados; D_{t}: Total Docentes",
      fuenteAdministrativa: "PENDIENTE",
      responsableCalculo: "PENDIENTE",
      responsableVerificar: "PENDIENTE",
      instructivoCalculo: "-",
      fechaCorte: "2025-12-30"
    },
    {
      id: 15,
      nro: 15,
      codigo: "07DCGE-15",
      nombre: "Publicaciones cient\xEDficas con autor\xEDa femenina",
      descripcion: "Mide el porcentaje de publicaciones cient\xEDficas que cuentan con al menos una autora femenina.",
      objetivo: "Promover la participaci\xF3n de mujeres en la producci\xF3n cient\xEDfica.",
      area: "Investigaci\xF3n",
      dimension: "7.- Divulgaci\xF3n Cient\xEDfica",
      unidadMedida: "%",
      formula: "(N\xB0 de publicaciones con autor\xEDa femenina / N\xB0 total de publicaciones cient\xEDficas) \xD7 100",
      frecuenciaMedicion: "Anual",
      estado: "Faltante",
      lineaBase: null,
      enlaceVisualizacion: null,
      formulaSimplificada: "\\left( \\frac{ p_{af} }{ P_{t} } \\right) \\times 100",
      variables: "p_{af}: Publicaciones Autor\xEDa Femenina; P_{t}: Total Publicaciones",
      fuenteAdministrativa: "PENDIENTE",
      responsableCalculo: "PENDIENTE",
      responsableVerificar: "PENDIENTE",
      instructivoCalculo: "-",
      fechaCorte: "2025-12-30"
    },
    {
      id: 16,
      nro: 16,
      codigo: "07DCGE-16",
      nombre: "Participaci\xF3n de mujeres en eventos de divulgaci\xF3n cient\xEDfica",
      descripcion: "Mide el porcentaje de mujeres que participan como ponentes en eventos de divulgaci\xF3n cient\xEDfica organizados por la universidad.",
      objetivo: "Promover la participaci\xF3n de mujeres en la divulgaci\xF3n cient\xEDfica.",
      area: "Investigaci\xF3n",
      dimension: "7.- Divulgaci\xF3n Cient\xEDfica",
      unidadMedida: "%",
      formula: "(N\xB0 de mujeres ponentes en eventos de divulgaci\xF3n / N\xB0 total de ponentes en eventos de divulgaci\xF3n) \xD7 100",
      frecuenciaMedicion: "Anual",
      estado: "Faltante",
      lineaBase: null,
      enlaceVisualizacion: null,
      formulaSimplificada: "\\left( \\frac{ m_{p} }{ P_{t} } \\right) \\times 100",
      variables: "m_{p}: Mujeres Ponentes; P_{t}: Total Ponentes",
      fuenteAdministrativa: "PENDIENTE",
      responsableCalculo: "PENDIENTE",
      responsableVerificar: "PENDIENTE",
      instructivoCalculo: "-",
      fechaCorte: "2025-12-30"
    },
    {
      id: 17,
      nro: 17,
      codigo: "08MCGE-17",
      nombre: "Proyectos de investigaci\xF3n con enfoque de g\xE9nero",
      descripcion: "Mide el porcentaje de proyectos de investigaci\xF3n que incorporan la perspectiva de g\xE9nero en su dise\xF1o y ejecuci\xF3n.",
      objetivo: "Promover la incorporaci\xF3n de la perspectiva de g\xE9nero en la investigaci\xF3n.",
      area: "Investigaci\xF3n",
      dimension: "8.- Mujeres en Conocimiento",
      unidadMedida: "%",
      formula: "(N\xB0 de proyectos de investigaci\xF3n con enfoque de g\xE9nero / N\xB0 total de proyectos de investigaci\xF3n) \xD7 100",
      frecuenciaMedicion: "Anual",
      estado: "Faltante",
      lineaBase: null,
      enlaceVisualizacion: null,
      formulaSimplificada: "\\left( \\frac{ p_{fg} }{ P_{t} } \\right) \\times 100",
      variables: "p_{fg}: Proyectos con Enfoque de G\xE9nero; P_{t}: Total Proyectos",
      fuenteAdministrativa: "PENDIENTE",
      responsableCalculo: "PENDIENTE",
      responsableVerificar: "PENDIENTE",
      instructivoCalculo: "-",
      fechaCorte: "2025-12-30"
    },
    {
      id: 18,
      nro: 18,
      codigo: "08MCGE-18",
      nombre: "Publicaciones en revistas de alto impacto con autor\xEDa femenina",
      descripcion: "Mide el porcentaje de publicaciones en revistas de alto impacto que cuentan con al menos una autora femenina.",
      objetivo: "Promover la participaci\xF3n de mujeres en la publicaci\xF3n cient\xEDfica de alto impacto.",
      area: "Investigaci\xF3n",
      dimension: "8.- Mujeres en Conocimiento",
      unidadMedida: "%",
      formula: "(N\xB0 de publicaciones en revistas de alto impacto con autor\xEDa femenina / N\xB0 total de publicaciones en revistas de alto impacto) \xD7 100",
      frecuenciaMedicion: "Anual",
      estado: "Faltante",
      lineaBase: null,
      enlaceVisualizacion: null,
      formulaSimplificada: "\\left( \\frac{ p_{ai} }{ P_{ti} } \\right) \\times 100",
      variables: "p_{ai}: Publicaciones Alto Impacto; P_{ti}: Total Publicaciones Alto Impacto",
      fuenteAdministrativa: "PENDIENTE",
      responsableCalculo: "PENDIENTE",
      responsableVerificar: "PENDIENTE",
      instructivoCalculo: "-",
      fechaCorte: "2025-12-30"
    },
    {
      id: 19,
      nro: 19,
      codigo: "08MCGE-19",
      nombre: "Participaci\xF3n de mujeres en comit\xE9s editoriales de revistas cient\xEDficas",
      descripcion: "Mide el porcentaje de mujeres que participan en comit\xE9s editoriales de revistas cient\xEDficas de la universidad.",
      objetivo: "Promover la participaci\xF3n de mujeres en la gesti\xF3n editorial cient\xEDfica.",
      area: "Investigaci\xF3n",
      dimension: "8.- Mujeres en Conocimiento",
      unidadMedida: "%",
      formula: "(N\xB0 de mujeres en comit\xE9s editoriales / N\xB0 total de miembros de comit\xE9s editoriales) \xD7 100",
      frecuenciaMedicion: "Anual",
      estado: "Faltante",
      lineaBase: null,
      enlaceVisualizacion: null,
      formulaSimplificada: "\\left( \\frac{ m_{ce} }{ M_{ce} } \\right) \\times 100",
      variables: "m_{ce}: Mujeres Comit\xE9s Editoriales; M_{ce}: Total Comit\xE9s Editoriales",
      fuenteAdministrativa: "PENDIENTE",
      responsableCalculo: "PENDIENTE",
      responsableVerificar: "PENDIENTE",
      instructivoCalculo: "-",
      fechaCorte: "2025-12-30"
    }
  ],
  reportesAgrupados: [
    {
      id: "agrupado-areas",
      titulo: "Estado Agrupado por \xC1reas",
      descripcion: "Visualizaci\xF3n consolidada de indicadores seg\xFAn \xE1reas estrat\xE9gicas institucionales.",
      iframeSrc: "https://app.powerbi.com/view?r=eyJrIjoiY2E5ZmMxYjctM2M0Yy00YjY2LWE0ZGEtYjU2YmU1YjEwYjY1IiwidCI6IjBkODQ5NzNiLThiYjctNDQ1OC05YzI5LTIxZmFiNDZmMTUyYyIsImMiOjR9&pageName=ReportSection",
      tipo: "powerbi"
    },
    {
      id: "agrupado-dimensiones",
      titulo: "Estado Agrupado por Dimensiones",
      descripcion: "An\xE1lisis detallado de indicadores agrupados por sus respectivas dimensiones.",
      iframeSrc: "https://app.powerbi.com/view?r=eyJrIjoiY2E5ZmMxYjctM2M0Yy00YjY2LWE0ZGEtYjU2YmU1YjEwYjY1IiwidCI6IjBkODQ5NzNiLThiYjctNDQ1OC05YzI5LTIxZmFiNDZmMTUyYyIsImMiOjR9&pageName=ReportSection",
      tipo: "powerbi"
    }
  ]
};

// server/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
async function startServer() {
  const app = express();
  const server = createServer(app);
  initializeIndicators(indicadores_default.indicadores, indicadores_default.reportesAgrupados);
  app.use("/api", indicators_default);
  app.get("/api/reportes-agrupados", (_req, res) => {
    try {
      const reports = getGroupedReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grouped reports" });
    }
  });
  const staticPath = process.env.NODE_ENV === "production" ? path.resolve(__dirname, "public") : path.resolve(__dirname, "..", "dist", "public");
  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
  const port = process.env.PORT || 3e3;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);

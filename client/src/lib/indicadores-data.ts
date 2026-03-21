/*
 * Datos de indicadores del Observatorio de Género
 * Estructura: categorías temáticas → indicadores → dashboards (iframe src)
 */

export interface Indicador {
  id: string;
  titulo: string;
  descripcion: string;
  iframeSrc: string;
  iframeHeight: number;
  tipo: "powerbi" | "tableau" | "placeholder";
  fuentes: string[];
  ultimaActualizacion: string;
  notasMetodologicas: string;
  unidad: string;
}

export interface Categoria {
  id: string;
  label: string;
  icono: string;
  descripcion: string;
  indicadores: Indicador[];
}

export const categorias: Categoria[] = [
  {
    id: "brecha-salarial",
    label: "Brecha Salarial",
    icono: "💰",
    descripcion: "Diferencias en remuneraciones entre hombres y mujeres por sector, cargo y nivel educacional.",
    indicadores: [
      {
        id: "brecha-salarial-general",
        titulo: "Brecha Salarial General",
        descripcion: "Diferencia porcentual entre el salario mediano de hombres y mujeres en el mercado laboral formal.",
        iframeSrc: "",
        iframeHeight: 600,
        tipo: "placeholder",
        fuentes: ["Encuesta Suplementaria de Ingresos (ESI) — INE", "Servicio de Impuestos Internos (SII)"],
        ultimaActualizacion: "Diciembre 2024",
        notasMetodologicas: "La brecha salarial se calcula como la diferencia entre el salario mediano masculino y femenino, dividida por el salario mediano masculino, expresada en porcentaje. Se excluyen trabajadores independientes sin contrato formal.",
        unidad: "Porcentaje (%)",
      },
      {
        id: "brecha-salarial-sector",
        titulo: "Brecha Salarial por Sector Económico",
        descripcion: "Análisis desagregado de brechas salariales según rama de actividad económica (CIIU Rev. 4).",
        iframeSrc: "",
        iframeHeight: 650,
        tipo: "placeholder",
        fuentes: ["Encuesta Nacional de Empleo (ENE) — INE", "Registro de Cotizantes — Superintendencia de Pensiones"],
        ultimaActualizacion: "Octubre 2024",
        notasMetodologicas: "Datos trimestrales. La clasificación sectorial sigue la CIIU Revisión 4 adaptada para Chile. Se reporta el promedio de los cuatro trimestres del año de referencia.",
        unidad: "Pesos CLP / Porcentaje",
      },
    ],
  },
  {
    id: "participacion-laboral",
    label: "Participación Laboral",
    icono: "👥",
    descripcion: "Tasas de participación, ocupación y desempleo desagregadas por sexo, edad y región.",
    indicadores: [
      {
        id: "tasa-participacion",
        titulo: "Tasa de Participación Laboral por Sexo",
        descripcion: "Porcentaje de la población en edad de trabajar que se encuentra activa en el mercado laboral, desagregado por sexo.",
        iframeSrc: "",
        iframeHeight: 580,
        tipo: "placeholder",
        fuentes: ["Encuesta Nacional de Empleo (ENE) — INE"],
        ultimaActualizacion: "Noviembre 2024",
        notasMetodologicas: "La tasa de participación laboral (TPL) se calcula como la razón entre la fuerza de trabajo y la población en edad de trabajar (15 años y más). Datos del trimestre móvil octubre-diciembre.",
        unidad: "Porcentaje (%)",
      },
      {
        id: "desempleo-genero",
        titulo: "Desempleo por Sexo y Región",
        descripcion: "Tasa de desocupación desagregada por sexo y región del país, con evolución temporal.",
        iframeSrc: "",
        iframeHeight: 620,
        tipo: "placeholder",
        fuentes: ["Encuesta Nacional de Empleo (ENE) — INE", "Ministerio del Trabajo y Previsión Social"],
        ultimaActualizacion: "Noviembre 2024",
        notasMetodologicas: "La tasa de desocupación se calcula como la proporción de personas desocupadas sobre la fuerza de trabajo total. Se presenta el promedio anual de los cuatro trimestres móviles.",
        unidad: "Porcentaje (%)",
      },
    ],
  },
  {
    id: "educacion",
    label: "Educación y Ciencia",
    icono: "🎓",
    descripcion: "Matrícula, titulación y participación en ciencia y tecnología desagregadas por sexo.",
    indicadores: [
      {
        id: "matricula-educacion-superior",
        titulo: "Matrícula en Educación Superior por Sexo",
        descripcion: "Evolución de la matrícula en educación superior (universidades, CFT, IP) desagregada por sexo y área del conocimiento.",
        iframeSrc: "",
        iframeHeight: 600,
        tipo: "placeholder",
        fuentes: ["Sistema de Información de Educación Superior (SIES) — MINEDUC"],
        ultimaActualizacion: "Junio 2024",
        notasMetodologicas: "Datos de matrícula total al 30 de abril de cada año. Incluye primer año y matrícula total. La clasificación por área del conocimiento sigue la CINE-F 2013 adaptada.",
        unidad: "Número de estudiantes / Porcentaje",
      },
      {
        id: "investigadoras",
        titulo: "Participación de Mujeres en Investigación",
        descripcion: "Proporción de investigadoras en proyectos FONDECYT y otros fondos concursables, por área disciplinaria.",
        iframeSrc: "",
        iframeHeight: 560,
        tipo: "placeholder",
        fuentes: ["ANID — Agencia Nacional de Investigación y Desarrollo", "Ministerio de Ciencias, Tecnología, Conocimiento e Innovación"],
        ultimaActualizacion: "Agosto 2024",
        notasMetodologicas: "Se contabiliza como investigadora principal o co-investigadora a toda mujer que figure en la nómina oficial del proyecto. Los datos corresponden a proyectos vigentes al 31 de diciembre del año de referencia.",
        unidad: "Porcentaje (%)",
      },
    ],
  },
  {
    id: "cargos-directivos",
    label: "Cargos Directivos",
    icono: "🏛️",
    descripcion: "Representación de mujeres en posiciones de liderazgo en el sector público y privado.",
    indicadores: [
      {
        id: "directivos-sector-publico",
        titulo: "Mujeres en Cargos Directivos del Sector Público",
        descripcion: "Proporción de mujeres en cargos de jefatura, directivos y de alta dirección pública (ADP).",
        iframeSrc: "",
        iframeHeight: 580,
        tipo: "placeholder",
        fuentes: ["Servicio Civil — Alta Dirección Pública", "DIPRES — Dirección de Presupuestos"],
        ultimaActualizacion: "Septiembre 2024",
        notasMetodologicas: "Se incluyen todos los cargos de jefatura de servicio, subdirección y jefaturas de departamento del sector público central. Los datos se obtienen del Sistema de Información de Personal (SIP) del Servicio Civil.",
        unidad: "Porcentaje (%)",
      },
      {
        id: "directivos-sector-privado",
        titulo: "Mujeres en Directorios de Empresas",
        descripcion: "Representación femenina en directorios de empresas que cotizan en bolsa y empresas del Estado.",
        iframeSrc: "",
        iframeHeight: 600,
        tipo: "placeholder",
        fuentes: ["Comisión para el Mercado Financiero (CMF)", "Sistema de Empresas Públicas (SEP)"],
        ultimaActualizacion: "Julio 2024",
        notasMetodologicas: "Datos anuales al 31 de diciembre. Para empresas privadas se consideran aquellas inscritas en el Registro de Valores de la CMF. Para empresas del Estado, se incluyen todas las sociedades del SEP.",
        unidad: "Porcentaje (%)",
      },
    ],
  },
  {
    id: "violencia-genero",
    label: "Violencia de Género",
    icono: "🛡️",
    descripcion: "Indicadores de violencia intrafamiliar, femicidios y acceso a justicia.",
    indicadores: [
      {
        id: "femicidios",
        titulo: "Femicidios Consumados y Frustrados",
        descripcion: "Registro de femicidios consumados y frustrados por región, con evolución anual.",
        iframeSrc: "",
        iframeHeight: 580,
        tipo: "placeholder",
        fuentes: ["Ministerio Público", "Carabineros de Chile — CEAD", "Servicio Nacional de la Mujer y la Equidad de Género (SernamEG)"],
        ultimaActualizacion: "Diciembre 2024",
        notasMetodologicas: "Se registran los femicidios tipificados según el artículo 390 bis del Código Penal (femicidio íntimo) y el artículo 390 ter (femicidio no íntimo). Los datos son preliminares hasta cierre del año judicial.",
        unidad: "Número de casos",
      },
      {
        id: "violencia-intrafamiliar",
        titulo: "Denuncias por Violencia Intrafamiliar",
        descripcion: "Evolución de denuncias por violencia intrafamiliar (VIF) desagregadas por sexo de la víctima y tipo de violencia.",
        iframeSrc: "",
        iframeHeight: 620,
        tipo: "placeholder",
        fuentes: ["Carabineros de Chile — CEAD", "Ministerio del Interior y Seguridad Pública"],
        ultimaActualizacion: "Noviembre 2024",
        notasMetodologicas: "Las denuncias incluyen aquellas realizadas ante Carabineros, PDI y directamente ante el Ministerio Público. Se excluyen los casos en que la víctima retiró la denuncia antes del proceso judicial.",
        unidad: "Número de denuncias",
      },
    ],
  },
  {
    id: "salud",
    label: "Salud",
    icono: "🏥",
    descripcion: "Indicadores de salud sexual y reproductiva, esperanza de vida y acceso a servicios.",
    indicadores: [
      {
        id: "esperanza-vida",
        titulo: "Esperanza de Vida al Nacer por Sexo",
        descripcion: "Evolución de la esperanza de vida al nacer desagregada por sexo y región.",
        iframeSrc: "",
        iframeHeight: 560,
        tipo: "placeholder",
        fuentes: ["Instituto Nacional de Estadísticas (INE) — Estadísticas Vitales", "Ministerio de Salud (MINSAL)"],
        ultimaActualizacion: "Junio 2024",
        notasMetodologicas: "La esperanza de vida se calcula a partir de las tablas de mortalidad elaboradas por el INE con base en el Censo de Población y estadísticas vitales. Los datos regionales son estimaciones.",
        unidad: "Años",
      },
    ],
  },
  {
    id: "uso-tiempo",
    label: "Uso del Tiempo",
    icono: "⏱️",
    descripcion: "Distribución del tiempo en trabajo remunerado, no remunerado y cuidados por sexo.",
    indicadores: [
      {
        id: "trabajo-no-remunerado",
        titulo: "Brecha en Trabajo No Remunerado",
        descripcion: "Horas semanales dedicadas al trabajo doméstico y de cuidados no remunerado, desagregadas por sexo.",
        iframeSrc: "",
        iframeHeight: 580,
        tipo: "placeholder",
        fuentes: ["Encuesta Nacional sobre Uso del Tiempo (ENUT) — INE"],
        ultimaActualizacion: "Enero 2024",
        notasMetodologicas: "Datos de la ENUT 2015. El trabajo no remunerado incluye: trabajo doméstico, cuidado de personas dependientes, trabajo voluntario y trabajo para la comunidad. La próxima medición está programada para 2025.",
        unidad: "Horas semanales",
      },
    ],
  },
];

export const kpisDestacados = [
  {
    valor: "21,3%",
    etiqueta: "Brecha salarial promedio",
    fuente: "ESI — INE, 2023",
    tendencia: "down",
    descripcion: "Diferencia porcentual en salario mediano",
  },
  {
    valor: "50,8%",
    etiqueta: "Tasa de participación laboral femenina",
    fuente: "ENE — INE, oct-dic 2023",
    tendencia: "up",
    descripcion: "Mujeres activas en el mercado laboral",
  },
  {
    valor: "56,2%",
    etiqueta: "Matrícula femenina en educación superior",
    fuente: "SIES — MINEDUC, 2023",
    tendencia: "up",
    descripcion: "Proporción de mujeres en universidades e IP",
  },
  {
    valor: "28,4%",
    etiqueta: "Mujeres en cargos directivos públicos",
    fuente: "Servicio Civil, 2023",
    tendencia: "up",
    descripcion: "Representación en Alta Dirección Pública",
  },
];

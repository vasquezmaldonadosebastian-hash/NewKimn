/*
 * Glosario — Observatorio de Indicadores de Género
 * Design: Searchable glossary with alphabetical index
 */

import { useState } from "react";
import { Search, BookMarked } from "lucide-react";

const terminos = [
  {
    termino: "Brecha de género",
    definicion: "Diferencia cuantitativa entre hombres y mujeres en cualquier dimensión medible (salarios, participación laboral, educación, etc.). Se expresa generalmente como porcentaje o ratio.",
    categoria: "General",
  },
  {
    termino: "Brecha salarial de género",
    definicion: "Diferencia porcentual entre el salario mediano o promedio de hombres y mujeres. Se calcula como: (salario masculino - salario femenino) / salario masculino × 100.",
    categoria: "Mercado Laboral",
  },
  {
    termino: "Desagregación por sexo",
    definicion: "Proceso de recopilación y presentación de datos estadísticos diferenciados por sexo (hombre/mujer), que permite identificar desigualdades de género en cualquier ámbito.",
    categoria: "Estadística",
  },
  {
    termino: "Empoderamiento económico",
    definicion: "Proceso mediante el cual las mujeres adquieren mayor control sobre los recursos económicos, incluyendo ingresos, activos y oportunidades laborales.",
    categoria: "General",
  },
  {
    termino: "Enfoque de género",
    definicion: "Marco analítico que examina las relaciones sociales entre hombres y mujeres, y las diferencias en sus roles, responsabilidades, oportunidades y necesidades, con el objetivo de identificar y corregir desigualdades.",
    categoria: "General",
  },
  {
    termino: "Femicidio",
    definicion: "Homicidio de una mujer por razones de género. En Chile, el femicidio íntimo está tipificado en el artículo 390 bis del Código Penal y el femicidio no íntimo en el artículo 390 ter.",
    categoria: "Violencia",
  },
  {
    termino: "Fuerza de trabajo",
    definicion: "Conjunto de personas en edad de trabajar (15 años y más) que se encuentran ocupadas o desocupadas. También denominada población económicamente activa (PEA).",
    categoria: "Mercado Laboral",
  },
  {
    termino: "Género",
    definicion: "Construcción social y cultural que asigna roles, comportamientos, actividades y atributos considerados apropiados para hombres y mujeres en una sociedad determinada. Se distingue del sexo biológico.",
    categoria: "General",
  },
  {
    termino: "Igualdad de género",
    definicion: "Situación en que hombres y mujeres tienen los mismos derechos, responsabilidades y oportunidades en todos los ámbitos de la vida. Implica que los intereses, necesidades y prioridades de todos los géneros son igualmente considerados.",
    categoria: "General",
  },
  {
    termino: "Indicador de género",
    definicion: "Medida que señala el estado o nivel de las diferencias entre hombres y mujeres en un momento del tiempo, expresando en particular las desigualdades que resultan de la diferencia sexual o de género (INE, 2019).",
    categoria: "Estadística",
  },
  {
    termino: "Paridad de género",
    definicion: "Representación equitativa de hombres y mujeres en un ámbito determinado, generalmente expresada como una proporción de 50/50 o un rango aceptable cercano a este.",
    categoria: "General",
  },
  {
    termino: "Segregación ocupacional",
    definicion: "Concentración de hombres y mujeres en diferentes tipos de empleos u ocupaciones. La segregación horizontal se refiere a la distribución en distintas ramas; la vertical, a la distribución en distintos niveles jerárquicos.",
    categoria: "Mercado Laboral",
  },
  {
    termino: "Tasa de participación laboral",
    definicion: "Proporción de la población en edad de trabajar que forma parte de la fuerza de trabajo (ocupados + desocupados). Se calcula como: (fuerza de trabajo / población en edad de trabajar) × 100.",
    categoria: "Mercado Laboral",
  },
  {
    termino: "Techo de cristal",
    definicion: "Barrera invisible que impide a las mujeres ascender a posiciones de alta dirección o liderazgo en organizaciones, a pesar de tener las calificaciones necesarias.",
    categoria: "Mercado Laboral",
  },
  {
    termino: "Trabajo no remunerado",
    definicion: "Trabajo realizado sin remuneración económica, que incluye el trabajo doméstico, el cuidado de personas dependientes, el trabajo voluntario y el trabajo para la comunidad. Recae desproporcionadamente en las mujeres.",
    categoria: "Uso del Tiempo",
  },
  {
    termino: "Violencia de género",
    definicion: "Cualquier acto de violencia basado en el género que resulte o pueda resultar en daño físico, sexual o psicológico para la mujer, incluidas las amenazas, la coacción o la privación arbitraria de libertad (ONU, 1993).",
    categoria: "Violencia",
  },
];

const categorias = ["Todos", "General", "Mercado Laboral", "Estadística", "Violencia", "Uso del Tiempo"];

export default function Glosario() {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");

  const terminosFiltrados = terminos.filter((t) => {
    const matchBusqueda =
      t.termino.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.definicion.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoriaFiltro === "Todos" || t.categoria === categoriaFiltro;
    return matchBusqueda && matchCategoria;
  });

  return (
    <div className="min-h-screen bg-[#F5F4F8]">
      {/* Header */}
      <div
        className="bg-white border-b border-[#E8F2FF]"
        style={{ background: "linear-gradient(180deg, #E8F2FF 0%, #FFFFFF 100%)" }}
      >
        <div className="container py-10">
          <div className="flex items-center gap-2 mb-2">
            <BookMarked className="w-5 h-5 text-[#0176DE]" />
            <span className="text-xs font-semibold text-[#0176DE] uppercase tracking-wider">Referencia</span>
          </div>
          <h1
            className="text-3xl font-bold text-[#1A0A2E] mb-3"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Glosario
          </h1>
          <p className="text-gray-600 max-w-2xl leading-relaxed">
            Definiciones de los principales conceptos y términos utilizados en el Observatorio de Indicadores de Género.
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search and filter */}
          <div className="bg-white rounded-xl p-5 border border-[#E8F2FF] shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar término o definición..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-[#E8F2FF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0176DE]/30 focus:border-[#0176DE] bg-[#E8F2FF]"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaFiltro(cat)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      categoriaFiltro === cat
                        ? "bg-[#0176DE] text-white"
                        : "bg-[#E8F2FF] text-gray-600 hover:bg-[#E8F2FF] border border-[#E8F2FF]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              {terminosFiltrados.length} término{terminosFiltrados.length !== 1 ? "s" : ""} encontrado{terminosFiltrados.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Terms list */}
          <div className="space-y-3">
            {terminosFiltrados.map((t) => (
              <div
                key={t.termino}
                className="bg-white rounded-xl p-6 border border-[#E8F2FF] shadow-sm hover:border-[#0176DE]/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3
                    className="font-bold text-[#1A0A2E] text-base"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {t.termino}
                  </h3>
                  <span className="flex-shrink-0 px-2.5 py-1 bg-[#E8F2FF] text-[#03122E] text-xs font-semibold rounded-full">
                    {t.categoria}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{t.definicion}</p>
              </div>
            ))}

            {terminosFiltrados.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <BookMarked className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No se encontraron términos que coincidan con la búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * Glosario — Observatorio de Indicadores de Género
 * Design: Searchable glossary with alphabetical index
 */

import { useState } from "react";
import { Search, BookMarked } from "lucide-react";

const terminos = [
  {
    termino: "Brecha de género",
    definicion: "Corresponde a la diferencia observable entre la situación de mujeres y hombres en distintos ámbitos sociales, económicos o institucionales. En términos analíticos, la brecha permite identificar la magnitud de dichas diferencias y evaluar si estas implican ventajas o desventajas relativas entre ambos grupos. Una brecha positiva indica una posición más favorable para las mujeres respecto de los hombres, mientras que una brecha negativa refleja una situación de desventaja para ellas (INE, 2015; SIES, 2024). En el presente diagnóstico, este concepto se utiliza para identificar desigualdades en la participación, condiciones y experiencias de mujeres y hombres en la vida universitaria.",
    categoria: "Conceptos Generales",
  },
  {
    termino: "Conciliación",
    definicion: "Se refiere a la articulación entre las responsabilidades laborales, familiares y personales, buscando compatibilizar el desempeño de las personas en estos distintos ámbitos de la vida. El concepto alude a la forma en que se organizan el tiempo y las actividades asociadas al trabajo remunerado, la vida familiar y el desarrollo personal, así como a las estrategias que permiten equilibrar dichas esferas (Cobo y Ranea, 2020).",
    categoria: "Trabajo y Cuidados",
  },
  {
    termino: "Corresponsabilidad",
    definicion: "Alude a la distribución equitativa de las responsabilidades domésticas y de cuidado entre hombres y mujeres, así como a la participación conjunta de distintos actores sociales —familias, Estado, mercado y comunidad— en la organización y provisión de los cuidados. Este enfoque busca superar la idea de que la conciliación constituye un problema individual de las mujeres, promoviendo en cambio una redistribución social de las tareas de cuidado (OIT-PNUD, 2009; ONU Mujeres, 2021).",
    categoria: "Trabajo y Cuidados",
  },
  {
    termino: "Cuidado",
    definicion: "Es un derecho humano autónomo, comprensivo del derecho a cuidar, a ser cuidado y al autocuidado (Corte IDH, 2025). Se trata de una actividad indispensable para la reproducción social y para sostener nuestras vidas, nuestro entorno y nuestro mundo que incluye cuidados físicos, emocionales y sociales. La carga de cuidados se ha concentrado históricamente en las mujeres de manera desproporcionada. En todos los contextos, la participación de las mujeres en tareas domésticas no remuneradas y su costo horario en este trabajo es mucho mayor al de los hombres (Gamba y Diz, 2021).",
    categoria: "Trabajo y Cuidados",
  },
  {
    termino: "Equidad de género",
    definicion: "Se define como la imparcialidad en el trato hacia mujeres y hombres según sus necesidades específicas. Esta imparcialidad puede implicar un trato igualitario o diferenciado con el fin de compensar desventajas históricas y sociales que afectan a las mujeres (Unesco, 2014).",
    categoria: "Conceptos Generales",
  },
  {
    termino: "Género",
    definicion: "Se entiende por género (del inglés gender) la construcción social y cultural de la feminidad y la masculinidad, tanto en lo referente a las características psicológicas que se atribuyen a cada sexo como a las pautas de su comportamiento normalizado. La diferencia sexual se naturaliza, transformándose en desigualdad cultural en detrimento histórico de las mujeres. Así, el sexo remite a los caracteres biológicos, y el género implicaría emociones, conductas, valores morales (Cobo y Ranea, 2020, p.119).",
    categoria: "Conceptos Generales",
  },
  {
    termino: "Igualdad de género",
    definicion: "Se refiere a igualdad de derechos, responsabilidades y oportunidades para hombres y mujeres, para niñas y niños. Este concepto implica que tanto los derechos como las responsabilidades y las oportunidades no están sujetas al sexo de las personas; se centra en la igualdad de derechos y oportunidades y no en que hombres y mujeres sean iguales (Unesco, 2014).",
    categoria: "Conceptos Generales",
  },
  {
    termino: "Segregación horizontal",
    definicion: "(Segregación ocupacional por género o 'paredes de cristal'): Se refiere a la concentración desproporcionada de un grupo social en ciertos sectores laborales, campos de estudio, profesiones o industrias, en lugar de una distribución uniforme, es decir da cuenta de una persistencia de áreas masculinizadas y feminizadas (OIT-PNUD, 2019, p. 6).",
    categoria: "Ámbito Laboral",
  },
  {
    termino: "Segregación vertical",
    definicion: "(Jerarquía ocupacional o 'techo de cristal'): Alude a las diferenciaciones que existen en cuanto al acceso a puestos de trabajo con distinta jerarquía entre mujeres y hombres. Se manifiesta en una alta concentración de mujeres en los escalones más bajos en sus ocupaciones y con una mayor concentración en ocupaciones no conectadas por vínculos de ascendencia y movilidad (Selamé, 2004; Bueno y Perticará 2009; ELE-INE).",
    categoria: "Ámbito Laboral",
  },
  {
    termino: "Violencia de género",
    definicion: "Cualquier acción o conducta basada en el género que cause muerte, daño o sufrimiento físico, sexual o psicológico a una persona, tanto en el ámbito público como en el privado. En el contexto de la educación superior, puede manifestarse a través de distintas prácticas que afectan la dignidad, la integridad o el bienestar de quienes integran la comunidad universitaria (Convención de Belém do Pará, 1994).",
    categoria: "Violencia de Género",
  },
  {
    termino: "Violencia psicológica",
    definicion: "Conducta que tiene por objeto causar temor o intimidación buscando controlar las conductas, sentimientos y pensamientos de la persona que está siendo agredida; atentando contra el bienestar psíquico de la/el afectada/o. Ejemplo: burlas, sobrenombres ofensivos, manipulaciones, garabatos, insultos, restricción a la libertad personal, aislamiento, amenazas (SERNAM, 2015).",
    categoria: "Violencia de Género",
  },
  {
    termino: "Violencia sexual",
    definicion: "Todo acto sexual, la tentativa de consumar un acto sexual, los comentarios o insinuaciones sexuales no deseados, o las acciones para comercializar o utilizar de cualquier otro modo la sexualidad de una persona mediante coacción por otra persona, independientemente de la relación de ésta con la víctima (OMS, 2013, p. 2).",
    categoria: "Violencia de Género",
  },
  {
    termino: "Violencia física",
    definicion: "Acción dirigida a atentar contra la integridad física de la víctima, como un mecanismo para ejercer poder y control. Ejemplos: empujones, tirones de pelo, pellizcos, cachetadas, quemaduras, rasguños, patadas, golpes de puños, golpes con objetos, ataques con armas (SERNAM, 2015).",
    categoria: "Violencia de Género",
  },
  {
    termino: "Violencia económica/patrimonial",
    definicion: "Privar de las necesidades básicas al otro u otra. Control de la víctima a través de la manipulación del dinero, privación económica, endeudamiento o que tomen control de su dinero o bienes (SERNAM, 2015).",
    categoria: "Violencia de Género",
  },
  {
    termino: "Violencia de género digital",
    definicion: "Se perpetra a través de medios digitales (redes sociales, correo, apps) y no está desconectada de la violencia machista del mundo offline (OVIGEM, 2021). Incluye manifestaciones como: la sextorsión (amenazas con difundir material íntimo), el doxing (publicación de información privada sin consentimiento), ataques de troles (cuentas coordinadas para incitar violencia), acoso sexual en línea y porno venganza.",
    categoria: "Violencia de Género",
  },
  {
    termino: "Violencia simbólica",
    definicion: "Definida por Bourdieu (2000) como aquella violencia amortiguada, insensible e invisible para sus propias víctimas, que se ejerce esencialmente a través de los caminos puramente simbólicos de la comunicación. Es una forma de poder que se ejerce directamente sobre los cuerpos al margen de cualquier coacción física, instalando normas incuestionables que orientan emociones, pensamientos y conductas.",
    categoria: "Violencia de Género",
  }
];

const categorias = ["Todos", "Conceptos Generales", "Trabajo y Cuidados", "Ámbito Laboral", "Violencia de Género"];

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
            Glosario de Género
          </h1>
          <p className="text-gray-600 max-w-2xl leading-relaxed">
            Definiciones de los principales conceptos sobre equidad, cuidados, brechas y prevención de la violencia de género, fundamentales para el diagnóstico institucional.
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

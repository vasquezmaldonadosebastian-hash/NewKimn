/*
 * IndicadorDetail — Página individual de indicador
 * Design: Estructura del Proto_observatorio_genero.html adaptada a React
 * Incluye: Hero, KPIs, Dashboard con iframe, Ficha técnica, Info cards
 * Mejoras: Fórmulas con variables dinámicas en LaTeX, instructivos completos, tipos seguros
 *
 * FIXES:
 * 1. formulaSimplificada y variables ahora vienen tipados en Indicator (no más cast con any)
 * 2. Tarjeta "Fórmula": modo inline ($) + overflow-hidden para evitar scroll horizontal
 */

import { useState } from "react";
import { ChevronDown, RefreshCw, Expand, Share2, Download, Info, ExternalLink } from "lucide-react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import type { Indicator } from "@shared/types/indicators";

interface IndicadorDetailProps {
  indicador: Indicator;
}

export default function IndicadorDetail({ indicador }: IndicadorDetailProps) {
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    fuentes: true,
    metodologia: false,
    notas: false,
  });
  const [, setIsFullscreen] = useState(false);

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tieneIframe = indicador.iframeSrc && indicador.iframeSrc.length > 0;

  const tieneInstructivo =
    indicador.instructivoCalculo &&
    indicador.instructivoCalculo !== "falta" &&
    indicador.instructivoCalculo !== "A la espera de validación" &&
    indicador.instructivoCalculo !== "-" &&
    indicador.instructivoCalculo !== "None" &&
    indicador.instructivoCalculo !== "";

  const instructivoEsUrl = tieneInstructivo && indicador.instructivoCalculo.startsWith("http");

  // Campos tipados directamente desde el servicio
  const formulaSimplificada = indicador.formulaSimplificada;
  const variables = indicador.variables;

  // La fórmula a mostrar: simplificada si existe, si no la completa
  const formulaMostrar = formulaSimplificada || indicador.formula || "Por definir";
  const formulaLarga = formulaMostrar.length > 150;

  const handleRefresh = () => {
    const iframes = document.querySelectorAll("iframe[title='Dashboard']");
    iframes.forEach((iframe) => {
      if (iframe instanceof HTMLIFrameElement) iframe.src = iframe.src;
    });
  };

  const handleFullscreen = () => {
    const iframes = document.querySelectorAll("iframe[title='Dashboard']");
    if (iframes.length > 0 && iframes[0] instanceof HTMLIFrameElement) {
      iframes[0].requestFullscreen?.();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: indicador.titulo, text: indicador.descripcion, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("URL copiada al portapapeles");
    }
  };

  const handleDownload = () => {
    alert("Descarga de reporte en desarrollo");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* ═══ HERO ═══ */}
      <section className="bg-gradient-to-br from-[#03122E] via-[#03122E] to-[#0176DE] relative overflow-hidden py-16">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-white/4 -top-48 -right-24 pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/4 -bottom-24 left-12 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-semibold uppercase tracking-wider">
            <span>📊</span> Indicador {indicador.codigo}
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {indicador.titulo}
          </h1>

          <p className="text-lg text-white/80 max-w-2xl leading-relaxed mb-8">{indicador.descripcion}</p>

          <div className="flex gap-4 flex-wrap">
            <button onClick={handleDownload} className="px-6 py-3 bg-white text-[#03122E] font-bold rounded-lg hover:shadow-lg transition-all" title="Descargar datos del indicador">
              Explorar Datos
            </button>
            <button onClick={handleDownload} className="px-6 py-3 bg-transparent border-2 border-white/40 text-white font-semibold rounded-lg hover:bg-white/12 transition-all" title="Descargar reporte en PDF">
              Descargar Reporte
            </button>
          </div>
        </div>
      </section>

      {/* ═══ WAVE SEPARATOR ═══ */}
      <div className="w-full h-12 bg-[#F8F9FA]" style={{ clipPath: "ellipse(55% 100% at 50% 0%)", marginTop: "-1px" }} />

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-[#0176DE]">
            <div className="text-sm text-gray-500 mb-2">Unidad de Medida</div>
            <div className="text-3xl font-black text-[#03122E]" style={{ fontFamily: "Montserrat, sans-serif" }}>{indicador.unidad || "N/A"}</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-[#0891B2]">
            <div className="text-sm text-gray-500 mb-2">Frecuencia</div>
            <div className="text-2xl font-bold text-[#0891B2]" style={{ fontFamily: "Montserrat, sans-serif" }}>{indicador.frecuenciaMedicion || "N/A"}</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-[#065F46]">
            <div className="text-sm text-gray-500 mb-2">Estado</div>
            <div className="text-lg font-bold text-[#065F46]">{indicador.estado || "N/A"}</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-[#92400E]">
            <div className="text-sm text-gray-500 mb-2">Corte de Datos</div>
            <div className="text-sm font-semibold text-[#92400E]">
              {indicador.fechaCorte ? new Date(indicador.fechaCorte).toLocaleDateString("es-CL") : "N/A"}
            </div>
          </div>
        </div>

        {/* ── Dashboard Card ── */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="flex items-center justify-between px-6 py-4 bg-[#E8F2FF] border-b border-[#E5D4F0]">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#27AE60]" />
              <div>
                <div className="font-semibold text-[#03122E]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {tieneIframe ? `Visualización Interactiva — ${indicador.tipo === "powerbi" ? "Power BI" : "Tableau"}` : "Visualización Pendiente"}
                </div>
                <div className="text-xs text-gray-500">Fuente: {indicador.fuenteAdministrativa || "Por definir"}</div>
              </div>
            </div>
            {tieneIframe && (
              <div className="flex items-center gap-2">
                <button onClick={handleRefresh} className="p-2 hover:bg-white/50 rounded-lg transition-colors" title="Actualizar dashboard"><RefreshCw className="w-4 h-4 text-gray-600" /></button>
                <button onClick={handleFullscreen} className="p-2 hover:bg-white/50 rounded-lg transition-colors" title="Pantalla completa"><Expand className="w-4 h-4 text-gray-600" /></button>
                <button onClick={handleShare} className="p-2 hover:bg-white/50 rounded-lg transition-colors" title="Compartir"><Share2 className="w-4 h-4 text-gray-600" /></button>
              </div>
            )}
          </div>

          <div className="relative w-full bg-gradient-to-br from-[#E8F2FF] to-[#E8F2FF] h-[75vh] min-h-[700px]">
            {tieneIframe ? (
              <iframe
                title="Dashboard"
                width="100%"
                height="100%"
                src={indicador.iframeSrc}
                frameBorder="0"
                allowFullScreen={true}
                className="w-full h-full absolute inset-0"
                style={{ display: "block" }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 px-6">
                <div className="w-20 h-20 rounded-3xl bg-[#E8F2FF] flex items-center justify-center mb-6">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-[#4B5563] mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Visualización por Configurar</h3>
                <p className="text-center text-gray-500 max-w-md mb-6">
                  Este indicador aún no cuenta con una visualización interactiva. La integración del dashboard de Power BI o Tableau está en proceso.
                </p>
                <div className="bg-white rounded-lg p-4 border border-[#E5D4F0] text-sm text-gray-600">
                  <strong>Responsable de cálculo:</strong> {indicador.responsableCalculo || "Por asignar"}
                </div>
              </div>
            )}
          </div>

          {tieneIframe && (
            <div className="flex items-center justify-between px-6 py-3 bg-[#F8F9FA] border-t border-gray-100 flex-wrap gap-3">
              <span className="text-xs text-gray-600 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#0176DE]" />
                Los datos se actualizan siguiendo el cronograma institucional de indicadores.
              </span>
              <div className="flex gap-2">
                <button onClick={handleDownload} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Descargar imagen"><Download className="w-4 h-4 text-gray-600" /></button>
              </div>
            </div>
          )}
        </div>

        {/* ── Info Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Objetivo */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#E8F2FF] flex items-center justify-center text-[#0176DE]">🎯</div>
              <h3 className="font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>Objetivo</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{indicador.objetivo || "Por definir"}</p>
          </div>

          {/* FIX: Tarjeta Fórmula — modo inline ($) + overflow-hidden */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#E0F2FE] flex items-center justify-center text-[#0891B2]">📈</div>
              <h3 className="font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>Fórmula</h3>
            </div>
            <div className="bg-gray-50 p-3 rounded flex justify-center items-center min-h-[60px] overflow-hidden">
              <span style={{ fontSize: "0.9rem" }}>
                <Latex>{`$${formulaMostrar}$`}</Latex>
              </span>
            </div>
          </div>

          {/* Periodicidad */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#D1FAE5] flex items-center justify-center text-[#065F46]">📅</div>
              <h3 className="font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>Periodicidad</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Actualización <strong>{indicador.frecuenciaMedicion}</strong> de los datos según cronograma institucional.
            </p>
          </div>
        </div>

        {/* ── Ficha Técnica (Acordeón) ── */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-[#1A0A2E]" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Ficha Técnica y Metodología
            </h2>
          </div>

          {/* Acordeón 1: Fuentes de Datos */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-3">
            <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#E8F2FF] transition-colors" onClick={() => toggleAccordion("fuentes")}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#92400E]">📊</div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Fuentes de Datos</h3>
                  <p className="text-xs text-gray-500">Sistemas de origen y organismos productores</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openAccordions.fuentes ? "rotate-180" : ""}`} />
            </button>

            {openAccordions.fuentes && (
              <div className="px-6 py-4 border-t border-gray-100 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Fuente administrativa</p>
                  <p className="text-sm text-gray-700">{indicador.fuenteAdministrativa || "Por definir"}</p>
                </div>
                {indicador.fuentes && indicador.fuentes.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">Fuentes de datos</p>
                    <ul className="space-y-1">
                      {indicador.fuentes.map((fuente, idx) => (
                        <li key={idx} className="text-sm text-gray-700">• {fuente}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Responsable de cálculo</p>
                  <p className="text-sm text-gray-700">{indicador.responsableCalculo || "Por asignar"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Responsable de verificación</p>
                  <p className="text-sm text-gray-700">{indicador.responsableVerificar || "Por asignar"}</p>
                </div>
              </div>
            )}
          </div>

          {/* Acordeón 2: Metodología */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-3">
            <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#E8F2FF] transition-colors" onClick={() => toggleAccordion("metodologia")}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] flex items-center justify-center text-[#0891B2]">📐</div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Metodología</h3>
                  <p className="text-xs text-gray-500">Fórmula de cálculo e instructivo</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openAccordions.metodologia ? "rotate-180" : ""}`} />
            </button>

            {openAccordions.metodologia && (
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Fórmula Matemática
                  </h4>

                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-4 flex justify-center overflow-x-auto min-h-[100px] items-center text-xl">
                    <Latex>{`$$${formulaMostrar.replace(/\*/g, "\\times")}$$`}</Latex>
                  </div>

                  {formulaLarga && (
                    <div className="bg-[#F0F4FF] rounded-lg p-3 mb-4 border border-[#D0D9FF] text-xs">
                      <p className="font-semibold text-[#3730A3] mb-2">📌 Nota: Fórmula simplificada</p>
                      <p className="text-gray-700">Para la definición completa de variables y componentes, consulte el instructivo detallado adjunto.</p>
                    </div>
                  )}

                  {/* Variables dinámicas */}
                  {variables ? (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm font-bold text-gray-900 mb-3">Variables de la fórmula:</p>
                      <ul className="space-y-3 text-sm text-gray-700">
                        {variables.split(";").map((variable: string, index: number) => {
                          const [simbolo, ...resto] = variable.split(":");
                          const descripcion = resto.join(":").trim();
                          if (!simbolo || !descripcion) return null;
                          return (
                            <li key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-md border border-gray-100">
                              <span className="font-bold text-[#0176DE] bg-[#E8F2FF] px-3 py-1 rounded text-center min-w-[60px]">
                                <Latex>{`$${simbolo.trim()}$`}</Latex>
                              </span>
                              <span className="leading-relaxed">{descripcion}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm font-bold text-gray-900 mb-3">Donde:</p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-3"><span className="text-[#0176DE] font-bold">•</span><span><strong>Numerador:</strong> Cantidad de elementos que cumplen el criterio de evaluación.</span></li>
                        <li className="flex gap-3"><span className="text-[#0176DE] font-bold">•</span><span><strong>Denominador:</strong> Total de elementos evaluados en el período (semestre/año).</span></li>
                        <li className="flex gap-3"><span className="text-[#0176DE] font-bold">•</span><span><strong>× 100:</strong> Factor de conversión a porcentaje (%).</span></li>
                      </ul>
                    </div>
                  )}
                </div>

                {tieneInstructivo && (
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-2">INSTRUCTIVO DETALLADO</p>
                    {instructivoEsUrl ? (
                      <a href={indicador.instructivoCalculo} target="_blank" rel="noopener noreferrer" className="text-[#0176DE] text-sm font-semibold hover:underline flex items-center gap-2">
                        📄 Ver documento de instructivo <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <p className="text-sm text-gray-600 italic">{indicador.instructivoCalculo}</p>
                    )}
                  </div>
                )}

                {!tieneInstructivo && (
                  <div className="bg-[#FEF3C7] rounded-lg p-3 border border-[#FCD34D] text-xs text-[#92400E]">
                    <p><strong>📄 Instructivo:</strong> En proceso de validación</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Acordeón 3: Información Técnica */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#E8F2FF] transition-colors" onClick={() => toggleAccordion("notas")}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D1FAE5] flex items-center justify-center text-[#065F46]">ℹ️</div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Información Técnica</h3>
                  <p className="text-xs text-gray-500">Detalles adicionales y contexto</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openAccordions.notas ? "rotate-180" : ""}`} />
            </button>

            {openAccordions.notas && (
              <div className="px-6 py-4 border-t border-gray-100 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Dimensión</p>
                  <p className="text-sm text-gray-600">{indicador.dimension || "Por definir"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Estado</p>
                  <p className="text-sm text-gray-600">{indicador.estado || "Por definir"}</p>
                </div>
                <div className="bg-[#FFF8E1] border-l-4 border-[#F59E0B] rounded-r-lg p-3 mt-4">
                  <p className="text-xs text-[#78350F]">
                    <strong>⚠️ Nota:</strong> La calidad de las cifras presentadas es de exclusiva responsabilidad de la Universidad Católica de Temuco como institución productora del indicador.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

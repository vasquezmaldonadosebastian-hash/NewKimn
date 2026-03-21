/*
 * DashboardViewer — Observatorio de Indicadores de Género
 * Design: Card flotante con sombra morada, iframe optimizado, acordeón de metodología
 * Colors: White card, purple shadow, lavender accordion bg
 */

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Maximize2,
  Calendar,
  Database,
  FileText,
  BarChart2,
  ExternalLink,
} from "lucide-react";
import type { Indicador } from "@/lib/indicadores-data";

interface DashboardViewerProps {
  indicador: Indicador;
}

export default function DashboardViewer({ indicador }: DashboardViewerProps) {
  const [metodologiaOpen, setMetodologiaOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="animate-scale-in">
      {/* Dashboard header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              className="text-2xl font-bold text-[#1A0A2E] mb-2"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {indicador.titulo}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
              {indicador.descripcion}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F2FF] text-[#03122E] text-xs font-semibold rounded-full">
              <BarChart2 className="w-3.5 h-3.5" />
              {indicador.unidad}
            </span>
          </div>
        </div>

        {/* Meta info bar */}
        <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5 text-[#0176DE]" />
            <span>Actualizado: <strong className="text-gray-700">{indicador.ultimaActualizacion}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Database className="w-3.5 h-3.5 text-[#0176DE]" />
            <span>{indicador.fuentes.length} fuente{indicador.fuentes.length !== 1 ? "s" : ""} de datos</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            <span>Datos vigentes</span>
          </div>
        </div>
      </div>

      {/* Dashboard iframe container */}
      <div className="dashboard-container">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#E8F2FF] border-b border-[#E8F2FF]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0176DE]" />
            <span className="text-xs font-medium text-[#03122E]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {indicador.tipo === "powerbi" ? "Microsoft Power BI" : indicador.tipo === "tableau" ? "Tableau" : "Visualización Interactiva"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded hover:bg-[#E8F2FF] text-gray-500 hover:text-[#0176DE] transition-colors"
              title="Pantalla completa"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              className="p-1.5 rounded hover:bg-[#E8F2FF] text-gray-500 hover:text-[#0176DE] transition-colors"
              title="Abrir en nueva pestaña"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Iframe area */}
        {indicador.iframeSrc ? (
          <iframe
            src={indicador.iframeSrc}
            height={indicador.iframeHeight}
            title={indicador.titulo}
            allowFullScreen
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
            className="w-full"
            style={{ height: `${indicador.iframeHeight}px` }}
          />
        ) : (
          /* Placeholder cuando no hay iframe configurado */
          <div
            className="flex flex-col items-center justify-center bg-gradient-to-br from-[#E8F2FF] to-[#E8F2FF]"
            style={{ height: `${indicador.iframeHeight}px` }}
          >
            <div className="text-center max-w-md px-6">
              <div className="w-16 h-16 rounded-2xl bg-[#0176DE]/10 flex items-center justify-center mx-auto mb-4">
                <BarChart2 className="w-8 h-8 text-[#0176DE]" />
              </div>
              <h3
                className="text-lg font-bold text-[#03122E] mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Dashboard por configurar
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Este espacio está reservado para el embed de Power BI o Tableau. Reemplace la propiedad <code className="bg-white px-1.5 py-0.5 rounded text-[#0176DE] text-xs font-mono">iframeSrc</code> con la URL de su dashboard.
              </p>
              <div className="flex flex-col gap-2 text-xs text-left bg-white rounded-lg p-4 border border-[#E8F2FF]">
                <div className="font-semibold text-gray-700 mb-1">Cómo integrar:</div>
                <div className="flex items-start gap-2 text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-[#0176DE] text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                  <span>Power BI: Publicar → Obtener código de inserción → Copiar URL del iframe</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-[#0176DE] text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                  <span>Tableau: Compartir → Código de inserción → URL del iframe</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-[#0176DE] text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                  <span>Pegar la URL en el campo <code className="font-mono">iframeSrc</code> del indicador correspondiente</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Metodología accordion */}
      <div className="metodologia-accordion mt-4">
        <button
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#E8F2FF] transition-colors"
          onClick={() => setMetodologiaOpen(!metodologiaOpen)}
          aria-expanded={metodologiaOpen}
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-[#0176DE]" />
            <span
              className="font-semibold text-[#1A0A2E] text-sm"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Ficha Técnica y Metodología
            </span>
          </div>
          {metodologiaOpen ? (
            <ChevronUp className="w-4 h-4 text-[#0176DE]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#0176DE]" />
          )}
        </button>

        {metodologiaOpen && (
          <div className="px-5 pb-5 border-t border-[#E8F2FF] animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              {/* Fuentes */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Database className="w-4 h-4 text-[#0176DE]" />
                  <h4
                    className="font-semibold text-[#1A0A2E] text-sm"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Fuentes de Datos
                  </h4>
                </div>
                <ul className="space-y-1.5">
                  {indicador.fuentes.map((fuente, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0176DE] mt-1.5 flex-shrink-0" />
                      {fuente}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actualización */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Calendar className="w-4 h-4 text-[#0176DE]" />
                  <h4
                    className="font-semibold text-[#1A0A2E] text-sm"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Última Actualización
                  </h4>
                </div>
                <p className="text-sm text-gray-600">{indicador.ultimaActualizacion}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Datos vigentes
                </div>
              </div>

              {/* Notas metodológicas */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2.5">
                  <FileText className="w-4 h-4 text-[#0176DE]" />
                  <h4
                    className="font-semibold text-[#1A0A2E] text-sm"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Notas Metodológicas
                  </h4>
                </div>
                <div className="bg-[#E8F2FF] rounded-lg p-4 border-l-4 border-[#0176DE]">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {indicador.notasMetodologicas}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

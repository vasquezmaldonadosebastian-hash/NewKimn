import React from "react";
import type { Indicator } from "@shared/types/indicators";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type TechnicalSheetProps = {
  indicador: Indicator;
};

export default function TechnicalSheet({ indicador }: TechnicalSheetProps) {
  const [openFuentes, setOpenFuentes] = useState(true);
  const [openInfo, setOpenInfo] = useState(false);

  const cobertura = [indicador.area, indicador.dimension].filter(Boolean).join(" — ") || "Por definir";

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-[#1A0A2E]" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Ficha Tecnica
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-3">
        <button
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#E8F2FF] transition-colors"
          onClick={() => setOpenFuentes((v) => !v)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#92400E]">DB</div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900">Fuente y Responsables</h3>
              <p className="text-xs text-gray-500">Sistemas de origen y roles</p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFuentes ? "rotate-180" : ""}`} />
        </button>

        {openFuentes && (
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
                    <li key={idx} className="text-sm text-gray-700">
                      • {fuente}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1">Responsable de calculo</p>
              <p className="text-sm text-gray-700">{indicador.responsableCalculo || "Por asignar"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1">Responsable de verificacion</p>
              <p className="text-sm text-gray-700">{indicador.responsableVerificar || "Por asignar"}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#E8F2FF] transition-colors"
          onClick={() => setOpenInfo((v) => !v)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D1FAE5] flex items-center justify-center text-[#065F46]">i</div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900">Informacion Tecnica</h3>
              <p className="text-xs text-gray-500">Periodicidad y cobertura</p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openInfo ? "rotate-180" : ""}`} />
        </button>

        {openInfo && (
          <div className="px-6 py-4 border-t border-gray-100 space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Unidad</p>
              <p className="text-sm text-gray-600">{indicador.unidad || "Por definir"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Linea base</p>
              <p className="text-sm text-gray-600">{indicador.lineaBase ?? "Por definir"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Periodicidad</p>
              <p className="text-sm text-gray-600">{indicador.frecuenciaMedicion || "Por definir"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Cobertura</p>
              <p className="text-sm text-gray-600">{cobertura}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Estado</p>
              <p className="text-sm text-gray-600">{indicador.estado || "Por definir"}</p>
            </div>
            <div className="bg-[#FFF8E1] border-l-4 border-[#F59E0B] rounded-r-lg p-3 mt-4">
              <p className="text-xs text-[#78350F]">
                <strong>Nota:</strong> La calidad de las cifras presentadas es de exclusiva responsabilidad de la institucion productora del indicador.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

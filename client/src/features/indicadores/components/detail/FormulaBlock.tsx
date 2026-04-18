import React from "react";
import type { Indicator } from "@shared/types/indicators";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

type FormulaBlockProps = {
  indicador: Indicator;
};

function safeFormulaForDisplay(formula: string) {
  return formula.replace(/\*/g, "\\times");
}

export default function FormulaBlock({ indicador }: FormulaBlockProps) {
  const [open, setOpen] = useState(true);

  const tieneInstructivo =
    Boolean(indicador.instructivoCalculo) &&
    indicador.instructivoCalculo !== "falta" &&
    indicador.instructivoCalculo !== "A la espera de validación" &&
    indicador.instructivoCalculo !== "-" &&
    indicador.instructivoCalculo !== "None";

  const instructivoEsUrl = tieneInstructivo && indicador.instructivoCalculo.startsWith("http");

  const formulaMostrar = indicador.formulaSimplificada || indicador.formula || "Por definir";
  const formulaLarga = formulaMostrar.length > 150;

  const variablesParsed = useMemo(() => {
    const raw = indicador.variables;
    if (!raw) return [];
    return raw
      .split(";")
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .map((variable) => {
        const [simbolo, ...resto] = variable.split(":");
        const descripcion = resto.join(":").trim();
        return { simbolo: simbolo?.trim() ?? "", descripcion };
      })
      .filter((v) => v.simbolo && v.descripcion);
  }, [indicador.variables]);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-3">
      <button
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#E8F2FF] transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E8F2FF] flex items-center justify-center text-[#0176DE]">fx</div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900">Metodologia</h3>
            <p className="text-xs text-gray-500">Formula de calculo e instructivo</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-6 py-4 border-t border-gray-100 space-y-4">
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-2">FORMULA MATEMATICA</p>
            <div className="bg-[#EEF2FF] rounded-lg p-4 border border-[#C7D2FE] overflow-hidden">
              {formulaLarga && (
                <p className="font-semibold text-[#3730A3] mb-2">Nota: formula simplificada</p>
              )}
              <div className="overflow-x-auto">
                <Latex>{`$$${safeFormulaForDisplay(formulaMostrar)}$$`}</Latex>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-semibold mb-2">VARIABLES</p>
            {variablesParsed.length > 0 ? (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-bold text-gray-900 mb-3">Variables de la formula:</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {variablesParsed.map((v, index) => (
                    <li key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-md border border-gray-100">
                      <span className="font-bold text-[#0176DE] bg-[#E8F2FF] px-3 py-1 rounded text-center min-w-[60px]">
                        <Latex>{`$${v.simbolo}$`}</Latex>
                      </span>
                      <span className="leading-relaxed">{v.descripcion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-bold text-gray-900 mb-3">Donde:</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <span className="text-[#0176DE] font-bold">•</span>
                    <span>
                      <strong>Numerador:</strong> Cantidad de elementos que cumplen el criterio de evaluacion.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#0176DE] font-bold">•</span>
                    <span>
                      <strong>Denominador:</strong> Total de elementos evaluados en el periodo.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#0176DE] font-bold">•</span>
                    <span>
                      <strong>x 100:</strong> Factor de conversion a porcentaje (%).
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {indicador.notasMetodologicas && (
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-2">NOTAS METODOLOGICAS</p>
              <p className="text-sm text-gray-600 leading-relaxed">{indicador.notasMetodologicas}</p>
            </div>
          )}

          {tieneInstructivo ? (
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-2">INSTRUCTIVO DETALLADO</p>
              {instructivoEsUrl ? (
                <a
                  href={indicador.instructivoCalculo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0176DE] text-sm font-semibold hover:underline flex items-center gap-2"
                >
                  Ver documento de instructivo <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <p className="text-sm text-gray-600 italic">{indicador.instructivoCalculo}</p>
              )}
            </div>
          ) : (
            <div className="bg-[#FEF3C7] rounded-lg p-3 border border-[#FCD34D] text-xs text-[#92400E]">
              <p>
                <strong>Instructivo:</strong> En proceso de validacion
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/*
 * IndicadoresSidebar — Observatorio de Indicadores de Género
 * Design: Dark purple sidebar, collapsible category groups, active state highlight
 * Colors: #1A0A2E bg, #0176DE active, white text
 */

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Categoria } from "@/lib/indicadores-data";

interface SidebarProps {
  categorias: Categoria[];
  categoriaActiva: string;
  indicadorActivo: string;
  onSelect: (categoriaId: string, indicadorId: string) => void;
}

export default function IndicadoresSidebar({
  categorias,
  categoriaActiva,
  indicadorActivo,
  onSelect,
}: SidebarProps) {
  const [expandedCats, setExpandedCats] = useState<Set<string>>(
    new Set([categoriaActiva])
  );

  const toggleCat = (catId: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  return (
    <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
      <div className="bg-[#1A0A2E] rounded-xl overflow-hidden shadow-lg sticky top-20">
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-white/10">
          <h3
            className="text-xs font-bold text-[#FEC60D] uppercase tracking-widest"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Dimensiones
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {categorias.reduce((acc, c) => acc + c.indicadores.length, 0)} indicadores disponibles
          </p>
        </div>

        {/* Categories */}
        <nav className="py-2">
          {categorias.map((cat) => {
            const isExpanded = expandedCats.has(cat.id);
            const isCatActive = cat.id === categoriaActiva;

            return (
              <div key={cat.id}>
                {/* Category header */}
                <button
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-150 ${
                    isCatActive
                      ? "text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => toggleCat(cat.id)}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base flex-shrink-0">{cat.icono}</span>
                    <span
                      className="text-sm font-semibold truncate"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    <span className="text-xs bg-white/10 text-gray-300 px-1.5 py-0.5 rounded-full">
                      {cat.indicadores.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Indicators */}
                {isExpanded && (
                  <div className="pb-1">
                    {cat.indicadores.map((ind) => {
                      const isActive = ind.id === indicadorActivo;
                      return (
                        <button
                          key={ind.id}
                          className={`sidebar-item w-full text-left ml-0 ${isActive ? "active" : ""}`}
                          onClick={() => onSelect(cat.id, ind.id)}
                          style={{ paddingLeft: "2.5rem" }}
                        >
                          <span className="truncate text-xs leading-snug">
                            {ind.titulo}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Separator */}
                <div className="mx-4 border-b border-white/5" />
              </div>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 py-3 border-t border-white/10">
          <p className="text-xs text-gray-500 leading-relaxed">
            Datos actualizados periódicamente. Consulte la ficha técnica de cada indicador.
          </p>
        </div>
      </div>
    </aside>
  );
}

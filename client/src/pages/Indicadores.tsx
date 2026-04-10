/*
 * Indicadores — Listado de indicadores
 * Design: Grid de tarjetas con enlaces a cada indicador individual
 * Colors: #F5F4F8 bg, white cards, #0176DE accents
 */

import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ChevronRight, Search, Filter, X } from "lucide-react";
import { useIndicatorsContext } from "@/contexts/IndicatorsContext";
import type { Indicator } from "@shared/types";

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
  "1.- Institucionalización": { bg: "#E8F2FF", border: "#E5D4F0", text: "#0176DE" },
  "2.- Violencia de Género": { bg: "#FEE2E2", border: "#FECACA", text: "#DC2626" },
  "3.- Corresponsabilidad en los cuidados": { bg: "#D1FAE5", border: "#A7F3D0", text: "#059669" },
  "4.- Trayectorias laborales": { bg: "#F3E8FF", border: "#E9D5FF", text: "#7C3AED" },
  "5.- Trayectorias educativas": { bg: "#CFFAFE", border: "#A5F3FC", text: "#0891B2" },
  "6.- Modelo educativo con perspectiva de género": { bg: "#FEF3C7", border: "#FDE68A", text: "#F59E0B" },
  "7.- Divulgación Científica": { bg: "#FCE7F3", border: "#FBCFE8", text: "#EC4899" },
  "8.- Mujeres en Conocimiento": { bg: "#EDE9FE", border: "#DDD6FE", text: "#8B5CF6" },
};

const DEFAULT_COLOR = { bg: "#F0F9FF", border: "#E0F2FE", text: "#0369A1" };

export default function Indicadores() {
  const { indicators, loading, error } = useIndicatorsContext();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState("todos");
  const [filterDimension, setFilterDimension] = useState("todos");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dimensionParam = params.get("dimension");
    const areaParam = params.get("area");
    if (dimensionParam) setFilterDimension(dimensionParam);
    if (areaParam) setFilterArea(areaParam);
  }, []);

  // ✅ Áreas únicas reales desde el campo 'area' del JSON
  const areas = useMemo(() => {
    const uniqueAreas = Array.from(
      new Set(
        indicators
          .map((ind) => ind.area)
          .filter((area): area is string => !!area)
      )
    ).sort();
    return ["todos", ...uniqueAreas];
  }, [indicators]);

  // ✅ Dimensiones únicas
  const dimensiones = useMemo(() => {
    const uniqueDimensions = Array.from(
      new Set(indicators.map((ind) => ind.dimension).filter((d): d is string => !!d))
    ).sort();
    return ["todos", ...uniqueDimensions];
  }, [indicators]);

  const filtrados = useMemo(() => {
    return indicators.filter((ind) => {
      const matchesSearch =
        ind.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ind.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ind.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesArea = filterArea === "todos" || ind.area === filterArea;
      const matchesDimension = filterDimension === "todos" || ind.dimension === filterDimension;

      return matchesSearch && matchesArea && matchesDimension;
    });
  }, [indicators, searchTerm, filterArea, filterDimension]);

  const getColorForDimension = (dimension: string | undefined) => {
    if (!dimension) return DEFAULT_COLOR;
    return COLOR_MAP[dimension] ?? DEFAULT_COLOR;
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterArea("todos");
    setFilterDimension("todos");
    setLocation("/indicadores");
  };

  if (loading) return <div className="min-h-screen bg-[#F5F4F8] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0176DE]" /></div>;
  if (error) return <div className="min-h-screen bg-[#F5F4F8] flex items-center justify-center text-center"><div><div className="text-6xl mb-4">⚠️</div><h1 className="text-2xl font-bold mb-2">Error al cargar</h1><p>{error}</p></div></div>;

  return (
    <div className="min-h-screen bg-[#F5F4F8]">
      <div className="bg-white border-b border-[#E8F2FF]">
        <div className="container py-8">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <a href="/" className="hover:text-[#0176DE]">Inicio</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#0176DE] font-medium">Indicadores</span>
          </nav>
          <h1 className="text-3xl font-black text-[#03122E] mb-2">Sistema de Indicadores de Género</h1>
          <p className="text-gray-600 max-w-2xl">Explora los {indicators.length} indicadores del observatorio institucional.</p>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-[#E8F2FF] rounded-lg text-sm" />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)} className="flex-1 px-4 py-2.5 border border-[#E8F2FF] rounded-lg text-sm">
              <option value="todos">Todas las áreas</option>
              {areas.filter(a => a !== "todos").map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select value={filterDimension} onChange={(e) => setFilterDimension(e.target.value)} className="flex-1 px-4 py-2.5 border border-[#E8F2FF] rounded-lg text-sm">
              <option value="todos">Todas las dimensiones</option>
              {dimensiones.filter(d => d !== "todos").map((dimension) => (
                <option key={dimension} value={dimension}>{dimension}</option>
              ))}
            </select>
          </div>
        </div>

        {filtrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtrados.map((indicador: Indicator) => {
              const color = getColorForDimension(indicador.dimension);
              return (
                <Link key={indicador.id} href={`/indicador/${indicador.id}`} className="group h-full">
                  <div className="h-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden">
                    <div className="p-4" style={{ backgroundColor: color.bg, borderBottom: `2px solid ${color.border}` }}>
                      <div className="flex items-start justify-between mb-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: color.text, color: "white" }}>{indicador.codigo}</span>
                        <span className="text-xs font-semibold text-gray-500">{indicador.frecuenciaMedicion}</span>
                      </div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">{indicador.area}</p>
                      <p className="text-xs text-gray-600">{indicador.dimension}</p>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-[#03122E] mb-2 line-clamp-2 group-hover:text-[#0176DE]">{indicador.titulo}</h3>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">{indicador.descripcion}</p>
                      <div className="space-y-2 mb-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-xs"><span className="text-gray-500">Unidad:</span><span className="font-semibold">{indicador.unidad || "N/A"}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-gray-500">Estado:</span><span className="font-semibold px-2 py-1 rounded" style={{ backgroundColor: indicador.estado === "Oficializado" ? "#D1FAE5" : "#FEF3C7", color: indicador.estado === "Oficializado" ? "#065F46" : "#92400E" }}>{indicador.estado || "N/A"}</span></div>
                      </div>
                      <button className="w-full px-4 py-2.5 rounded-lg font-semibold text-sm text-white" style={{ backgroundColor: color.text }}>Ver Indicador →</button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-[#E8F2FF]">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold mb-2">No se encontraron indicadores</h3>
            <button onClick={handleClearFilters} className="mt-4 px-6 py-2.5 bg-[#0176DE] text-white font-semibold rounded-lg">Limpiar filtros</button>
          </div>
        )}
      </div>
    </div>
  );
}

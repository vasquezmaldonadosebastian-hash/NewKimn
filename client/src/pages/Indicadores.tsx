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

export default function Indicadores() {
  const { indicators, loading, error } = useIndicatorsContext();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState("todos");
  const [filterDimension, setFilterDimension] = useState("todos");

  // Leer parámetros de dimensión y área desde URL si existen
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dimensionParam = params.get("dimension");
    const areaParam = params.get("area");
    if (dimensionParam) {
      setFilterDimension(dimensionParam);
    }
    if (areaParam) {
      setFilterArea(areaParam);
    }
  }, []);

  // Filtrar indicadores
  const filtrados = useMemo(() => {
    return indicators.filter((ind) => {
      const matchesSearch =
        ind.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ind.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ind.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesArea = filterArea === "todos" || (ind.dimension?.includes(filterArea));
      const matchesDimension = filterDimension === "todos" || (ind.dimension === filterDimension);

      return matchesSearch && matchesArea && matchesDimension;
    });
  }, [indicators, searchTerm, filterArea, filterDimension]);

  // Obtener áreas únicas (primeras palabras de las dimensiones)
  const areas = useMemo(() => {
    const uniqueAreas = Array.from(
      new Set(
        indicators
          .map((ind) => {
            // Extraer el número de la dimensión (ej: "1.- Institucionalización" -> "1")
            const match = ind.dimension?.match(/^(\d+)\./);
            return match ? match[1] : null;
          })
          .filter(Boolean)
      )
    ).sort();
    return ["todos", ...areas];
  }, [indicators]);

  // Mapeo de áreas a nombres legibles
  const areaNames: Record<string, string> = {
    "1": "1.- Institucionalización",
    "2": "2.- Violencia de Género",
    "3": "3.- Corresponsabilidad en los cuidados",
    "4": "4.- Trayectorias laborales",
    "5": "5.- Trayectorias educativas",
    "6": "6.- Modelo educativo con perspectiva de género",
    "7": "7.- Divulgación Científica",
    "8": "8.- Mujeres en Conocimiento",
  };

  // Obtener dimensiones únicas
  const dimensiones = useMemo(() => {
    const uniqueDimensions = Array.from(new Set(indicators.map((ind) => ind.dimension).filter(Boolean)));
    return ["todos", ...uniqueDimensions.sort()];
  }, [indicators]);

  // Mapeo de colores por dimensión
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    "1.- Institucionalización": { bg: "#E8F2FF", border: "#E5D4F0", text: "#0176DE" },
    "2.- Violencia de Género": { bg: "#FEE2E2", border: "#FECACA", text: "#DC2626" },
    "3.- Corresponsabilidad en los cuidados": { bg: "#D1FAE5", border: "#A7F3D0", text: "#059669" },
    "4.- Trayectorias laborales": { bg: "#F3E8FF", border: "#E9D5FF", text: "#7C3AED" },
    "5.- Trayectorias educativas": { bg: "#CFFAFE", border: "#A5F3FC", text: "#0891B2" },
    "6.- Modelo educativo con perspectiva de género": { bg: "#FEF3C7", border: "#FDE68A", text: "#F59E0B" },
    "7.- Divulgación Científica": { bg: "#FCE7F3", border: "#FBCFE8", text: "#EC4899" },
    "8.- Mujeres en Conocimiento": { bg: "#EDE9FE", border: "#DDD6FE", text: "#8B5CF6" },
  };

  const getColorForDimension = (dimension: string) => {
    return colorMap[dimension] || { bg: "#F0F9FF", border: "#E0F2FE", text: "#0369A1" };
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterArea("todos");
    setFilterDimension("todos");
    setLocation("/indicadores");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F4F8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0176DE] mb-4" />
          <p className="text-gray-600">Cargando indicadores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F4F8] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F4F8]">
      {/* Page header */}
      <div className="bg-white border-b border-[#E8F2FF]">
        <div className="container py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <a href="/" className="hover:text-[#0176DE] transition-colors">
              Inicio
            </a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#0176DE] font-medium">Indicadores</span>
          </nav>

          <h1 className="text-3xl font-black text-[#03122E] mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Sistema de Indicadores de Género
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Explora los {indicators.length} indicadores que conforman el observatorio de género institucional. Cada indicador incluye su descripción, metodología, fuentes de datos y visualizaciones interactivas.
          </p>
        </div>
      </div>

      {/* Filters and search */}
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Search */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar indicadores"
              className="w-full pl-10 pr-4 py-2.5 border border-[#E8F2FF] rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0176DE] focus:border-transparent"
            />
          </div>

          {/* Filter by area */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              aria-label="Filtrar por área"
              className="flex-1 px-4 py-2.5 border border-[#E8F2FF] rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0176DE] focus:border-transparent"
            >
              <option value="todos">Todas las áreas</option>
              {(areas as string[]).map((area) => (
                <option key={area} value={area}>
                  {area === "todos" ? "Todas las áreas" : areaNames[area] || `Área ${area}`}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by dimension */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterDimension}
              onChange={(e) => setFilterDimension(e.target.value)}
              aria-label="Filtrar por dimensión"
              className="flex-1 px-4 py-2.5 border border-[#E8F2FF] rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0176DE] focus:border-transparent"
            >
              {(dimensiones as string[]).map((dimension) => (
                <option key={dimension} value={dimension}>
                  {dimension === "todos" ? "Todas las dimensiones" : dimension}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters and clear button */}
        {(searchTerm || filterArea !== "todos" || filterDimension !== "todos") && (
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-600">Filtros activos:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                Búsqueda: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:text-blue-900"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filterArea !== "todos" && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                Área: {areaNames[filterArea] || `Área ${filterArea}`}
                <button
                  onClick={() => setFilterArea("todos")}
                  className="hover:text-purple-900"
                  aria-label="Limpiar filtro de área"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filterDimension !== "todos" && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                Dimensión: {filterDimension}
                <button
                  onClick={() => setFilterDimension("todos")}
                  className="hover:text-green-900"
                  aria-label="Limpiar filtro de dimensión"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="ml-auto text-sm text-[#0176DE] font-semibold hover:underline"
            >
              Limpiar todo
            </button>
          </div>
        )}

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Mostrando <strong>{filtrados.length}</strong> de <strong>{indicators.length}</strong> indicadores
          </p>
        </div>

        {/* Grid de indicadores */}
        {filtrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtrados.map((indicador: Indicator) => {
              const color = getColorForDimension(indicador.dimension || "");
              return (
                <Link key={indicador.id} href={`/indicador/${indicador.id}`} className="group h-full">
                  <div
                    className="h-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#E8F2FF]"
                  >
                    {/* Header con color por dimensión */}
                    <div
                      className="p-4"
                      style={{
                        backgroundColor: color.bg,
                        borderBottom: `2px solid ${color.border}`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span
                          className="inline-block px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ backgroundColor: color.text, color: "white" }}
                        >
                          {indicador.codigo}
                        </span>
                        <span className="text-xs font-semibold text-gray-500">
                          {indicador.frecuenciaMedicion}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{indicador.dimension}</p>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3
                        className="text-lg font-bold text-[#03122E] mb-2 line-clamp-2 group-hover:text-[#0176DE] transition-colors"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {indicador.titulo}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {indicador.descripcion}
                      </p>

                      {/* Meta info */}
                      <div className="space-y-2 mb-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Unidad:</span>
                          <span className="font-semibold text-gray-700">{indicador.unidad || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Estado:</span>
                          <span
                            className="font-semibold px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: indicador.estado === "Oficializado" ? "#D1FAE5" : "#FEF3C7",
                              color: indicador.estado === "Oficializado" ? "#065F46" : "#92400E",
                            }}
                          >
                            {indicador.estado || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* CTA */}
                      <button
                        className="w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition-all"
                        style={{
                          backgroundColor: color.text,
                          color: "white",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = "0.9";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = "1";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        Ver Indicador →
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-[#E8F2FF]">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No se encontraron indicadores</h3>
            <p className="text-gray-600 text-center max-w-md">
              Intenta ajustar tus filtros de búsqueda, área o dimensión para encontrar lo que buscas.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-6 py-2.5 bg-[#0176DE] text-white font-semibold rounded-lg hover:bg-[#03122E] transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

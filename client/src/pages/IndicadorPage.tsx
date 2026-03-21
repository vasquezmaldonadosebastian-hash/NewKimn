/*
 * IndicadorPage — Página dinámica de indicador individual
 * Carga datos de la API y renderiza con el componente IndicadorDetail
 */

import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import IndicadorDetail from "@/components/IndicadorDetail";
import { ArrowLeft } from "lucide-react";
import type { Indicator } from "@shared/types";

export default function IndicadorPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [indicador, setIndicador] = useState<Indicator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIndicador = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/indicadores/${id}`);
        if (!response.ok) throw new Error("No se pudo cargar el indicador");

        const data = await response.json();
        setIndicador(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    loadIndicador();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0176DE] mb-4" />
          <p className="text-gray-600">Cargando indicador...</p>
        </div>
      </div>
    );
  }

  if (error || !indicador) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar</h1>
          <p className="text-gray-600 mb-6">{error || "Indicador no encontrado"}</p>
          <button
            onClick={() => navigate("/indicadores")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0176DE] text-white font-semibold rounded-lg hover:bg-[#03122E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Indicadores
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Back button */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <button
            onClick={() => navigate("/indicadores")}
            className="inline-flex items-center gap-2 text-[#0176DE] font-semibold hover:text-[#03122E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Indicadores
          </button>
        </div>
      </div>

      {/* Indicador Detail */}
      <IndicadorDetail indicador={indicador} />
    </>
  );
}

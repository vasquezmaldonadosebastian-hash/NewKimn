import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { GroupedReport } from "@shared/types/indicators";

export default function EstadoAgrupado() {
  const [reports, setReports] = useState<GroupedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/reportes-agrupados");
        if (!response.ok) {
          throw new Error("No se pudieron cargar los reportes agrupados");
        }
        const data = await response.json();
        setReports(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const report = reports.find((r) => r.id === "estado-agrupado") ?? reports[0] ?? null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F4F8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0176DE]" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#F5F4F8] flex items-center justify-center text-center">
        <div>
          <div className="text-6xl mb-4">âš ï¸</div>
          <h1 className="text-2xl font-bold mb-2">Error al cargar reportes</h1>
          <p>{error || "No se encontraron reportes agrupados."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F4F8]">
      <div className="bg-white border-b border-[#E8F2FF]">
        <div className="container py-8">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <a href="/" className="hover:text-[#0176DE]">
              Inicio
            </a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#0176DE] font-medium">Estado Agrupado</span>
          </nav>
          <h1 className="text-3xl font-black text-[#03122E] mb-2">
            Estado Agrupado de Indicadores
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Visualiza el estado consolidado de los indicadores por Ã¡reas estratÃ©gicas y
            dimensiones.
          </p>
        </div>
      </div>

      <div className="container py-6">
        <div className="w-full overflow-hidden rounded-lg shadow-sm border border-gray-200 bg-white mb-8">
          <div className="p-4">
            <div className="w-full max-w-[1000px] mx-auto aspect-[1000/1000]">
            <iframe
              src={report.iframeSrc}
              title={report.titulo}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen={true}
            ></iframe>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

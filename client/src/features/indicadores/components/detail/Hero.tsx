import React from "react";
import type { Indicator } from "@shared/types/indicators";
import { toast } from "sonner";

function formatFechaCorte(fechaCorte: string) {
  if (!fechaCorte) return "Por definir";
  const dt = new Date(fechaCorte);
  if (Number.isNaN(dt.getTime())) return fechaCorte;
  return dt.toLocaleDateString("es-CL");
}

type HeroProps = {
  indicador: Indicator;
};

export default function Hero({ indicador }: HeroProps) {
  const handleExplore = () => {
    toast.info("Explorar datos: funcionalidad en desarrollo.");
  };

  const handleDownload = () => {
    toast.info("Descargar reporte: funcionalidad en desarrollo.");
  };

  return (
    <section className="bg-gradient-to-br from-[#03122E] via-[#03122E] to-[#0176DE] relative overflow-hidden py-16">
      <div className="absolute w-[500px] h-[500px] rounded-full bg-white/4 -top-48 -right-24 pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-white/4 -bottom-24 left-12 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-semibold uppercase tracking-wider">
          <span>Indicador {indicador.codigo || "S/N"}</span>
          <span className="text-white/60">|</span>
          <span>{indicador.area || "Sin categoria"}</span>
          <span className="text-white/60">|</span>
          <span>Corte: {formatFechaCorte(indicador.fechaCorte)}</span>
        </div>

        <h1
          className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {indicador.titulo}
        </h1>

        <p className="text-lg text-white/80 max-w-2xl leading-relaxed mb-6">
          {indicador.descripcion}
        </p>

        {indicador.objetivo && (
          <div className="max-w-2xl mb-8 bg-white/10 border border-white/15 rounded-lg p-4 text-white/90">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
              Objetivo
            </p>
            <p className="text-sm leading-relaxed">{indicador.objetivo}</p>
          </div>
        )}

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleExplore}
            className="px-6 py-3 bg-white text-[#03122E] font-bold rounded-lg hover:shadow-lg transition-all"
            title="Explorar datos del indicador"
          >
            Explorar Datos
          </button>
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-transparent border-2 border-white/40 text-white font-semibold rounded-lg hover:bg-white/12 transition-all"
            title="Descargar reporte en PDF"
          >
            Descargar Reporte
          </button>
        </div>
      </div>
    </section>
  );
}

/*
 * Home — Kimn Género
 * Design: Hero con gradiente morado + imagen, KPIs animados, sección de dimensiones
 * Colors: #0176DE primary, #1A0A2E dark, #F5F4F8 bg
 */

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowRight, TrendingUp, TrendingDown, BarChart3, BookOpen, Users, Shield } from "lucide-react";
import { useIndicatorsContext } from "@/contexts/IndicatorsContext";

// Animated counter hook
function useCountUp(target: string, duration = 1500) {
  const [display, setDisplay] = useState(target);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          // Extract numeric part handling comma decimals (e.g. "21,3%")
          const cleaned = target.replace(/,/g, ".");
          const numericPart = parseFloat(cleaned.replace(/[^0-9.]/g, ""));
          const suffix = target.replace(/[0-9,.]/g, "");
          if (isNaN(numericPart)) {
            setDisplay(target);
            return;
          }
          const steps = 40;
          let step = 0;
          const interval = setInterval(() => {
            step++;
            const current = Math.min((numericPart / steps) * step, numericPart);
            if (step >= steps) {
              setDisplay(target);
              clearInterval(interval);
            } else {
              const decimals = target.includes(",") ? 1 : 0;
              setDisplay(current.toFixed(decimals).replace(".", ",") + suffix);
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { display, ref };
}

function KpiCard({ label, value, trend }: { label: string; value: string; trend: "up" | "down" }) {
  const { display, ref } = useCountUp(value);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="kpi-card opacity-0 animate-slide-up"
      style={{ animationFillMode: "forwards" }}
    >
      <div className="flex items-start justify-between mb-1">
        <div
          className="text-3xl font-extrabold text-[#0176DE]"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {display}
        </div>
        {trend === "up" ? (
          <TrendingUp className="w-5 h-5 text-green-500 mt-1" />
        ) : (
          <TrendingDown className="w-5 h-5 text-red-400 mt-1" />
        )}
      </div>
      <div className="text-sm font-semibold text-gray-800 mb-1">{label}</div>
    </div>
  );
}

// Mapeo de dimensiones a iconos y colores
const dimensionConfig: Record<string, { icon: string; color: string }> = {
  "1.- Institucionalización": { icon: "🏛️", color: "#0176DE" },
  "2.- Violencia de Género": { icon: "🛡️", color: "#DC2626" },
  "3.- Corresponsabilidad en los cuidados": { icon: "⚖️", color: "#059669" },
  "4.- Trayectorias laborales": { icon: "📈", color: "#7C3AED" },
  "5.- Trayectorias educativas": { icon: "📚", color: "#0891B2" },
  "6.- Modelo educativo con perspectiva de género": { icon: "🎓", color: "#F59E0B" },
  "7.- Participación equilibrada en la divulgación científica": { icon: "📢", color: "#EC4899" },
  "8.- Visibilización del aporte de las mujeres en las áreas de conocimiento": { icon: "👩‍🔬", color: "#8B5CF6" },
};

export default function Home() {
  const { indicators, loading } = useIndicatorsContext();

  // Agrupar indicadores por dimensión y contar
  const dimensionStats = useMemo(() => {
    const stats: Record<string, number> = {};
    indicators.forEach((ind) => {
      if (ind.dimension) {
        stats[ind.dimension] = (stats[ind.dimension] || 0) + 1;
      }
    });
    return Object.entries(stats)
      .map(([dimension, count]) => ({
        dimension,
        count,
        config: dimensionConfig[dimension] || { icon: "📊", color: "#6B7280" },
      }))
      .sort((a, b) => a.dimension.localeCompare(b.dimension))
      .slice(0, 8); // Mostrar solo las primeras 8
  }, [indicators]);

  const totalIndicadores = indicators.length;
  const oficializados = indicators.filter((ind) => ind.estado === "Oficializado").length;

  return (
    <div className="min-h-screen bg-[#F5F4F8]">
      {/* ─── HERO ─── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1A0A2E 0%, #03122E 40%, #0176DE 100%)",
          minHeight: "55vh",
        }}
      >
        {/* Background image overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663447566391/LYhypHEVUXKoDvuf57dpiK/hero-observatorio-mwRwNRovbtzvjPr26s6PvP.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Geometric overlay pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container relative z-10 py-16 lg:py-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-xs font-medium mb-6 border border-white/20 opacity-0 animate-slide-up"
              style={{ animationFillMode: "forwards" }}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Plataforma Institucional de Datos
            </div>

            {/* Title */}
            <h1
              className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-4 opacity-0 animate-slide-up stagger-1"
              style={{ fontFamily: 'Montserrat, sans-serif', animationFillMode: "forwards" }}
            >
              Kimn
              <br />
              <span className="text-[#FEC60D]">Género</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg text-white/75 leading-relaxed mb-8 max-w-xl opacity-0 animate-slide-up stagger-2"
              style={{ animationFillMode: "forwards" }}
            >
              Plataforma interactiva para la visualización y análisis de datos desagregados por sexo. Evidencia para el diseño de políticas públicas con enfoque de género.
            </p>

            {/* CTA */}
            <div
              className="flex flex-wrap gap-3 opacity-0 animate-slide-up stagger-3"
              style={{ animationFillMode: "forwards" }}
            >
              <Link href="/indicadores">
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#03122E] font-semibold rounded-lg hover:bg-[#E8F2FF] transition-colors shadow-lg text-sm">
                  Explorar Indicadores
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/metodologia">
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20 text-sm">
                  <BookOpen className="w-4 h-4" />
                  Ver Metodología
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 60L1440 60L1440 20C1200 55 960 5 720 30C480 55 240 5 0 20L0 60Z" fill="#F5F4F8"/>
          </svg>
        </div>
      </section>

      {/* ─── KPIs ─── */}
      <section className="container -mt-2 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Indicadores Totales" value={totalIndicadores.toString()} trend="up" />
          <KpiCard label="Areas" value={"4 Areas estrategicas"} trend="up" />
          <KpiCard label="Dimensiones" value={dimensionStats.length.toString()} trend="up" />
          <KpiCard label="Cobertura" value={"10 Unidades"} trend="up" />
        </div>
      </section>

      {/* ─── INTRO ─── */}
      <section className="container pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8F2FF] text-[#03122E] rounded-full text-xs font-semibold mb-4">
              <Users className="w-3.5 h-3.5" />
              Acerca del Observatorio
            </div>
            <h2
              className="text-3xl font-bold text-[#1A0A2E] mb-4 leading-tight"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Datos para la igualdad de género
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kimn Género es una plataforma institucional que pone a disposición del público indicadores desagregados en múltiples dimensiones relacionadas con la equidad de género.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Los indicadores se producen a partir de fuentes oficiales y son actualizados periódicamente para reflejar la situación actual de las brechas de género en la institución.
            </p>
            <blockquote className="border-l-4 border-[#0176DE] pl-4 py-2 bg-[#E8F2FF] rounded-r-lg">
              <p className="text-sm text-gray-700 italic leading-relaxed">
                "Un indicador de género es una medida que señala el estado o nivel de las diferencias entre hombres y mujeres en un momento del tiempo, expresando en particular las desigualdades que resultan de la diferencia sexual o de género."
              </p>
              <cite className="text-xs text-[#0176DE] font-medium mt-2 block">— INE, 2019</cite>
            </blockquote>
          </div>

          {/* Dimension cards */}
          <div className="grid grid-cols-2 gap-3">
            {!loading && dimensionStats.map((stat, i) => (
              <Link key={stat.dimension} href={`/indicadores?dimension=${encodeURIComponent(stat.dimension)}`}>
                <div
                  className="bg-white rounded-xl p-4 border border-[#E8F2FF] hover:border-[#0176DE] hover:shadow-md transition-all duration-200 cursor-pointer group opacity-0 animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
                >
                  <div className="text-2xl mb-2">{stat.config.icon}</div>
                  <div
                    className="text-sm font-semibold text-[#03122E] group-hover:text-[#0176DE] transition-colors leading-tight"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {stat.dimension}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {stat.count} indicador{stat.count !== 1 ? "es" : ""}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="container pb-16">
        <div
          className="rounded-2xl p-8 lg:p-12 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0176DE 0%, #173F8A 100%)" }}
        >
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="white"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-[#FEC60D]" />
                <span className="text-[#FEC60D] text-sm font-semibold uppercase tracking-wider">Datos abiertos</span>
              </div>
              <h3
                className="text-2xl lg:text-3xl font-bold mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Explore los indicadores interactivos
              </h3>
              <p className="text-white/70 text-sm max-w-lg">
                Acceda a visualizaciones dinámicas de Power BI y Tableau con datos actualizados sobre brechas de género.
              </p>
            </div>
            <Link href="/indicadores">
              <span className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0176DE] font-bold rounded-xl hover:bg-[#E8F2FF] transition-colors shadow-xl text-sm">
                Ir a Indicadores
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

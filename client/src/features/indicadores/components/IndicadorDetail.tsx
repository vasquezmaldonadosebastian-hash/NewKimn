import React from "react";
import type { Indicator } from "@shared/types/indicators";
import DashboardCard from "./detail/DashboardCard";
import FormulaBlock from "./detail/FormulaBlock";
import Hero from "./detail/Hero";
import TechnicalSheet from "./detail/TechnicalSheet";

interface IndicadorDetailProps {
  indicador: Indicator;
}

export default function IndicadorDetail({ indicador }: IndicadorDetailProps) {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Hero indicador={indicador} />
      <div
        className="w-full h-12 bg-[#F8F9FA]"
        style={{ clipPath: "ellipse(55% 100% at 50% 0%)", marginTop: "-1px" }}
      />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <DashboardCard indicador={indicador} />
        <FormulaBlock indicador={indicador} />
        <TechnicalSheet indicador={indicador} />
      </div>
    </div>
  );
}

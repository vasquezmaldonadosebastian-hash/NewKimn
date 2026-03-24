/*
 * Header — KIMN Género
 * Estética unificada, manteniendo enlaces originales y estado activo
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search } from "lucide-react";

// Tus enlaces originales intactos
const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Indicadores", href: "/indicadores" },
  { label: "Metodología", href: "/metodologia" },
  { label: "Glosario", href: "/glosario" },
  { label: "Contacto", href: "/contacto" },
];

export default function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Topbar genérica UCT para mantener la estética visual
  const topLinks = [
    { label: "CONECTA", href: "#" },
    { label: "UCT AL DÍA", href: "#" },
    { label: "TEC-UCT", href: "#" },
    { label: "CENTRO DE AYUDA", href: "#" },
    { label: "DIRECTORIO", href: "#" },
  ];

  return (
    <>
      {/* ═══ TOP BAR (Azul UCT) ═══ */}
      <div className="bg-[#0082C6] text-white hidden lg:block">
        <div className="max-w-[1320px] mx-auto px-4 h-10 flex items-center justify-end">
          <div className="flex items-center text-[11px] font-semibold tracking-wider">
            {topLinks.map((link, idx) => (
              <div key={idx} className="flex items-center">
                <a href={link.href} className="hover:text-gray-200 transition-colors px-3">
                  {link.label}
                </a>
                {idx < topLinks.length - 1 && <span className="text-white/40">|</span>}
              </div>
            ))}
            {/* Redes Sociales (Reducidas para mantener limpieza en este componente) */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/40">
              <a href="#" className="hover:text-gray-200"><svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 320 512"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg></a>
              <a href="#" className="hover:text-gray-200"><svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg></a>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MAIN HEADER ═══ */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1320px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <Link href="/">
              <div className="cursor-pointer hover:opacity-90 transition-opacity">
                {/* ⬇⬇⬇ AQUÍ CAMBIAS EL LOGO ⬇⬇⬇ 
                */}
                <gif 
                  src="/logo-uct.gif" 
                  alt="Logo KIMN" 
                  className="h-12 md:h-16 w-auto object-contain" 
                />
              </div>
            </Link>

            <div className="flex items-center gap-6">
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6">
                {navItems.map((item) => {
                  const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                  
                  return (
                    <Link key={item.href} href={item.href}>
                      <a className={`flex items-center gap-1 text-[13px] font-bold uppercase transition-colors
                        ${isActive ? "text-[#0082C6]" : "text-[#333333] hover:text-[#0082C6]"}`}
                      >
                        {item.label}
                      </a>
                    </Link>
                  );
                })}
              </nav>

              {/* Search Icon */}
              <button className="hidden lg:flex p-2 hover:bg-gray-50 rounded-full transition-colors">
                <Search className="w-5 h-5 text-[#0082C6] stroke-[2.5]" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menú de navegación"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileOpen && (
            <nav className="lg:hidden mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href}>
                    <a 
                      className={`flex justify-between items-center text-sm font-bold uppercase px-3 py-2 rounded-md transition-colors 
                        ${isActive ? "text-[#0082C6] bg-blue-50/50" : "text-gray-700 hover:text-[#0082C6] hover:bg-gray-50"}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}

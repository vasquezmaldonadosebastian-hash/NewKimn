/*
 * Header — KIMN Género
 * Incluye barra superior centrada y logo en formato gif desde __manus__
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const topLinks = [
    { label: "CONECTA", href: "#" },
    { label: "UCT AL DÍA", href: "#" },
    { label: "TEC-UCT", href: "#" },
    { label: "CENTRO DE AYUDA", href: "#" },
    { label: "DIRECTORIO", href: "#" },
    { label: "WEBMAIL", href: "#" },
    { label: "PORTAL DE PAGOS", href: "#" },
  ];

  const navItems = [
    { label: "INICIO", href: "/" },
    { label: "SOBRE EL MODELO", href: "/metodologia" },
    { label: "INDICADORES", href: "/indicadores" },
    { label: "GLOSARIO", href: "/glosario" },
    { label: "CONTACTO", href: "/contacto" },
  ];

  return (
    <>
      {/* ═══ TOP BAR (Azul Centrada) ═══ */}
      <div className="bg-[#0073CC] text-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-center">
          <div className="flex items-center text-[11px] font-semibold tracking-wider">
            {topLinks.map((link, idx) => (
              <div key={idx} className="flex items-center">
                <a href={link.href} className="hover:text-gray-200 transition-colors px-3">
                  {link.label}
                </a>
                {idx < topLinks.length - 1 && <span className="text-white/40">|</span>}
              </div>
            ))}
            
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/40">
              <a href="#" className="hover:text-gray-200"><svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 320 512"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg></a>
              <a href="#" className="hover:text-gray-200"><svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 448 512"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg></a>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MAIN HEADER (Gris) ═══ */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-6">
            
            {/* LOGO - Ruta exacta basada en la estructura de carpetas */}
            <Link href="/">
              <div className="cursor-pointer hover:opacity-90 transition-opacity">
                <img 
                  src="/__manus__/logo-uct.gif" 
                  alt="Logo KIMN" 
                  className="h-10 md:h-14 w-auto object-contain bg-[#03122E] p-1.5 rounded-md" 
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center gap-6">
              <nav className="hidden lg:flex items-center gap-6">
                {navItems.map((item) => {
                  const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                  
                  return (
                    <Link key={item.href} href={item.href}>
                      <a className={`text-[13px] font-bold transition-colors border-b-2 
                        ${isActive ? "text-[#0073CC] border-[#0073CC]" : "text-gray-700 border-transparent hover:text-[#0073CC] hover:border-[#0073CC]"}`}
                      >
                        {item.label}
                      </a>
                    </Link>
                  );
                })}
              </nav>

              {/* Search Icon */}
              <button className="hidden lg:block p-2 hover:bg-gray-50 rounded-full transition-colors">
                <Search className="w-5 h-5 text-[#0073CC] stroke-[2.5]" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
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
                      className={`block px-3 py-2 rounded-md text-sm font-bold transition-colors 
                        ${isActive ? "text-[#0073CC] bg-blue-50" : "text-gray-700 hover:text-[#0073CC] hover:bg-gray-50"}`}
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

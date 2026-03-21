/*
 * HeaderUCT — Header institucional basado en diseño de direcciongenero.uct.cl
 * Incluye: Barra azul superior con enlaces, logo UCT, navegación principal
 */

import { Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function HeaderUCT() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const topLinks = [
    { label: "CONECTA", href: "#" },
    { label: "UCT AL DÍA", href: "#" },
    { label: "TEC-UCT", href: "#" },
    { label: "CENTRO DE AYUDA", href: "#" },
    { label: "DIRECTORIO", href: "#" },
    { label: "WEBMAIL", href: "#" },
    { label: "PORTAL DE PAGOS", href: "#" },
  ];

  const mainNavLinks = [
    { label: "Inicio", href: "/" },
    { label: "Sobre el Modelo", href: "/metodologia" },
    { label: "Indicadores", href: "/indicadores" },
    { label: "Glosario", href: "/glosario" },
    { label: "Contacto", href: "/contacto" },
  ];

  return (
    <>
      {/* ═══ TOP BAR (Azul) ═══ */}
      <div className="bg-[#0066CC] text-white text-xs font-semibold">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-4 flex-wrap">
              {topLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="hover:text-blue-200 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-blue-200" title="Facebook">
                f
              </a>
              <a href="#" className="hover:text-blue-200" title="Twitter">
                𝕏
              </a>
              <a href="#" className="hover:text-blue-200" title="Instagram">
                📷
              </a>
              <a href="#" className="hover:text-blue-200" title="LinkedIn">
                in
              </a>
              <a href="#" className="hover:text-blue-200" title="YouTube">
                ▶
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MAIN HEADER ═══ */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo + Title */}
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0176DE] to-[#03122E] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  📊
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-bold text-[#03122E]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    KIMN
                  </div>
                  <div className="text-xs text-[#0176DE] font-semibold">
                    GÉNERO
                  </div>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {mainNavLinks.map((link, idx) => (
                <Link key={idx} href={link.href}>
                  <a className="text-sm font-semibold text-gray-700 hover:text-[#0176DE] transition-colors border-b-2 border-transparent hover:border-[#0176DE]">
                    {link.label}
                  </a>
                </Link>
              ))}
            </nav>

            {/* Search + Mobile Menu */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block">
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-gray-200 flex flex-col gap-3">
              {mainNavLinks.map((link, idx) => (
                <Link key={idx} href={link.href}>
                  <a className="text-sm font-semibold text-gray-700 hover:text-[#0176DE] transition-colors block py-2">
                    {link.label}
                  </a>
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}

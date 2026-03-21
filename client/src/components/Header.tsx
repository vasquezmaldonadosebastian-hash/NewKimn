/*
 * Header — KIMN Género
 * Design: Sticky header, 64px height, logo left + nav right
 * Colors: White bg with bottom border, primary UCT blue for active/hover
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

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

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
                <img src="/logo-uct.png" alt="Logo UCT" className="w-full h-full object-contain" />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-[#03122E] text-sm tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  KIMN
                </div>
                <div className="text-xs text-[#0176DE] font-medium tracking-wider uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Género
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-[#E8F2FF] text-[#03122E] font-semibold"
                        : "text-gray-600 hover:bg-[#F5F4F8] hover:text-[#0176DE]"
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-[#F5F4F8]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú de navegación"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          <nav className="container py-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#E8F2FF] text-[#03122E] font-semibold"
                        : "text-gray-600 hover:bg-[#F5F4F8] hover:text-[#0176DE]"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

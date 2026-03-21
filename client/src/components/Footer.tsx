/*
 * Footer — Observatorio de Indicadores de Género
 * Design: Dark navy footer (UCT institutional), 3 columns + bottom bar
 * Colors: #03122E bg, #0176DE accents, white text
 */

import { Link } from "wouter";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#03122E] text-white pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Column 1: Brand & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center brightness-0 invert">
                <img src="/logo-uct.png" alt="Logo UCT" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-bold text-sm tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  OBSERVATORIO
                </div>
                <div className="text-xs text-[#0176DE] font-medium tracking-wider uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Indicadores de Género
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Plataforma institucional de la Universidad Católica de Temuco para el monitoreo y análisis de brechas de género.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-5 text-[#0176DE]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Navegación
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Inicio", href: "/" },
                { label: "Indicadores", href: "/indicadores" },
                { label: "Metodología", href: "/metodologia" },
                { label: "Glosario", href: "/glosario" },
                { label: "Contacto", href: "/contacto" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-[#0176DE] opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-5 text-[#0176DE]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Contacto
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-[#0176DE] flex-shrink-0 mt-0.5" />
                <span>Av. Alemania 0422, Temuco, Chile</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-[#0176DE] flex-shrink-0" />
                <span>+56 45 220 5200</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-[#0176DE] flex-shrink-0" />
                <a href="mailto:observatorio@uct.cl" className="hover:text-white transition-colors">observatorio@uct.cl</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gray-500">
            © {currentYear} Universidad Católica de Temuco. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-6">
            <a href="https://uct.cl" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1.5">
              Sitio Institucional
              <ExternalLink className="w-3 h-3" />
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">
              Política de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

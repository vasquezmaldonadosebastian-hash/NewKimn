/*
 * FooterUCT — Footer institucional basado en diseño de direcciongenero.uct.cl
 * Incluye: Información de contacto, enlaces de interés, redes sociales
 */

import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export default function FooterUCT() {
  return (
    <footer className="bg-[#1A1A2E] text-gray-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Dirección de Género */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Dirección de Género
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#0176DE] flex-shrink-0 mt-1" />
                <p>Manuel Montt 56, Campus San Francisco, Edificio 03, 4° Nivel</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#0176DE] flex-shrink-0" />
                <a href="tel:+56452685126" className="hover:text-[#0176DE] transition-colors">
                  (45) 2 685126
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#0176DE] flex-shrink-0" />
                <a href="mailto:direcciondegenero@uct.cl" className="hover:text-[#0176DE] transition-colors">
                  direcciondegenero@uct.cl
                </a>
              </div>
            </div>
          </div>

          {/* Observatorio de Género */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Observatorio de Género
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#0176DE] flex-shrink-0 mt-1" />
                <p>Manuel Montt 56, Campus San Francisco, Edificio 07, oficina 240</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#0176DE] flex-shrink-0" />
                <a href="tel:+56452685057" className="hover:text-[#0176DE] transition-colors">
                  (45) 2 685057
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#0176DE] flex-shrink-0" />
                <a href="mailto:observatorio@uct.cl" className="hover:text-[#0176DE] transition-colors">
                  observatorio@uct.cl
                </a>
              </div>
            </div>
          </div>

          {/* Redes Sociales y Enlaces */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Síguenos
            </h3>
            <div className="flex items-center gap-4 mb-6">
              <a href="#" className="p-2 hover:bg-[#0176DE] rounded-lg transition-colors" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-[#0176DE] rounded-lg transition-colors" title="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-[#0176DE] rounded-lg transition-colors" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-[#0176DE] rounded-lg transition-colors" title="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-[#0176DE] rounded-lg transition-colors" title="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            <div className="space-y-2 text-sm">
              <a href="#" className="block hover:text-[#0176DE] transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="block hover:text-[#0176DE] transition-colors">
                Términos de Uso
              </a>
              <a href="#" className="block hover:text-[#0176DE] transition-colors">
                Accesibilidad
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          {/* Links de Interés */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-white mb-3">Enlaces de Interés</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <a href="#" className="hover:text-[#0176DE] transition-colors">
                Ministerio de la Mujer y Equidad de Género
              </a>
              <a href="#" className="hover:text-[#0176DE] transition-colors">
                Dirección de Género
              </a>
              <a href="#" className="hover:text-[#0176DE] transition-colors">
                Observatorio del Sistema Nacional de Ciencias
              </a>
              <a href="#" className="hover:text-[#0176DE] transition-colors">
                Observatorio Igualdad de Género CEPAL
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-700 text-xs text-gray-400">
            <p>TODO EL CONTENIDO © UCT 2025</p>
            <p className="mt-4 md:mt-0">
              Universidad Católica de Temuco | Dirección de Género y Observatorio de Indicadores de Género
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

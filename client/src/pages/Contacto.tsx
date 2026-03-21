/*
 * Contacto — Observatorio de Indicadores de Género
 * Design: Clean contact form with institutional info
 */

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    institucion: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      toast.success("Mensaje enviado correctamente. Nos pondremos en contacto a la brevedad.");
      setForm({ nombre: "", institucion: "", email: "", asunto: "", mensaje: "" });
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#F5F4F8]">
      {/* Header */}
      <div
        className="bg-white border-b border-[#E8F2FF]"
        style={{ background: "linear-gradient(180deg, #E8F2FF 0%, #FFFFFF 100%)" }}
      >
        <div className="container py-10">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-[#0176DE]" />
            <span className="text-xs font-semibold text-[#0176DE] uppercase tracking-wider">Comunicaciones</span>
          </div>
          <h1
            className="text-3xl font-bold text-[#1A0A2E] mb-3"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Contacto
          </h1>
          <p className="text-gray-600 max-w-2xl leading-relaxed">
            Para consultas sobre los datos, solicitudes de información o colaboraciones institucionales, utilice el formulario o los canales de contacto indicados.
          </p>
        </div>
      </div>

      <div className="container py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-[#E8F2FF] shadow-sm">
              <h2
                className="font-bold text-[#1A0A2E] mb-4 text-sm uppercase tracking-wider"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Información de Contacto
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E8F2FF] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#0176DE]" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Correo electrónico</div>
                    <a href="mailto:observatorio@uct.cl" className="text-sm text-[#0176DE] hover:underline font-medium">
                      observatorio@uct.cl
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E8F2FF] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-[#0176DE]" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Teléfono</div>
                    <span className="text-sm text-gray-700 font-medium">+56 2 XXXX XXXX</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E8F2FF] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-[#0176DE]" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Dirección</div>
                    <span className="text-sm text-gray-700">Av. Caupolicán 1296<br />Temuco, Chile</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-[#1A0A2E] rounded-xl p-6 text-white">
              <h3
                className="font-semibold text-white mb-2 text-sm"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Horario de atención
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Lunes a viernes<br />
                09:00 – 18:00 hrs.<br />
                <span className="text-gray-400">(Hora de Santiago, GMT-3)</span>
              </p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400 leading-relaxed">
                  El tiempo de respuesta habitual es de 2 a 5 días hábiles.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 border border-[#E8F2FF] shadow-sm">
              <h2
                className="font-bold text-[#1A0A2E] mb-6"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Enviar consulta
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Su nombre"
                      className="w-full px-3.5 py-2.5 border border-[#E8F2FF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0176DE]/30 focus:border-[#0176DE] bg-[#E8F2FF] placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Institución
                    </label>
                    <input
                      type="text"
                      name="institucion"
                      value={form.institucion}
                      onChange={handleChange}
                      placeholder="Organización o institución"
                      className="w-full px-3.5 py-2.5 border border-[#E8F2FF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0176DE]/30 focus:border-[#0176DE] bg-[#E8F2FF] placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Correo electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="correo@ejemplo.cl"
                    className="w-full px-3.5 py-2.5 border border-[#E8F2FF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0176DE]/30 focus:border-[#0176DE] bg-[#E8F2FF] placeholder:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Asunto <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="asunto"
                    value={form.asunto}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 border border-[#E8F2FF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0176DE]/30 focus:border-[#0176DE] bg-[#E8F2FF] text-gray-700"
                  >
                    <option value="">Seleccione un asunto</option>
                    <option value="consulta-datos">Consulta sobre datos o indicadores</option>
                    <option value="metodologia">Consulta metodológica</option>
                    <option value="colaboracion">Propuesta de colaboración institucional</option>
                    <option value="error">Reporte de error en los datos</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mensaje <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Describa su consulta con el mayor detalle posible..."
                    className="w-full px-3.5 py-2.5 border border-[#E8F2FF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0176DE]/30 focus:border-[#0176DE] bg-[#E8F2FF] placeholder:text-gray-300 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-gray-400">
                    <span className="text-red-500">*</span> Campos obligatorios
                  </p>
                  <button
                    type="submit"
                    disabled={enviando}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0176DE] text-white font-semibold rounded-lg hover:bg-[#03122E] transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                  >
                    {enviando ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar mensaje
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

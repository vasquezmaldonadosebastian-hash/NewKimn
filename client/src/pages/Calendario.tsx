/*
 * Calendario — Kimn Género
 * Design: Hero con gradiente azul/morado + iframe de Google Calendar
 */

import React from "react";

export default function Calendario() {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── HERO ─── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1A0A2E 0%, #03122E 40%, #0176DE 100%)",
          minHeight: "35vh",
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
        
        <div className="container relative z-10 py-12 lg:py-16">
          <div className="max-w-4xl">
            {/* Breadcrumb style */}
            <div className="text-white/80 text-xs mb-6">
              Inicio &gt; <span className="font-semibold text-white">Calendario de actualizaciones</span>
            </div>

            {/* Title */}
            <h1
              className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Calendario de actualizaciones
            </h1>

            {/* Description */}
            <p className="text-sm lg:text-base text-white/90 leading-relaxed max-w-3xl">
              El calendario de actualizaciones constituye una herramienta estratégica de comunicación que permite a la Universidad Católica de Temuco mantener informadas a las personas e instituciones interesadas sobre el itinerario de actualización de sus indicadores. A través de este calendario, los usuarios pueden acceder de manera centralizada y en tiempo real a fechas relevantes, hitos de publicación y procesos de actualización, facilitando la planificación, el seguimiento y la toma de decisiones. De esta forma, se promueve la transparencia, la coordinación interinstitucional y el acceso oportuno a información clave a nivel nacional.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CALENDAR CONTENT ─── */}
      <section className="container py-12 flex flex-col items-center">
        <div className="w-full max-w-4xl overflow-hidden rounded-lg shadow-sm border border-gray-200 bg-white p-4 mb-8">
          <div className="aspect-video w-full">
            <iframe 
              src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=America%2FSantiago&showPrint=0&showTitle=0&showCalendars=0&src=OTJhOTEwN2JhOGRlNTZkOGY5ZDczODA5ZGY3OTI0M2QxNTM1ZGQzMjAxNjhmN2I0YzQwMzI3NTllZTFmYTRkZkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZXMuY2wjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&src=c3VlbWs5MDdoOXVrbDllZmM0Mzgxb2dobGNvcDI5MG1AaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20&src=Y2xhc3Nyb29tMTE2NTI3ODQwNjkzMTI5MDM0MTM0QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&color=%234285f4&color=%230b8043&color=%23f09300&color=%23004d40" 
              style={{ border: "0" }} 
              width="100%" 
              height="600" 
              frameBorder="0" 
              scrolling="no"
              title="Calendario de actualizaciones"
            ></iframe>
          </div>
        </div>

        {/* Add Calendar Button */}
        <div className="flex justify-center">
          <a 
            href="https://calendar.google.com/calendar/u/1?cid=OTJhOTEwN2JhOGRlNTZkOGY5ZDczODA5ZGY3OTI0M2QxNTM1ZGQzMjAxNjhmN2I0YzQwMzI3NTllZTFmYTRkZkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-2.5 bg-[#0176DE] text-white font-semibold rounded-md hover:bg-[#0165c0] transition-colors shadow-sm text-sm"
          >
            Añadir Calendario
          </a>
        </div>
      </section>
    </div>
  );
}

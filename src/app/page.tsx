'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, BadgeCheck, Cpu } from 'lucide-react';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  return (
    <div
      className="relative min-h-screen bg-gray-950"
      style={{
        backgroundImage: 'url(/schematic-bg.jpg)',
        backgroundAttachment: isMobile ? 'scroll' : 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Global dark overlay — 88% opacity for readability */}
      <div className="fixed inset-0 bg-black/[0.88] pointer-events-none z-0" />

      {/* ─── Hero Section ─── */}
      <section className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Valida y Construye tu{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Negocio Digital
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
            La incubadora digital que evalúa tu idea con criterios realistas
            y genera MVPs funcionales listos para ejecutar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Primary CTA */}
            <Link
              href="/register"
              className="
                group inline-flex items-center justify-center gap-2
                px-8 py-4 rounded-2xl
                bg-white/10 backdrop-blur-md
                border border-white/20
                text-white text-lg font-semibold
                hover:bg-white/20 hover:scale-105
                transition-all duration-200
                shadow-2xl
              "
            >
              Comenzar Ahora
              <ArrowRight className="group-hover:translate-x-1 transition-transform duration-200" size={20} />
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/login"
              className="
                inline-flex items-center justify-center
                px-8 py-4 rounded-2xl
                bg-white/5 backdrop-blur-md
                border border-white/10
                text-white text-lg font-semibold
                hover:bg-white/10
                transition-all duration-200
              "
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Differentiators Section ─── */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-4xl mx-auto leading-tight">
              ¿Por qué Forgeon es diferente?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Evaluación honesta, criterios realistas y generación automática de tu MVP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Evaluación Conservadora */}
            <div className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="mb-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
                <ShieldCheck size={36} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Evaluación Conservadora
              </h3>
              <p className="text-white/70 text-lg leading-relaxed font-normal">
                Simulación multi-agente que evalúa tu idea con criterios defensibles y realistas. Sin proyecciones fantasiosas.
              </p>
            </div>

            {/* Card 2: Quality Gates */}
            <div className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="mb-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-200">
                <BadgeCheck size={36} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Quality Gates
              </h3>
              <p className="text-white/70 text-lg leading-relaxed font-normal">
                Bloqueos estrictos que impiden generar un MVP si tu idea no cumple estándares mínimos de viabilidad.
              </p>
            </div>

            {/* Card 3: Generación Automática de MVP */}
            <div className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="mb-5 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-200">
                <Cpu size={36} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Generación Automática de MVP
              </h3>
              <p className="text-white/70 text-lg leading-relaxed font-normal">
                Genera MVPs funcionales y ejecutables a partir de plantillas. Descárgalos y empieza a construir de inmediato.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Preview Mock Section ─── */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-4xl mx-auto leading-tight">
              Tu plataforma de incubación
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Un dashboard completo para gestionar tus ideas, evaluar viabilidad y generar tu MVP con un clic.
            </p>
          </div>

          {/* Dashboard mockup frame */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/10">
            {/* Gradient border glow */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 pointer-events-none" />

            {/* Mock browser chrome */}
            <div className="relative bg-gray-900/80 backdrop-blur-sm px-4 py-3 flex items-center gap-2 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white/5 rounded-lg px-3 py-1 text-sm text-white/40 text-center max-w-xs mx-auto">
                  app.forgeon.io/dashboard
                </div>
              </div>
            </div>

            {/* Mock dashboard content */}
            <div className="relative bg-gray-950/90 backdrop-blur-sm p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/50 text-sm mb-1">Proyectos Activos</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/50 text-sm mb-1">Evaluaciones</p>
                  <p className="text-2xl font-bold text-emerald-400">2 aprobadas</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/50 text-sm mb-1">MVPs Generados</p>
                  <p className="text-2xl font-bold text-purple-400">1 listo</p>
                </div>
              </div>

              {/* Mock project card */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold text-lg">Mi Marketplace</h4>
                    <p className="text-white/50 text-sm mt-1">Evaluación completada · Listo para build</p>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-sm font-medium">
                    BUILD_READY
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descriptive text below mockup */}
          <div className="mt-10 text-center">
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-loose">
              Gestiona múltiples proyectos, ejecuta evaluaciones con 5 agentes de IA especializados,
              genera código funcional y descárgalo como ZIP listo para ejecutar.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Final CTA Section ─── */}
      <section className="relative z-10 px-4 py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            ¿Listo para validar tu idea?
          </h2>
          <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Comienza con nuestro wizard estructurado y recibe retroalimentación honesta sobre tu concepto de negocio.
          </p>
          <Link
            href="/register"
            className="
              group inline-flex items-center gap-3
              px-10 py-5 rounded-2xl
              bg-white/10 backdrop-blur-md
              border border-white/20
              text-white text-xl font-bold
              hover:bg-white/20 hover:scale-105
              transition-all duration-200
              shadow-2xl
            "
          >
            Comenzar Ahora
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-200" size={24} />
          </Link>
          <p className="mt-6 text-white/50 text-sm">
            Sin tarjeta de crédito · Empieza a construir en minutos
          </p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-white/10 px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Forgeon. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Cpu, BadgeCheck, Sparkles } from 'lucide-react';

const slides = [
  {
    title: 'Dashboard Inteligente',
    description: 'Gestiona todos tus proyectos, evaluaciones y MVPs desde un solo lugar.',
    mockup: (
      <div className="bg-gray-950/90 rounded-xl p-5 border border-white/10 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-white/40 text-xs">Proyectos</p>
            <p className="text-xl font-bold text-white">3</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-white/40 text-xs">Evaluaciones</p>
            <p className="text-xl font-bold text-emerald-400">2</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-white/40 text-xs">MVPs</p>
            <p className="text-xl font-bold text-purple-400">1</p>
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-sm">Mi Marketplace</p>
              <p className="text-white/40 text-xs mt-1">Listo para build</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-medium">BUILD_READY</span>
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-sm">App de Delivery</p>
              <p className="text-white/40 text-xs mt-1">En evaluación</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-medium">EVALUATING</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Evaluación Multi-Agente',
    description: '5 agentes de IA especializados analizan tu idea con criterios realistas.',
    mockup: (
      <div className="bg-gray-950/90 rounded-xl p-5 border border-white/10 space-y-3">
        <div className="text-center mb-2">
          <p className="text-3xl font-bold text-white">7.4<span className="text-lg text-white/40">/10</span></p>
          <p className="text-white/40 text-xs">Puntuación Global</p>
        </div>
        {[
          { name: 'Mercado', score: 8.2, color: 'bg-emerald-500' },
          { name: 'Producto', score: 7.8, color: 'bg-blue-500' },
          { name: 'Financiero', score: 6.5, color: 'bg-yellow-500' },
          { name: 'Técnico', score: 7.9, color: 'bg-purple-500' },
          { name: 'Abogado del Diablo', score: 6.8, color: 'bg-red-500' },
        ].map((agent) => (
          <div key={agent.name} className="flex items-center gap-3">
            <p className="text-white/60 text-xs w-28 shrink-0">{agent.name}</p>
            <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
              <div className={`${agent.color} h-full rounded-full`} style={{ width: `${agent.score * 10}%` }} />
            </div>
            <p className="text-white/80 text-xs font-medium w-8 text-right">{agent.score}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Generación de MVP',
    description: 'Genera código funcional listo para ejecutar con un solo clic.',
    mockup: (
      <div className="bg-gray-950/90 rounded-xl p-5 border border-white/10 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-emerald-400 text-xs font-medium">Build completado</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3 border border-white/10 font-mono text-xs text-white/60 space-y-1">
          <p><span className="text-emerald-400">✓</span> Generando estructura...</p>
          <p><span className="text-emerald-400">✓</span> Creando páginas de auth...</p>
          <p><span className="text-emerald-400">✓</span> Configurando API routes...</p>
          <p><span className="text-emerald-400">✓</span> Dashboard generado</p>
          <p><span className="text-emerald-400">✓</span> Quality gates: PASSED</p>
          <p className="text-purple-400 mt-2">→ ZIP listo para descargar</p>
        </div>
        <button className="w-full py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-500/30 transition-colors">
          Descargar MVP
        </button>
      </div>
    ),
  },
  {
    title: 'Curso Personalizado',
    description: 'Aprende a construir tu negocio con contenido generado por IA.',
    mockup: (
      <div className="bg-gray-950/90 rounded-xl p-5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-white font-semibold text-sm">Tu Curso</p>
          <span className="text-emerald-400 text-xs font-medium">35% completado</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-1.5 mb-3">
          <div className="bg-emerald-500 h-full rounded-full" style={{ width: '35%' }} />
        </div>
        {[
          { name: 'Fundamentos', status: 'done' },
          { name: 'Modelo de Negocio', status: 'current' },
          { name: 'Stack Técnico', status: 'locked' },
          { name: 'Go to Market', status: 'locked' },
        ].map((level) => (
          <div key={level.name} className={`flex items-center gap-3 p-2 rounded-lg ${level.status === 'current' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-white/5 border border-white/5'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${level.status === 'done' ? 'bg-emerald-500 text-white' : level.status === 'current' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/30'}`}>
              {level.status === 'done' ? '✓' : level.status === 'current' ? '▶' : '🔒'}
            </div>
            <p className={`text-sm ${level.status === 'locked' ? 'text-white/30' : 'text-white/80'}`}>{level.name}</p>
          </div>
        ))}
      </div>
    ),
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const onScroll = () => setShowNav(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  // Auto-advance every 5s
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

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
      <div className="fixed inset-0 bg-black/[0.88] pointer-events-none z-0" />

      {/* ─── Navbar ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ${showNav ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/Forgeon_logo_white.png" alt="Forgeon" width={160} height={160} className="h-14 w-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all">
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero: Two-column layout ─── */}
      <section className="relative z-10 min-h-screen flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Hero content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                Valida y Construye tu{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Negocio Digital
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-lg leading-relaxed">
                La incubadora digital que evalúa tu idea con criterios realistas y genera MVPs funcionales listos para ejecutar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-gray-950 text-base font-semibold hover:bg-white/90 transition-all shadow-lg"
              >
                Comenzar Ahora
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-base font-semibold hover:bg-white/10 transition-all"
              >
                Iniciar Sesión
              </Link>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 pt-2">
              {[
                { icon: ShieldCheck, label: 'Evaluación Realista', color: 'text-blue-400' },
                { icon: BadgeCheck, label: 'Quality Gates', color: 'text-purple-400' },
                { icon: Cpu, label: 'MVP Automático', color: 'text-emerald-400' },
                { icon: Sparkles, label: 'IA Generativa', color: 'text-amber-400' },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <f.icon size={14} className={f.color} />
                  <span className="text-white/60 text-xs font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Carousel showcase */}
          <div className="relative">
            {/* Gradient glow behind */}
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl pointer-events-none" />

            <div className="relative">
              {/* Browser frame */}
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/10 bg-gray-900/50 backdrop-blur-sm">
                {/* Chrome bar */}
                <div className="px-4 py-2.5 flex items-center gap-2 border-b border-white/10 bg-gray-900/80">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-white/5 rounded px-3 py-0.5 text-xs text-white/30 text-center max-w-[200px] mx-auto">
                      app.forgeon.io
                    </div>
                  </div>
                </div>

                {/* Slide content */}
                <div className="p-5 min-h-[340px]">
                  <div className="mb-3">
                    <p className="text-white font-semibold text-sm">{slides[current].title}</p>
                    <p className="text-white/40 text-xs mt-0.5">{slides[current].description}</p>
                  </div>
                  <div className="transition-opacity duration-300">
                    {slides[current].mockup}
                  </div>
                </div>
              </div>

              {/* Carousel controls */}
              <div className="flex items-center justify-center gap-4 mt-5">
                <button onClick={prev} className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all" aria-label="Anterior">
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-purple-400' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
                <button onClick={next} className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all" aria-label="Siguiente">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Differentiators Section ─── */}
      <section className="relative z-10 px-6 py-24">
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
            <div className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="mb-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
                <ShieldCheck size={36} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Evaluación Conservadora</h3>
              <p className="text-white/70 text-lg leading-relaxed font-normal">
                Simulación multi-agente que evalúa tu idea con criterios defensibles y realistas. Sin proyecciones fantasiosas.
              </p>
            </div>
            <div className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="mb-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-200">
                <BadgeCheck size={36} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Quality Gates</h3>
              <p className="text-white/70 text-lg leading-relaxed font-normal">
                Bloqueos estrictos que impiden generar un MVP si tu idea no cumple estándares mínimos de viabilidad.
              </p>
            </div>
            <div className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="mb-5 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-200">
                <Cpu size={36} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Generación Automática de MVP</h3>
              <p className="text-white/70 text-lg leading-relaxed font-normal">
                Genera MVPs funcionales y ejecutables a partir de plantillas. Descárgalos y empieza a construir de inmediato.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Preview Mock Section ─── */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-4xl mx-auto leading-tight">
              Tu plataforma de incubación
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Un dashboard completo para gestionar tus ideas, evaluar viabilidad y generar tu MVP con un clic.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/10">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 pointer-events-none" />
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
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold text-lg">Mi Marketplace</h4>
                    <p className="text-white/50 text-sm mt-1">Evaluación completada · Listo para build</p>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-sm font-medium">BUILD_READY</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-loose">
              Gestiona múltiples proyectos, ejecuta evaluaciones con 5 agentes de IA especializados,
              genera código funcional y descárgalo como ZIP listo para ejecutar.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Final CTA Section ─── */}
      <section className="relative z-10 px-6 py-32 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/fondo_start_now.png)' }}
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Top divider line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-white/60 text-sm font-medium">Comienza gratis hoy</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            ¿Listo para validar tu idea?
          </h2>
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            Comienza con nuestro wizard estructurado y recibe retroalimentación honesta sobre tu concepto de negocio.
          </p>

          <Link
            href="/register"
            className="group inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-white text-gray-950 text-xl font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          >
            Comenzar Ahora
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-200" size={24} />
          </Link>

          <p className="mt-8 text-white/50 text-sm">
            Sin tarjeta de crédito · Empieza a construir en minutos
          </p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Forgeon. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

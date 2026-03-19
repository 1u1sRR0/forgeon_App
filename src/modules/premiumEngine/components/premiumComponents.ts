// Premium Component Library — generates modern HTML/JSX with Tailwind + design tokens

import { DesignTokens, HeroVariant } from '../designTokens/types';

export interface FeatureItem {
  name: string;
  description: string;
  icon?: string;
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

export class PremiumComponentLibrary {
  constructor(private tokens: DesignTokens) {}

  private get bg() {
    return this.tokens.colorMode === 'dark' ? 'bg-gray-950' : 'bg-white';
  }
  private get textMain() {
    return this.tokens.colorMode === 'dark' ? 'text-white' : 'text-gray-900';
  }
  private get textSub() {
    return this.tokens.colorMode === 'dark' ? 'text-gray-400' : 'text-gray-600';
  }
  private get cardBg() {
    return this.tokens.colorMode === 'dark'
      ? 'bg-white/5 border-white/10'
      : 'bg-white border-gray-200';
  }

  generateNavbar(params: { appName: string; links: string[] }): string {
    const { appName, links } = params;
    const linkItems = links
      .map(
        (l) =>
          `<a href="#${l.toLowerCase()}" class="text-sm font-medium ${this.textSub} hover:${this.textMain} transition-colors">${l}</a>`
      )
      .join('\n            ');

    return `<nav class="${this.bg} backdrop-blur-md border-b border-gray-200/10 sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16 items-center">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[${this.tokens.accentGradient.from}] to-[${this.tokens.accentGradient.to}] shadow-lg"></div>
        <span class="text-xl font-bold ${this.textMain}" style="font-family: var(--font-heading)">${appName}</span>
      </div>
      <div class="hidden md:flex items-center gap-8">
        ${linkItems}
      </div>
      <div class="flex items-center gap-3">
        <a href="/login" class="text-sm font-medium ${this.textSub} hover:${this.textMain} transition-colors">Iniciar Sesión</a>
        <a href="/register" class="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[${this.tokens.accentGradient.from}] to-[${this.tokens.accentGradient.to}] shadow-md hover:shadow-lg transition-all">Registrarse</a>
      </div>
    </div>
  </div>
</nav>`;
  }


  generateHero(params: { title: string; subtitle: string; ctaText: string; variant?: HeroVariant }): string {
    const { title, subtitle, ctaText } = params;
    const variant = params.variant ?? this.tokens.heroVariant;
    const gradientBg = `bg-gradient-to-br from-[${this.tokens.accentGradient.from}]/10 to-[${this.tokens.accentGradient.to}]/5`;

    if (variant === 'split') {
      return `<section class="${this.bg} ${gradientBg} py-20 sm:py-28 lg:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold ${this.textMain} leading-tight" style="font-family: var(--font-heading)">${title}</h1>
        <p class="mt-6 text-lg sm:text-xl ${this.textSub} leading-relaxed max-w-lg" style="font-family: var(--font-body)">${subtitle}</p>
        <div class="mt-8 flex flex-wrap gap-4">
          <a href="/register" class="px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[${this.tokens.accentGradient.from}] to-[${this.tokens.accentGradient.to}] shadow-lg hover:shadow-xl transition-all">${ctaText}</a>
          <a href="#features" class="px-8 py-3.5 rounded-xl text-base font-semibold ${this.textMain} border border-gray-300 hover:bg-gray-50 transition-all">Saber más</a>
        </div>
      </div>
      <div class="relative">
        <div class="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-[${this.tokens.accentGradient.from}]/20 to-[${this.tokens.accentGradient.to}]/20 border border-white/10 shadow-2xl flex items-center justify-center">
          <span class="text-6xl">🚀</span>
        </div>
      </div>
    </div>
  </div>
</section>`;
    }

    // Default: centered hero
    return `<section class="${this.bg} ${gradientBg} py-24 sm:py-32 lg:py-40">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[${this.tokens.colors.primary}]/10 border border-[${this.tokens.colors.primary}]/20 mb-8">
      <span class="w-2 h-2 rounded-full bg-[${this.tokens.colors.primary}] animate-pulse"></span>
      <span class="text-sm font-medium text-[${this.tokens.colors.primary}]">Nuevo</span>
    </div>
    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold ${this.textMain} leading-tight" style="font-family: var(--font-heading)">${title}</h1>
    <p class="mt-6 text-lg sm:text-xl ${this.textSub} leading-relaxed max-w-2xl mx-auto" style="font-family: var(--font-body)">${subtitle}</p>
    <div class="mt-10 flex flex-wrap justify-center gap-4">
      <a href="/register" class="px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[${this.tokens.accentGradient.from}] to-[${this.tokens.accentGradient.to}] shadow-lg hover:shadow-xl transition-all">${ctaText}</a>
      <a href="#features" class="px-8 py-3.5 rounded-xl text-base font-semibold ${this.textMain} border border-gray-300 hover:bg-gray-50 transition-all">Saber más</a>
    </div>
  </div>
</section>`;
  }

  generateFeaturesSection(params: { features: FeatureItem[] }): string {
    const { features } = params;
    const cards = features
      .map(
        (f) => `      <div class="${this.cardBg} border rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[${this.tokens.accentGradient.from}]/10 to-[${this.tokens.accentGradient.to}]/10 flex items-center justify-center mb-4">
          <span class="text-2xl">${f.icon || '✨'}</span>
        </div>
        <h3 class="text-lg font-bold ${this.textMain}" style="font-family: var(--font-heading)">${f.name}</h3>
        <p class="mt-2 text-sm ${this.textSub} leading-relaxed" style="font-family: var(--font-body)">${f.description}</p>
      </div>`
      )
      .join('\n');

    return `<section id="features" class="${this.bg} py-20 sm:py-28">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold ${this.textMain}" style="font-family: var(--font-heading)">Características</h2>
      <p class="mt-4 text-lg ${this.textSub} max-w-2xl mx-auto">Todo lo que necesitas para llevar tu negocio al siguiente nivel.</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
${cards}
    </div>
  </div>
</section>`;
  }


  generatePricingSection(params: { tiers: PricingTier[] }): string {
    const { tiers } = params;
    const cards = tiers
      .map((t) => {
        const highlight = t.highlighted
          ? `border-[${this.tokens.colors.primary}] shadow-lg shadow-[${this.tokens.colors.primary}]/10`
          : 'border-gray-200/10';
        const badge = t.highlighted
          ? `<div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[${this.tokens.accentGradient.from}] to-[${this.tokens.accentGradient.to}]">Popular</div>`
          : '';
        const featureList = t.features
          .map((f) => `          <li class="flex items-center gap-2 text-sm ${this.textSub}"><span class="text-[${this.tokens.colors.primary}]">✓</span> ${f}</li>`)
          .join('\n');

        return `      <div class="relative ${this.cardBg} border ${highlight} rounded-2xl p-6 sm:p-8">
        ${badge}
        <h3 class="text-xl font-bold ${this.textMain}">${t.name}</h3>
        <div class="mt-4 flex items-baseline gap-1">
          <span class="text-4xl font-bold ${this.textMain}">${t.price}</span>
          <span class="text-sm ${this.textSub}">/mes</span>
        </div>
        <ul class="mt-6 space-y-3">
${featureList}
        </ul>
        <a href="/register" class="mt-8 block w-full text-center px-6 py-3 rounded-xl text-sm font-semibold ${
          t.highlighted
            ? `text-white bg-gradient-to-r from-[${this.tokens.accentGradient.from}] to-[${this.tokens.accentGradient.to}] shadow-md`
            : `${this.textMain} border border-gray-300 hover:bg-gray-50`
        } transition-all">Empezar</a>
      </div>`;
      })
      .join('\n');

    return `<section id="pricing" class="${this.bg} py-20 sm:py-28">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold ${this.textMain}" style="font-family: var(--font-heading)">Planes y Precios</h2>
      <p class="mt-4 text-lg ${this.textSub} max-w-2xl mx-auto">Elige el plan que mejor se adapte a tus necesidades.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
${cards}
    </div>
  </div>
</section>`;
  }

  generateAuthPage(params: { appName: string; type: 'login' | 'register' }): string {
    const { appName, type } = params;
    const isLogin = type === 'login';
    const title = isLogin ? `Inicia sesión en ${appName}` : `Crea tu cuenta en ${appName}`;
    const btnText = isLogin ? 'Iniciar Sesión' : 'Crear Cuenta';
    const altText = isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?';
    const altLink = isLogin ? '/register' : '/login';
    const altAction = isLogin ? 'Regístrate' : 'Inicia sesión';

    const nameField = !isLogin
      ? `        <div>
          <label for="name" class="block text-sm font-medium ${this.textSub} mb-1.5">Nombre</label>
          <input id="name" name="name" type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[${this.tokens.colors.primary}] focus:border-transparent text-sm" placeholder="Tu nombre completo" />
        </div>`
      : '';

    return `<div class="min-h-screen flex items-center justify-center ${this.bg} py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full">
    <div class="text-center mb-8">
      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[${this.tokens.accentGradient.from}] to-[${this.tokens.accentGradient.to}] shadow-lg mx-auto mb-4"></div>
      <h2 class="text-2xl sm:text-3xl font-bold ${this.textMain}" style="font-family: var(--font-heading)">${title}</h2>
    </div>
    <div class="${this.cardBg} border rounded-2xl p-6 sm:p-8 shadow-sm">
      <form class="space-y-5">
${nameField}
        <div>
          <label for="email" class="block text-sm font-medium ${this.textSub} mb-1.5">Email</label>
          <input id="email" name="email" type="email" required class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[${this.tokens.colors.primary}] focus:border-transparent text-sm" placeholder="tu@email.com" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium ${this.textSub} mb-1.5">Contraseña</label>
          <input id="password" name="password" type="password" required class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[${this.tokens.colors.primary}] focus:border-transparent text-sm" placeholder="••••••••" />
        </div>
        <button type="submit" class="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[${this.tokens.accentGradient.from}] to-[${this.tokens.accentGradient.to}] shadow-md hover:shadow-lg transition-all">${btnText}</button>
      </form>
      <p class="mt-6 text-center text-sm ${this.textSub}">${altText} <a href="${altLink}" class="font-semibold text-[${this.tokens.colors.primary}] hover:underline">${altAction}</a></p>
    </div>
  </div>
</div>`;
  }


  generateDashboardLayout(params: { appName: string; entityName: string }): string {
    const { appName, entityName } = params;
    const entityPlural = entityName.toLowerCase() + 's';

    return `<div class="min-h-screen ${this.bg}">
  <aside class="fixed inset-y-0 left-0 w-64 bg-gray-950 border-r border-white/10 hidden lg:flex flex-col">
    <div class="p-6 border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[${this.tokens.accentGradient.from}] to-[${this.tokens.accentGradient.to}] shadow-lg"></div>
        <span class="text-lg font-bold text-white" style="font-family: var(--font-heading)">${appName}</span>
      </div>
    </div>
    <nav class="flex-1 p-4 space-y-1">
      <a href="/dashboard" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-white/5">📊 Dashboard</a>
      <a href="/dashboard/${entityPlural}" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">📋 ${entityName}s</a>
      <a href="/dashboard/settings" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">⚙️ Configuración</a>
    </nav>
  </aside>
  <main class="lg:ml-64 p-6 sm:p-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold ${this.textMain}" style="font-family: var(--font-heading)">Dashboard</h1>
          <p class="mt-1 text-sm ${this.textSub}">Bienvenido a ${appName}</p>
        </div>
        <a href="/dashboard/${entityPlural}/new" class="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[${this.tokens.accentGradient.from}] to-[${this.tokens.accentGradient.to}] shadow-md hover:shadow-lg transition-all">+ Nuevo ${entityName}</a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="${this.cardBg} border rounded-2xl p-6 shadow-sm">
          <p class="text-sm ${this.textSub}">Total ${entityName}s</p>
          <p class="text-3xl font-bold ${this.textMain} mt-2">0</p>
        </div>
        <div class="${this.cardBg} border rounded-2xl p-6 shadow-sm">
          <p class="text-sm ${this.textSub}">Activos</p>
          <p class="text-3xl font-bold ${this.textMain} mt-2">0</p>
        </div>
        <div class="${this.cardBg} border rounded-2xl p-6 shadow-sm">
          <p class="text-sm ${this.textSub}">Este mes</p>
          <p class="text-3xl font-bold ${this.textMain} mt-2">0</p>
        </div>
      </div>
    </div>
  </main>
</div>`;
  }

  generateFooter(params: { appName: string; links: string[] }): string {
    const { appName, links } = params;
    const linkItems = links
      .map((l) => `        <a href="#" class="text-sm ${this.textSub} hover:${this.textMain} transition-colors">${l}</a>`)
      .join('\n');

    return `<footer class="${this.bg} border-t border-gray-200/10 py-12 sm:py-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-[${this.tokens.accentGradient.from}] to-[${this.tokens.accentGradient.to}] shadow-sm"></div>
        <span class="text-lg font-bold ${this.textMain}" style="font-family: var(--font-heading)">${appName}</span>
      </div>
      <div class="flex flex-wrap items-center gap-6">
${linkItems}
      </div>
    </div>
    <div class="mt-8 pt-8 border-t border-gray-200/10 text-center">
      <p class="text-sm ${this.textSub}">© ${new Date().getFullYear()} ${appName}. Todos los derechos reservados.</p>
    </div>
  </div>
</footer>`;
  }
}

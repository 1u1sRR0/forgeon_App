// Premium Build Integration — bridges premium engine with the existing build system

import { DesignTokens } from './designTokens/types';
import { generateCssCustomProperties } from './designTokens/tokenGenerator';
import { PremiumComponentLibrary, FeatureItem, PricingTier } from './components/premiumComponents';
import { TemplateType } from '../build/types';

interface GeneratedFile {
  path: string;
  content: string;
}

interface PremiumBuildParams {
  appName: string;
  entityName: string;
  features?: FeatureItem[];
  pricingTiers?: PricingTier[];
  navLinks?: string[];
  heroTitle?: string;
  heroSubtitle?: string;
  ctaText?: string;
}

export class PremiumBuildIntegration {
  /**
   * Generates premium globals.css with design tokens injected.
   */
  static generatePremiumGlobalsCss(tokens: DesignTokens): string {
    const cssVars = generateCssCustomProperties(tokens);
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

${cssVars}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-background);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}
`;
  }

  /**
   * Generates premium files for a given template type.
   */
  static generatePremiumFiles(
    templateType: TemplateType,
    params: PremiumBuildParams,
    tokens: DesignTokens
  ): GeneratedFile[] {
    const lib = new PremiumComponentLibrary(tokens);
    const files: GeneratedFile[] = [];

    const defaultFeatures: FeatureItem[] = params.features ?? [
      { name: 'Rápido y Moderno', description: 'Construido con las últimas tecnologías para máximo rendimiento.', icon: '⚡' },
      { name: 'Seguro', description: 'Autenticación robusta y protección de datos integrada.', icon: '🔐' },
      { name: 'Escalable', description: 'Arquitectura preparada para crecer con tu negocio.', icon: '📈' },
    ];

    const defaultPricing: PricingTier[] = params.pricingTiers ?? [
      { name: 'Básico', price: 'Gratis', features: ['1 usuario', 'Funciones básicas', 'Soporte por email'] },
      { name: 'Pro', price: '$29', features: ['10 usuarios', 'Todas las funciones', 'Soporte prioritario', 'API access'], highlighted: true },
      { name: 'Enterprise', price: '$99', features: ['Usuarios ilimitados', 'Funciones avanzadas', 'Soporte 24/7', 'SLA dedicado'] },
    ];

    const navLinks = params.navLinks ?? ['Características', 'Precios', 'Contacto'];
    const heroTitle = params.heroTitle ?? `Bienvenido a ${params.appName}`;
    const heroSubtitle = params.heroSubtitle ?? 'La plataforma que necesitas para llevar tu negocio digital al siguiente nivel.';
    const ctaText = params.ctaText ?? 'Empezar Gratis';

    // Common premium files for all templates
    const navbar = lib.generateNavbar({ appName: params.appName, links: navLinks });
    const hero = lib.generateHero({ title: heroTitle, subtitle: heroSubtitle, ctaText });
    const features = lib.generateFeaturesSection({ features: defaultFeatures });
    const pricing = lib.generatePricingSection({ tiers: defaultPricing });
    const footer = lib.generateFooter({ appName: params.appName, links: ['Términos', 'Privacidad', 'Contacto'] });

    // Premium landing page (all templates get one)
    const landingHtml = this.buildLandingPage(params.appName, navbar, hero, features, pricing, footer, tokens);
    files.push({ path: 'src/app/page.tsx', content: landingHtml });

    // Premium auth pages
    files.push({ path: 'src/app/(auth)/login/page.tsx', content: this.wrapAuthPage(lib.generateAuthPage({ appName: params.appName, type: 'login' })) });
    files.push({ path: 'src/app/(auth)/register/page.tsx', content: this.wrapAuthPage(lib.generateAuthPage({ appName: params.appName, type: 'register' })) });

    // Premium globals.css
    files.push({ path: 'src/app/globals.css', content: this.generatePremiumGlobalsCss(tokens) });

    // Template-specific premium files
    switch (templateType) {
      case 'SAAS_BASIC':
      case 'MARKETPLACE_MINI':
      case 'ECOMMERCE_MINI':
        files.push({
          path: 'src/app/(dashboard)/dashboard/page.tsx',
          content: this.wrapDashboardPage(lib.generateDashboardLayout({ appName: params.appName, entityName: params.entityName })),
        });
        break;
      case 'LANDING_BLOG':
        // Landing+Blog uses the premium landing as main page, no dashboard override needed
        break;
    }

    return files;
  }

  private static buildLandingPage(
    appName: string,
    navbar: string,
    hero: string,
    features: string,
    pricing: string,
    footer: string,
    tokens: DesignTokens
  ): string {
    const bgClass = tokens.colorMode === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-gray-900';
    return `import Link from 'next/link';

export default function Home() {
  return (
    <div className="${bgClass} min-h-screen">
      {/* Navbar */}
      <div dangerouslySetInnerHTML={{ __html: \`${this.escapeTemplate(navbar)}\` }} />

      {/* Hero */}
      <div dangerouslySetInnerHTML={{ __html: \`${this.escapeTemplate(hero)}\` }} />

      {/* Features */}
      <div dangerouslySetInnerHTML={{ __html: \`${this.escapeTemplate(features)}\` }} />

      {/* Pricing */}
      <div dangerouslySetInnerHTML={{ __html: \`${this.escapeTemplate(pricing)}\` }} />

      {/* Footer */}
      <div dangerouslySetInnerHTML={{ __html: \`${this.escapeTemplate(footer)}\` }} />
    </div>
  );
}
`;
  }

  private static wrapAuthPage(html: string): string {
    return `'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${this.escapeTemplate(html)}\` }} />
  );
}
`;
  }

  private static wrapDashboardPage(html: string): string {
    return `'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${this.escapeTemplate(html)}\` }} />
  );
}
`;
  }

  private static escapeTemplate(html: string): string {
    return html.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  }
}

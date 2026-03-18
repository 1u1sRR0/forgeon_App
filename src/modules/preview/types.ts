/**
 * Tipos compartidos para el módulo de Preview Funcional de Negocio Digital.
 *
 * Estos tipos definen la estructura de datos utilizada para generar
 * landing pages HTML, extraer datos de blueprints, y exportar documentos.
 */

/** Característica del producto extraída de PRODUCT_ARCHITECT */
export interface Feature {
  name: string;
  description: string;
  icon?: string;
}

/** Beneficio derivado de las características del producto */
export interface Benefit {
  title: string;
  description: string;
}

/** Tier de pricing extraído de MONETIZATION_GTM */
export interface PricingTier {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

/** Configuración de pricing con tiers */
export interface PricingConfig {
  tiers: PricingTier[];
}

/** Paleta de colores extraída de UX_UI_AGENT */
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

/**
 * Datos estructurados para generar la landing page HTML.
 *
 * Se construye a partir de los AgentArtifacts de la GenerationSession,
 * combinando datos de BUSINESS_STRATEGIST, PRODUCT_ARCHITECT,
 * UX_UI_AGENT y MONETIZATION_GTM.
 *
 * @see Requisitos 1.1, 6.1, 6.2, 6.3, 6.4
 */
export interface LandingPageData {
  businessName: string;
  tagline: string;
  valueProposition: string;
  features: Feature[];
  benefits: Benefit[];
  pricing?: PricingConfig;
  colors: ColorPalette;
  typography: string;
  ctaText: string;
  ctaSubtext?: string;
}

/**
 * Opciones para la exportación de documentos.
 *
 * @see Requisitos 3.1, 3.2, 3.4, 3.5
 */
export interface ExportOptions {
  sessionId: string;
  projectName: string;
  format: 'zip' | 'html' | 'markdown';
}

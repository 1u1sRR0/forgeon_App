/**
 * LandingPageGenerator - Genera landing pages HTML a partir de blueprints de agentes IA.
 *
 * Este módulo orquesta la extracción de datos de los AgentArtifacts y genera
 * landing pages HTML standalone con CSS inline y diseño responsivo.
 *
 * @see Requisitos 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
 */

import type { LandingPageData } from './types';
import {
  extractFromBusinessStrategist,
  extractFromProductArchitect,
  extractFromUxUiAgent,
  extractFromMonetizationGtm,
  getDefaultLandingPageData,
} from './blueprintDataExtractor';
import prisma from '@/lib/prisma';

/**
 * Extrae datos estructurados de los AgentArtifacts para generar la landing page.
 *
 * Orquesta los extractores específicos de cada tipo de agente y combina
 * los resultados con valores por defecto como base.
 *
 * @param artifacts - Array de artefactos con agentType y content
 * @returns LandingPageData completo para generar HTML
 * @see Requisitos 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */
export function extractLandingPageData(
  artifacts: Array<{ agentType: string; content: Record<string, unknown> }>
): LandingPageData {
  // Comenzar con valores por defecto
  const data = getDefaultLandingPageData();

  // Procesar cada artefacto según su tipo
  for (const artifact of artifacts) {
    const { agentType, content } = artifact;

    switch (agentType) {
      case 'BUSINESS_STRATEGIST': {
        const extracted = extractFromBusinessStrategist(content);
        if (extracted.businessName) data.businessName = extracted.businessName;
        if (extracted.tagline) data.tagline = extracted.tagline;
        if (extracted.valueProposition) data.valueProposition = extracted.valueProposition;
        break;
      }
      case 'PRODUCT_ARCHITECT': {
        const extracted = extractFromProductArchitect(content);
        if (extracted.features && extracted.features.length > 0) {
          data.features = extracted.features;
        }
        if (extracted.benefits && extracted.benefits.length > 0) {
          data.benefits = extracted.benefits;
        }
        break;
      }
      case 'UX_UI_AGENT': {
        const extracted = extractFromUxUiAgent(content);
        if (extracted.colors) data.colors = extracted.colors;
        if (extracted.typography) data.typography = extracted.typography;
        break;
      }
      case 'MONETIZATION_GTM': {
        const extracted = extractFromMonetizationGtm(content);
        if (extracted.pricing) data.pricing = extracted.pricing;
        break;
      }
    }
  }

  return data;
}

/**
 * Genera HTML completo standalone para la landing page.
 *
 * Crea un documento HTML con:
 * - DOCTYPE, html, head con meta viewport, title, CSS inline
 * - Hero section con businessName, tagline, valueProposition, CTA
 * - Features section con todas las características
 * - Benefits section con todos los beneficios
 * - Pricing section (solo si data.pricing existe)
 * - CTA section con call-to-action
 * - Footer
 *
 * @param data - Datos estructurados de la landing page
 * @returns HTML completo como string
 * @see Requisitos 1.1, 1.2, 1.3, 1.4, 1.6
 */
export function generateLandingPageHtml(data: LandingPageData): string {
  const { colors, typography } = data;

  // Generar CSS inline
  const css = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: ${typography};
      color: ${colors.text};
      background-color: ${colors.background};
      line-height: 1.6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    /* Hero Section */
    #hero {
      background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
      color: #ffffff;
      padding: 80px 20px;
      text-align: center;
    }
    #hero h1 {
      font-size: 3rem;
      margin-bottom: 16px;
      font-weight: 800;
    }
    #hero .tagline {
      font-size: 1.5rem;
      margin-bottom: 24px;
      opacity: 0.9;
    }
    #hero .value-proposition {
      font-size: 1.1rem;
      max-width: 700px;
      margin: 0 auto 32px;
      opacity: 0.85;
    }
    .cta-button {
      display: inline-block;
      background-color: ${colors.accent};
      color: #ffffff;
      padding: 16px 40px;
      border-radius: 8px;
      text-decoration: none;
      font-size: 1.1rem;
      font-weight: 700;
      transition: transform 0.2s, box-shadow 0.2s;
      border: none;
      cursor: pointer;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    /* Features Section */
    #features {
      padding: 80px 20px;
      background-color: ${colors.background};
    }
    #features h2 {
      text-align: center;
      font-size: 2.2rem;
      margin-bottom: 48px;
      color: ${colors.text};
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 32px;
    }
    .feature-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      transition: box-shadow 0.2s;
    }
    .feature-card:hover {
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }
    .feature-icon {
      font-size: 3rem;
      margin-bottom: 16px;
    }
    .feature-card h3 {
      font-size: 1.3rem;
      margin-bottom: 12px;
      color: ${colors.primary};
    }
    .feature-card p {
      color: ${colors.secondary};
      font-size: 0.95rem;
    }

    /* Benefits Section */
    #benefits {
      padding: 80px 20px;
      background: linear-gradient(180deg, #f9fafb, ${colors.background});
    }
    #benefits h2 {
      text-align: center;
      font-size: 2.2rem;
      margin-bottom: 48px;
      color: ${colors.text};
    }
    .benefits-list {
      max-width: 800px;
      margin: 0 auto;
    }
    .benefit-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 32px;
      padding: 24px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .benefit-check {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      background-color: ${colors.accent};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: bold;
      margin-right: 16px;
      font-size: 1rem;
    }
    .benefit-item h3 {
      font-size: 1.1rem;
      margin-bottom: 4px;
      color: ${colors.text};
    }
    .benefit-item p {
      color: ${colors.secondary};
      font-size: 0.95rem;
    }

    /* Pricing Section */
    #pricing {
      padding: 80px 20px;
      background-color: ${colors.background};
    }
    #pricing h2 {
      text-align: center;
      font-size: 2.2rem;
      margin-bottom: 48px;
      color: ${colors.text};
    }
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 32px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .pricing-card {
      background: #ffffff;
      border: 2px solid #e5e7eb;
      border-radius: 16px;
      padding: 40px 32px;
      text-align: center;
      position: relative;
    }
    .pricing-card.highlighted {
      border-color: ${colors.primary};
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      transform: scale(1.05);
    }
    .pricing-card.highlighted::before {
      content: 'Recomendado';
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background-color: ${colors.primary};
      color: #ffffff;
      padding: 4px 16px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .pricing-card h3 {
      font-size: 1.4rem;
      margin-bottom: 8px;
      color: ${colors.text};
    }
    .pricing-price {
      font-size: 2.5rem;
      font-weight: 800;
      color: ${colors.primary};
      margin-bottom: 24px;
    }
    .pricing-features {
      list-style: none;
      margin-bottom: 32px;
      text-align: left;
    }
    .pricing-features li {
      padding: 8px 0;
      border-bottom: 1px solid #f3f4f6;
      color: ${colors.secondary};
      font-size: 0.95rem;
    }
    .pricing-features li::before {
      content: '✓';
      color: ${colors.accent};
      font-weight: bold;
      margin-right: 8px;
    }

    /* CTA Section */
    #cta {
      padding: 80px 20px;
      background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
      text-align: center;
      color: #ffffff;
    }
    #cta h2 {
      font-size: 2.2rem;
      margin-bottom: 16px;
    }
    #cta p {
      font-size: 1.1rem;
      margin-bottom: 32px;
      opacity: 0.9;
    }
    #cta .cta-button {
      background-color: #ffffff;
      color: ${colors.primary};
    }

    /* Footer */
    #footer {
      padding: 40px 20px;
      background-color: ${colors.text};
      color: #9ca3af;
      text-align: center;
      font-size: 0.9rem;
    }
    #footer p {
      margin-bottom: 8px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      #hero h1 { font-size: 2rem; }
      #hero .tagline { font-size: 1.2rem; }
      .features-grid { grid-template-columns: 1fr; }
      .pricing-grid { grid-template-columns: 1fr; }
      .pricing-card.highlighted { transform: scale(1); }
      #hero { padding: 60px 16px; }
      #features, #benefits, #pricing, #cta { padding: 60px 16px; }
    }
    @media (max-width: 480px) {
      #hero h1 { font-size: 1.6rem; }
      #hero .tagline { font-size: 1rem; }
      .cta-button { padding: 12px 28px; font-size: 1rem; }
    }
  `;

  // Generar secciones HTML
  const featuresHtml = data.features
    .map(
      (f) => `
      <div class="feature-card">
        <div class="feature-icon">${escapeHtml(f.icon || '✨')}</div>
        <h3>${escapeHtml(f.name)}</h3>
        <p>${escapeHtml(f.description)}</p>
      </div>`
    )
    .join('\n');

  const benefitsHtml = data.benefits
    .map(
      (b) => `
      <div class="benefit-item">
        <div class="benefit-check">✓</div>
        <div>
          <h3>${escapeHtml(b.title)}</h3>
          <p>${escapeHtml(b.description)}</p>
        </div>
      </div>`
    )
    .join('\n');

  let pricingSection = '';
  if (data.pricing && data.pricing.tiers.length > 0) {
    const tiersHtml = data.pricing.tiers
      .map(
        (tier) => `
        <div class="pricing-card${tier.highlighted ? ' highlighted' : ''}">
          <h3>${escapeHtml(tier.name)}</h3>
          <div class="pricing-price">${escapeHtml(tier.price)}</div>
          <ul class="pricing-features">
            ${tier.features.map((f) => `<li>${escapeHtml(f)}</li>`).join('\n            ')}
          </ul>
          <a href="#" class="cta-button">${escapeHtml(data.ctaText)}</a>
        </div>`
      )
      .join('\n');

    pricingSection = `
    <section id="pricing">
      <div class="container">
        <h2>Planes y Precios</h2>
        <div class="pricing-grid">
          ${tiersHtml}
        </div>
      </div>
    </section>`;
  }

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.businessName)} - ${escapeHtml(data.tagline)}</title>
  <style>${css}</style>
</head>
<body>
  <section id="hero">
    <div class="container">
      <h1>${escapeHtml(data.businessName)}</h1>
      <p class="tagline">${escapeHtml(data.tagline)}</p>
      <p class="value-proposition">${escapeHtml(data.valueProposition)}</p>
      <a href="#features" class="cta-button">${escapeHtml(data.ctaText)}</a>
    </div>
  </section>

  <section id="features">
    <div class="container">
      <h2>Características</h2>
      <div class="features-grid">
        ${featuresHtml}
      </div>
    </div>
  </section>

  <section id="benefits">
    <div class="container">
      <h2>Beneficios</h2>
      <div class="benefits-list">
        ${benefitsHtml}
      </div>
    </div>
  </section>
${pricingSection}
  <section id="cta">
    <div class="container">
      <h2>¿Listo para empezar?</h2>
      <p>${escapeHtml(data.ctaSubtext || 'Únete hoy y transforma tu negocio')}</p>
      <a href="#" class="cta-button">${escapeHtml(data.ctaText)}</a>
    </div>
  </section>

  <footer id="footer">
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${escapeHtml(data.businessName)}. Todos los derechos reservados.</p>
      <p>Generado con Forgeon</p>
    </div>
  </footer>
</body>
</html>`;

  return html;
}

/**
 * Escapa caracteres HTML especiales para prevenir XSS.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Genera la landing page HTML y la almacena en la base de datos.
 *
 * Orquesta el flujo completo:
 * 1. Obtiene la GenerationSession con sus AgentArtifacts
 * 2. Extrae datos estructurados de los artefactos
 * 3. Genera el HTML de la landing page
 * 4. Actualiza el campo landingPageHtml en la DB
 *
 * @param sessionId - ID de la GenerationSession
 * @returns HTML generado
 * @throws Error si la sesión no existe
 * @see Requisito 1.5
 */
export async function generateAndStoreLandingPage(
  sessionId: string
): Promise<string> {
  // Obtener sesión con artefactos
  const session = await prisma.generationSession.findUnique({
    where: { id: sessionId },
    include: { AgentArtifact: true },
  });

  if (!session) {
    throw new Error(`GenerationSession not found: ${sessionId}`);
  }

  // Transformar artefactos al formato esperado por extractLandingPageData
  const artifacts = session.AgentArtifact.map((artifact) => ({
    agentType: artifact.agentType,
    content: (artifact.content as Record<string, unknown>) || {},
  }));

  // Extraer datos y generar HTML
  const landingData = extractLandingPageData(artifacts);
  const html = generateLandingPageHtml(landingData);

  // Almacenar en DB
  await prisma.generationSession.update({
    where: { id: sessionId },
    data: { landingPageHtml: html },
  });

  return html;
}

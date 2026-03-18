/**
 * BlueprintDataExtractor - Extrae y normaliza datos de cada tipo de agente.
 *
 * Este módulo proporciona funciones para extraer datos estructurados de los
 * AgentArtifacts generados por el pipeline de agentes IA, transformándolos
 * en el formato LandingPageData necesario para generar landing pages HTML.
 *
 * @see Requisitos 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */

import type {
  LandingPageData,
  Feature,
  Benefit,
  PricingTier,
  ColorPalette,
} from './types';

/**
 * Extrae un valor de un objeto anidado de forma segura con fallback.
 *
 * @param obj - Objeto del cual extraer el valor
 * @param path - Array de claves para navegar el objeto
 * @param defaultValue - Valor por defecto si la extracción falla
 * @returns El valor extraído o el valor por defecto
 */
export function safeExtract<T>(
  obj: unknown,
  path: string[],
  defaultValue: T
): T {
  try {
    let current: unknown = obj;
    for (const key of path) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return defaultValue;
      }
    }
    return (current as T) ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Extrae datos del blueprint de BUSINESS_STRATEGIST.
 *
 * Extrae businessName, tagline y valueProposition de los campos
 * executiveSummary y valueProposition del blueprint.
 *
 * @param content - Contenido del AgentArtifact de BUSINESS_STRATEGIST
 * @returns Datos parciales de LandingPageData
 * @see Requisito 6.1
 */
export function extractFromBusinessStrategist(
  content: Record<string, unknown>
): Partial<LandingPageData> {
  const result: Partial<LandingPageData> = {};

  // Extraer nombre del negocio desde executiveSummary
  const executiveSummary = safeExtract<string | Record<string, unknown>>(
    content,
    ['executiveSummary'],
    ''
  );

  if (typeof executiveSummary === 'string' && executiveSummary) {
    // Si es string, usar la primera línea como nombre
    const lines = executiveSummary.split('\n').filter((l) => l.trim());
    result.businessName = lines[0]?.trim() || '';
  } else if (typeof executiveSummary === 'object' && executiveSummary) {
    // Si es objeto, buscar campos comunes
    result.businessName = safeExtract<string>(
      executiveSummary,
      ['businessName'],
      ''
    ) || safeExtract<string>(executiveSummary, ['name'], '');
  }

  // Extraer propuesta de valor
  const valueProposition = safeExtract<string | Record<string, unknown>>(
    content,
    ['valueProposition'],
    ''
  );

  if (typeof valueProposition === 'string' && valueProposition) {
    result.valueProposition = valueProposition;
    // Usar la primera línea como tagline
    const lines = valueProposition.split('\n').filter((l) => l.trim());
    result.tagline = lines[0]?.trim() || '';
  } else if (typeof valueProposition === 'object' && valueProposition) {
    result.valueProposition = safeExtract<string>(
      valueProposition,
      ['description'],
      ''
    ) || safeExtract<string>(valueProposition, ['statement'], '');
    result.tagline = safeExtract<string>(valueProposition, ['tagline'], '') ||
      safeExtract<string>(valueProposition, ['headline'], '') ||
      result.valueProposition?.split('\n')[0] || '';
  }

  return result;
}

/**
 * Extrae datos del blueprint de PRODUCT_ARCHITECT.
 *
 * Extrae features y benefits del array de características del blueprint.
 * Los beneficios se derivan de las características con prioridad "must-have".
 *
 * @param content - Contenido del AgentArtifact de PRODUCT_ARCHITECT
 * @returns Datos parciales de LandingPageData
 * @see Requisito 6.2
 */
export function extractFromProductArchitect(
  content: Record<string, unknown>
): Partial<LandingPageData> {
  const result: Partial<LandingPageData> = {};

  // Extraer features
  const featuresRaw = safeExtract<unknown[]>(content, ['features'], []);
  const features: Feature[] = [];
  const benefits: Benefit[] = [];

  // Iconos por defecto para asignar a features
  const defaultIcons = ['🚀', '⚡', '🎯', '💡', '🔒', '📊', '🌟', '✨'];

  if (Array.isArray(featuresRaw)) {
    featuresRaw.forEach((feature, index) => {
      if (typeof feature === 'object' && feature !== null) {
        const featureObj = feature as Record<string, unknown>;
        const name = safeExtract<string>(featureObj, ['name'], '') ||
          safeExtract<string>(featureObj, ['title'], '');
        const description = safeExtract<string>(featureObj, ['description'], '');

        if (name) {
          features.push({
            name,
            description,
            icon: defaultIcons[index % defaultIcons.length],
          });

          // Derivar beneficios de features con prioridad alta
          const priority = safeExtract<string>(featureObj, ['priority'], '');
          if (
            priority === 'must-have' ||
            priority === 'high' ||
            index < 3
          ) {
            benefits.push({
              title: name,
              description: description || `Beneficio de ${name}`,
            });
          }
        }
      } else if (typeof feature === 'string' && feature) {
        features.push({
          name: feature,
          description: '',
          icon: defaultIcons[index % defaultIcons.length],
        });
      }
    });
  }

  if (features.length > 0) {
    result.features = features;
  }

  if (benefits.length > 0) {
    result.benefits = benefits;
  }

  return result;
}

/**
 * Extrae datos del blueprint de UX_UI_AGENT.
 *
 * Extrae colores y tipografía del campo designSystem del blueprint.
 *
 * @param content - Contenido del AgentArtifact de UX_UI_AGENT
 * @returns Datos parciales de LandingPageData
 * @see Requisito 6.3
 */
export function extractFromUxUiAgent(
  content: Record<string, unknown>
): Partial<LandingPageData> {
  const result: Partial<LandingPageData> = {};

  // Extraer designSystem
  const designSystem = safeExtract<Record<string, unknown>>(
    content,
    ['designSystem'],
    {}
  );

  // Extraer colores
  const colorsRaw = safeExtract<Record<string, unknown>>(
    designSystem,
    ['colors'],
    {}
  );

  if (Object.keys(colorsRaw).length > 0) {
    const colors: ColorPalette = {
      primary: safeExtract<string>(colorsRaw, ['primary'], '#7C3AED'),
      secondary: safeExtract<string>(colorsRaw, ['secondary'], '#4B5563'),
      accent: safeExtract<string>(colorsRaw, ['accent'], '#10B981'),
      background: safeExtract<string>(colorsRaw, ['background'], '#FFFFFF'),
      text: safeExtract<string>(colorsRaw, ['text'], '#1F2937'),
    };
    result.colors = colors;
  }

  // Extraer tipografía
  const typography = safeExtract<string | Record<string, unknown>>(
    designSystem,
    ['typography'],
    ''
  );

  if (typeof typography === 'string' && typography) {
    result.typography = typography;
  } else if (typeof typography === 'object' && typography) {
    result.typography = safeExtract<string>(typography, ['fontFamily'], '') ||
      safeExtract<string>(typography, ['primary'], '') ||
      'Inter, system-ui, sans-serif';
  }

  return result;
}

/**
 * Extrae datos del blueprint de MONETIZATION_GTM.
 *
 * Extrae los tiers de pricing del campo pricingStrategy del blueprint.
 *
 * @param content - Contenido del AgentArtifact de MONETIZATION_GTM
 * @returns Datos parciales de LandingPageData
 * @see Requisito 6.4
 */
export function extractFromMonetizationGtm(
  content: Record<string, unknown>
): Partial<LandingPageData> {
  const result: Partial<LandingPageData> = {};

  // Extraer pricingStrategy
  const pricingStrategy = safeExtract<Record<string, unknown>>(
    content,
    ['pricingStrategy'],
    {}
  );

  // Extraer tiers
  const tiersRaw = safeExtract<unknown[]>(pricingStrategy, ['tiers'], []);

  if (Array.isArray(tiersRaw) && tiersRaw.length > 0) {
    const tiers: PricingTier[] = [];

    tiersRaw.forEach((tier, index) => {
      if (typeof tier === 'object' && tier !== null) {
        const tierObj = tier as Record<string, unknown>;
        const name = safeExtract<string>(tierObj, ['name'], '') ||
          safeExtract<string>(tierObj, ['title'], '') ||
          `Plan ${index + 1}`;
        const price = safeExtract<string>(tierObj, ['price'], '') ||
          safeExtract<number>(tierObj, ['price'], 0).toString();
        const featuresRaw = safeExtract<unknown[]>(tierObj, ['features'], []);

        const features: string[] = featuresRaw
          .filter((f): f is string => typeof f === 'string')
          .slice(0, 10);

        const highlighted = safeExtract<boolean>(tierObj, ['highlighted'], false) ||
          safeExtract<boolean>(tierObj, ['recommended'], false) ||
          index === 1; // El segundo tier suele ser el destacado

        tiers.push({
          name,
          price: typeof price === 'number' ? `$${price}` : price,
          features,
          highlighted,
        });
      }
    });

    if (tiers.length > 0) {
      result.pricing = { tiers };
    }
  }

  return result;
}


/**
 * Retorna datos por defecto para una landing page.
 *
 * Se usa cuando los blueprints no están disponibles o están incompletos.
 * Proporciona valores razonables con una paleta de colores purple/gray.
 *
 * @returns LandingPageData completo con valores por defecto
 * @see Requisito 6.6
 */
export function getDefaultLandingPageData(): LandingPageData {
  return {
    businessName: 'Mi Negocio Digital',
    tagline: 'Transformando ideas en realidad',
    valueProposition:
      'Una solución innovadora diseñada para resolver tus necesidades de manera eficiente y efectiva.',
    features: [
      {
        name: 'Fácil de usar',
        description: 'Interfaz intuitiva que no requiere conocimientos técnicos',
        icon: '🚀',
      },
      {
        name: 'Rápido y eficiente',
        description: 'Optimizado para ofrecer resultados en tiempo récord',
        icon: '⚡',
      },
      {
        name: 'Seguro y confiable',
        description: 'Protección de datos con los más altos estándares',
        icon: '🔒',
      },
      {
        name: 'Soporte 24/7',
        description: 'Equipo de expertos disponible cuando lo necesites',
        icon: '💬',
      },
    ],
    benefits: [
      {
        title: 'Ahorra tiempo',
        description: 'Automatiza tareas repetitivas y enfócate en lo importante',
      },
      {
        title: 'Reduce costos',
        description: 'Optimiza recursos y maximiza tu retorno de inversión',
      },
      {
        title: 'Escala fácilmente',
        description: 'Crece sin límites con una plataforma preparada para el futuro',
      },
    ],
    colors: {
      primary: '#7C3AED',
      secondary: '#4B5563',
      accent: '#10B981',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    typography: 'Inter, system-ui, sans-serif',
    ctaText: 'Comenzar ahora',
    ctaSubtext: 'Prueba gratis por 14 días',
  };
}

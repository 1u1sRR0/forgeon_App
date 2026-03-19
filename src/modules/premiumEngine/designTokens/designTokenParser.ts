// Parser: transforms UX_UI_AGENT blueprint JSON into DesignTokens

import { DesignTokens, HeroVariant, ColorMode, DEFAULT_DESIGN_TOKENS } from './types';

const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

function isValidHex(color: unknown): color is string {
  return typeof color === 'string' && HEX_COLOR_REGEX.test(color);
}

function safeString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

function safeNumber(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  return !isNaN(n) && n > 0 ? n : fallback;
}

function parseHeroVariant(value: unknown): HeroVariant {
  const valid: HeroVariant[] = ['centered', 'split', 'background-image', 'video'];
  if (typeof value === 'string' && valid.includes(value as HeroVariant)) {
    return value as HeroVariant;
  }
  return DEFAULT_DESIGN_TOKENS.heroVariant;
}

function parseColorMode(value: unknown): ColorMode {
  if (value === 'dark') return 'dark';
  return 'light';
}

function parseSectionOrder(value: unknown): string[] {
  if (Array.isArray(value) && value.length > 0 && value.every((v) => typeof v === 'string')) {
    return value as string[];
  }
  return [...DEFAULT_DESIGN_TOKENS.sectionOrder];
}

/**
 * Transforms a UX_UI_AGENT blueprint JSON into a typed DesignTokens object.
 * Applies defaults for any missing or invalid fields.
 */
export function parseUxBlueprint(blueprint: Record<string, unknown>): DesignTokens {
  if (!blueprint || typeof blueprint !== 'object') {
    return { ...DEFAULT_DESIGN_TOKENS };
  }

  const ds = blueprint.designSystem as Record<string, unknown> | undefined;
  const dsColors = (ds?.colors ?? {}) as Record<string, unknown>;
  const dsTypography = (ds?.typography ?? {}) as Record<string, unknown>;
  const dsSpacing = (ds?.spacing ?? {}) as Record<string, unknown>;

  const fontPairing = blueprint.fontPairing as Record<string, unknown> | undefined;
  const accentGradient = blueprint.accentGradient as Record<string, unknown> | undefined;

  const colors = {
    primary: isValidHex(dsColors.primary) ? dsColors.primary : DEFAULT_DESIGN_TOKENS.colors.primary,
    secondary: isValidHex(dsColors.secondary) ? dsColors.secondary : DEFAULT_DESIGN_TOKENS.colors.secondary,
    accent: isValidHex(dsColors.accent) ? dsColors.accent : DEFAULT_DESIGN_TOKENS.colors.accent,
    background: isValidHex(dsColors.background) ? dsColors.background : DEFAULT_DESIGN_TOKENS.colors.background,
    text: isValidHex(dsColors.text) ? dsColors.text : DEFAULT_DESIGN_TOKENS.colors.text,
  };

  // Typography: prefer fontPairing top-level, fallback to designSystem.typography
  const headingFont = safeString(
    fontPairing?.heading ?? dsTypography?.headingFont ?? dsTypography?.fontFamily,
    DEFAULT_DESIGN_TOKENS.typography.headingFont
  );
  const bodyFont = safeString(
    fontPairing?.body ?? dsTypography?.bodyFont ?? dsTypography?.fontFamily,
    DEFAULT_DESIGN_TOKENS.typography.bodyFont
  );

  const spacingBase = safeNumber(
    dsSpacing?.base ?? dsSpacing?.unit,
    DEFAULT_DESIGN_TOKENS.spacing.base
  );

  const gradientFrom = isValidHex(accentGradient?.from) ? accentGradient!.from as string : colors.primary;
  const gradientTo = isValidHex(accentGradient?.to) ? accentGradient!.to as string : colors.accent;

  return {
    colors,
    typography: { headingFont, bodyFont },
    spacing: { base: spacingBase },
    heroVariant: parseHeroVariant(blueprint.heroVariant),
    sectionOrder: parseSectionOrder(blueprint.sectionOrder),
    colorMode: parseColorMode(blueprint.colorMode),
    accentGradient: { from: gradientFrom, to: gradientTo },
  };
}

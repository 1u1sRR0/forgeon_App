// Token Generator: DesignTokens → CSS custom properties & Tailwind config

import { DesignTokens } from './types';

/**
 * Generates CSS custom properties from DesignTokens.
 */
export function generateCssCustomProperties(tokens: DesignTokens): string {
  return `:root {
  --color-primary: ${tokens.colors.primary};
  --color-secondary: ${tokens.colors.secondary};
  --color-accent: ${tokens.colors.accent};
  --color-background: ${tokens.colors.background};
  --color-text: ${tokens.colors.text};
  --font-heading: '${tokens.typography.headingFont}', sans-serif;
  --font-body: '${tokens.typography.bodyFont}', sans-serif;
  --font-family: '${tokens.typography.bodyFont}', sans-serif;
  --spacing-base: ${tokens.spacing.base}px;
  --gradient-from: ${tokens.accentGradient.from};
  --gradient-to: ${tokens.accentGradient.to};
}`;
}

/**
 * Generates Tailwind CSS extension config from DesignTokens.
 */
export function generateTailwindExtension(tokens: DesignTokens): string {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${tokens.colors.primary}',
        secondary: '${tokens.colors.secondary}',
        accent: '${tokens.colors.accent}',
        background: '${tokens.colors.background}',
        foreground: '${tokens.colors.text}',
      },
      fontFamily: {
        heading: ['${tokens.typography.headingFont}', 'sans-serif'],
        body: ['${tokens.typography.bodyFont}', 'sans-serif'],
      },
      spacing: {
        base: '${tokens.spacing.base}px',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, ${tokens.accentGradient.from}, ${tokens.accentGradient.to})',
      },
    },
  },
};`;
}

/**
 * Serializes DesignTokens to JSON string.
 */
export function serializeTokens(tokens: DesignTokens): string {
  return JSON.stringify(tokens);
}

/**
 * Deserializes JSON string back to DesignTokens.
 */
export function deserializeTokens(json: string): DesignTokens {
  return JSON.parse(json) as DesignTokens;
}

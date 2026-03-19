// Design Tokens type system for Premium Output Engine

export type HeroVariant = 'centered' | 'split' | 'background-image' | 'video';
export type ColorMode = 'light' | 'dark';

export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  spacing: {
    base: number; // px
  };
  heroVariant: HeroVariant;
  sectionOrder: string[];
  colorMode: ColorMode;
  accentGradient: { from: string; to: string };
}

export const DEFAULT_DESIGN_TOKENS: DesignTokens = {
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#8B5CF6',
    background: '#FFFFFF',
    text: '#111827',
  },
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
  },
  spacing: {
    base: 16,
  },
  heroVariant: 'centered',
  sectionOrder: ['hero', 'features', 'pricing', 'testimonials', 'cta'],
  colorMode: 'light',
  accentGradient: { from: '#3B82F6', to: '#8B5CF6' },
};

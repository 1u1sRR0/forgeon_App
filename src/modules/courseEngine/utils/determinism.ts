import crypto from 'crypto';

/**
 * Generate deterministic IDs for reproducibility
 * Same seed + suffix always produces same ID
 */
export function generateDeterministicId(seed: string, suffix: string): string {
  const combined = `${seed}-${suffix}`;
  const hash = crypto.createHash('sha256').update(combined).digest('hex');
  return `course_${hash.substring(0, 16)}`;
}

/**
 * Generate deterministic hash for content
 */
export function hashContent(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Seeded random number generator for deterministic randomness
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: string) {
    this.seed = this.hashSeed(seed);
  }

  private hashSeed(seed: string): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

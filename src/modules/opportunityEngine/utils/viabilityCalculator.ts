import { DemandSignal } from '../opportunityTypes';

/**
 * Calculate viability score using weighted formula
 * Formula: 0.45 × demandScore + 0.35 × (100 - competitionScore) + 0.20 × avgSignalStrength
 */
export function calculateViabilityScore(
  demandScore: number,
  competitionScore: number,
  signals: DemandSignal[]
): number {
  // Validate inputs
  if (demandScore < 0 || demandScore > 100) {
    throw new Error('Demand score must be between 0 and 100');
  }
  if (competitionScore < 0 || competitionScore > 100) {
    throw new Error('Competition score must be between 0 and 100');
  }

  // Calculate average signal strength
  const avgSignalStrength =
    signals.length > 0
      ? signals.reduce((sum, signal) => sum + signal.strength, 0) / signals.length
      : 0;

  // Apply weighted formula
  const viability =
    0.45 * demandScore +
    0.35 * (100 - competitionScore) +
    0.20 * avgSignalStrength;

  // Round to nearest integer
  return Math.round(viability);
}

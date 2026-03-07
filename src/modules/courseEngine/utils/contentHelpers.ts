// ============================================================================
// CONTENT HELPERS
// ============================================================================

import { ProjectContext } from '../courseTypes';

/**
 * Format a topic title to be more readable
 */
export function formatTopicTitle(topic: string): string {
  return topic
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Calculate estimated reading time based on content length
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Customize a code example with project-specific details
 */
export function customizeCodeExample(
  template: string,
  context: ProjectContext
): string {
  return template
    .replace(/\{projectName\}/g, context.name)
    .replace(/\{businessModel\}/g, context.businessModel)
    .replace(/\{targetAudience\}/g, context.targetAudience);
}

/**
 * Extract key concepts from text content
 */
export function extractKeyConcepts(content: string): string[] {
  // Simple extraction - look for capitalized phrases and technical terms
  const concepts: string[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    // Look for bullet points or numbered lists
    if (line.match(/^[\s]*[-*•]\s+(.+)/) || line.match(/^[\s]*\d+\.\s+(.+)/)) {
      const match = line.match(/^[\s]*[-*•\d.]+\s+(.+)/);
      if (match) {
        concepts.push(match[1].trim());
      }
    }
  }

  return concepts.slice(0, 5); // Return top 5 concepts
}

/**
 * Generate a deterministic ID based on content
 */
export function generateContentId(prefix: string, ...parts: string[]): string {
  const combined = parts.join('-').toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return `${prefix}-${combined}`;
}

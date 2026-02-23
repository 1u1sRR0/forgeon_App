import { ProjectState } from '@prisma/client';

/**
 * Project State Machine
 * Defines valid state transitions and rules
 */

export const STATE_TRANSITIONS: Record<ProjectState, ProjectState[]> = {
  IDEA: ['STRUCTURED'],
  STRUCTURED: ['VALIDATED'],
  VALIDATED: ['BUILD_READY', 'BLOCKED'],
  BUILD_READY: ['MVP_GENERATED'],
  MVP_GENERATED: ['STRUCTURED'], // Allow iteration
  BLOCKED: ['STRUCTURED'], // After fixes
};

export function canTransitionTo(
  currentState: ProjectState,
  targetState: ProjectState
): boolean {
  const validTransitions = STATE_TRANSITIONS[currentState];
  return validTransitions?.includes(targetState) ?? false;
}

export function getNextActions(state: ProjectState): string[] {
  switch (state) {
    case 'IDEA':
      return ['Complete the wizard to structure your idea'];
    case 'STRUCTURED':
      return ['Run evaluation to assess viability'];
    case 'VALIDATED':
      return ['Review evaluation results', 'Fix issues if blocked', 'Generate MVP if ready'];
    case 'BUILD_READY':
      return ['Generate MVP'];
    case 'MVP_GENERATED':
      return ['Download MVP', 'Iterate on your idea'];
    case 'BLOCKED':
      return ['Fix blocking issues', 'Update wizard inputs', 'Re-run evaluation'];
    default:
      return [];
  }
}

export function getStateDescription(state: ProjectState): string {
  switch (state) {
    case 'IDEA':
      return 'Your project is in the idea phase. Complete the wizard to structure your concept.';
    case 'STRUCTURED':
      return 'Your idea is structured and ready for evaluation.';
    case 'VALIDATED':
      return 'Your project has been evaluated. Review the results to proceed.';
    case 'BUILD_READY':
      return 'Your project is ready for MVP generation!';
    case 'MVP_GENERATED':
      return 'Your MVP has been generated successfully.';
    case 'BLOCKED':
      return 'Your project is blocked from MVP generation. Fix the issues to proceed.';
    default:
      return '';
  }
}

export function getStateColor(state: ProjectState): string {
  switch (state) {
    case 'IDEA':
      return 'gray';
    case 'STRUCTURED':
      return 'blue';
    case 'VALIDATED':
      return 'yellow';
    case 'BUILD_READY':
      return 'green';
    case 'MVP_GENERATED':
      return 'purple';
    case 'BLOCKED':
      return 'red';
    default:
      return 'gray';
  }
}

export function getStateBadgeClasses(state: ProjectState): string {
  const color = getStateColor(state);
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';

  const colorClasses: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    red: 'bg-red-100 text-red-800',
  };

  return `${baseClasses} ${colorClasses[color]}`;
}

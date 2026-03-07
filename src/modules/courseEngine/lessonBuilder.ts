// ============================================================================
// LESSON BUILDER
// ============================================================================

import { Lesson, ContentBlock, ProjectContext } from './courseTypes';
import { generateContentId, calculateReadingTime } from './utils/contentHelpers';
import { selectTemplate, getTemplateContent } from './templates/genericTemplates';

/**
 * Build lessons for a specific level
 */
export function buildLessons(
  levelNumber: number,
  levelTitle: string,
  context: ProjectContext
): Lesson[] {
  const lessons: Lesson[] = [];
  const template = selectTemplate(context.projectType);

  // Get lesson topics for this level
  const topics = getLessonTopics(levelNumber, context);

  topics.forEach((topic, index) => {
    const content = generateLessonContent(levelNumber, topic, context, template);
    const contentText = content.map((block) => block.content).join(' ');

    lessons.push({
      id: generateContentId('lesson', `level-${levelNumber}-${index + 1}`),
      levelId: '', // Will be set when saving to database
      lessonNumber: index + 1,
      title: topic.title,
      description: topic.description,
      content,
      estimatedMinutes: calculateReadingTime(contentText),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  return lessons;
}

function getLessonTopics(
  levelNumber: number,
  context: ProjectContext
): Array<{ title: string; description: string }> {
  switch (levelNumber) {
    case 1:
      return [
        {
          title: 'Understanding the Problem',
          description: `Deep dive into the problem ${context.name} solves`,
        },
        {
          title: 'Defining Your Solution',
          description: 'How your product addresses the core problem',
        },
        {
          title: 'MVP Fundamentals',
          description: 'Building the minimum viable version',
        },
      ];

    case 2:
      return [
        {
          title: 'Identifying Your Target Audience',
          description: 'Who will use your product and why',
        },
        {
          title: 'Creating User Personas',
          description: 'Detailed profiles of your ideal customers',
        },
        {
          title: 'Understanding User Needs',
          description: 'What users really want from your solution',
        },
      ];

    case 3:
      return [
        {
          title: 'Core Features Planning',
          description: 'Essential features for your MVP',
        },
        {
          title: 'User Flow Design',
          description: 'How users navigate through your product',
        },
        {
          title: 'Wireframing Basics',
          description: 'Creating low-fidelity mockups',
        },
      ];

    case 4:
      return [
        {
          title: 'Technical Architecture Overview',
          description: 'Understanding your tech stack',
        },
        {
          title: 'Database Design',
          description: 'Structuring your data',
        },
        {
          title: 'API Design',
          description: 'Building your backend services',
        },
      ];

    case 5:
      return [
        {
          title: 'Development Workflow',
          description: 'Setting up your development environment',
        },
        {
          title: 'Testing Strategies',
          description: 'Ensuring code quality',
        },
        {
          title: 'Deployment Process',
          description: 'Getting your app live',
        },
      ];

    case 6:
      return [
        {
          title: 'Go-to-Market Strategy',
          description: 'Launching your product',
        },
        {
          title: 'User Acquisition',
          description: 'Getting your first customers',
        },
        {
          title: 'Growth and Iteration',
          description: 'Scaling based on feedback',
        },
      ];

    default:
      return [];
  }
}

function generateLessonContent(
  levelNumber: number,
  topic: { title: string; description: string },
  context: ProjectContext,
  template: string
): ContentBlock[] {
  const content: ContentBlock[] = [];

  // Introduction
  content.push({
    type: 'text',
    content: `# ${topic.title}\n\n${topic.description}\n\nIn this lesson, you'll learn how to apply these concepts specifically to ${context.name}.`,
  });

  // Main content based on level
  content.push(...getTemplateContent(levelNumber, topic.title, context, template));

  // Key takeaways
  content.push({
    type: 'callout',
    title: 'Key Takeaways',
    content: `Remember these important points as you build ${context.name}.`,
  });

  return content;
}

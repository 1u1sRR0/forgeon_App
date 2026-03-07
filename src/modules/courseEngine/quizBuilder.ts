// ============================================================================
// QUIZ BUILDER
// ============================================================================

import { Quiz, QuizQuestion, ProjectContext } from './courseTypes';
import { generateContentId } from './utils/contentHelpers';

/**
 * Build quizzes for each level
 */
export function buildQuizzes(
  levelNumber: number,
  levelTitle: string,
  context: ProjectContext
): Quiz {
  const questions = generateQuestions(levelNumber, context);

  return {
    id: generateContentId('quiz', `level-${levelNumber}`),
    levelId: '', // Will be set when saving to database
    title: `${levelTitle} - Knowledge Check`,
    description: `Test your understanding of ${levelTitle.toLowerCase()} concepts.`,
    questions,
    passingScore: 70,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function generateQuestions(
  levelNumber: number,
  context: ProjectContext
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  switch (levelNumber) {
    case 1:
      questions.push(
        {
          id: generateContentId('q', 'level1-1'),
          question: `What is the primary problem ${context.name} solves?`,
          options: [
            { id: 'a', text: context.problemStatement },
            { id: 'b', text: 'Generic business problem' },
            { id: 'c', text: 'Technical infrastructure issues' },
            { id: 'd', text: 'Marketing challenges' },
          ],
          correctOptionId: 'a',
          explanation: `${context.name} specifically addresses: ${context.problemStatement}`,
          category: 'business',
        },
        {
          id: generateContentId('q', 'level1-2'),
          question: 'What is an MVP?',
          options: [
            { id: 'a', text: 'A fully featured product' },
            {
              id: 'b',
              text: 'The minimum version needed to validate core assumptions',
            },
            { id: 'c', text: 'A marketing campaign' },
            { id: 'd', text: 'A business plan' },
          ],
          correctOptionId: 'b',
          explanation:
            'An MVP is the simplest version of a product that can test your core hypothesis with real users.',
          category: 'business',
        }
      );
      break;

    case 2:
      questions.push(
        {
          id: generateContentId('q', 'level2-1'),
          question: `Who is the target audience for ${context.name}?`,
          options: [
            { id: 'a', text: context.targetAudience },
            { id: 'b', text: 'Everyone' },
            { id: 'c', text: 'Only enterprise customers' },
            { id: 'd', text: 'Only individual consumers' },
          ],
          correctOptionId: 'a',
          explanation: `${context.name} is specifically designed for: ${context.targetAudience}`,
          category: 'business',
        },
        {
          id: generateContentId('q', 'level2-2'),
          question: 'What is a user persona?',
          options: [
            { id: 'a', text: 'A real customer' },
            {
              id: 'b',
              text: 'A fictional representation of your ideal customer',
            },
            { id: 'c', text: 'A marketing slogan' },
            { id: 'd', text: 'A product feature' },
          ],
          correctOptionId: 'b',
          explanation:
            'User personas are detailed, fictional profiles that represent your target customers.',
          category: 'business',
        }
      );
      break;

    case 3:
      questions.push(
        {
          id: generateContentId('q', 'level3-1'),
          question: 'What is the purpose of wireframes?',
          options: [
            { id: 'a', text: 'Final visual design' },
            { id: 'b', text: 'Low-fidelity layout and structure planning' },
            { id: 'c', text: 'Marketing materials' },
            { id: 'd', text: 'Database schema' },
          ],
          correctOptionId: 'b',
          explanation:
            'Wireframes are simple, low-fidelity sketches that focus on layout and user flow, not visual design.',
          category: 'product',
        },
        {
          id: generateContentId('q', 'level3-2'),
          question: 'What is a user story?',
          options: [
            { id: 'a', text: 'A customer testimonial' },
            {
              id: 'b',
              text: 'A description of a feature from the user perspective',
            },
            { id: 'c', text: 'A marketing narrative' },
            { id: 'd', text: 'A technical specification' },
          ],
          correctOptionId: 'b',
          explanation:
            'User stories describe features from the user\'s perspective: "As a [user], I want [feature] so that [benefit]"',
          category: 'product',
        }
      );
      break;

    case 4:
      questions.push(
        {
          id: generateContentId('q', 'level4-1'),
          question: 'What is an API?',
          options: [
            { id: 'a', text: 'A user interface' },
            {
              id: 'b',
              text: 'A set of rules for software communication',
            },
            { id: 'c', text: 'A database' },
            { id: 'd', text: 'A programming language' },
          ],
          correctOptionId: 'b',
          explanation:
            'APIs (Application Programming Interfaces) define how different software components communicate.',
          category: 'technical',
        },
        {
          id: generateContentId('q', 'level4-2'),
          question: 'What is the purpose of a database?',
          options: [
            { id: 'a', text: 'To display web pages' },
            { id: 'b', text: 'To store and organize data persistently' },
            { id: 'c', text: 'To send emails' },
            { id: 'd', text: 'To handle user authentication' },
          ],
          correctOptionId: 'b',
          explanation:
            'Databases store, organize, and retrieve data efficiently and persistently.',
          category: 'technical',
        }
      );
      break;

    case 5:
      questions.push(
        {
          id: generateContentId('q', 'level5-1'),
          question: 'What is deployment?',
          options: [
            { id: 'a', text: 'Writing code' },
            { id: 'b', text: 'Making your app available to users' },
            { id: 'c', text: 'Testing features' },
            { id: 'd', text: 'Designing interfaces' },
          ],
          correctOptionId: 'b',
          explanation:
            'Deployment is the process of making your application accessible to users on a server or cloud platform.',
          category: 'technical',
        },
        {
          id: generateContentId('q', 'level5-2'),
          question: 'What is continuous integration (CI)?',
          options: [
            { id: 'a', text: 'A marketing strategy' },
            {
              id: 'b',
              text: 'Automatically testing and integrating code changes',
            },
            { id: 'c', text: 'A database backup method' },
            { id: 'd', text: 'A design process' },
          ],
          correctOptionId: 'b',
          explanation:
            'CI automatically tests and integrates code changes to catch issues early.',
          category: 'technical',
        }
      );
      break;

    case 6:
      questions.push(
        {
          id: generateContentId('q', 'level6-1'),
          question: 'What is a conversion funnel?',
          options: [
            { id: 'a', text: 'A sales tool' },
            {
              id: 'b',
              text: 'The path users take from awareness to conversion',
            },
            { id: 'c', text: 'A technical architecture' },
            { id: 'd', text: 'A database query' },
          ],
          correctOptionId: 'b',
          explanation:
            'A conversion funnel tracks the steps users take from first learning about your product to becoming customers.',
          category: 'marketing',
        },
        {
          id: generateContentId('q', 'level6-2'),
          question: 'What is user retention?',
          options: [
            { id: 'a', text: 'Acquiring new users' },
            { id: 'b', text: 'Keeping existing users engaged over time' },
            { id: 'c', text: 'Removing inactive users' },
            { id: 'd', text: 'Increasing prices' },
          ],
          correctOptionId: 'b',
          explanation:
            'User retention measures how well you keep users engaged and active over time.',
          category: 'marketing',
        }
      );
      break;
  }

  return questions;
}

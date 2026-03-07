import prisma from '@/lib/prisma';
import { Course, CourseLevel, ProjectContext } from './courseTypes';
import { generateDeterministicId } from './utils/determinism';

/**
 * Main course generation function
 * Deterministic: same inputs = same outputs
 */
export async function generateCourse(projectId: string): Promise<void> {
  // 1. Gather project context
  const context = await buildProjectContext(projectId);
  
  // 2. Generate course structure
  const courseId = generateDeterministicId(projectId, 'course');
  
  // 3. Create course in database
  await prisma.course.create({
    data: {
      id: courseId,
      projectId,
      title: `${context.businessType} MVP Mastery`,
      description: `Complete learning path for building and launching your ${context.industry} ${context.businessType}`,
      metadata: {
        businessType: context.businessType,
        industry: context.industry,
        templateType: context.templateType,
        techStack: context.techStack,
        generatedAt: new Date().toISOString(),
        version: 1,
      },
    },
  });
  
  // 4. Generate 6 levels with lessons
  await generateLevels(courseId, context);
}

/**
 * Generate all 6 course levels
 */
async function generateLevels(courseId: string, context: ProjectContext): Promise<void> {
  const levelDefinitions = [
    {
      number: 1,
      title: 'Understanding the Business',
      description: 'Master your business model, value proposition, and market positioning',
      topics: ['business_model', 'value_proposition', 'target_market', 'competitive_analysis'],
    },
    {
      number: 2,
      title: 'Technical Foundations',
      description: 'Learn your tech stack, architecture, and development workflow',
      topics: ['tech_stack', 'architecture', 'database', 'authentication', 'api_design'],
    },
    {
      number: 3,
      title: 'Deployment & Operations',
      description: 'Deploy your MVP and set up essential operations',
      topics: ['local_setup', 'environment_config', 'deployment', 'monitoring', 'ci_cd'],
    },
    {
      number: 4,
      title: 'Legal & Compliance',
      description: 'Understand legal requirements and compliance basics',
      topics: ['business_registration', 'terms_of_service', 'privacy_policy', 'gdpr', 'payment_compliance'],
    },
    {
      number: 5,
      title: 'Growth & Scaling',
      description: 'Strategies for acquiring users and scaling your business',
      topics: ['mvp_validation', 'user_acquisition', 'metrics', 'feedback_loops', 'scaling_strategy'],
    },
    {
      number: 6,
      title: 'Advanced Operations',
      description: 'Optimize operations, analytics, and team processes',
      topics: ['analytics', 'marketing', 'customer_support', 'iteration', 'team_building'],
    },
  ];
  
  for (const def of levelDefinitions) {
    const levelId = generateDeterministicId(courseId, `level-${def.number}`);
    
    // Create level
    await prisma.courseLevel.create({
      data: {
        id: levelId,
        courseId,
        levelNumber: def.number,
        title: def.title,
        description: def.description,
        objectives: def.topics.slice(0, 5).map(topic => 
          `Understand and apply ${topic.replace(/_/g, ' ')} in your ${context.businessType} project`
        ),
      },
    });
    
    // Create lessons for this level
    for (let i = 0; i < def.topics.length; i++) {
      const topic = def.topics[i];
      const lessonId = generateDeterministicId(levelId, `lesson-${i + 1}`);
      
      await prisma.lesson.create({
        data: {
          id: lessonId,
          levelId,
          lessonNumber: i + 1,
          title: topic.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `Learn about ${topic.replace(/_/g, ' ')} for your ${context.businessType} project`,
          content: [
            {
              type: 'text',
              content: `This lesson covers ${topic.replace(/_/g, ' ')} in detail.`,
            },
          ],
          estimatedMinutes: 15,
        },
      });
    }
    
    // Create quiz for this level
    const quizId = generateDeterministicId(levelId, 'quiz');
    await prisma.quiz.create({
      data: {
        id: quizId,
        levelId,
        title: `${def.title} Quiz`,
        description: `Test your knowledge of ${def.title.toLowerCase()}`,
        questions: [
          {
            id: generateDeterministicId(quizId, 'q1'),
            question: `What is the main focus of ${def.title}?`,
            options: [
              { id: 'a', text: 'Option A' },
              { id: 'b', text: 'Option B' },
              { id: 'c', text: 'Option C' },
              { id: 'd', text: 'Option D' },
            ],
            correctAnswer: 'a',
            explanation: 'This is the correct answer because...',
            category: def.title.toLowerCase(),
          },
        ],
        passingScore: 70,
      },
    });
  }
}

/**
 * Build project context from database
 */
async function buildProjectContext(projectId: string): Promise<ProjectContext> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      wizardAnswers: true,
      viabilityScores: {
        orderBy: { computedAt: 'desc' },
        take: 1,
      },
      templateMapping: true,
      buildArtifacts: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });
  
  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }
  
  const wizardAnswersMap: Record<string, any> = {};
  project.wizardAnswers.forEach(answer => {
    wizardAnswersMap[answer.key] = answer.value;
  });
  
  return {
    projectId,
    name: project.name,
    businessType: wizardAnswersMap.businessType || 'saas',
    businessModel: wizardAnswersMap.businessModel || 'subscription',
    industry: wizardAnswersMap.industry || 'general',
    targetAudience: wizardAnswersMap.targetAudience || 'general',
    monetization: wizardAnswersMap.monetizationModel || 'subscription',
    monetizationModel: wizardAnswersMap.monetizationModel || 'subscription',
    projectType: (wizardAnswersMap.businessType || 'saas').toLowerCase() as any,
    uniqueValue: wizardAnswersMap.differentiation || wizardAnswersMap.uniqueValue || 'Innovative solution',
    problemStatement: wizardAnswersMap.problemStatement || 'Problem to solve',
    solution: wizardAnswersMap.solution || 'Solution approach',
    templateType: project.templateMapping?.recommendedTemplate || 'SAAS_BASIC',
    techStack: extractTechStack(project.buildArtifacts[0]),
    evaluationScore: project.viabilityScores[0]?.totalScore,
    wizardAnswers: wizardAnswersMap,
    buildMetadata: project.buildArtifacts[0]?.parameters as any,
  };
}

function extractTechStack(buildArtifact: any): string[] {
  if (!buildArtifact) return ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'];
  
  const params = buildArtifact.parameters as any;
  return params?.techStack || ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'];
}

// ============================================================================
// COURSE SYSTEM TYPES
// ============================================================================

export interface Course {
  id: string;
  projectId: string;
  title: string;
  description: string;
  metadata: CourseMetadata;
  levels: CourseLevel[];
  glossary: GlossaryTerm[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseMetadata {
  businessType: string;
  industry: string;
  templateType: string;
  techStack: string[];
  generatedAt: string;
  version: number;
}

export interface CourseLevel {
  id: string;
  courseId: string;
  levelNumber: number;
  title: string;
  description: string;
  objectives: string[];
  lessons: Lesson[];
  quiz?: Quiz;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  levelId: string;
  lessonNumber: number;
  title: string;
  description: string;
  content: ContentBlock[];
  estimatedMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ContentBlockType =
  | 'text'
  | 'code'
  | 'checklist'
  | 'warning'
  | 'tip'
  | 'callout'
  | 'step';

export interface ContentBlock {
  type: ContentBlockType;
  content?: string; // Optional for checklist type
  language?: string; // For code blocks
  items?: string[]; // For checklists
  title?: string; // For callouts, warnings, tips
}

export interface Quiz {
  id: string;
  levelId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  category: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: 'business' | 'technical' | 'legal' | 'marketing';
  relatedTerms?: string[];
}

// ============================================================================
// PROGRESS TRACKING TYPES
// ============================================================================

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  timeSpent?: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: QuizAnswer[];
  score: number;
  passed: boolean;
  completedAt: Date;
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface CourseProgress {
  overallCompletion: number;
  lessonsCompleted: number;
  totalLessons: number;
  quizzesPassed: number;
  totalQuizzes: number;
  averageQuizScore: number;
  timeSpent: number;
  levelProgress: LevelProgress[];
}

export interface LevelProgress {
  levelNumber: number;
  completion: number;
  lessonsCompleted: number;
  totalLessons: number;
  quizPassed: boolean;
  quizScore?: number;
}

// ============================================================================
// PROJECT CONTEXT TYPES
// ============================================================================

export interface ProjectContext {
  projectId: string;
  name: string;
  problemStatement: string;
  solution: string;
  businessType: string;
  businessModel: string;
  industry: string;
  targetAudience: string;
  monetization: string;
  monetizationModel: string;
  templateType: string;
  projectType: 'saas' | 'marketplace' | 'ecommerce' | 'generic';
  techStack: string[];
  uniqueValue: string;
  evaluationScore?: number;
  wizardAnswers: Record<string, any>;
  buildMetadata?: any;
}

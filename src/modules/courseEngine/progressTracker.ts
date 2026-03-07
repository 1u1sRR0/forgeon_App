import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CourseProgress {
  overallCompletion: number;
  levelsCompleted: number;
  totalLevels: number;
  lessonsCompleted: number;
  totalLessons: number;
  quizzesPassed: number;
  totalQuizzes: number;
  averageQuizScore: number;
  timeSpentMinutes: number;
  levelProgress: LevelProgress[];
}

export interface LevelProgress {
  levelId: string;
  levelNumber: number;
  title: string;
  completion: number;
  lessonsCompleted: number;
  totalLessons: number;
}

/**
 * Calculate overall course progress for a user
 */
export async function calculateCourseProgress(
  courseId: string,
  userId: string
): Promise<CourseProgress> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      levels: {
        include: {
          lessons: {
            include: {
              progress: {
                where: { userId },
              },
            },
          },
          quizzes: true,
        },
      },
    },
  });

  if (!course) {
    throw new Error(`Course ${courseId} not found`);
  }

  let totalLessons = 0;
  let completedLessons = 0;
  let totalQuizzes = 0;
  let passedQuizzes = 0;
  let totalQuizScore = 0;
  let quizAttempts = 0;
  let totalTimeSpent = 0;

  const levelProgress: LevelProgress[] = [];

  for (const level of course.levels) {
    const levelLessons = level.lessons.length;
    const levelCompleted = level.lessons.filter(
      (l: any) => l.progress.length > 0 && l.progress[0].completed
    ).length;

    totalLessons += levelLessons;
    completedLessons += levelCompleted;

    // Calculate time spent
    level.lessons.forEach((lesson: any) => {
      if (lesson.progress.length > 0) {
        totalTimeSpent += lesson.progress[0].timeSpent || 0;
      }
    });

    // Count quizzes
    const levelQuizzes = level.quizzes.length;
    totalQuizzes += levelQuizzes;

    levelProgress.push({
      levelId: level.id,
      levelNumber: level.levelNumber,
      title: level.title,
      completion: levelLessons > 0 ? (levelCompleted / levelLessons) * 100 : 0,
      lessonsCompleted: levelCompleted,
      totalLessons: levelLessons,
    });
  }

  // Get quiz attempts
  const quizIds = course.levels
    .flatMap((l: any) => l.quizzes)
    .map((q: any) => q.id);

  if (quizIds.length > 0) {
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
        quizId: { in: quizIds },
      },
      orderBy: { completedAt: 'desc' },
    });

    // Get best attempt per quiz
    const bestAttempts = new Map<string, any>();
    attempts.forEach((attempt) => {
      if (
        !bestAttempts.has(attempt.quizId) ||
        attempt.score > bestAttempts.get(attempt.quizId).score
      ) {
        bestAttempts.set(attempt.quizId, attempt);
      }
    });

    bestAttempts.forEach((attempt) => {
      if (attempt.passed) passedQuizzes++;
      totalQuizScore += attempt.score;
      quizAttempts++;
    });
  }

  const overallCompletion =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const levelsCompleted = levelProgress.filter((l) => l.completion === 100).length;
  const averageQuizScore = quizAttempts > 0 ? totalQuizScore / quizAttempts : 0;

  return {
    overallCompletion,
    levelsCompleted,
    totalLevels: course.levels.length,
    lessonsCompleted: completedLessons,
    totalLessons,
    quizzesPassed: passedQuizzes,
    totalQuizzes,
    averageQuizScore,
    timeSpentMinutes: totalTimeSpent,
    levelProgress,
  };
}

/**
 * Calculate progress for a specific level
 */
export async function calculateLevelProgress(
  levelId: string,
  userId: string
): Promise<LevelProgress> {
  const level = await prisma.courseLevel.findUnique({
    where: { id: levelId },
    include: {
      lessons: {
        include: {
          progress: {
            where: { userId },
          },
        },
      },
    },
  });

  if (!level) {
    throw new Error(`Level ${levelId} not found`);
  }

  const totalLessons = level.lessons.length;
  const completedLessons = level.lessons.filter(
    (l) => l.progress.length > 0 && l.progress[0].completed
  ).length;

  return {
    levelId: level.id,
    levelNumber: level.levelNumber,
    title: level.title,
    completion: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
    lessonsCompleted: completedLessons,
    totalLessons,
  };
}

/**
 * Mark a lesson as complete
 */
export async function markLessonComplete(
  lessonId: string,
  userId: string,
  timeSpentMinutes?: number
): Promise<void> {
  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
    create: {
      userId,
      lessonId,
      completed: true,
      completedAt: new Date(),
      timeSpent: timeSpentMinutes || 0,
    },
    update: {
      completed: true,
      completedAt: new Date(),
      timeSpent: timeSpentMinutes || 0,
    },
  });
}

/**
 * Record a quiz attempt
 */
export async function recordQuizAttempt(
  quizId: string,
  userId: string,
  score: number,
  answers: any[],
  passed: boolean
): Promise<void> {
  await prisma.quizAttempt.create({
    data: {
      userId,
      quizId,
      score,
      answers: answers as any,
      passed,
      completedAt: new Date(),
    },
  });
}

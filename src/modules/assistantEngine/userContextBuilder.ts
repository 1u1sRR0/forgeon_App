import prisma from '@/lib/prisma';

export interface UserContext {
  userId: string;
  userName: string | null;
  email: string | null;
  projects: Array<{
    id: string;
    name: string;
    state: string;
    viabilityScore?: number;
  }>;
  stats: {
    totalProjects: number;
    completedProjects: number;
  };
}

export async function buildUserContext(userId: string): Promise<UserContext> {
  // Load user profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Load user projects (limit 10 most recent)
  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 10,
    select: {
      id: true,
      name: true,
      state: true,
      viabilityScores: {
        orderBy: { computedAt: 'desc' },
        take: 1,
        select: {
          totalScore: true,
        },
      },
    },
  });

  // Calculate stats
  const totalProjects = await prisma.project.count({ where: { userId } });
  const completedProjects = await prisma.project.count({
    where: {
      userId,
      state: { in: ['BUILD_READY', 'MVP_GENERATED'] },
    },
  });

  return {
    userId: user.id,
    userName: user.name,
    email: user.email,
    projects: projects.map((p) => ({
      id: p.id,
      name: p.name,
      state: p.state,
      viabilityScore: p.viabilityScores[0]?.totalScore,
    })),
    stats: {
      totalProjects,
      completedProjects,
    },
  };
}

// Learn Hub Service - Project Progress Management

import { prisma } from '@/lib/prisma';

export interface ProjectWithProgress {
  id: string;
  name: string;
  state: string;
  progress: number;
  updatedAt: string;
}

export class LearnService {
  /**
   * Gets all projects with calculated progress percentages
   */
  async getProjectsWithProgress(
    userId: string,
    searchQuery?: string
  ): Promise<ProjectWithProgress[]> {
    const where: any = { userId };

    if (searchQuery) {
      where.name = {
        contains: searchQuery,
        mode: 'insensitive',
      };
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    // Get learn tasks for each project
    const projectIds = projects.map(p => p.id);
    const learnTasks = await prisma.learnTask.findMany({
      where: {
        projectId: { in: projectIds },
      },
    });

    // Group tasks by project
    const tasksByProject = new Map<string, any[]>();
    learnTasks.forEach(task => {
      if (!tasksByProject.has(task.projectId)) {
        tasksByProject.set(task.projectId, []);
      }
      tasksByProject.get(task.projectId)!.push(task);
    });

    return projects.map((project) => {
      const projectTasks = tasksByProject.get(project.id) || [];
      const totalTasks = projectTasks.length;
      const completedTasks = projectTasks.filter((task: any) => task.completed).length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        id: project.id,
        name: project.name,
        state: project.state,
        progress,
        updatedAt: project.updatedAt.toISOString(),
      };
    });
  }
}

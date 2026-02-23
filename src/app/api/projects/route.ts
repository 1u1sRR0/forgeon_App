import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createErrorResponse } from '@/lib/apiErrors';

// GET /api/projects - List user's projects
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createErrorResponse(401, 'You must be logged in to view projects', 'UNAUTHORIZED');
    }

    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const state = searchParams.get('state');

    const where: any = {
      userId: session.user.id,
    };

    if (state) {
      where.state = state;
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: {
        [sort]: order,
      },
      select: {
        id: true,
        name: true,
        description: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      projects,
      total: projects.length,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return createErrorResponse(500, 'Failed to load projects. Please try again.', 'FETCH_PROJECTS_ERROR');
  }
}

// POST /api/projects - Create new project
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createErrorResponse(401, 'You must be logged in to create a project', 'UNAUTHORIZED');
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name || name.trim().length === 0) {
      return createErrorResponse(400, 'Project name is required', 'INVALID_NAME');
    }

    if (name.trim().length > 100) {
      return createErrorResponse(400, 'Project name must be less than 100 characters', 'NAME_TOO_LONG');
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        userId: session.user.id,
        state: 'IDEA',
      },
      select: {
        id: true,
        name: true,
        description: true,
        state: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return createErrorResponse(500, 'Failed to create project. Please try again.', 'CREATE_PROJECT_ERROR');
  }
}

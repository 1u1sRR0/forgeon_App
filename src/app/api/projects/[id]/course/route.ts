import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateCourse } from '@/modules/courseEngine/courseGenerator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformCourseResponse(course: any) {
  if (!course) return course;
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    levels: (course.CourseLevel || []).map((level: any) => ({
      id: level.id,
      title: level.title,
      description: level.description,
      order: level.levelNumber,
      learningObjectives: Array.isArray(level.objectives) ? level.objectives : [],
      lessons: (level.Lesson || []).map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        order: lesson.lessonNumber,
        estimatedMinutes: lesson.estimatedMinutes,
        content: lesson.content || [],
        quiz: level.Quiz?.[0]
          ? {
              id: level.Quiz[0].id,
              title: level.Quiz[0].title,
              passingScore: level.Quiz[0].passingScore,
              questions: level.Quiz[0].questions || [],
            }
          : undefined,
      })),
    })),
  };
}

// GET /api/projects/[id]/course - Get or generate course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if regeneration is requested
    const { searchParams } = new URL(request.url);
    const regenerate = searchParams.get('regenerate') === 'true';

    if (regenerate) {
      // Delete existing course to regenerate
      await prisma.course.deleteMany({ where: { projectId } });
    }

    // Check if course exists
    let course = await prisma.course.findUnique({
      where: { projectId },
      include: {
        CourseLevel: {
          orderBy: { levelNumber: 'asc' },
          include: {
            Lesson: {
              orderBy: { lessonNumber: 'asc' },
              include: {
                LessonProgress: {
                  where: { userId: session.user.id },
                },
              },
            },
            Quiz: true,
          },
        },
      },
    });

    // Generate course if it doesn't exist (lazy generation)
    if (!course) {
      try {
        await generateCourse(projectId);
        course = await prisma.course.findUnique({
          where: { projectId },
          include: {
            CourseLevel: {
              orderBy: { levelNumber: 'asc' },
              include: {
                Lesson: {
                  orderBy: { lessonNumber: 'asc' },
                  include: {
                    LessonProgress: {
                      where: { userId: session.user.id },
                    },
                  },
                },
                Quiz: true,
              },
            },
          },
        });
      } catch (error) {
        console.error('Course generation failed:', error);
        return NextResponse.json(
          { error: 'Failed to generate course', fallback: true },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(transformCourseResponse(course));
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

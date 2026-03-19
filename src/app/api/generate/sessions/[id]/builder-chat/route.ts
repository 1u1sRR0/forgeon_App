import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BuilderAgent } from '@/modules/premiumEngine/builderAgent';

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { message, currentHtml } = body;

    // Validate required fields
    const missingFields: string[] = [];
    if (!message) missingFields.push('message');
    if (!currentHtml) missingFields.push('currentHtml');
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Campos requeridos: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Verify session exists and belongs to user
    const genSession = await prisma.generationSession.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!genSession) {
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      );
    }

    // Process with BuilderAgent
    const agent = new BuilderAgent();
    const result = await agent.processRequest({
      message,
      currentHtml,
      businessContext: {
        projectName: genSession.businessType || 'Mi Negocio',
        businessType: genSession.businessType || 'saas',
        colors: { primary: '#3B82F6', secondary: '#10B981' },
      },
      conversationHistory: body.conversationHistory || [],
    });

    return NextResponse.json({
      modifiedHtml: result.modifiedHtml,
      assistantMessage: result.assistantMessage,
    });
  } catch (error: any) {
    console.error('Builder chat error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * API Endpoint: GET /api/generate/sessions/[id]/download
 *
 * Genera y retorna documentos exportables en múltiples formatos.
 * Query param `format`: 'zip' (default), 'html', 'markdown'
 *
 * @see Requisitos 5.2, 5.4, 5.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  generateZipPackage,
  getStandaloneHtml,
  generateBusinessPlanMarkdown,
  sanitizeFileName,
  generateDocumentsZipPackage,
} from '@/modules/preview/documentExporter';

const VALID_FORMATS = ['zip', 'html', 'markdown', 'documents'] as const;
type ExportFormat = (typeof VALID_FORMATS)[number];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Obtener formato del query param (default: zip)
    const { searchParams } = new URL(request.url);
    const format = (searchParams.get('format') || 'zip') as string;

    // Validar formato
    if (!VALID_FORMATS.includes(format as ExportFormat)) {
      return NextResponse.json(
        { error: `Invalid format: '${format}'. Valid formats: ${VALID_FORMATS.join(', ')}` },
        { status: 400 }
      );
    }

    // Obtener la sesión de generación
    const genSession = await prisma.generationSession.findUnique({
      where: { id },
      include: {
        AgentArtifact: true,
        QuestionnaireResponse: true,
      },
    });

    // Validar que la sesión existe
    if (!genSession) {
      return NextResponse.json(
        { error: 'Generation session not found' },
        { status: 404 }
      );
    }

    // Validar propiedad de la sesión
    if (genSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Determinar nombre del proyecto para el archivo
    let projectName = 'Generated Project';
    if (genSession.QuestionnaireResponse) {
      const sectionD = genSession.QuestionnaireResponse.sectionD as Record<string, unknown> | null;
      const sectionA = genSession.QuestionnaireResponse.sectionA as Record<string, unknown> | null;
      const productName = sectionD?.productName as string | undefined;
      const businessIdea = sectionA?.businessIdea as string | undefined;

      if (productName) {
        projectName = productName;
      } else if (businessIdea) {
        projectName = businessIdea.split('\n')[0].substring(0, 100);
      }
    }

    const sanitizedName = sanitizeFileName(projectName);

    // Generar y retornar según formato
    switch (format as ExportFormat) {
      case 'zip': {
        const zipBuffer = await generateZipPackage(id);
        return new NextResponse(zipBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${sanitizedName}-package.zip"`,
          },
        });
      }

      case 'html': {
        const html = await getStandaloneHtml(id);
        return new NextResponse(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Disposition': `attachment; filename="${sanitizedName}-landing-page.html"`,
          },
        });
      }

      case 'markdown': {
        const artifacts = genSession.AgentArtifact.map((artifact) => ({
          agentType: artifact.agentType,
          content: (artifact.content as Record<string, unknown>) || {},
        }));
        const markdown = generateBusinessPlanMarkdown(artifacts, projectName);
        return new NextResponse(markdown, {
          status: 200,
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Content-Disposition': `attachment; filename="${sanitizedName}-business-plan.md"`,
          },
        });
      }

      case 'documents': {
        const docsZipBuffer = await generateDocumentsZipPackage(id);
        return new NextResponse(docsZipBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${sanitizedName}-documentos.zip"`,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error generating download:', error);
    return NextResponse.json(
      { error: 'Failed to generate download package' },
      { status: 500 }
    );
  }
}

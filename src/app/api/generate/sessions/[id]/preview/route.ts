/**
 * API Endpoint: GET /api/generate/sessions/[id]/preview
 *
 * Retorna el HTML de la landing page generada para una sesión.
 * Si no existe, la genera on-demand usando generateAndStoreLandingPage.
 *
 * @see Requisitos 5.1, 5.3, 5.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateAndStoreLandingPage } from '@/modules/preview/landingPageGenerator';

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

    // Obtener la sesión de generación
    const genSession = await prisma.generationSession.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        landingPageHtml: true,
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

    // Si ya existe el HTML, retornarlo
    if (genSession.landingPageHtml) {
      return new NextResponse(genSession.landingPageHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // Si no existe, generar on-demand
    try {
      const html = await generateAndStoreLandingPage(id);
      return new NextResponse(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    } catch (genError) {
      console.error('Error generating landing page:', genError);
      // Return a styled HTML error page instead of JSON so the iframe shows something useful
      const errorHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview no disponible</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; background: #0f0f23; color: #e5e7eb; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .container { text-align: center; max-width: 500px; padding: 40px; }
    .icon { font-size: 4rem; margin-bottom: 20px; }
    h1 { font-size: 1.5rem; color: #fff; margin-bottom: 12px; }
    p { font-size: 0.95rem; color: #9ca3af; line-height: 1.6; }
    .hint { margin-top: 20px; padding: 16px; background: #1f1f3a; border-radius: 12px; border: 1px solid #374151; }
    .hint p { font-size: 0.85rem; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">🏗️</div>
    <h1>Preview aún no disponible</h1>
    <p>Los blueprints de tu negocio digital aún no se han generado. Completa el pipeline de agentes para ver el preview de tu landing page.</p>
    <div class="hint">
      <p>Ve a la sección de Blueprints y ejecuta el pipeline de agentes primero.</p>
    </div>
  </div>
</body>
</html>`;
      return new NextResponse(errorHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }
  } catch (error) {
    console.error('Error fetching preview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

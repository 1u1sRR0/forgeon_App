// Microservice generator for API routes with Zod validation, auth, pagination, and error handling

import { EndpointSpec, ZodSchemaSpec } from '../types';

export class MicroserviceGenerator {
  /**
   * Generates a complete Next.js API route (App Router format) with:
   * - Zod schema inline validation
   * - Session verification (getServerSession + authOptions)
   * - Ownership verification (403)
   * - Pagination with page/limit
   * - Try-catch with console.error and 500 response
   * - ZodError catch returning 400 with field errors
   * - Error messages in Spanish
   */
  static generateEndpoint(spec: EndpointSpec): string {
    const entityLower = spec.entityName.toLowerCase();
    const entityPlural = entityLower + 's';
    const entityUpper = spec.entityName.charAt(0).toUpperCase() + spec.entityName.slice(1);

    const imports = [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
    ];

    const needsZod = spec.zodSchema && ['POST', 'PUT', 'PATCH'].includes(spec.method);
    if (needsZod) {
      imports.push(`import { z } from 'zod';`);
    }

    const parts: string[] = [...imports, ''];

    // Inline Zod schema if provided
    if (needsZod && spec.zodSchema) {
      parts.push(MicroserviceGenerator.generateZodSchema(spec.zodSchema));
      parts.push('');
    }

    // Function signature
    const methodName = spec.method;
    const hasParams = spec.path.includes('[');

    if (hasParams) {
      parts.push(`export async function ${methodName}(`);
      parts.push(`  request: NextRequest,`);
      parts.push(`  props: { params: Promise<{ id: string }> }`);
      parts.push(`) {`);
      parts.push(`  const params = await props.params;`);
    } else {
      parts.push(`export async function ${methodName}(request: NextRequest) {`);
    }

    // Try block
    parts.push(`  try {`);

    // Auth check
    if (spec.requiresAuth) {
      parts.push(`    // Verificar autenticación`);
      parts.push(`    const session = await getServerSession(authOptions);`);
      parts.push(`    if (!session?.user) {`);
      parts.push(`      return NextResponse.json(`);
      parts.push(`        { error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' },`);
      parts.push(`        { status: 401 }`);
      parts.push(`      );`);
      parts.push(`    }`);
      parts.push('');
    }

    // Method-specific body
    if (spec.method === 'GET' && spec.supportsPagination) {
      parts.push(...MicroserviceGenerator._generatePaginatedGet(spec, entityLower, entityPlural));
    } else if (spec.method === 'GET') {
      parts.push(...MicroserviceGenerator._generateSimpleGet(spec, entityLower, entityPlural, entityUpper, hasParams));
    } else if (spec.method === 'POST') {
      parts.push(...MicroserviceGenerator._generatePost(spec, entityLower, entityUpper, needsZod));
    } else if (spec.method === 'PUT' || spec.method === 'PATCH') {
      parts.push(...MicroserviceGenerator._generateUpdate(spec, entityLower, entityUpper, needsZod));
    } else if (spec.method === 'DELETE') {
      parts.push(...MicroserviceGenerator._generateDelete(spec, entityLower, entityUpper));
    }

    // Catch blocks
    if (needsZod) {
      parts.push(`  } catch (error) {`);
      parts.push(`    if (error instanceof z.ZodError) {`);
      parts.push(`      const erroresDetallados = error.errors.map((e) => ({`);
      parts.push(`        campo: e.path.join('.'),`);
      parts.push(`        mensaje: e.message,`);
      parts.push(`      }));`);
      parts.push(`      return NextResponse.json(`);
      parts.push(`        { error: 'Error de validación', errores: erroresDetallados },`);
      parts.push(`        { status: 400 }`);
      parts.push(`      );`);
      parts.push(`    }`);
      parts.push(`    console.error('Error en operación de base de datos:', error);`);
      parts.push(`    return NextResponse.json(`);
      parts.push(`      { error: 'Error interno del servidor. Intente nuevamente más tarde.' },`);
      parts.push(`      { status: 500 }`);
      parts.push(`    );`);
      parts.push(`  }`);
    } else {
      parts.push(`  } catch (error) {`);
      parts.push(`    console.error('Error en operación de base de datos:', error);`);
      parts.push(`    return NextResponse.json(`);
      parts.push(`      { error: 'Error interno del servidor. Intente nuevamente más tarde.' },`);
      parts.push(`      { status: 500 }`);
      parts.push(`    );`);
      parts.push(`  }`);
    }

    parts.push(`}`);
    parts.push('');

    return parts.join('\n');
  }

  /**
   * Generates a Zod schema definition with:
   * - Proper Zod types (z.string(), z.number(), z.boolean(), z.string().email(), etc.)
   * - min/max constraints
   * - Error messages in Spanish
   * - Required/optional field handling
   */
  static generateZodSchema(schema: ZodSchemaSpec): string {
    const lines: string[] = [];
    lines.push(`const ${schema.name} = z.object({`);

    for (const field of schema.fields) {
      let zodType = MicroserviceGenerator._mapZodType(field.type);

      // Add constraints
      if (field.min !== undefined) {
        if (field.type === 'string' || field.type === 'email' || field.type === 'url') {
          zodType += `.min(${field.min}, { message: '${field.message || `Debe tener al menos ${field.min} caracteres`}' })`;
        } else if (field.type === 'number') {
          zodType += `.min(${field.min}, { message: '${field.message || `El valor mínimo es ${field.min}`}' })`;
        }
      }

      if (field.max !== undefined) {
        if (field.type === 'string' || field.type === 'email' || field.type === 'url') {
          zodType += `.max(${field.max}, { message: '${field.message || `No debe exceder ${field.max} caracteres`}' })`;
        } else if (field.type === 'number') {
          zodType += `.max(${field.max}, { message: '${field.message || `El valor máximo es ${field.max}`}' })`;
        }
      }

      // Handle optional fields
      if (!field.required) {
        zodType += `.optional()`;
      }

      lines.push(`  ${field.name}: ${zodType},`);
    }

    lines.push(`});`);
    return lines.join('\n');
  }

  /**
   * Generates a reusable auth helper:
   * - Exports a function that checks getServerSession(authOptions)
   * - Returns the session or returns 401 response
   * - Imports from next-auth and @/lib/auth
   */
  static generateAuthMiddleware(): string {
    return `import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Verifica la autenticación del usuario.
 * Retorna la sesión si está autenticado, o una respuesta 401 si no.
 */
export async function verificarAutenticacion() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      autenticado: false,
      respuesta: NextResponse.json(
        { error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' },
        { status: 401 }
      ),
    };
  }

  return {
    autenticado: true,
    session,
  };
}
`;
  }

  /**
   * Generates a pagination utility:
   * - Parses page/limit from URLSearchParams
   * - Calculates skip, take for Prisma
   * - Returns metadata object: { total, totalPages, currentPage, hasNext, hasPrev }
   */
  static generatePaginationHelper(): string {
    return `/**
 * Utilidad de paginación para API routes.
 * Parsea page/limit de los parámetros de URL y calcula metadata de paginación.
 */

interface PaginacionParams {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

interface PaginacionMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Parsea los parámetros de paginación de la URL.
 */
export function parsearPaginacion(searchParams: URLSearchParams): PaginacionParams {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
  const skip = (page - 1) * limit;

  return { page, limit, skip, take: limit };
}

/**
 * Calcula la metadata de paginación.
 */
export function calcularMetaPaginacion(total: number, page: number, limit: number): PaginacionMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
`;
  }

  /**
   * Generates error handling utility:
   * - Catches errors, logs with console.error
   * - Returns NextResponse with generic 500 message
   * - Handles ZodError specifically with 400 and field details
   */
  static generateErrorHandler(): string {
    return `import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Manejador de errores para API routes.
 * Captura errores, registra con console.error y retorna respuestas apropiadas.
 */
export function manejarError(error: unknown): NextResponse {
  // Manejar errores de validación Zod
  if (error instanceof z.ZodError) {
    const erroresDetallados = error.errors.map((e) => ({
      campo: e.path.join('.'),
      mensaje: e.message,
    }));

    return NextResponse.json(
      { error: 'Error de validación', errores: erroresDetallados },
      { status: 400 }
    );
  }

  // Registrar error detallado en el servidor
  console.error('Error en operación de base de datos:', error);

  // Retornar mensaje genérico al cliente
  return NextResponse.json(
    { error: 'Error interno del servidor. Intente nuevamente más tarde.' },
    { status: 500 }
  );
}
`;
  }

  // --- Private helper methods ---

  private static _mapZodType(type: string): string {
    switch (type) {
      case 'string':
        return `z.string({ required_error: 'Este campo es obligatorio' })`;
      case 'number':
        return `z.number({ required_error: 'Este campo es obligatorio', invalid_type_error: 'Debe ser un número válido' })`;
      case 'boolean':
        return `z.boolean({ required_error: 'Este campo es obligatorio' })`;
      case 'email':
        return `z.string({ required_error: 'El correo electrónico es obligatorio' }).email({ message: 'Debe ser un correo electrónico válido' })`;
      case 'url':
        return `z.string({ required_error: 'La URL es obligatoria' }).url({ message: 'Debe ser una URL válida' })`;
      case 'date':
        return `z.string({ required_error: 'La fecha es obligatoria' }).datetime({ message: 'Debe ser una fecha válida' })`;
      default:
        return `z.string({ required_error: 'Este campo es obligatorio' })`;
    }
  }

  private static _generatePaginatedGet(
    spec: EndpointSpec,
    entityLower: string,
    entityPlural: string
  ): string[] {
    const lines: string[] = [];
    lines.push(`    // Parsear parámetros de paginación`);
    lines.push(`    const { searchParams } = new URL(request.url);`);
    lines.push(`    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));`);
    lines.push(`    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));`);
    lines.push(`    const skip = (page - 1) * limit;`);
    lines.push('');

    if (spec.requiresOwnership) {
      lines.push(`    const userId = (session?.user as any)?.id;`);
      lines.push('');
      lines.push(`    // Contar total de registros del usuario`);
      lines.push(`    const total = await prisma.${entityLower}.count({`);
      lines.push(`      where: { userId },`);
      lines.push(`    });`);
      lines.push('');
      lines.push(`    // Obtener registros paginados`);
      lines.push(`    const ${entityPlural} = await prisma.${entityLower}.findMany({`);
      lines.push(`      where: { userId },`);
      lines.push(`      skip,`);
      lines.push(`      take: limit,`);
      lines.push(`      orderBy: { createdAt: 'desc' },`);
      lines.push(`    });`);
    } else {
      lines.push(`    // Contar total de registros`);
      lines.push(`    const total = await prisma.${entityLower}.count();`);
      lines.push('');
      lines.push(`    // Obtener registros paginados`);
      lines.push(`    const ${entityPlural} = await prisma.${entityLower}.findMany({`);
      lines.push(`      skip,`);
      lines.push(`      take: limit,`);
      lines.push(`      orderBy: { createdAt: 'desc' },`);
      lines.push(`    });`);
    }

    lines.push('');
    lines.push(`    const totalPages = Math.ceil(total / limit);`);
    lines.push('');
    lines.push(`    return NextResponse.json({`);
    lines.push(`      datos: ${entityPlural},`);
    lines.push(`      paginacion: {`);
    lines.push(`        total,`);
    lines.push(`        totalPages,`);
    lines.push(`        currentPage: page,`);
    lines.push(`        hasNext: page < totalPages,`);
    lines.push(`        hasPrev: page > 1,`);
    lines.push(`      },`);
    lines.push(`    });`);
    return lines;
  }

  private static _generateSimpleGet(
    spec: EndpointSpec,
    entityLower: string,
    entityPlural: string,
    entityUpper: string,
    hasParams: boolean
  ): string[] {
    const lines: string[] = [];

    if (hasParams) {
      if (spec.requiresOwnership) {
        lines.push(`    const userId = (session?.user as any)?.id;`);
        lines.push('');
      }
      lines.push(`    const ${entityLower} = await prisma.${entityLower}.findUnique({`);
      lines.push(`      where: { id: params.id },`);
      lines.push(`    });`);
      lines.push('');
      lines.push(`    if (!${entityLower}) {`);
      lines.push(`      return NextResponse.json(`);
      lines.push(`        { error: '${entityUpper} no encontrado.' },`);
      lines.push(`        { status: 404 }`);
      lines.push(`      );`);
      lines.push(`    }`);

      if (spec.requiresOwnership) {
        lines.push('');
        lines.push(`    // Verificar propiedad del recurso`);
        lines.push(`    if (${entityLower}.userId !== userId) {`);
        lines.push(`      return NextResponse.json(`);
        lines.push(`        { error: 'No tiene permisos para acceder a este recurso.' },`);
        lines.push(`        { status: 403 }`);
        lines.push(`      );`);
        lines.push(`    }`);
      }

      lines.push('');
      lines.push(`    return NextResponse.json({ ${entityLower} });`);
    } else {
      if (spec.requiresOwnership) {
        lines.push(`    const userId = (session?.user as any)?.id;`);
        lines.push('');
        lines.push(`    const ${entityPlural} = await prisma.${entityLower}.findMany({`);
        lines.push(`      where: { userId },`);
        lines.push(`      orderBy: { createdAt: 'desc' },`);
        lines.push(`    });`);
      } else {
        lines.push(`    const ${entityPlural} = await prisma.${entityLower}.findMany({`);
        lines.push(`      orderBy: { createdAt: 'desc' },`);
        lines.push(`    });`);
      }
      lines.push('');
      lines.push(`    return NextResponse.json({ ${entityPlural} });`);
    }

    return lines;
  }

  private static _generatePost(
    spec: EndpointSpec,
    entityLower: string,
    entityUpper: string,
    needsZod: boolean | undefined
  ): string[] {
    const lines: string[] = [];

    lines.push(`    // Parsear y validar datos de entrada`);
    lines.push(`    const body = await request.json();`);

    if (needsZod && spec.zodSchema) {
      lines.push(`    const datos = ${spec.zodSchema.name}.parse(body);`);
    } else {
      lines.push(`    const datos = body;`);
    }

    lines.push('');

    if (spec.requiresAuth) {
      lines.push(`    const userId = (session?.user as any)?.id;`);
      lines.push('');
      lines.push(`    const ${entityLower} = await prisma.${entityLower}.create({`);
      lines.push(`      data: {`);
      lines.push(`        ...datos,`);
      lines.push(`        userId,`);
      lines.push(`      },`);
      lines.push(`    });`);
    } else {
      lines.push(`    const ${entityLower} = await prisma.${entityLower}.create({`);
      lines.push(`      data: datos,`);
      lines.push(`    });`);
    }

    lines.push('');
    lines.push(`    return NextResponse.json({ ${entityLower} }, { status: 201 });`);
    return lines;
  }

  private static _generateUpdate(
    spec: EndpointSpec,
    entityLower: string,
    entityUpper: string,
    needsZod: boolean | undefined
  ): string[] {
    const lines: string[] = [];

    lines.push(`    // Parsear y validar datos de entrada`);
    lines.push(`    const body = await request.json();`);

    if (needsZod && spec.zodSchema) {
      lines.push(`    const datos = ${spec.zodSchema.name}.parse(body);`);
    } else {
      lines.push(`    const datos = body;`);
    }

    lines.push('');

    // Find existing resource
    lines.push(`    const ${entityLower}Existente = await prisma.${entityLower}.findUnique({`);
    lines.push(`      where: { id: params.id },`);
    lines.push(`    });`);
    lines.push('');
    lines.push(`    if (!${entityLower}Existente) {`);
    lines.push(`      return NextResponse.json(`);
    lines.push(`        { error: '${entityUpper} no encontrado.' },`);
    lines.push(`        { status: 404 }`);
    lines.push(`      );`);
    lines.push(`    }`);

    // Ownership check
    if (spec.requiresOwnership) {
      lines.push('');
      lines.push(`    // Verificar propiedad del recurso`);
      lines.push(`    const userId = (session?.user as any)?.id;`);
      lines.push(`    if (${entityLower}Existente.userId !== userId) {`);
      lines.push(`      return NextResponse.json(`);
      lines.push(`        { error: 'No tiene permisos para modificar este recurso.' },`);
      lines.push(`        { status: 403 }`);
      lines.push(`      );`);
      lines.push(`    }`);
    }

    lines.push('');
    lines.push(`    const ${entityLower} = await prisma.${entityLower}.update({`);
    lines.push(`      where: { id: params.id },`);
    lines.push(`      data: datos,`);
    lines.push(`    });`);
    lines.push('');
    lines.push(`    return NextResponse.json({ ${entityLower} });`);
    return lines;
  }

  private static _generateDelete(
    spec: EndpointSpec,
    entityLower: string,
    entityUpper: string
  ): string[] {
    const lines: string[] = [];

    // Find existing resource
    lines.push(`    const ${entityLower}Existente = await prisma.${entityLower}.findUnique({`);
    lines.push(`      where: { id: params.id },`);
    lines.push(`    });`);
    lines.push('');
    lines.push(`    if (!${entityLower}Existente) {`);
    lines.push(`      return NextResponse.json(`);
    lines.push(`        { error: '${entityUpper} no encontrado.' },`);
    lines.push(`        { status: 404 }`);
    lines.push(`      );`);
    lines.push(`    }`);

    // Ownership check
    if (spec.requiresOwnership) {
      lines.push('');
      lines.push(`    // Verificar propiedad del recurso`);
      lines.push(`    const userId = (session?.user as any)?.id;`);
      lines.push(`    if (${entityLower}Existente.userId !== userId) {`);
      lines.push(`      return NextResponse.json(`);
      lines.push(`        { error: 'No tiene permisos para eliminar este recurso.' },`);
      lines.push(`        { status: 403 }`);
      lines.push(`      );`);
      lines.push(`    }`);
    }

    lines.push('');
    lines.push(`    await prisma.${entityLower}.delete({`);
    lines.push(`      where: { id: params.id },`);
    lines.push(`    });`);
    lines.push('');
    lines.push(`    return NextResponse.json({ mensaje: '${entityUpper} eliminado correctamente.' });`);
    return lines;
  }
}

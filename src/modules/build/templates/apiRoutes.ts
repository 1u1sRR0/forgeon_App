// Template generators for API routes

import { BuildParameters } from '../types';

export class ApiRoutesGenerator {
  /**
   * Generate src/lib/prisma.ts
   */
  static generatePrismaLib(): string {
    return `import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
`;
  }

  /**
   * Generate src/lib/auth.ts
   */
  static generateAuthLib(): string {
    return `import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};
`;
  }

  /**
   * Generate src/middleware.ts
   */
  static generateMiddleware(): string {
    return `import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ['/dashboard/:path*'],
};
`;
  }

  /**
   * Generate src/app/api/auth/[...nextauth]/route.ts
   */
  static generateNextAuthRoute(): string {
    return `import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
`;
  }

  /**
   * Generate src/app/api/auth/register/route.ts
   */
  static generateRegisterRoute(): string {
    return `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;
  }

  /**
   * Generate CRUD API route for entity
   */
  static generateEntityRoute(params: BuildParameters): string {
    const entityNameLower = params.entityName.toLowerCase();
    const entityNameUpper = params.entityName.charAt(0).toUpperCase() + params.entityName.slice(1);
    const entityNamePlural = entityNameLower + 's';

    return `import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/${entityNamePlural} - List all ${entityNamePlural}
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const ${entityNamePlural} = await prisma.${entityNameLower}.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ ${entityNamePlural} });
  } catch (error) {
    console.error('Get ${entityNamePlural} error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/${entityNamePlural} - Create new ${entityNameLower}
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { title, description } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const ${entityNameLower} = await prisma.${entityNameLower}.create({
      data: {
        title,
        description,
        userId: user.id,
      },
    });

    return NextResponse.json({ ${entityNameLower} }, { status: 201 });
  } catch (error) {
    console.error('Create ${entityNameLower} error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;
  }

  /**
   * Generate CRUD API route for single entity
   */
  static generateEntityIdRoute(params: BuildParameters): string {
    const entityNameLower = params.entityName.toLowerCase();
    const entityNameUpper = params.entityName.charAt(0).toUpperCase() + params.entityName.slice(1);

    return `import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/${entityNameLower}s/[id] - Get single ${entityNameLower}
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const ${entityNameLower} = await prisma.${entityNameLower}.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!${entityNameLower}) {
      return NextResponse.json({ error: '${entityNameUpper} not found' }, { status: 404 });
    }

    return NextResponse.json({ ${entityNameLower} });
  } catch (error) {
    console.error('Get ${entityNameLower} error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/${entityNameLower}s/[id] - Update ${entityNameLower}
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { title, description } = await request.json();

    const ${entityNameLower} = await prisma.${entityNameLower}.updateMany({
      where: {
        id: params.id,
        userId: user.id,
      },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
      },
    });

    if (${entityNameLower}.count === 0) {
      return NextResponse.json({ error: '${entityNameUpper} not found' }, { status: 404 });
    }

    const updated${entityNameUpper} = await prisma.${entityNameLower}.findUnique({
      where: { id: params.id },
    });

    return NextResponse.json({ ${entityNameLower}: updated${entityNameUpper} });
  } catch (error) {
    console.error('Update ${entityNameLower} error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/${entityNameLower}s/[id] - Delete ${entityNameLower}
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const ${entityNameLower} = await prisma.${entityNameLower}.deleteMany({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (${entityNameLower}.count === 0) {
      return NextResponse.json({ error: '${entityNameUpper} not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete ${entityNameLower} error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;
  }
}

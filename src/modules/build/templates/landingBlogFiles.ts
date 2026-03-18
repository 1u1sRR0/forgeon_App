// Template generators for Landing+Blog files

import { BuildParameters } from '../types';

export class LandingBlogGenerator {
  /**
   * Generate prisma/schema.prisma for Landing+Blog
   */
  static generatePrismaSchema(params: BuildParameters): string {
    return `// Prisma schema for ${params.appName} - Landing+Blog

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id       String @id @default(uuid())
  email    String @unique
  name     String?
  password String
  role     String @default("author")
  Post     Post[]
}

model Post {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  content     String
  excerpt     String?
  published   Boolean  @default(false)
  authorId    String
  categoryId  String?
  Author      User     @relation(fields: [authorId], references: [id])
  Category    Category? @relation(fields: [categoryId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Category {
  id   String @id @default(uuid())
  name String @unique
  slug String @unique
  Post Post[]
}

model ContactSubmission {
  id        String   @id @default(uuid())
  name      String
  email     String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}
`;
  }

  /**
   * Generate src/app/api/posts/route.ts - Posts CRUD
   */
  static generatePostsRoute(params: BuildParameters): string {
    return `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { published: true };
    if (category) {
      where.Category = { slug: category };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { Author: { select: { name: true } }, Category: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, categoryId, published } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título y contenido son obligatorios' },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 160),
        published: published || false,
        authorId: (session.user as any).id,
        categoryId: categoryId || null,
      },
      include: { Author: { select: { name: true } }, Category: true },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
  }

  /**
   * Generate src/app/api/posts/[id]/route.ts - Single post CRUD
   */
  static generatePostIdRoute(params: BuildParameters): string {
    return `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
      include: {
        Author: { select: { name: true } },
        Category: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, categoryId, published } = body;

    const updateData: Record<string, unknown> = {};
    if (title) {
      updateData.title = title;
      updateData.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    if (content) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (published !== undefined) updateData.published = published;

    const post = await prisma.post.update({
      where: { id: params.id },
      data: updateData,
      include: { Author: { select: { name: true } }, Category: true },
    });

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Post eliminado' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
  }

  /**
   * Generate src/app/api/categories/route.ts - Categories CRUD
   */
  static generateCategoriesRoute(params: BuildParameters): string {
    return `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { Post: true } } },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Nombre es obligatorio' }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const category = await prisma.category.create({
      data: { name, slug },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
  }

  /**
   * Generate src/app/api/contact/route.ts - Contact form submission
   */
  static generateContactRoute(params: BuildParameters): string {
    return `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';

    const where: Record<string, unknown> = {};
    if (unreadOnly) {
      where.read = false;
    }

    const submissions = await prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ submissions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nombre, email y mensaje son obligatorios' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.create({
      data: { name, email, message },
    });

    return NextResponse.json(
      { message: 'Mensaje enviado correctamente', id: submission.id },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
  }

  /**
   * Generate src/app/page.tsx - Landing page
   */
  static generateLandingPage(params: BuildParameters): string {
    const primary = params.brandingColors?.primary || '#7c3aed';
    return `'use client';

import Link from 'next/link';
import { SeoHead } from '@/components/SeoHead';

export default function LandingPage() {
  return (
    <>
      <SeoHead
        title="${params.appName} - Inicio"
        description="Bienvenido a ${params.appName}. Descubre nuestro contenido y mantente al día."
      />
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Hero Section */}
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-gray-950 to-blue-900/20" />
          <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ${params.appName}
            </h1>
            <div className="flex items-center gap-4">
              <Link href="/blog" className="text-gray-300 hover:text-white transition-colors duration-200">
                Blog
              </Link>
              <Link href="/contacto" className="text-gray-300 hover:text-white transition-colors duration-200">
                Contacto
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-200"
              >
                Iniciar Sesión
              </Link>
            </div>
          </nav>

          <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-24">
            <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                ${params.appName}
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Tu espacio para descubrir contenido de calidad, ideas inspiradoras y mantenerte conectado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl transition-all duration-200 hover:scale-105"
              >
                Explorar Blog
              </Link>
              <Link
                href="/contacto"
                className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all duration-200"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
              ¿Qué encontrarás aquí?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-200">
                <div className="text-4xl mb-4">📝</div>
                <h4 className="text-xl font-semibold mb-3">Blog</h4>
                <p className="text-gray-400 leading-relaxed">
                  Artículos y publicaciones sobre los temas que más te interesan, escritos por nuestro equipo.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-200">
                <div className="text-4xl mb-4">🏷️</div>
                <h4 className="text-xl font-semibold mb-3">Categorías</h4>
                <p className="text-gray-400 leading-relaxed">
                  Contenido organizado por categorías para que encuentres exactamente lo que buscas.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-200">
                <div className="text-4xl mb-4">✉️</div>
                <h4 className="text-xl font-semibold mb-3">Contacto</h4>
                <p className="text-gray-400 leading-relaxed">
                  ¿Tienes preguntas o sugerencias? Escríbenos y te responderemos lo antes posible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para explorar?
            </h3>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Descubre nuestras últimas publicaciones y mantente al día con las novedades.
            </p>
            <Link
              href="/blog"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl transition-all duration-200 hover:scale-105"
            >
              Ver el Blog
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} ${params.appName}. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <Link href="/blog" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Blog</Link>
              <Link href="/contacto" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Contacto</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
`;
  }

  /**
   * Generate src/app/blog/page.tsx - Blog listing page
   */
  static generateBlogListPage(params: BuildParameters): string {
    return `'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SeoHead } from '@/components/SeoHead';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  Author: { name: string | null };
  Category: { name: string; slug: string } | null;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { Post: number };
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [activeCategory]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (activeCategory) queryParams.set('category', activeCategory);
      if (search) queryParams.set('q', search);

      const res = await fetch(\`/api/posts?\${queryParams}\`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error al cargar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  return (
    <>
      <SeoHead
        title="${params.appName} - Blog"
        description="Lee las últimas publicaciones de ${params.appName}."
      />
      <div className="min-h-screen bg-gray-950 text-white">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-white/10">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ${params.appName}
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-white font-medium">Blog</Link>
            <Link href="/contacto" className="text-gray-300 hover:text-white transition-colors">Contacto</Link>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-gray-400 text-lg mb-8">Las últimas publicaciones y novedades.</p>

          <form onSubmit={handleSearch} className="flex gap-4 mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar artículos..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-150"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors duration-200"
            >
              Buscar
            </button>
          </form>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setActiveCategory('')}
                className={\`px-4 py-2 rounded-full text-sm transition-all duration-200 \${
                  !activeCategory
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }\`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={\`px-4 py-2 rounded-full text-sm transition-all duration-200 \${
                    activeCategory === cat.slug
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }\`}
                >
                  {cat.name} ({cat._count.Post})
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-400">Cargando artículos...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No se encontraron artículos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-lg transition-all duration-200"
                >
                  <div className="p-6">
                    {post.Category && (
                      <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs mb-3">
                        {post.Category.name}
                      </span>
                    )}
                    <Link href={\`/blog/\${post.slug}\`}>
                      <h2 className="text-xl font-semibold text-white hover:text-purple-400 transition-colors mb-3">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                      {post.excerpt || ''}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{post.Author?.name || 'Anónimo'}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
`;
  }

  /**
   * Generate src/app/blog/[slug]/page.tsx - Blog post detail page
   */
  static generateBlogPostPage(params: BuildParameters): string {
    return `'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SeoHead } from '@/components/SeoHead';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  Author: { name: string | null };
  Category: { name: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(\`/api/posts/\${params.slug}\`);
        if (!res.ok) throw new Error('No encontrado');
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error('Error al cargar post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.slug]);

  if (loading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Cargando...</div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white">
        <p className="text-gray-400 text-lg mb-4">Artículo no encontrado</p>
        <Link href="/blog" className="text-purple-400 hover:text-purple-300">Volver al blog</Link>
      </div>
    );
  }

  return (
    <>
      <SeoHead
        title={\`\${post.title} - ${params.appName}\`}
        description={post.excerpt || post.content.substring(0, 160)}
      />
      <div className="min-h-screen bg-gray-950 text-white">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-white/10">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ${params.appName}
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
            <Link href="/contacto" className="text-gray-300 hover:text-white transition-colors">Contacto</Link>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-6 py-12">
          <Link href="/blog" className="text-purple-400 hover:text-purple-300 mb-8 inline-block">
            ← Volver al blog
          </Link>

          <header className="mb-8">
            {post.Category && (
              <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs mb-4">
                {post.Category.name}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <span>Por {post.Author?.name || 'Anónimo'}</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </header>

          <div className="prose prose-invert prose-purple max-w-none">
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</div>
          </div>
        </article>
      </div>
    </>
  );
}
`;
  }

  /**
   * Generate src/app/contacto/page.tsx - Contact form page
   */
  static generateContactPage(params: BuildParameters): string {
    return `'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SeoHead } from '@/components/SeoHead';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al enviar el mensaje');
        return;
      }

      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Error al enviar el mensaje');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <SeoHead
        title="${params.appName} - Contacto"
        description="Ponte en contacto con ${params.appName}. Estamos aquí para ayudarte."
      />
      <div className="min-h-screen bg-gray-950 text-white">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-white/10">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ${params.appName}
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
            <Link href="/contacto" className="text-white font-medium">Contacto</Link>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contacto</h1>
          <p className="text-gray-400 text-lg mb-8">
            ¿Tienes preguntas, sugerencias o simplemente quieres saludar? Escríbenos.
          </p>

          {sent ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
              <p className="text-2xl mb-2">✅</p>
              <h2 className="text-xl font-semibold text-green-400 mb-2">¡Mensaje enviado!</h2>
              <p className="text-gray-400">Gracias por escribirnos. Te responderemos pronto.</p>
              <button
                onClick={() => setSent(false)}
                className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-150"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-150"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-150 min-h-[120px]"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 text-lg"
              >
                {sending ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
`;
  }

  /**
   * Generate src/components/SeoHead.tsx - SEO meta tags component
   */
  static generateSeoComponents(params: BuildParameters): string {
    return `import Head from 'next/head';

interface SeoHeadProps {
  title: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  keywords?: string;
  author?: string;
  noIndex?: boolean;
}

export function SeoHead({
  title,
  description = '${params.appName} - Tu plataforma de contenido',
  ogImage = '/og-image.png',
  ogType = 'website',
  canonicalUrl,
  keywords,
  author,
  noIndex = false,
}: SeoHeadProps) {
  const fullTitle = title.includes('${params.appName}')
    ? title
    : \`\${title} | ${params.appName}\`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content="${params.appName}" />
      <meta property="og:locale" content="es_ES" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Head>
  );
}

export function generateSitemap(baseUrl: string, posts: Array<{ slug: string; updatedAt: string }>): string {
  const staticPages = ['', '/blog', '/contacto'];

  const staticEntries = staticPages
    .map(
      (page) => \`  <url>
    <loc>\${baseUrl}\${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>\${page === '' ? '1.0' : '0.8'}</priority>
  </url>\`
    )
    .join('\\n');

  const postEntries = posts
    .map(
      (post) => \`  <url>
    <loc>\${baseUrl}/blog/\${post.slug}</loc>
    <lastmod>\${new Date(post.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\`
    )
    .join('\\n');

  return \`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
\${staticEntries}
\${postEntries}
</urlset>\`;
}
`;
  }
}

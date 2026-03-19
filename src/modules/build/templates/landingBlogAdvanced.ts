// LandingBlogAdvancedTemplate — Generates advanced Landing/Blog pages, blog with
// pagination and category filters, article with table of contents, contact form,
// about page, newsletter subscription, Prisma schema, and API routes for the
// LANDING_BLOG template type.
// All pages use 'use client', useState, useEffect, Tailwind design system classes,
// and import shared components from '@/components/shared'.
// SEO: each page exports generateMetadata with title, description, Open Graph, canonical URL.

import { BuildParameters } from '../types';

interface ApiRouteFile {
  path: string;
  content: string;
}

export class LandingBlogAdvancedTemplate {
  // ─── Helpers ───────────────────────────────────────────────

  private static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private static lower(str: string): string {
    return str.toLowerCase();
  }

  private static plural(str: string): string {
    return str.toLowerCase() + 's';
  }

  private static pluralUpper(str: string): string {
    return LandingBlogAdvancedTemplate.capitalize(str) + 's';
  }

  // ─── 1. Blog List Page (paginated + category filter) ──────

  static generateBlogListPage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingSpinner, EmptyState } from '@/components/shared';
import { Toast } from '@/components/shared';
import ArticleCard from '@/components/blog/ArticleCard';
import CategoryBadge from '@/components/blog/CategoryBadge';

export const metadata = {
  title: 'Blog — ${appName}',
  description: 'Artículos, guías y novedades de ${appName}. Mantente al día con nuestro contenido.',
  openGraph: {
    title: 'Blog — ${appName}',
    description: 'Artículos, guías y novedades de ${appName}.',
    type: 'website',
    url: '/blog',
  },
};

export function generateMetadata() {
  return {
    title: 'Blog — ${appName}',
    description: 'Artículos, guías y novedades de ${appName}. Mantente al día con nuestro contenido.',
    openGraph: {
      title: 'Blog — ${appName}',
      description: 'Artículos, guías y novedades de ${appName}.',
      type: 'website',
      url: '/blog',
    },
    alternates: { canonical: '/blog' },
  };
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
  category: { id: string; name: string; slug: string } | null;
  author: { name: string | null };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Paginacion {
  total: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function BlogListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [paginacion, setPaginacion] = useState<Paginacion>({
    total: 0, totalPages: 1, currentPage: 1, hasNext: false, hasPrev: false,
  });

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  const [search, setSearch] = useState(searchQuery);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, currentCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch {
      // silently fail
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('limit', '9');
      if (currentCategory) params.set('categorySlug', currentCategory);
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(\`/api/posts?\${params.toString()}\`);
      if (!res.ok) throw new Error('Error al cargar artículos');
      const data = await res.json();
      setPosts(data.posts || []);
      setPaginacion(data.paginacion || paginacion);
    } catch (err: any) {
      setError(err.message || 'Error al cargar artículos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (currentCategory) params.set('category', currentCategory);
    params.set('page', '1');
    router.push(\`/blog?\${params.toString()}\`);
  };

  const handleCategoryFilter = (slug: string) => {
    const params = new URLSearchParams();
    if (slug) params.set('category', slug);
    if (searchQuery) params.set('search', searchQuery);
    params.set('page', '1');
    router.push(\`/blog?\${params.toString()}\`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (currentCategory) params.set('category', currentCategory);
    if (searchQuery) params.set('search', searchQuery);
    params.set('page', String(page));
    router.push(\`/blog?\${params.toString()}\`);
  };

  return (
    <div className="min-h-screen bg-background">
      {toastMessage && <Toast message={toastMessage} type="info" onClose={() => setToastMessage('')} />}

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Blog</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Artículos, guías y novedades de ${appName}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2" role="search" aria-label="Buscar artículos">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar artículos..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              aria-label="Buscar artículos"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Category Badges */}
        <div className="flex flex-wrap gap-2 mb-8" role="navigation" aria-label="Filtrar por categoría">
          <button
            onClick={() => handleCategoryFilter('')}
            className={\`px-4 py-2 rounded-full text-sm font-medium transition-colors \${
              !currentCategory
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-secondary hover:bg-gray-200'
            }\`}
            aria-pressed={!currentCategory}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <CategoryBadge
              key={cat.id}
              name={cat.name}
              slug={cat.slug}
              active={currentCategory === cat.slug}
              onClick={() => handleCategoryFilter(cat.slug)}
            />
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={fetchPosts} className="px-4 py-2 bg-primary text-white rounded-lg">
              Reintentar
            </button>
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            title="No hay artículos"
            description="No se encontraron artículos con los filtros seleccionados."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <ArticleCard
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt || ''}
                  coverImage={post.coverImage || ''}
                  date={post.createdAt}
                  category={post.category?.name || ''}
                  author={post.author?.name || 'Anónimo'}
                  onClick={() => router.push(\`/blog/\${post.slug}\`)}
                />
              ))}
            </div>

            {/* Pagination */}
            {paginacion.totalPages > 1 && (
              <nav className="flex justify-center items-center gap-2 mt-12" role="navigation" aria-label="Paginación del blog">
                <button
                  onClick={() => handlePageChange(paginacion.currentPage - 1)}
                  disabled={!paginacion.hasPrev}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  aria-label="Página anterior"
                >
                  ← Anterior
                </button>
                <span className="text-sm text-secondary px-4">
                  Página {paginacion.currentPage} de {paginacion.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(paginacion.currentPage + 1)}
                  disabled={!paginacion.hasNext}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  aria-label="Página siguiente"
                >
                  Siguiente →
                </button>
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  );
}
`;
  }

  // ─── 2. Article Page (single article + table of contents) ─

  static generateArticlePage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared';
import { Toast } from '@/components/shared';
import TableOfContents from '@/components/blog/TableOfContents';
import ShareButtons from '@/components/blog/ShareButtons';
import CategoryBadge from '@/components/blog/CategoryBadge';
import NewsletterForm from '@/components/blog/NewsletterForm';

export function generateMetadata({ params: routeParams }: { params: { slug: string } }) {
  return {
    title: \`Artículo — ${appName}\`,
    description: 'Lee este artículo en el blog de ${appName}.',
    openGraph: {
      title: \`Artículo — ${appName}\`,
      description: 'Lee este artículo en el blog de ${appName}.',
      type: 'article',
      url: \`/blog/\${routeParams.slug}\`,
    },
    alternates: { canonical: \`/blog/\${routeParams.slug}\` },
  };
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string; slug: string } | null;
  author: { name: string | null };
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(markdown: string): TocItem[] {
  const headingRegex = /^(#{1,3})\\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ id, text, level });
  }
  return headings;
}

function renderMarkdown(content: string): string {
  let html = content
    .replace(/^### (.+)$/gm, '<h3 id="$1" class="text-xl font-heading font-semibold text-foreground mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 id="$1" class="text-2xl font-heading font-bold text-foreground mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 id="$1" class="text-3xl font-heading font-bold text-foreground mt-12 mb-6">$1</h1>')
    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
    .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
    .replace(/\\[(.+?)\\]\\((.+?)\\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-secondary">$1</li>')
    .replace(/^(?!<[hla]|<li|<strong|<em)(.+)$/gm, '<p class="text-secondary leading-relaxed mb-4">$1</p>');

  // Fix heading IDs to use slug format
  html = html.replace(/id="([^"]+)"/g, (_, text) => {
    const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return \`id="\${slug}"\`;
  });

  return html;
}

export default function ArticlePage({ params: routeParams }: { params: { slug: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [headings, setHeadings] = useState<TocItem[]>([]);

  useEffect(() => {
    fetchPost();
  }, [routeParams.slug]);

  const fetchPost = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(\`/api/posts/\${routeParams.slug}\`);
      if (!res.ok) throw new Error('Artículo no encontrado');
      const data = await res.json();
      setPost(data.post);
      if (data.post?.content) {
        setHeadings(extractHeadings(data.post.content));
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar el artículo');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error || 'Artículo no encontrado'}</p>
        <button onClick={() => router.push('/blog')} className="px-4 py-2 bg-primary text-white rounded-lg">
          Volver al Blog
        </button>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      {toastMessage && <Toast message={toastMessage} type="info" onClose={() => setToastMessage('')} />}

      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full h-64 md:h-96 bg-gray-100">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents — Sidebar */}
          {headings.length > 0 && (
            <aside className="lg:w-64 flex-shrink-0 order-2 lg:order-1">
              <div className="lg:sticky lg:top-8">
                <TableOfContents items={headings} />
              </div>
            </aside>
          )}

          {/* Article Content */}
          <article className="flex-1 order-1 lg:order-2" role="article" aria-label={post.title}>
            {/* Breadcrumb */}
            <nav className="text-sm text-secondary mb-6" aria-label="Breadcrumb">
              <a href="/blog" className="hover:text-primary transition-colors">Blog</a>
              <span className="mx-2">›</span>
              {post.category && (
                <>
                  <a href={\`/blog?category=\${post.category.slug}\`} className="hover:text-primary transition-colors">
                    {post.category.name}
                  </a>
                  <span className="mx-2">›</span>
                </>
              )}
              <span className="text-foreground">{post.title}</span>
            </nav>

            {/* Meta */}
            <div className="flex items-center gap-3 mb-4">
              {post.category && (
                <CategoryBadge name={post.category.name} slug={post.category.slug} active={false} />
              )}
              <span className="text-sm text-secondary">{formattedDate}</span>
              <span className="text-sm text-secondary">por {post.author?.name || 'Anónimo'}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-secondary mb-8 border-l-4 border-primary pl-4 italic">
                {post.excerpt}
              </p>
            )}

            {/* Rendered Markdown Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
            />

            {/* Share Buttons */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <ShareButtons title={post.title} slug={post.slug} />
            </div>

            {/* Newsletter CTA */}
            <div className="mt-10 bg-gray-50 rounded-xl p-8 text-center">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                ¿Te gustó este artículo?
              </h3>
              <p className="text-secondary mb-4">Suscríbete para recibir más contenido como este.</p>
              <NewsletterForm compact />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
`;
  }

  // ─── 3. Contact Page (form with validation) ───────────────

  static generateContactPage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { Toast } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';

export function generateMetadata() {
  return {
    title: 'Contacto — ${appName}',
    description: 'Ponte en contacto con el equipo de ${appName}. Estamos aquí para ayudarte.',
    openGraph: {
      title: 'Contacto — ${appName}',
      description: 'Ponte en contacto con el equipo de ${appName}.',
      type: 'website',
      url: '/contacto',
    },
    alternates: { canonical: '/contacto' },
  };
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', subject: '', message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es obligatorio';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSuccess(false);

    if (!validateForm()) return;

    setSaving(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al enviar el mensaje');
      }

      setSuccess(true);
      setToastMessage('¡Mensaje enviado correctamente! Te responderemos pronto.');
      setToastType('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setServerError(err.message || 'Error al enviar el mensaje');
      setToastMessage(err.message || 'Error al enviar el mensaje');
      setToastType('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />}

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Contacto</h1>
          <p className="text-lg text-secondary">
            ¿Tienes preguntas o sugerencias? Nos encantaría escucharte.
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {success && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center" role="alert">
            ¡Gracias por tu mensaje! Te responderemos lo antes posible.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-label="Formulario de contacto">
          {/* Name */}
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={\`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary \${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }\`}
              placeholder="Tu nombre"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && <p id="name-error" className="text-sm text-red-600 mt-1" role="alert">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={\`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary \${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }\`}
              placeholder="tu@email.com"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <p id="email-error" className="text-sm text-red-600 mt-1" role="alert">{errors.email}</p>}
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground mb-1">
              Asunto
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Asunto del mensaje"
              aria-describedby={errors.subject ? 'subject-error' : undefined}
            />
            {errors.subject && <p id="subject-error" className="text-sm text-red-600 mt-1" role="alert">{errors.subject}</p>}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1">
              Mensaje <span className="text-red-500">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className={\`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y \${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }\`}
              placeholder="Escribe tu mensaje aquí..."
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && <p id="message-error" className="text-sm text-red-600 mt-1" role="alert">{errors.message}</p>}
          </div>

          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Enviar mensaje de contacto"
          >
            {saving ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
        </form>
      </main>
    </div>
  );
}
`;
  }

  // ─── 4. About Page ────────────────────────────────────────

  static generateAboutPage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { Toast } from '@/components/shared';

export function generateMetadata() {
  return {
    title: 'Acerca de — ${appName}',
    description: 'Conoce más sobre ${appName}, nuestra misión, visión y el equipo detrás del proyecto.',
    openGraph: {
      title: 'Acerca de — ${appName}',
      description: 'Conoce más sobre ${appName}, nuestra misión y visión.',
      type: 'website',
      url: '/about',
    },
    alternates: { canonical: '/about' },
  };
}

const TEAM_MEMBERS = [
  { name: 'Fundador', role: 'CEO & Fundador', avatar: '', bio: 'Apasionado por la tecnología y la innovación.' },
  { name: 'CTO', role: 'Director de Tecnología', avatar: '', bio: 'Experto en arquitectura de software y sistemas escalables.' },
  { name: 'Diseñador', role: 'Director de Diseño', avatar: '', bio: 'Creando experiencias de usuario excepcionales.' },
];

const VALUES = [
  { icon: '🚀', title: 'Innovación', description: 'Buscamos constantemente nuevas formas de resolver problemas.' },
  { icon: '🤝', title: 'Colaboración', description: 'Trabajamos juntos para lograr resultados extraordinarios.' },
  { icon: '💡', title: 'Transparencia', description: 'Comunicación abierta y honesta en todo lo que hacemos.' },
  { icon: '🎯', title: 'Excelencia', description: 'Nos esforzamos por entregar la mejor calidad posible.' },
];

export default function AboutPage() {
  const [toastMessage, setToastMessage] = useState('');

  return (
    <div className="min-h-screen bg-background">
      {toastMessage && <Toast message={toastMessage} type="info" onClose={() => setToastMessage('')} />}

      {/* Hero */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Acerca de ${appName}</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Nuestra misión es crear soluciones digitales que transformen la manera en que las personas trabajan y se conectan.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8 mb-16" aria-label="Misión y Visión">
          <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">🎯 Nuestra Misión</h2>
            <p className="text-secondary leading-relaxed">
              Empoderar a emprendedores y empresas con herramientas digitales de alta calidad que les permitan
              lanzar y escalar sus proyectos de manera eficiente, accesible y profesional.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">🔭 Nuestra Visión</h2>
            <p className="text-secondary leading-relaxed">
              Ser la plataforma líder en generación de negocios digitales, democratizando el acceso a
              tecnología de primer nivel para cualquier persona con una idea.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16" aria-label="Nuestros valores">
          <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-8">Nuestros Valores</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value) => (
              <div key={value.title} className="bg-white p-6 rounded-xl shadow border border-gray-200 text-center">
                <div className="text-4xl mb-3" aria-hidden="true">{value.icon}</div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-secondary">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section aria-label="Nuestro equipo">
          <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-8">Nuestro Equipo</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.name} className="bg-white p-6 rounded-xl shadow border border-gray-200 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl text-secondary">
                  {member.avatar || member.name.charAt(0)}
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                <p className="text-sm text-secondary">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
`;
  }

  // ─── 5. Newsletter Page ───────────────────────────────────

  static generateNewsletterPage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { Toast } from '@/components/shared';
import NewsletterForm from '@/components/blog/NewsletterForm';

export function generateMetadata() {
  return {
    title: 'Newsletter — ${appName}',
    description: 'Suscríbete al newsletter de ${appName} y recibe las últimas novedades directamente en tu bandeja.',
    openGraph: {
      title: 'Newsletter — ${appName}',
      description: 'Suscríbete al newsletter de ${appName}.',
      type: 'website',
      url: '/newsletter',
    },
    alternates: { canonical: '/newsletter' },
  };
}

export default function NewsletterPage() {
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  return (
    <div className="min-h-screen bg-background">
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />}

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4" aria-hidden="true">📬</div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Newsletter</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Recibe artículos, guías y novedades de ${appName} directamente en tu bandeja de entrada.
            Sin spam, solo contenido de valor.
          </p>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-2 text-center">
            Suscríbete Gratis
          </h2>
          <p className="text-secondary text-center mb-6">
            Únete a nuestra comunidad y mantente al día con lo último.
          </p>
          <NewsletterForm
            onSuccess={() => {
              setToastMessage('¡Te has suscrito correctamente!');
              setToastType('success');
            }}
            onError={(msg: string) => {
              setToastMessage(msg);
              setToastType('error');
            }}
          />
        </div>

        {/* Benefits */}
        <div className="mt-12 grid sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2" aria-hidden="true">📰</div>
            <h3 className="font-heading font-semibold text-foreground mb-1">Contenido Exclusivo</h3>
            <p className="text-sm text-secondary">Artículos y guías que no publicamos en el blog.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2" aria-hidden="true">🎁</div>
            <h3 className="font-heading font-semibold text-foreground mb-1">Recursos Gratuitos</h3>
            <p className="text-sm text-secondary">Templates, checklists y herramientas útiles.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2" aria-hidden="true">🚀</div>
            <h3 className="font-heading font-semibold text-foreground mb-1">Primero en Enterarte</h3>
            <p className="text-sm text-secondary">Novedades y lanzamientos antes que nadie.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
`;
  }

  // ─── 6. ArticleCard Component ─────────────────────────────

  static generateArticleCard(): string {
    return `'use client';

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  date: string;
  category: string;
  author: string;
  onClick?: () => void;
}

export default function ArticleCard({ title, slug, excerpt, coverImage, date, category, author, onClick }: ArticleCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <article
      className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' && onClick) onClick(); }}
      tabIndex={0}
      role="article"
      aria-label={\`\${title} — \${category}\`}
    >
      {/* Cover Image */}
      <div className="aspect-video bg-gray-100">
        {coverImage ? (
          <img src={coverImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary text-sm">
            Sin imagen
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Category & Date */}
        <div className="flex items-center gap-2 mb-2">
          {category && (
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {category}
            </span>
          )}
          <span className="text-xs text-secondary">{formattedDate}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-secondary line-clamp-3 mb-3">{excerpt}</p>
        )}

        {/* Author */}
        <div className="flex items-center gap-2 text-xs text-secondary">
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
            {author.charAt(0).toUpperCase()}
          </div>
          <span>{author}</span>
        </div>
      </div>
    </article>
  );
}
`;
  }

  // ─── 7. CategoryBadge Component ───────────────────────────

  static generateCategoryBadge(): string {
    return `'use client';

interface CategoryBadgeProps {
  name: string;
  slug: string;
  active?: boolean;
  onClick?: () => void;
}

export default function CategoryBadge({ name, slug, active = false, onClick }: CategoryBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={\`px-4 py-2 rounded-full text-sm font-medium transition-colors \${
        active
          ? 'bg-primary text-white'
          : 'bg-gray-100 text-secondary hover:bg-gray-200'
      }\`}
      aria-pressed={active}
      aria-label={\`Categoría: \${name}\`}
      role="option"
    >
      {name}
    </button>
  );
}
`;
  }

  // ─── 8. TableOfContents Component ─────────────────────────

  static generateTableOfContents(): string {
    return `'use client';

import { useState, useEffect } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="bg-white p-4 rounded-xl shadow border border-gray-200" role="navigation" aria-label="Tabla de contenidos">
      <h2 className="text-sm font-heading font-semibold text-foreground mb-3 uppercase tracking-wide">
        Contenido
      </h2>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: \`\${(item.level - 1) * 12}px\` }}>
            <a
              href={\`#\${item.id}\`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(item.id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={\`block text-sm py-1 transition-colors \${
                activeId === item.id
                  ? 'text-primary font-medium'
                  : 'text-secondary hover:text-foreground'
              }\`}
              aria-current={activeId === item.id ? 'location' : undefined}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
`;
  }

  // ─── 9. NewsletterForm Component ──────────────────────────

  static generateNewsletterForm(): string {
    return `'use client';

import { useState, useEffect } from 'react';

interface NewsletterFormProps {
  compact?: boolean;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

export default function NewsletterForm({ compact = false, onSuccess, onError }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (value: string): boolean => {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('El email es obligatorio');
      return;
    }
    if (!validateEmail(email)) {
      setError('Ingresa un email válido');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al suscribirse');
      }

      setSuccess(true);
      setEmail('');
      onSuccess?.();
    } catch (err: any) {
      const msg = err.message || 'Error al suscribirse';
      setError(msg);
      onError?.(msg);
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg" role="alert">
        <p className="text-green-700 font-medium">¡Suscripción exitosa! 🎉</p>
        <p className="text-green-600 text-sm mt-1">Revisa tu bandeja de entrada para confirmar.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={\`\${compact ? 'flex gap-2' : 'space-y-4'}\`} aria-label="Formulario de suscripción al newsletter">
      <div className={compact ? 'flex-1' : ''}>
        <label htmlFor="newsletter-email" className={compact ? 'sr-only' : 'block text-sm font-medium text-foreground mb-1'}>
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          placeholder="tu@email.com"
          className={\`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary \${
            error ? 'border-red-500' : 'border-gray-300'
          }\`}
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? 'newsletter-error' : undefined}
        />
        {error && !compact && (
          <p id="newsletter-error" className="text-sm text-red-600 mt-1" role="alert">{error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={saving}
        className={\`px-6 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed \${
          compact ? 'whitespace-nowrap' : 'w-full'
        }\`}
        aria-label="Suscribirse al newsletter"
      >
        {saving ? 'Enviando...' : 'Suscribirse'}
      </button>
      {error && compact && (
        <p id="newsletter-error" className="text-sm text-red-600 mt-1 col-span-full" role="alert">{error}</p>
      )}
    </form>
  );
}
`;
  }

  // ─── 10. ShareButtons Component ───────────────────────────

  static generateShareButtons(): string {
    return `'use client';

import { useState, useEffect } from 'react';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const articleUrl = \`\${baseUrl}/blog/\${slug}\`;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(articleUrl);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: '𝕏',
      url: \`https://twitter.com/intent/tweet?text=\${encodedTitle}&url=\${encodedUrl}\`,
      color: 'hover:bg-gray-900 hover:text-white',
    },
    {
      name: 'Facebook',
      icon: 'f',
      url: \`https://www.facebook.com/sharer/sharer.php?u=\${encodedUrl}\`,
      color: 'hover:bg-blue-600 hover:text-white',
    },
    {
      name: 'LinkedIn',
      icon: 'in',
      url: \`https://www.linkedin.com/sharing/share-offsite/?url=\${encodedUrl}\`,
      color: 'hover:bg-blue-700 hover:text-white',
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex items-center gap-3" role="group" aria-label="Compartir artículo">
      <span className="text-sm font-medium text-foreground">Compartir:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={\`w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-secondary text-sm font-bold transition-colors \${link.color}\`}
          aria-label={\`Compartir en \${link.name}\`}
        >
          {link.icon}
        </a>
      ))}
      <button
        onClick={handleCopyLink}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-secondary text-sm transition-colors hover:bg-gray-100"
        aria-label={copied ? 'Enlace copiado' : 'Copiar enlace'}
      >
        {copied ? '✓' : '🔗'}
      </button>
    </div>
  );
}
`;
  }

  // ─── 11. Advanced Prisma Schema ───────────────────────────

  static generateAdvancedPrismaSchema(params: BuildParameters): string {
    return `// Prisma schema generado por ${params.appName}
// Template: LANDING_BLOG (Avanzado)

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  posts         Post[]
}

model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  content     String    @db.Text
  excerpt     String?
  coverImage  String?
  published   Boolean   @default(false)
  authorId    String
  categoryId  String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  author      User      @relation(fields: [authorId], references: [id])
  category    Category? @relation(fields: [categoryId], references: [id])
}

model Category {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique

  posts Post[]
}

model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String?
  message   String   @db.Text
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model NewsletterSubscriber {
  id           String   @id @default(cuid())
  email        String   @unique
  confirmed    Boolean  @default(false)
  subscribedAt DateTime @default(now())
}
`;
  }

  // ─── 12. API Routes ───────────────────────────────────────

  static generateApiRoutes(params: BuildParameters): ApiRouteFile[] {
    const routes: ApiRouteFile[] = [];

    routes.push({ path: 'src/app/api/posts/route.ts', content: LandingBlogAdvancedTemplate._postsListRoute() });
    routes.push({ path: 'src/app/api/posts/[slug]/route.ts', content: LandingBlogAdvancedTemplate._postDetailRoute() });
    routes.push({ path: 'src/app/api/categories/route.ts', content: LandingBlogAdvancedTemplate._categoriesRoute() });
    routes.push({ path: 'src/app/api/contact/route.ts', content: LandingBlogAdvancedTemplate._contactRoute() });
    routes.push({ path: 'src/app/api/newsletter/route.ts', content: LandingBlogAdvancedTemplate._newsletterRoute() });
    routes.push({ path: 'src/app/api/sitemap/route.ts', content: LandingBlogAdvancedTemplate._sitemapRoute() });

    return routes;
  }

  // ─── Private API Route Generators ─────────────────────────

  private static _postsListRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const createPostSchema = z.object({`,
      `  title: z.string({ required_error: 'El título es obligatorio' })`,
      `    .min(3, { message: 'El título debe tener al menos 3 caracteres' })`,
      `    .max(200, { message: 'El título no debe exceder 200 caracteres' }),`,
      `  content: z.string({ required_error: 'El contenido es obligatorio' })`,
      `    .min(10, { message: 'El contenido debe tener al menos 10 caracteres' }),`,
      `  excerpt: z.string().max(500, { message: 'El extracto no debe exceder 500 caracteres' }).optional(),`,
      `  coverImage: z.string().url({ message: 'La imagen de portada debe ser una URL válida' }).optional(),`,
      `  published: z.boolean().optional(),`,
      `  categoryId: z.string().optional(),`,
      `});`,
      ``,
      `function generateSlug(title: string): string {`,
      `  return title`,
      `    .toLowerCase()`,
      `    .normalize('NFD')`,
      `    .replace(/[\\u0300-\\u036f]/g, '')`,
      `    .replace(/[^a-z0-9]+/g, '-')`,
      `    .replace(/(^-|-$)/g, '');`,
      `}`,
      ``,
      `export async function GET(request: NextRequest) {`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json(`,
      `        { error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' },`,
      `        { status: 401 }`,
      `      );`,
      `    }`,
      ``,
      `    const { searchParams } = new URL(request.url);`,
      `    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));`,
      `    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '9', 10)));`,
      `    const skip = (page - 1) * limit;`,
      `    const search = searchParams.get('search') || undefined;`,
      `    const categorySlug = searchParams.get('categorySlug') || undefined;`,
      ``,
      `    const where: any = { published: true };`,
      `    if (search) {`,
      `      where.OR = [`,
      `        { title: { contains: search, mode: 'insensitive' } },`,
      `        { content: { contains: search, mode: 'insensitive' } },`,
      `        { excerpt: { contains: search, mode: 'insensitive' } },`,
      `      ];`,
      `    }`,
      `    if (categorySlug) {`,
      `      where.category = { slug: categorySlug };`,
      `    }`,
      ``,
      `    const total = await prisma.post.count({ where });`,
      `    const posts = await prisma.post.findMany({`,
      `      where,`,
      `      skip,`,
      `      take: limit,`,
      `      orderBy: { createdAt: 'desc' },`,
      `      include: {`,
      `        category: true,`,
      `        author: { select: { name: true } },`,
      `      },`,
      `    });`,
      ``,
      `    const totalPages = Math.ceil(total / limit);`,
      ``,
      `    return NextResponse.json({`,
      `      posts,`,
      `      paginacion: {`,
      `        total,`,
      `        totalPages,`,
      `        currentPage: page,`,
      `        hasNext: page < totalPages,`,
      `        hasPrev: page > 1,`,
      `      },`,
      `    });`,
      `  } catch (error) {`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json(`,
      `      { error: 'Error interno del servidor. Intente nuevamente más tarde.' },`,
      `      { status: 500 }`,
      `    );`,
      `  }`,
      `}`,
      ``,
      `export async function POST(request: NextRequest) {`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json(`,
      `        { error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' },`,
      `        { status: 401 }`,
      `      );`,
      `    }`,
      ``,
      `    const userId = (session.user as any).id;`,
      `    const body = await request.json();`,
      `    const datos = createPostSchema.parse(body);`,
      ``,
      `    const slug = generateSlug(datos.title) + '-' + Date.now().toString(36);`,
      ``,
      `    const post = await prisma.post.create({`,
      `      data: {`,
      `        ...datos,`,
      `        slug,`,
      `        authorId: userId,`,
      `      },`,
      `      include: {`,
      `        category: true,`,
      `        author: { select: { name: true } },`,
      `      },`,
      `    });`,
      ``,
      `    return NextResponse.json({ post }, { status: 201 });`,
      `  } catch (error) {`,
      `    if (error instanceof z.ZodError) {`,
      `      const erroresDetallados = error.errors.map((e) => ({`,
      `        campo: e.path.join('.'),`,
      `        mensaje: e.message,`,
      `      }));`,
      `      return NextResponse.json(`,
      `        { error: 'Error de validación', errores: erroresDetallados },`,
      `        { status: 400 }`,
      `      );`,
      `    }`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json(`,
      `      { error: 'Error interno del servidor. Intente nuevamente más tarde.' },`,
      `      { status: 500 }`,
      `    );`,
      `  }`,
      `}`,
    ].join('\n');
  }

  private static _postDetailRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const updatePostSchema = z.object({`,
      `  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres' }).max(200).optional(),`,
      `  content: z.string().min(10, { message: 'El contenido debe tener al menos 10 caracteres' }).optional(),`,
      `  excerpt: z.string().max(500).optional(),`,
      `  coverImage: z.string().url({ message: 'La imagen de portada debe ser una URL válida' }).optional().nullable(),`,
      `  published: z.boolean().optional(),`,
      `  categoryId: z.string().optional().nullable(),`,
      `});`,
      ``,
      `export async function GET(`,
      `  request: NextRequest,`,
      `  { params }: { params: { slug: string } }`,
      `) {`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json(`,
      `        { error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' },`,
      `        { status: 401 }`,
      `      );`,
      `    }`,
      ``,
      `    const post = await prisma.post.findUnique({`,
      `      where: { slug: params.slug },`,
      `      include: {`,
      `        category: true,`,
      `        author: { select: { name: true } },`,
      `      },`,
      `    });`,
      ``,
      `    if (!post) {`,
      `      return NextResponse.json(`,
      `        { error: 'Artículo no encontrado.' },`,
      `        { status: 404 }`,
      `      );`,
      `    }`,
      ``,
      `    return NextResponse.json({ post });`,
      `  } catch (error) {`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json(`,
      `      { error: 'Error interno del servidor. Intente nuevamente más tarde.' },`,
      `      { status: 500 }`,
      `    );`,
      `  }`,
      `}`,
      ``,
      `export async function PUT(`,
      `  request: NextRequest,`,
      `  { params }: { params: { slug: string } }`,
      `) {`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json(`,
      `        { error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' },`,
      `        { status: 401 }`,
      `      );`,
      `    }`,
      ``,
      `    const userId = (session.user as any).id;`,
      ``,
      `    const existing = await prisma.post.findUnique({`,
      `      where: { slug: params.slug },`,
      `    });`,
      ``,
      `    if (!existing) {`,
      `      return NextResponse.json(`,
      `        { error: 'Artículo no encontrado.' },`,
      `        { status: 404 }`,
      `      );`,
      `    }`,
      ``,
      `    if (existing.authorId !== userId) {`,
      `      return NextResponse.json(`,
      `        { error: 'No tiene permisos para modificar este artículo.' },`,
      `        { status: 403 }`,
      `      );`,
      `    }`,
      ``,
      `    const body = await request.json();`,
      `    const datos = updatePostSchema.parse(body);`,
      ``,
      `    const post = await prisma.post.update({`,
      `      where: { slug: params.slug },`,
      `      data: datos,`,
      `      include: {`,
      `        category: true,`,
      `        author: { select: { name: true } },`,
      `      },`,
      `    });`,
      ``,
      `    return NextResponse.json({ post });`,
      `  } catch (error) {`,
      `    if (error instanceof z.ZodError) {`,
      `      const erroresDetallados = error.errors.map((e) => ({`,
      `        campo: e.path.join('.'),`,
      `        mensaje: e.message,`,
      `      }));`,
      `      return NextResponse.json(`,
      `        { error: 'Error de validación', errores: erroresDetallados },`,
      `        { status: 400 }`,
      `      );`,
      `    }`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json(`,
      `      { error: 'Error interno del servidor. Intente nuevamente más tarde.' },`,
      `      { status: 500 }`,
      `    );`,
      `  }`,
      `}`,
      ``,
      `export async function DELETE(`,
      `  request: NextRequest,`,
      `  { params }: { params: { slug: string } }`,
      `) {`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json(`,
      `        { error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' },`,
      `        { status: 401 }`,
      `      );`,
      `    }`,
      ``,
      `    const userId = (session.user as any).id;`,
      ``,
      `    const existing = await prisma.post.findUnique({`,
      `      where: { slug: params.slug },`,
      `    });`,
      ``,
      `    if (!existing) {`,
      `      return NextResponse.json(`,
      `        { error: 'Artículo no encontrado.' },`,
      `        { status: 404 }`,
      `      );`,
      `    }`,
      ``,
      `    if (existing.authorId !== userId) {`,
      `      return NextResponse.json(`,
      `        { error: 'No tiene permisos para eliminar este artículo.' },`,
      `        { status: 403 }`,
      `      );`,
      `    }`,
      ``,
      `    await prisma.post.delete({ where: { slug: params.slug } });`,
      ``,
      `    return NextResponse.json({ message: 'Artículo eliminado correctamente.' });`,
      `  } catch (error) {`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json(`,
      `      { error: 'Error interno del servidor. Intente nuevamente más tarde.' },`,
      `      { status: 500 }`,
      `    );`,
      `  }`,
      `}`,
    ].join('\n');
  }

  private static _categoriesRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const createCategorySchema = z.object({`,
      `  name: z.string({ required_error: 'El nombre es obligatorio' })`,
      `    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })`,
      `    .max(100, { message: 'El nombre no debe exceder 100 caracteres' }),`,
      `});`,
      ``,
      `function generateSlug(name: string): string {`,
      `  return name`,
      `    .toLowerCase()`,
      `    .normalize('NFD')`,
      `    .replace(/[\\u0300-\\u036f]/g, '')`,
      `    .replace(/[^a-z0-9]+/g, '-')`,
      `    .replace(/(^-|-$)/g, '');`,
      `}`,
      ``,
      `export async function GET(request: NextRequest) {`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json(`,
      `        { error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' },`,
      `        { status: 401 }`,
      `      );`,
      `    }`,
      ``,
      `    const categories = await prisma.category.findMany({`,
      `      orderBy: { name: 'asc' },`,
      `      include: { _count: { select: { posts: true } } },`,
      `    });`,
      ``,
      `    return NextResponse.json({ categories });`,
      `  } catch (error) {`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json(`,
      `      { error: 'Error interno del servidor. Intente nuevamente más tarde.' },`,
      `      { status: 500 }`,
      `    );`,
      `  }`,
      `}`,
      ``,
      `export async function POST(request: NextRequest) {`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json(`,
      `        { error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' },`,
      `        { status: 401 }`,
      `      );`,
      `    }`,
      ``,
      `    const body = await request.json();`,
      `    const datos = createCategorySchema.parse(body);`,
      `    const slug = generateSlug(datos.name);`,
      ``,
      `    const category = await prisma.category.create({`,
      `      data: { name: datos.name, slug },`,
      `    });`,
      ``,
      `    return NextResponse.json({ category }, { status: 201 });`,
      `  } catch (error) {`,
      `    if (error instanceof z.ZodError) {`,
      `      const erroresDetallados = error.errors.map((e) => ({`,
      `        campo: e.path.join('.'),`,
      `        mensaje: e.message,`,
      `      }));`,
      `      return NextResponse.json(`,
      `        { error: 'Error de validación', errores: erroresDetallados },`,
      `        { status: 400 }`,
      `      );`,
      `    }`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json(`,
      `      { error: 'Error interno del servidor. Intente nuevamente más tarde.' },`,
      `      { status: 500 }`,
      `    );`,
      `  }`,
      `}`,
    ].join('\n');
  }

  private static _contactRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const contactSchema = z.object({`,
      `  name: z.string({ required_error: 'El nombre es obligatorio' })`,
      `    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })`,
      `    .max(100, { message: 'El nombre no debe exceder 100 caracteres' }),`,
      `  email: z.string({ required_error: 'El email es obligatorio' })`,
      `    .email({ message: 'Debe ser un email válido' }),`,
      `  subject: z.string().max(200, { message: 'El asunto no debe exceder 200 caracteres' }).optional(),`,
      `  message: z.string({ required_error: 'El mensaje es obligatorio' })`,
      `    .min(10, { message: 'El mensaje debe tener al menos 10 caracteres' })`,
      `    .max(5000, { message: 'El mensaje no debe exceder 5000 caracteres' }),`,
      `});`,
      ``,
      `export async function POST(request: NextRequest) {`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json(`,
      `        { error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' },`,
      `        { status: 401 }`,
      `      );`,
      `    }`,
      ``,
      `    const body = await request.json();`,
      `    const datos = contactSchema.parse(body);`,
      ``,
      `    const submission = await prisma.contactSubmission.create({`,
      `      data: datos,`,
      `    });`,
      ``,
      `    return NextResponse.json(`,
      `      { message: 'Mensaje enviado correctamente.', submission },`,
      `      { status: 201 }`,
      `    );`,
      `  } catch (error) {`,
      `    if (error instanceof z.ZodError) {`,
      `      const erroresDetallados = error.errors.map((e) => ({`,
      `        campo: e.path.join('.'),`,
      `        mensaje: e.message,`,
      `      }));`,
      `      return NextResponse.json(`,
      `        { error: 'Error de validación', errores: erroresDetallados },`,
      `        { status: 400 }`,
      `      );`,
      `    }`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json(`,
      `      { error: 'Error interno del servidor. Intente nuevamente más tarde.' },`,
      `      { status: 500 }`,
      `    );`,
      `  }`,
      `}`,
    ].join('\n');
  }

  private static _newsletterRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const newsletterSchema = z.object({`,
      `  email: z.string({ required_error: 'El email es obligatorio' })`,
      `    .email({ message: 'Debe ser un email válido' }),`,
      `});`,
      ``,
      `export async function POST(request: NextRequest) {`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json(`,
      `        { error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' },`,
      `        { status: 401 }`,
      `      );`,
      `    }`,
      ``,
      `    const body = await request.json();`,
      `    const datos = newsletterSchema.parse(body);`,
      ``,
      `    // Check if already subscribed`,
      `    const existing = await prisma.newsletterSubscriber.findUnique({`,
      `      where: { email: datos.email },`,
      `    });`,
      ``,
      `    if (existing) {`,
      `      return NextResponse.json(`,
      `        { message: 'Este email ya está suscrito al newsletter.' },`,
      `        { status: 200 }`,
      `      );`,
      `    }`,
      ``,
      `    const subscriber = await prisma.newsletterSubscriber.create({`,
      `      data: { email: datos.email },`,
      `    });`,
      ``,
      `    return NextResponse.json(`,
      `      { message: 'Suscripción exitosa.', subscriber },`,
      `      { status: 201 }`,
      `    );`,
      `  } catch (error) {`,
      `    if (error instanceof z.ZodError) {`,
      `      const erroresDetallados = error.errors.map((e) => ({`,
      `        campo: e.path.join('.'),`,
      `        mensaje: e.message,`,
      `      }));`,
      `      return NextResponse.json(`,
      `        { error: 'Error de validación', errores: erroresDetallados },`,
      `        { status: 400 }`,
      `      );`,
      `    }`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json(`,
      `      { error: 'Error interno del servidor. Intente nuevamente más tarde.' },`,
      `      { status: 500 }`,
      `    );`,
      `  }`,
      `}`,
    ].join('\n');
  }

  private static _sitemapRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      ``,
      `export async function GET(request: NextRequest) {`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json(`,
      `        { error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' },`,
      `        { status: 401 }`,
      `      );`,
      `    }`,
      ``,
      `    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';`,
      ``,
      `    const posts = await prisma.post.findMany({`,
      `      where: { published: true },`,
      `      select: { slug: true, updatedAt: true },`,
      `      orderBy: { updatedAt: 'desc' },`,
      `    });`,
      ``,
      `    const categories = await prisma.category.findMany({`,
      `      select: { slug: true },`,
      `    });`,
      ``,
      `    const staticPages = [`,
      `      { url: '/', priority: '1.0', changefreq: 'weekly' },`,
      `      { url: '/blog', priority: '0.9', changefreq: 'daily' },`,
      `      { url: '/about', priority: '0.7', changefreq: 'monthly' },`,
      `      { url: '/contacto', priority: '0.7', changefreq: 'monthly' },`,
      `      { url: '/newsletter', priority: '0.6', changefreq: 'monthly' },`,
      `    ];`,
      ``,
      `    let xml = '<?xml version="1.0" encoding="UTF-8"?>\\n';`,
      `    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n';`,
      ``,
      `    // Static pages`,
      `    for (const page of staticPages) {`,
      `      xml += '  <url>\\n';`,
      `      xml += \`    <loc>\${baseUrl}\${page.url}</loc>\\n\`;`,
      `      xml += \`    <changefreq>\${page.changefreq}</changefreq>\\n\`;`,
      `      xml += \`    <priority>\${page.priority}</priority>\\n\`;`,
      `      xml += '  </url>\\n';`,
      `    }`,
      ``,
      `    // Blog posts`,
      `    for (const post of posts) {`,
      `      xml += '  <url>\\n';`,
      `      xml += \`    <loc>\${baseUrl}/blog/\${post.slug}</loc>\\n\`;`,
      `      xml += \`    <lastmod>\${post.updatedAt.toISOString()}</lastmod>\\n\`;`,
      `      xml += '    <changefreq>weekly</changefreq>\\n';`,
      `      xml += '    <priority>0.8</priority>\\n';`,
      `      xml += '  </url>\\n';`,
      `    }`,
      ``,
      `    // Category pages`,
      `    for (const cat of categories) {`,
      `      xml += '  <url>\\n';`,
      `      xml += \`    <loc>\${baseUrl}/blog?category=\${cat.slug}</loc>\\n\`;`,
      `      xml += '    <changefreq>weekly</changefreq>\\n';`,
      `      xml += '    <priority>0.6</priority>\\n';`,
      `      xml += '  </url>\\n';`,
      `    }`,
      ``,
      `    xml += '</urlset>';`,
      ``,
      `    return new NextResponse(xml, {`,
      `      status: 200,`,
      `      headers: {`,
      `        'Content-Type': 'application/xml',`,
      `        'Cache-Control': 'public, max-age=3600, s-maxage=3600',`,
      `      },`,
      `    });`,
      `  } catch (error) {`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json(`,
      `      { error: 'Error interno del servidor. Intente nuevamente más tarde.' },`,
      `      { status: 500 }`,
      `    );`,
      `  }`,
      `}`,
    ].join('\n');
  }
}

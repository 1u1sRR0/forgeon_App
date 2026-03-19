// MarketplaceAdvancedTemplate — Generates advanced Marketplace pages, components,
// Prisma schema, and API routes for the MARKETPLACE_MINI template type.
// All pages use 'use client', useState, useEffect, Tailwind design system classes,
// and import shared components from '@/components/shared'.

import { BuildParameters } from '../types';

interface ApiRouteFile {
  path: string;
  content: string;
}

export class MarketplaceAdvancedTemplate {
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
    return MarketplaceAdvancedTemplate.capitalize(str) + 's';
  }

  // ─── 1. Seller Dashboard ──────────────────────────────────

  static generateSellerDashboard(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { Toast } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';

interface SellerMetrics {
  totalListings: number;
  activeListings: number;
  soldListings: number;
  totalRevenue: number;
}

interface RecentActivity {
  id: string;
  type: 'sale' | 'message' | 'review' | 'listing';
  description: string;
  createdAt: string;
}

export default function SellerDashboardPage() {
  const [metrics, setMetrics] = useState<SellerMetrics>({
    totalListings: 0,
    activeListings: 0,
    soldListings: 0,
    totalRevenue: 0,
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetch('/api/seller/dashboard');
        const data = await res.json();
        if (res.ok) {
          setMetrics(data.metrics || metrics);
          setActivities(data.activities || []);
        } else {
          setError('Error al cargar el dashboard');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner aria-label="Cargando dashboard del vendedor" />;
  }

  const activityIcons: Record<string, string> = {
    sale: '💰',
    message: '💬',
    review: '⭐',
    listing: '📦',
  };

  return (
    <div className="p-6 bg-background text-foreground" role="region" aria-label="Dashboard del Vendedor">
      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      <h1 className="text-2xl font-heading font-bold text-primary mb-6">Dashboard del Vendedor</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" role="list" aria-label="Métricas del vendedor">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="listitem">
          <p className="text-sm text-secondary">Total Listados</p>
          <p className="text-3xl font-bold text-foreground mt-1">{metrics.totalListings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="listitem">
          <p className="text-sm text-secondary">Activos</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{metrics.activeListings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="listitem">
          <p className="text-sm text-secondary">Vendidos</p>
          <p className="text-3xl font-bold text-primary mt-1">{metrics.soldListings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="listitem">
          <p className="text-sm text-secondary">Ingresos Totales</p>
          <p className="text-3xl font-bold text-foreground mt-1">\${metrics.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="img" aria-label="Gráfico de ventas mensuales">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Ventas Mensuales</h2>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-sm text-secondary">Gráfico de ventas</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="img" aria-label="Gráfico de visitas a listados">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Visitas a Listados</h2>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-sm text-secondary">Gráfico de visitas</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Actividad Reciente</h2>
        {activities.length === 0 ? (
          <p className="text-sm text-secondary">No hay actividad reciente.</p>
        ) : (
          <div className="space-y-3" role="list" aria-label="Actividad reciente">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors" role="listitem">
                <span className="text-lg" aria-hidden="true">{activityIcons[activity.type] || '📋'}</span>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.description}</p>
                  <p className="text-xs text-secondary">{new Date(activity.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
`;
  }

  // ─── 2. Listing Management ─────────────────────────────────

  static generateListingManagement(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';
import { EmptyState } from '@/components/shared';
import { Toast } from '@/components/shared';

interface Listing {
  id: string;
  title: string;
  price: number;
  status: 'active' | 'paused' | 'sold';
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

const columns: Column[] = [
  { key: 'title', label: 'Título', sortable: true },
  { key: 'price', label: 'Precio', sortable: true },
  { key: 'status', label: 'Estado', sortable: true },
  { key: 'createdAt', label: 'Creado', sortable: true },
];

export default function ListingManagementPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const pageSize = 10;

  useEffect(() => {
    fetchListings();
  }, [currentPage, sortField, sortDirection, filterStatus]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(pageSize),
        sortBy: sortField,
        sortDir: sortDirection,
      });
      if (searchQuery) params.set('search', searchQuery);
      if (filterStatus) params.set('status', filterStatus);

      const res = await fetch(\`/api/listings?\${params.toString()}\`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al cargar listados');
        return;
      }

      setListings(data.datos || data.listings || []);
      setTotalPages(data.paginacion?.totalPages || 1);
    } catch (err) {
      setError('Error de conexión al cargar listados');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (ev: React.FormEvent) => {
    ev.preventDefault();
    setCurrentPage(1);
    fetchListings();
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === listings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(listings.map((l) => l.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: 'pause' | 'activate' | 'delete') => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch('/api/listings/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, action }),
      });
      if (res.ok) {
        setToastMessage(\`Acción '\${action}' aplicada a \${selectedIds.length} listados\`);
        setToastType('success');
        setSelectedIds([]);
        fetchListings();
      } else {
        setToastMessage('Error al ejecutar acción masiva');
        setToastType('error');
      }
    } catch (err) {
      setToastMessage('Error de conexión');
      setToastType('error');
    }
  };

  if (loading && listings.length === 0) {
    return <LoadingSpinner aria-label="Cargando listados" />;
  }

  return (
    <div className="p-6 bg-background text-foreground" role="region" aria-label="Gestión de Listados">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-primary">Mis Listados</h1>
        <button
          onClick={() => router.push('/dashboard/listings/new')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
          aria-label="Crear nuevo listado"
        >
          Crear Listado
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2" role="search" aria-label="Buscar listados">
        <input
          type="text"
          value={searchQuery}
          onChange={(ev) => setSearchQuery(ev.target.value)}
          placeholder="Buscar listados..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Término de búsqueda"
        />
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90" aria-label="Ejecutar búsqueda">
          Buscar
        </button>
      </form>

      {/* Status Filters */}
      <div className="mb-4 flex gap-2 flex-wrap items-center" role="group" aria-label="Filtros de estado">
        {[
          { value: '', label: 'Todos' },
          { value: 'active', label: 'Activos' },
          { value: 'paused', label: 'Pausados' },
          { value: 'sold', label: 'Vendidos' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => { setFilterStatus(f.value); setCurrentPage(1); }}
            className={\`px-3 py-1 text-sm rounded-full transition-colors \${
              filterStatus === f.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-secondary hover:bg-gray-200'
            }\`}
            aria-pressed={filterStatus === f.value}
            aria-label={\`Filtrar: \${f.label}\`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="mb-4 flex gap-2 items-center p-3 bg-primary/5 rounded-lg" role="toolbar" aria-label="Acciones masivas">
          <span className="text-sm text-foreground">{selectedIds.length} seleccionados</span>
          <button
            onClick={() => handleBulkAction('activate')}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
            aria-label="Activar seleccionados"
          >
            Activar
          </button>
          <button
            onClick={() => handleBulkAction('pause')}
            className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            aria-label="Pausar seleccionados"
          >
            Pausar
          </button>
          <button
            onClick={() => handleBulkAction('delete')}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            aria-label="Eliminar seleccionados"
          >
            Eliminar
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
      )}

      {listings.length === 0 && !loading ? (
        <EmptyState
          title="Sin listados"
          description="No tienes listados aún. Crea el primero."
          actionLabel="Crear Listado"
          onAction={() => router.push('/dashboard/listings/new')}
          aria-label="No hay listados"
        />
      ) : (
        <DataTable
          columns={columns}
          data={listings}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={(row: Record<string, any>) => router.push(\`/dashboard/listings/\${row.id}\`)}
          loading={loading}
          aria-label="Tabla de listados"
        />
      )}

      {/* Pagination */}
      <nav className="mt-6 flex justify-center items-center gap-2" role="navigation" aria-label="Paginación">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
          aria-label="Página anterior"
        >
          Anterior
        </button>
        <span className="text-sm text-secondary" aria-live="polite" aria-atomic="true">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
          aria-label="Página siguiente"
        >
          Siguiente
        </button>
      </nav>
    </div>
  );
}
`;
  }

  // ─── 3. Listing Detail ─────────────────────────────────────

  static generateListingDetail(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: string;
  categoryId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    name: string;
  };
}

export default function ListingDetailPage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const loadListing = async () => {
      try {
        const resolvedParams = await props.params;
        const res = await fetch(\`/api/listings/\${resolvedParams.id}\`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Listado no encontrado');
          setLoading(false);
          return;
        }
        setListing(data.listing);
        setIsFavorite(data.isFavorite || false);

        const reviewsRes = await fetch(\`/api/reviews?listingId=\${resolvedParams.id}\`);
        const reviewsData = await reviewsRes.json();
        if (reviewsRes.ok) {
          setReviews(reviewsData.reviews || []);
        }
      } catch (err) {
        setError('Error al cargar el listado');
      } finally {
        setLoading(false);
      }
    };
    loadListing();
  }, [props.params]);

  const handleToggleFavorite = async () => {
    try {
      const resolvedParams = await props.params;
      const res = await fetch('/api/favorites', {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: resolvedParams.id }),
      });
      if (res.ok) {
        setIsFavorite(!isFavorite);
        setToastMessage(isFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos');
        setToastType('success');
      }
    } catch (err) {
      setToastMessage('Error al actualizar favoritos');
      setToastType('error');
    }
  };

  const handleContactSeller = async () => {
    if (!listing) return;
    try {
      const resolvedParams = await props.params;
      router.push(\`/dashboard/messages?listingId=\${resolvedParams.id}&sellerId=\${listing.user.id}\`);
    } catch (err) {
      setToastMessage('Error al iniciar conversación');
      setToastType('error');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={\`text-lg \${i < rating ? 'text-yellow-400' : 'text-gray-300'}\`} aria-hidden="true">★</span>
    ));
  };

  if (loading) {
    return <LoadingSpinner aria-label="Cargando detalle del listado" />;
  }

  if (error || !listing) {
    return (
      <div className="p-6 bg-background text-foreground" role="alert">
        <p className="text-red-600">{error || 'Listado no encontrado'}</p>
        <button
          onClick={() => router.push('/dashboard/search')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
          aria-label="Volver a búsqueda"
        >
          Volver a búsqueda
        </button>
      </div>
    );
  }

  const images = listing.images.length > 0 ? listing.images : ['/placeholder.jpg'];

  return (
    <div className="p-6 max-w-5xl mx-auto bg-background text-foreground" role="region" aria-label="Detalle del Listado">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4" role="img" aria-label={\`Imagen del listado: \${listing.title}\`}>
            <img
              src={images[selectedImage]}
              alt={\`\${listing.title} - imagen \${selectedImage + 1}\`}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Galería de imágenes">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={\`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors \${
                    selectedImage === idx ? 'border-primary' : 'border-gray-200'
                  }\`}
                  role="tab"
                  aria-selected={selectedImage === idx}
                  aria-label={\`Ver imagen \${idx + 1}\`}
                >
                  <img src={img} alt={\`Miniatura \${idx + 1}\`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Listing Info */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-heading font-bold text-foreground">{listing.title}</h1>
            <button
              onClick={handleToggleFavorite}
              className={\`p-2 rounded-full transition-colors \${
                isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 bg-gray-100 hover:text-red-500'
              }\`}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              aria-pressed={isFavorite}
            >
              <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <p className="text-3xl font-bold text-primary mb-4">\${listing.price.toLocaleString()}</p>

          <p className="text-foreground mb-6">{listing.description}</p>

          {/* Seller Info */}
          <div className="p-4 bg-gray-50 rounded-lg mb-6" role="region" aria-label="Información del vendedor">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{listing.user.name?.charAt(0).toUpperCase() || '?'}</span>
              </div>
              <div>
                <p className="font-medium text-foreground">{listing.user.name}</p>
                <p className="text-sm text-secondary">Vendedor</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleContactSeller}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-md hover:opacity-90 transition-opacity font-medium"
              aria-label="Contactar al vendedor"
            >
              Contactar Vendedor
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10" role="region" aria-label="Reseñas">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Reseñas ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-secondary">Aún no hay reseñas para este listado.</p>
        ) : (
          <div className="space-y-4" role="list" aria-label="Lista de reseñas">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 bg-white rounded-lg border border-gray-200" role="listitem">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex" aria-label={\`Calificación: \${review.rating} de 5 estrellas\`}>
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-secondary">por {review.reviewer.name}</span>
                </div>
                <p className="text-foreground">{review.comment}</p>
                <p className="text-xs text-secondary mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
`;
  }

  // ─── 4. Search Page ────────────────────────────────────────

  static generateSearchPage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';
import { EmptyState } from '@/components/shared';

interface SearchListing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: string;
  user: {
    name: string;
  };
  rating: number;
}

interface Category {
  id: string;
  name: string;
}

export default function SearchPage() {
  const router = useRouter();
  const [listings, setListings] = useState<SearchListing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [location, setLocation] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchListings();
  }, [currentPage, sortBy, sortDir]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      // Silently fail
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(pageSize),
        sortBy,
        sortDir,
      });
      if (searchQuery) params.set('search', searchQuery);
      if (selectedCategory) params.set('categoryId', selectedCategory);
      if (priceMin) params.set('priceMin', priceMin);
      if (priceMax) params.set('priceMax', priceMax);
      if (location) params.set('location', location);
      if (minRating) params.set('minRating', minRating);

      const res = await fetch(\`/api/search?\${params.toString()}\`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error en la búsqueda');
        return;
      }

      setListings(data.listings || []);
      setTotalPages(data.paginacion?.totalPages || 1);
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (ev: React.FormEvent) => {
    ev.preventDefault();
    setCurrentPage(1);
    fetchListings();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceMin('');
    setPriceMax('');
    setLocation('');
    setMinRating('');
    setCurrentPage(1);
    fetchListings();
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 bg-background text-foreground" role="region" aria-label="Búsqueda Avanzada">
      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      <h1 className="text-2xl font-heading font-bold text-primary mb-6">Buscar Listados</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0" role="complementary" aria-label="Filtros de búsqueda">
          <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow border border-gray-200 space-y-4">
            <h2 className="text-lg font-heading font-semibold text-foreground">Filtros</h2>

            {/* Search */}
            <div>
              <label htmlFor="search-query" className="block text-sm font-medium text-secondary mb-1">Buscar</label>
              <input
                id="search-query"
                type="text"
                value={searchQuery}
                onChange={(ev) => setSearchQuery(ev.target.value)}
                placeholder="Palabra clave..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Palabra clave de búsqueda"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="search-category" className="block text-sm font-medium text-secondary mb-1">Categoría</label>
              <select
                id="search-category"
                value={selectedCategory}
                onChange={(ev) => setSelectedCategory(ev.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Filtrar por categoría"
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Rango de Precio</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={priceMin}
                  onChange={(ev) => setPriceMin(ev.target.value)}
                  placeholder="Mín"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Precio mínimo"
                  min="0"
                />
                <input
                  type="number"
                  value={priceMax}
                  onChange={(ev) => setPriceMax(ev.target.value)}
                  placeholder="Máx"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Precio máximo"
                  min="0"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="search-location" className="block text-sm font-medium text-secondary mb-1">Ubicación</label>
              <input
                id="search-location"
                type="text"
                value={location}
                onChange={(ev) => setLocation(ev.target.value)}
                placeholder="Ciudad o región..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Filtrar por ubicación"
              />
            </div>

            {/* Rating */}
            <div>
              <label htmlFor="search-rating" className="block text-sm font-medium text-secondary mb-1">Calificación mínima</label>
              <select
                id="search-rating"
                value={minRating}
                onChange={(ev) => setMinRating(ev.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Filtrar por calificación mínima"
              >
                <option value="">Cualquiera</option>
                <option value="4">4+ estrellas</option>
                <option value="3">3+ estrellas</option>
                <option value="2">2+ estrellas</option>
                <option value="1">1+ estrella</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
                aria-label="Aplicar filtros"
              >
                Buscar
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Limpiar filtros"
              >
                Limpiar
              </button>
            </div>
          </form>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {/* Sort & View Toggle */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-sm text-secondary">Ordenar por:</label>
              <select
                id="sort-select"
                value={\`\${sortBy}-\${sortDir}\`}
                onChange={(ev) => {
                  const [field, dir] = ev.target.value.split('-');
                  setSortBy(field);
                  setSortDir(dir as 'asc' | 'desc');
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Ordenar resultados"
              >
                <option value="createdAt-desc">Más recientes</option>
                <option value="createdAt-asc">Más antiguos</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
              </select>
            </div>

            <div className="flex gap-1" role="group" aria-label="Modo de vista">
              <button
                onClick={() => setViewMode('grid')}
                className={\`p-2 rounded-md transition-colors \${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-secondary'}\`}
                aria-label="Vista de cuadrícula"
                aria-pressed={viewMode === 'grid'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={\`p-2 rounded-md transition-colors \${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-secondary'}\`}
                aria-label="Vista de lista"
                aria-pressed={viewMode === 'list'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
          )}

          {loading ? (
            <LoadingSpinner aria-label="Buscando listados" />
          ) : listings.length === 0 ? (
            <EmptyState
              title="Sin resultados"
              description="No se encontraron listados con los filtros seleccionados."
              aria-label="Sin resultados de búsqueda"
            />
          ) : (
            <div className={\`\${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-4'}\`} role="list" aria-label="Resultados de búsqueda">
              {listings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(\`/dashboard/listings/\${item.id}\`)}
                  className={\`bg-white rounded-xl shadow border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow \${
                    viewMode === 'list' ? 'flex' : ''
                  }\`}
                  role="listitem"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') router.push(\`/dashboard/listings/\${item.id}\`); }}
                  aria-label={\`\${item.title} - \$\${item.price.toLocaleString()}\`}
                >
                  <div className={\`bg-gray-100 \${viewMode === 'list' ? 'w-40 h-32 flex-shrink-0' : 'aspect-video'}\`}>
                    <img
                      src={item.images?.[0] || '/placeholder.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-foreground mb-1 line-clamp-1">{item.title}</h3>
                    <p className="text-lg font-bold text-primary mb-1">\${item.price.toLocaleString()}</p>
                    <p className="text-sm text-secondary mb-2">{item.user.name}</p>
                    <div className="flex items-center gap-1" aria-label={\`Calificación: \${item.rating} de 5\`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={\`text-sm \${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}\`} aria-hidden="true">★</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && listings.length > 0 && (
            <nav className="mt-6 flex justify-center items-center gap-2" role="navigation" aria-label="Paginación de resultados">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
                aria-label="Página anterior"
              >
                Anterior
              </button>
              <span className="text-sm text-secondary" aria-live="polite" aria-atomic="true">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
                aria-label="Página siguiente"
              >
                Siguiente
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
`;
  }

  // ─── 5. Seller Profile ─────────────────────────────────────

  static generateSellerProfile(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';
import { EmptyState } from '@/components/shared';

interface SellerInfo {
  id: string;
  name: string;
  bio: string;
  memberSince: string;
  totalSales: number;
  averageRating: number;
  totalReviews: number;
}

interface SellerListing {
  id: string;
  title: string;
  price: number;
  images: string[];
  status: string;
}

interface SellerReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    name: string;
  };
}

export default function SellerProfilePage(props: { params: Promise<{ sellerId: string }> }) {
  const router = useRouter();
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const [listings, setListings] = useState<SellerListing[]>([]);
  const [reviews, setReviews] = useState<SellerReview[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const loadSeller = async () => {
      try {
        const resolvedParams = await props.params;
        const res = await fetch(\`/api/sellers/\${resolvedParams.sellerId}\`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Vendedor no encontrado');
          setLoading(false);
          return;
        }
        setSeller(data.seller);
        setListings(data.listings || []);
        setReviews(data.reviews || []);
      } catch (err) {
        setError('Error al cargar perfil del vendedor');
      } finally {
        setLoading(false);
      }
    };
    loadSeller();
  }, [props.params]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={\`text-lg \${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}\`} aria-hidden="true">★</span>
    ));
  };

  if (loading) {
    return <LoadingSpinner aria-label="Cargando perfil del vendedor" />;
  }

  if (error || !seller) {
    return (
      <div className="p-6 bg-background text-foreground" role="alert">
        <p className="text-red-600">{error || 'Vendedor no encontrado'}</p>
        <button
          onClick={() => router.push('/dashboard/search')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
          aria-label="Volver a búsqueda"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-background text-foreground" role="region" aria-label="Perfil del Vendedor">
      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      {/* Seller Header */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{seller.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-heading font-bold text-foreground">{seller.name}</h1>
            <p className="text-sm text-secondary">Miembro desde {new Date(seller.memberSince).toLocaleDateString()}</p>
          </div>
        </div>

        {seller.bio && (
          <p className="mt-4 text-foreground">{seller.bio}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6" role="list" aria-label="Estadísticas del vendedor">
          <div className="text-center" role="listitem">
            <p className="text-2xl font-bold text-primary">{seller.totalSales}</p>
            <p className="text-sm text-secondary">Ventas</p>
          </div>
          <div className="text-center" role="listitem">
            <div className="flex items-center justify-center gap-1" aria-label={\`Calificación promedio: \${seller.averageRating.toFixed(1)} de 5\`}>
              {renderStars(seller.averageRating)}
            </div>
            <p className="text-sm text-secondary">{seller.averageRating.toFixed(1)} ({seller.totalReviews} reseñas)</p>
          </div>
          <div className="text-center" role="listitem">
            <p className="text-2xl font-bold text-foreground">{listings.filter((l) => l.status === 'active').length}</p>
            <p className="text-sm text-secondary">Listados activos</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6" role="tablist" aria-label="Secciones del perfil">
        <button
          onClick={() => setActiveTab('listings')}
          className={\`px-4 py-2 rounded-md text-sm font-medium transition-colors \${
            activeTab === 'listings' ? 'bg-primary text-white' : 'bg-gray-100 text-secondary hover:bg-gray-200'
          }\`}
          role="tab"
          aria-selected={activeTab === 'listings'}
          aria-label="Ver listados"
        >
          Listados ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={\`px-4 py-2 rounded-md text-sm font-medium transition-colors \${
            activeTab === 'reviews' ? 'bg-primary text-white' : 'bg-gray-100 text-secondary hover:bg-gray-200'
          }\`}
          role="tab"
          aria-selected={activeTab === 'reviews'}
          aria-label="Ver reseñas"
        >
          Reseñas ({reviews.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'listings' && (
        <div role="tabpanel" aria-label="Listados del vendedor">
          {listings.length === 0 ? (
            <EmptyState title="Sin listados" description="Este vendedor no tiene listados activos." aria-label="Sin listados" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Listados del vendedor">
              {listings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(\`/dashboard/listings/\${item.id}\`)}
                  className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  role="listitem"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') router.push(\`/dashboard/listings/\${item.id}\`); }}
                  aria-label={\`\${item.title} - \$\${item.price.toLocaleString()}\`}
                >
                  <div className="aspect-video bg-gray-100">
                    <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-foreground mb-1 line-clamp-1">{item.title}</h3>
                    <p className="text-lg font-bold text-primary">\${item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div role="tabpanel" aria-label="Reseñas del vendedor">
          {reviews.length === 0 ? (
            <EmptyState title="Sin reseñas" description="Este vendedor aún no tiene reseñas." aria-label="Sin reseñas" />
          ) : (
            <div className="space-y-4" role="list" aria-label="Reseñas del vendedor">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 bg-white rounded-lg border border-gray-200" role="listitem">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex" aria-label={\`Calificación: \${review.rating} de 5\`}>
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-secondary">por {review.reviewer.name}</span>
                  </div>
                  <p className="text-foreground">{review.comment}</p>
                  <p className="text-xs text-secondary mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
`;
  }

  // ─── 6. Messaging ──────────────────────────────────────────

  static generateMessaging(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect, useRef } from 'react';
import { Toast } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';
import { EmptyState } from '@/components/shared';

interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
  };
  listingTitle: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export default function MessagingPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/messages/conversations');
      const data = await res.json();
      if (res.ok) {
        setConversations(data.conversations || []);
        setCurrentUserId(data.currentUserId || '');
      } else {
        setError('Error al cargar conversaciones');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    setSelectedConversation(conversationId);
    try {
      const res = await fetch(\`/api/messages/conversations/\${conversationId}\`);
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      setToastMessage('Error al cargar mensajes');
      setToastType('error');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation,
          content: newMessage.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage('');
      } else {
        setToastMessage('Error al enviar mensaje');
        setToastType('error');
      }
    } catch (err) {
      setToastMessage('Error de conexión');
      setToastType('error');
    } finally {
      setSending(false);
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  if (loading) {
    return <LoadingSpinner aria-label="Cargando mensajes" />;
  }

  return (
    <div className="p-6 bg-background text-foreground" role="region" aria-label="Mensajes">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      <h1 className="text-2xl font-heading font-bold text-primary mb-6">Mensajes</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
      )}

      <div className="flex gap-4 h-[calc(100vh-200px)] min-h-[400px]">
        {/* Conversation List */}
        <div className="w-80 flex-shrink-0 bg-white rounded-xl shadow border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-foreground">Conversaciones</h2>
          </div>
          <div className="flex-1 overflow-y-auto" role="list" aria-label="Lista de conversaciones">
            {conversations.length === 0 ? (
              <div className="p-4">
                <p className="text-sm text-secondary">No tienes conversaciones.</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => loadMessages(conv.id)}
                  className={\`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors \${
                    selectedConversation === conv.id ? 'bg-primary/5' : ''
                  }\`}
                  role="listitem"
                  aria-label={\`Conversación con \${conv.otherUser.name} sobre \${conv.listingTitle}\`}
                  aria-current={selectedConversation === conv.id ? 'true' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{conv.otherUser.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-foreground text-sm truncate">{conv.otherUser.name}</p>
                        {conv.unreadCount > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full" aria-label={\`\${conv.unreadCount} mensajes sin leer\`}>
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-secondary truncate">{conv.listingTitle}</p>
                      <p className="text-xs text-secondary truncate mt-1">{conv.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 bg-white rounded-xl shadow border border-gray-200 overflow-hidden flex flex-col">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                title="Selecciona una conversación"
                description="Elige una conversación de la lista para ver los mensajes."
                aria-label="Sin conversación seleccionada"
              />
            </div>
          ) : (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-gray-200">
                <p className="font-medium text-foreground">{selectedConv?.otherUser.name}</p>
                <p className="text-xs text-secondary">{selectedConv?.listingTitle}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3" role="log" aria-label="Hilo de mensajes" aria-live="polite">
                {loadingMessages ? (
                  <LoadingSpinner aria-label="Cargando mensajes" />
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={\`flex \${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}\`}
                    >
                      <div
                        className={\`max-w-xs lg:max-w-md px-4 py-2 rounded-lg \${
                          msg.senderId === currentUserId
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-foreground'
                        }\`}
                        role="article"
                        aria-label={\`Mensaje de \${msg.senderId === currentUserId ? 'ti' : selectedConv?.otherUser.name}\`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={\`text-xs mt-1 \${msg.senderId === currentUserId ? 'text-white/70' : 'text-secondary'}\`}>
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Send Form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex gap-2" aria-label="Enviar mensaje">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(ev) => setNewMessage(ev.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Contenido del mensaje"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
                  aria-label="Enviar mensaje"
                >
                  {sending ? 'Enviando...' : 'Enviar'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
`;
  }

  // ─── 7. ListingCard Component ──────────────────────────────

  static generateListingCard(): string {
    return `'use client';

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  sellerName: string;
  rating: number;
  onClick?: () => void;
}

export default function ListingCard({ id, title, price, image, sellerName, rating, onClick }: ListingCardProps) {
  const renderStars = (r: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={\`text-sm \${i < r ? 'text-yellow-400' : 'text-gray-300'}\`} aria-hidden="true">★</span>
    ));

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      role="article"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' && onClick) onClick(); }}
      aria-label={\`\${title} - \$\${price.toLocaleString()} por \${sellerName}\`}
    >
      <div className="aspect-video bg-gray-100">
        <img src={image || '/placeholder.jpg'} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-foreground mb-1 line-clamp-1">{title}</h3>
        <p className="text-lg font-bold text-primary mb-1">\${price.toLocaleString()}</p>
        <p className="text-sm text-secondary mb-2">{sellerName}</p>
        <div className="flex items-center gap-1" aria-label={\`Calificación: \${rating} de 5\`}>
          {renderStars(rating)}
        </div>
      </div>
    </div>
  );
}
`;
  }

  // ─── 8. SearchFilters Component ────────────────────────────

  static generateSearchFilters(): string {
    return `'use client';

import { useState } from 'react';

interface Category {
  id: string;
  name: string;
}

interface SearchFiltersProps {
  categories: Category[];
  onApply: (filters: {
    category: string;
    priceMin: string;
    priceMax: string;
    location: string;
    minRating: string;
  }) => void;
  onClear: () => void;
}

export default function SearchFilters({ categories, onApply, onClear }: SearchFiltersProps) {
  const [category, setCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [location, setLocation] = useState('');
  const [minRating, setMinRating] = useState('');

  const handleApply = () => {
    onApply({ category, priceMin, priceMax, location, minRating });
  };

  const handleClear = () => {
    setCategory('');
    setPriceMin('');
    setPriceMax('');
    setLocation('');
    setMinRating('');
    onClear();
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow border border-gray-200 space-y-4" role="form" aria-label="Filtros de búsqueda">
      <h2 className="text-lg font-heading font-semibold text-foreground">Filtros</h2>

      <div>
        <label htmlFor="filter-category" className="block text-sm font-medium text-secondary mb-1">Categoría</label>
        <select
          id="filter-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Filtrar por categoría"
        >
          <option value="">Todas</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary mb-1">Rango de Precio</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="Mín"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Precio mínimo"
            min="0"
          />
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="Máx"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Precio máximo"
            min="0"
          />
        </div>
      </div>

      <div>
        <label htmlFor="filter-location" className="block text-sm font-medium text-secondary mb-1">Ubicación</label>
        <input
          id="filter-location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ciudad o región..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Filtrar por ubicación"
        />
      </div>

      <div>
        <label htmlFor="filter-rating" className="block text-sm font-medium text-secondary mb-1">Calificación mínima</label>
        <select
          id="filter-rating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Filtrar por calificación"
        >
          <option value="">Cualquiera</option>
          <option value="4">4+ estrellas</option>
          <option value="3">3+ estrellas</option>
          <option value="2">2+ estrellas</option>
          <option value="1">1+ estrella</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
          aria-label="Aplicar filtros"
        >
          Aplicar
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Limpiar filtros"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
`;
  }

  // ─── 9. ReviewStars Component ──────────────────────────────

  static generateReviewStars(): string {
    return `'use client';

import { useState } from 'react';

interface ReviewStarsProps {
  rating: number;
  maxStars?: number;
  editable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (rating: number) => void;
}

export default function ReviewStars({ rating, maxStars = 5, editable = false, size = 'md', onChange }: ReviewStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const handleClick = (star: number) => {
    if (editable && onChange) {
      onChange(star);
    }
  };

  return (
    <div
      className="flex items-center gap-0.5"
      role={editable ? 'radiogroup' : 'img'}
      aria-label={\`Calificación: \${editable ? hoverRating || rating : rating} de \${maxStars} estrellas\`}
    >
      {Array.from({ length: maxStars }, (_, i) => {
        const star = i + 1;
        const isFilled = star <= (hoverRating || rating);

        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => editable && setHoverRating(star)}
            onMouseLeave={() => editable && setHoverRating(0)}
            className={\`\${sizeClasses[size]} transition-colors \${
              isFilled ? 'text-yellow-400' : 'text-gray-300'
            } \${editable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}\`}
            disabled={!editable}
            role={editable ? 'radio' : undefined}
            aria-checked={editable ? star === rating : undefined}
            aria-label={\`\${star} estrella\${star > 1 ? 's' : ''}\`}
            tabIndex={editable ? 0 : -1}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
`;
  }

  // ─── 10. SellerBadge Component ─────────────────────────────

  static generateSellerBadge(): string {
    return `'use client';

interface SellerBadgeProps {
  level: 'new' | 'verified' | 'top' | 'premium';
  size?: 'sm' | 'md' | 'lg';
}

const levelConfig: Record<string, { label: string; icon: string; className: string }> = {
  new: {
    label: 'Nuevo',
    icon: '🆕',
    className: 'bg-gray-100 text-gray-700',
  },
  verified: {
    label: 'Verificado',
    icon: '✓',
    className: 'bg-blue-100 text-blue-700',
  },
  top: {
    label: 'Top Vendedor',
    icon: '⭐',
    className: 'bg-yellow-100 text-yellow-700',
  },
  premium: {
    label: 'Premium',
    icon: '👑',
    className: 'bg-purple-100 text-purple-700',
  },
};

export default function SellerBadge({ level, size = 'md' }: SellerBadgeProps) {
  const config = levelConfig[level] || levelConfig.new;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={\`inline-flex items-center gap-1 rounded-full font-medium \${config.className} \${sizeClasses[size]}\`}
      role="status"
      aria-label={\`Nivel de vendedor: \${config.label}\`}
    >
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}
`;
  }

  // ─── 11. Advanced Prisma Schema ────────────────────────────

  static generateAdvancedPrismaSchema(params: BuildParameters): string {
    return `// Prisma schema generado por ${params.appName}
// Template: MARKETPLACE_MINI (Avanzado)

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
  bio           String?
  location      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  listings      Listing[]
  buyerTransactions  Transaction[] @relation("BuyerTransactions")
  sellerTransactions Transaction[] @relation("SellerTransactions")
  sentMessages     Message[] @relation("SentMessages")
  receivedMessages Message[] @relation("ReceivedMessages")
  reviewsGiven     Review[]  @relation("ReviewsGiven")
  reviewsReceived  Review[]  @relation("ReviewsReceived")
  favorites        Favorite[]
}

model Listing {
  id          String   @id @default(cuid())
  title       String
  description String?
  price       Float
  images      String[] @default([])
  status      String   @default("active")
  categoryId  String
  userId      String
  location    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user         User         @relation(fields: [userId], references: [id])
  category     Category     @relation(fields: [categoryId], references: [id])
  transactions Transaction[]
  messages     Message[]
  favorites    Favorite[]
}

model Category {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  createdAt DateTime @default(now())

  listings  Listing[]
}

model Transaction {
  id        String   @id @default(cuid())
  buyerId   String
  sellerId  String
  listingId String
  amount    Float
  status    String   @default("pending")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  buyer     User     @relation("BuyerTransactions", fields: [buyerId], references: [id])
  seller    User     @relation("SellerTransactions", fields: [sellerId], references: [id])
  listing   Listing  @relation(fields: [listingId], references: [id])
}

model Message {
  id         String   @id @default(cuid())
  senderId   String
  receiverId String
  listingId  String?
  content    String
  read       Boolean  @default(false)
  createdAt  DateTime @default(now())

  sender     User     @relation("SentMessages", fields: [senderId], references: [id])
  receiver   User     @relation("ReceivedMessages", fields: [receiverId], references: [id])
  listing    Listing? @relation(fields: [listingId], references: [id])
}

model Review {
  id         String   @id @default(cuid())
  rating     Int
  comment    String?
  reviewerId String
  sellerId   String
  createdAt  DateTime @default(now())

  reviewer   User     @relation("ReviewsGiven", fields: [reviewerId], references: [id])
  seller     User     @relation("ReviewsReceived", fields: [sellerId], references: [id])
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  listingId String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  listing   Listing  @relation(fields: [listingId], references: [id])

  @@unique([userId, listingId])
}
`;
  }

  // ─── 12. API Routes ────────────────────────────────────────

  static generateApiRoutes(params: BuildParameters): ApiRouteFile[] {
    const routes: ApiRouteFile[] = [];

    routes.push({ path: 'src/app/api/listings/route.ts', content: MarketplaceAdvancedTemplate._listingsListRoute() });
    routes.push({ path: 'src/app/api/listings/[id]/route.ts', content: MarketplaceAdvancedTemplate._listingsDetailRoute() });
    routes.push({ path: 'src/app/api/search/route.ts', content: MarketplaceAdvancedTemplate._searchRoute() });
    routes.push({ path: 'src/app/api/messages/route.ts', content: MarketplaceAdvancedTemplate._messagesRoute() });
    routes.push({ path: 'src/app/api/messages/conversations/route.ts', content: MarketplaceAdvancedTemplate._conversationsRoute() });
    routes.push({ path: 'src/app/api/reviews/route.ts', content: MarketplaceAdvancedTemplate._reviewsRoute() });
    routes.push({ path: 'src/app/api/transactions/route.ts', content: MarketplaceAdvancedTemplate._transactionsRoute() });
    routes.push({ path: 'src/app/api/transactions/[id]/route.ts', content: MarketplaceAdvancedTemplate._transactionDetailRoute() });

    return routes;
  }

  // ─── Private API Route Generators ──────────────────────────

  private static _listingsListRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const createListingSchema = z.object({`,
      `  title: z.string({ required_error: 'El título es obligatorio' })`,
      `    .min(3, { message: 'El título debe tener al menos 3 caracteres' })`,
      `    .max(200, { message: 'El título no debe exceder 200 caracteres' }),`,
      `  description: z.string().max(5000, { message: 'La descripción no debe exceder 5000 caracteres' }).optional(),`,
      `  price: z.number({ required_error: 'El precio es obligatorio' })`,
      `    .min(0, { message: 'El precio debe ser mayor o igual a 0' }),`,
      `  images: z.array(z.string()).optional(),`,
      `  categoryId: z.string({ required_error: 'La categoría es obligatoria' }),`,
      `  location: z.string().optional(),`,
      `});`,
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
      `    const userId = (session.user as any).id;`,
      `    const { searchParams } = new URL(request.url);`,
      `    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));`,
      `    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));`,
      `    const skip = (page - 1) * limit;`,
      `    const status = searchParams.get('status') || undefined;`,
      `    const search = searchParams.get('search') || undefined;`,
      ``,
      `    const where: any = { userId };`,
      `    if (status) where.status = status;`,
      `    if (search) {`,
      `      where.OR = [`,
      `        { title: { contains: search, mode: 'insensitive' } },`,
      `        { description: { contains: search, mode: 'insensitive' } },`,
      `      ];`,
      `    }`,
      ``,
      `    const total = await prisma.listing.count({ where });`,
      `    const listings = await prisma.listing.findMany({`,
      `      where,`,
      `      skip,`,
      `      take: limit,`,
      `      orderBy: { createdAt: 'desc' },`,
      `      include: { category: true },`,
      `    });`,
      ``,
      `    const totalPages = Math.ceil(total / limit);`,
      ``,
      `    return NextResponse.json({`,
      `      datos: listings,`,
      `      listings,`,
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
      `    const datos = createListingSchema.parse(body);`,
      ``,
      `    const listing = await prisma.listing.create({`,
      `      data: { ...datos, userId },`,
      `    });`,
      ``,
      `    return NextResponse.json({ listing }, { status: 201 });`,
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

  private static _listingsDetailRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const updateListingSchema = z.object({`,
      `  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres' }).max(200).optional(),`,
      `  description: z.string().max(5000).optional(),`,
      `  price: z.number().min(0, { message: 'El precio debe ser mayor o igual a 0' }).optional(),`,
      `  images: z.array(z.string()).optional(),`,
      `  status: z.string().optional(),`,
      `  categoryId: z.string().optional(),`,
      `  location: z.string().optional(),`,
      `});`,
      ``,
      `export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {`,
      `  const params = await props.params;`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json({ error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' }, { status: 401 });`,
      `    }`,
      `    const listing = await prisma.listing.findUnique({`,
      `      where: { id: params.id },`,
      `      include: { user: { select: { id: true, name: true, email: true } }, category: true },`,
      `    });`,
      `    if (!listing) {`,
      `      return NextResponse.json({ error: 'Listado no encontrado.' }, { status: 404 });`,
      `    }`,
      `    const userId = (session.user as any).id;`,
      `    const isFavorite = await prisma.favorite.findUnique({`,
      `      where: { userId_listingId: { userId, listingId: params.id } },`,
      `    });`,
      `    return NextResponse.json({ listing, isFavorite: !!isFavorite });`,
      `  } catch (error) {`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json({ error: 'Error interno del servidor. Intente nuevamente más tarde.' }, { status: 500 });`,
      `  }`,
      `}`,
      ``,
      `export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {`,
      `  const params = await props.params;`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json({ error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' }, { status: 401 });`,
      `    }`,
      `    const userId = (session.user as any).id;`,
      `    const body = await request.json();`,
      `    const datos = updateListingSchema.parse(body);`,
      `    const listingExistente = await prisma.listing.findUnique({ where: { id: params.id } });`,
      `    if (!listingExistente) {`,
      `      return NextResponse.json({ error: 'Listado no encontrado.' }, { status: 404 });`,
      `    }`,
      `    if (listingExistente.userId !== userId) {`,
      `      return NextResponse.json({ error: 'No tiene permisos para modificar este recurso.' }, { status: 403 });`,
      `    }`,
      `    const listingUpdated = await prisma.listing.update({ where: { id: params.id }, data: datos });`,
      `    return NextResponse.json({ listing: listingUpdated });`,
      `  } catch (error) {`,
      `    if (error instanceof z.ZodError) {`,
      `      const erroresDetallados = error.errors.map((e) => ({ campo: e.path.join('.'), mensaje: e.message }));`,
      `      return NextResponse.json({ error: 'Error de validación', errores: erroresDetallados }, { status: 400 });`,
      `    }`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json({ error: 'Error interno del servidor. Intente nuevamente más tarde.' }, { status: 500 });`,
      `  }`,
      `}`,
      ``,
      `export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {`,
      `  const params = await props.params;`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json({ error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' }, { status: 401 });`,
      `    }`,
      `    const userId = (session.user as any).id;`,
      `    const listingExistente = await prisma.listing.findUnique({ where: { id: params.id } });`,
      `    if (!listingExistente) {`,
      `      return NextResponse.json({ error: 'Listado no encontrado.' }, { status: 404 });`,
      `    }`,
      `    if (listingExistente.userId !== userId) {`,
      `      return NextResponse.json({ error: 'No tiene permisos para eliminar este recurso.' }, { status: 403 });`,
      `    }`,
      `    await prisma.listing.delete({ where: { id: params.id } });`,
      `    return NextResponse.json({ mensaje: 'Listado eliminado correctamente.' });`,
      `  } catch (error) {`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json({ error: 'Error interno del servidor. Intente nuevamente más tarde.' }, { status: 500 });`,
      `  }`,
      `}`,
    ].join('\n');
  }

  private static _searchRoute(): string {
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
      `    const { searchParams } = new URL(request.url);`,
      `    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));`,
      `    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));`,
      `    const skip = (page - 1) * limit;`,
      `    const search = searchParams.get('search') || undefined;`,
      `    const categoryId = searchParams.get('categoryId') || undefined;`,
      `    const priceMin = searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined;`,
      `    const priceMax = searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined;`,
      `    const location = searchParams.get('location') || undefined;`,
      `    const minRating = searchParams.get('minRating') ? parseInt(searchParams.get('minRating')!, 10) : undefined;`,
      `    const sortBy = searchParams.get('sortBy') || 'createdAt';`,
      `    const sortDir = searchParams.get('sortDir') === 'asc' ? 'asc' : 'desc';`,
      ``,
      `    const where: any = { status: 'active' };`,
      ``,
      `    if (search) {`,
      `      where.OR = [`,
      `        { title: { contains: search, mode: 'insensitive' } },`,
      `        { description: { contains: search, mode: 'insensitive' } },`,
      `      ];`,
      `    }`,
      `    if (categoryId) where.categoryId = categoryId;`,
      `    if (priceMin !== undefined || priceMax !== undefined) {`,
      `      where.price = {};`,
      `      if (priceMin !== undefined) where.price.gte = priceMin;`,
      `      if (priceMax !== undefined) where.price.lte = priceMax;`,
      `    }`,
      `    if (location) {`,
      `      where.location = { contains: location, mode: 'insensitive' };`,
      `    }`,
      ``,
      `    const total = await prisma.listing.count({ where });`,
      `    const listings = await prisma.listing.findMany({`,
      `      where,`,
      `      skip,`,
      `      take: limit,`,
      `      orderBy: { [sortBy]: sortDir },`,
      `      include: {`,
      `        user: { select: { id: true, name: true } },`,
      `        category: true,`,
      `      },`,
      `    });`,
      ``,
      `    const totalPages = Math.ceil(total / limit);`,
      ``,
      `    return NextResponse.json({`,
      `      listings,`,
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
    ].join('\n');
  }

  private static _messagesRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const sendMessageSchema = z.object({`,
      `  receiverId: z.string({ required_error: 'El destinatario es obligatorio' }).optional(),`,
      `  conversationId: z.string().optional(),`,
      `  listingId: z.string().optional(),`,
      `  content: z.string({ required_error: 'El contenido es obligatorio' })`,
      `    .min(1, { message: 'El mensaje no puede estar vacío' })`,
      `    .max(2000, { message: 'El mensaje no debe exceder 2000 caracteres' }),`,
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
      `    const senderId = (session.user as any).id;`,
      `    const body = await request.json();`,
      `    const datos = sendMessageSchema.parse(body);`,
      ``,
      `    let receiverId = datos.receiverId;`,
      ``,
      `    // If conversationId provided, find the other user`,
      `    if (datos.conversationId && !receiverId) {`,
      `      const existingMsg = await prisma.message.findFirst({`,
      `        where: {`,
      `          OR: [`,
      `            { senderId, receiverId: { not: senderId } },`,
      `            { receiverId: senderId, senderId: { not: senderId } },`,
      `          ],`,
      `        },`,
      `        select: { senderId: true, receiverId: true },`,
      `      });`,
      `      if (existingMsg) {`,
      `        receiverId = existingMsg.senderId === senderId ? existingMsg.receiverId : existingMsg.senderId;`,
      `      }`,
      `    }`,
      ``,
      `    if (!receiverId) {`,
      `      return NextResponse.json({ error: 'Destinatario no encontrado.' }, { status: 400 });`,
      `    }`,
      ``,
      `    const message = await prisma.message.create({`,
      `      data: {`,
      `        senderId,`,
      `        receiverId,`,
      `        listingId: datos.listingId || null,`,
      `        content: datos.content,`,
      `      },`,
      `    });`,
      ``,
      `    return NextResponse.json({ message }, { status: 201 });`,
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

  private static _conversationsRoute(): string {
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
      `    const userId = (session.user as any).id;`,
      ``,
      `    const messages = await prisma.message.findMany({`,
      `      where: {`,
      `        OR: [{ senderId: userId }, { receiverId: userId }],`,
      `      },`,
      `      orderBy: { createdAt: 'desc' },`,
      `      include: {`,
      `        sender: { select: { id: true, name: true } },`,
      `        receiver: { select: { id: true, name: true } },`,
      `        listing: { select: { title: true } },`,
      `      },`,
      `    });`,
      ``,
      `    // Group by conversation partner`,
      `    const conversationMap = new Map<string, any>();`,
      `    for (const msg of messages) {`,
      `      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;`,
      `      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;`,
      `      if (!conversationMap.has(otherUserId)) {`,
      `        conversationMap.set(otherUserId, {`,
      `          id: otherUserId,`,
      `          otherUser,`,
      `          listingTitle: msg.listing?.title || 'Conversación',`,
      `          lastMessage: msg.content,`,
      `          lastMessageAt: msg.createdAt,`,
      `          unreadCount: 0,`,
      `        });`,
      `      }`,
      `      if (msg.receiverId === userId && !msg.read) {`,
      `        conversationMap.get(otherUserId).unreadCount++;`,
      `      }`,
      `    }`,
      ``,
      `    const conversations = Array.from(conversationMap.values());`,
      ``,
      `    return NextResponse.json({ conversations, currentUserId: userId });`,
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

  private static _reviewsRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const createReviewSchema = z.object({`,
      `  rating: z.number({ required_error: 'La calificación es obligatoria' })`,
      `    .int({ message: 'La calificación debe ser un número entero' })`,
      `    .min(1, { message: 'La calificación mínima es 1' })`,
      `    .max(5, { message: 'La calificación máxima es 5' }),`,
      `  comment: z.string().max(1000, { message: 'El comentario no debe exceder 1000 caracteres' }).optional(),`,
      `  sellerId: z.string({ required_error: 'El vendedor es obligatorio' }),`,
      `});`,
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
      `    const sellerId = searchParams.get('sellerId');`,
      `    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));`,
      `    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));`,
      `    const skip = (page - 1) * limit;`,
      ``,
      `    const where: any = {};`,
      `    if (sellerId) where.sellerId = sellerId;`,
      ``,
      `    const total = await prisma.review.count({ where });`,
      `    const reviews = await prisma.review.findMany({`,
      `      where,`,
      `      skip,`,
      `      take: limit,`,
      `      orderBy: { createdAt: 'desc' },`,
      `      include: {`,
      `        reviewer: { select: { name: true } },`,
      `      },`,
      `    });`,
      ``,
      `    const totalPages = Math.ceil(total / limit);`,
      ``,
      `    return NextResponse.json({`,
      `      reviews,`,
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
      `    const reviewerId = (session.user as any).id;`,
      `    const body = await request.json();`,
      `    const datos = createReviewSchema.parse(body);`,
      ``,
      `    if (datos.sellerId === reviewerId) {`,
      `      return NextResponse.json(`,
      `        { error: 'No puede dejar una reseña para usted mismo.' },`,
      `        { status: 400 }`,
      `      );`,
      `    }`,
      ``,
      `    const review = await prisma.review.create({`,
      `      data: {`,
      `        rating: datos.rating,`,
      `        comment: datos.comment || null,`,
      `        reviewerId,`,
      `        sellerId: datos.sellerId,`,
      `      },`,
      `    });`,
      ``,
      `    return NextResponse.json({ review }, { status: 201 });`,
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

  private static _transactionsRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const createTransactionSchema = z.object({`,
      `  listingId: z.string({ required_error: 'El listado es obligatorio' }),`,
      `  amount: z.number({ required_error: 'El monto es obligatorio' })`,
      `    .min(0, { message: 'El monto debe ser mayor o igual a 0' }),`,
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
      `    const buyerId = (session.user as any).id;`,
      `    const body = await request.json();`,
      `    const datos = createTransactionSchema.parse(body);`,
      ``,
      `    const listing = await prisma.listing.findUnique({`,
      `      where: { id: datos.listingId },`,
      `    });`,
      ``,
      `    if (!listing) {`,
      `      return NextResponse.json({ error: 'Listado no encontrado.' }, { status: 404 });`,
      `    }`,
      ``,
      `    if (listing.userId === buyerId) {`,
      `      return NextResponse.json({ error: 'No puede comprar su propio listado.' }, { status: 400 });`,
      `    }`,
      ``,
      `    const transaction = await prisma.transaction.create({`,
      `      data: {`,
      `        buyerId,`,
      `        sellerId: listing.userId,`,
      `        listingId: datos.listingId,`,
      `        amount: datos.amount,`,
      `        status: 'pending',`,
      `      },`,
      `    });`,
      ``,
      `    return NextResponse.json({ transaction }, { status: 201 });`,
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

  private static _transactionDetailRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const updateTransactionSchema = z.object({`,
      `  status: z.enum(['pending', 'paid', 'shipped', 'completed', 'cancelled'], {`,
      `    required_error: 'El estado es obligatorio',`,
      `    invalid_type_error: 'Estado no válido. Valores permitidos: pending, paid, shipped, completed, cancelled',`,
      `  }),`,
      `});`,
      ``,
      `export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {`,
      `  const params = await props.params;`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json({ error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' }, { status: 401 });`,
      `    }`,
      `    const userId = (session.user as any).id;`,
      `    const body = await request.json();`,
      `    const datos = updateTransactionSchema.parse(body);`,
      ``,
      `    const transaction = await prisma.transaction.findUnique({ where: { id: params.id } });`,
      `    if (!transaction) {`,
      `      return NextResponse.json({ error: 'Transacción no encontrada.' }, { status: 404 });`,
      `    }`,
      `    if (transaction.buyerId !== userId && transaction.sellerId !== userId) {`,
      `      return NextResponse.json({ error: 'No tiene permisos para modificar esta transacción.' }, { status: 403 });`,
      `    }`,
      ``,
      `    const updated = await prisma.transaction.update({`,
      `      where: { id: params.id },`,
      `      data: { status: datos.status },`,
      `    });`,
      ``,
      `    return NextResponse.json({ transaction: updated });`,
      `  } catch (error) {`,
      `    if (error instanceof z.ZodError) {`,
      `      const erroresDetallados = error.errors.map((e) => ({ campo: e.path.join('.'), mensaje: e.message }));`,
      `      return NextResponse.json({ error: 'Error de validación', errores: erroresDetallados }, { status: 400 });`,
      `    }`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json({ error: 'Error interno del servidor. Intente nuevamente más tarde.' }, { status: 500 });`,
      `  }`,
      `}`,
    ].join('\n');
  }
}

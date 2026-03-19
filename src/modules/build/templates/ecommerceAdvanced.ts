// EcommerceAdvancedTemplate — Generates advanced E-commerce pages, cart, checkout,
// orders, Prisma schema, and API routes for the ECOMMERCE_MINI template type.
// All pages use 'use client', useState, useEffect, Tailwind design system classes,
// and import shared components from '@/components/shared'.

import { BuildParameters } from '../types';

interface ApiRouteFile {
  path: string;
  content: string;
}

export class EcommerceAdvancedTemplate {
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
    return EcommerceAdvancedTemplate.capitalize(str) + 's';
  }

  // ─── 1. Catalog Page ──────────────────────────────────────

  static generateCatalogPage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner, EmptyState } from '@/components/shared';
import { Toast } from '@/components/shared';
import ProductCard from '@/components/ecommerce/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: { id: string; name: string };
  stock: number;
  rating?: number;
}

interface Category {
  id: string;
  name: string;
}

interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function CatalogPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.set('page', String(page));
      queryParams.set('limit', '12');
      if (search) queryParams.set('search', search);
      if (categoryFilter) queryParams.set('categoryId', categoryFilter);
      if (priceMin) queryParams.set('priceMin', priceMin);
      if (priceMax) queryParams.set('priceMax', priceMax);
      if (sortBy) queryParams.set('sortBy', sortBy);

      const res = await fetch(\`/api/products?\${queryParams.toString()}\`);
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
        setPagination(data.paginacion || null);
      } else {
        setError('Error al cargar productos');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (res.ok) setCategories(data.categories || []);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, sortBy, categoryFilter]);

  const handleSearch = () => {
    setPage(1);
    loadProducts();
  };

  const handleAddToCart = async (productId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.ok) {
        setToastMessage('Producto agregado al carrito');
      } else {
        const data = await res.json();
        setError(data.error || 'Error al agregar al carrito');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  return (
    <div className="p-6 bg-background text-foreground" role="region" aria-label="Catálogo de Productos">
      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      <h1 className="text-2xl font-heading font-bold text-primary mb-6">Catálogo de Productos</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200 mb-6" role="form" aria-label="Filtros de catálogo">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="catalog-search" className="block text-sm font-medium text-secondary mb-1">Buscar</label>
            <input
              id="catalog-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              placeholder="Buscar productos..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Buscar productos"
            />
          </div>

          <div>
            <label htmlFor="catalog-category" className="block text-sm font-medium text-secondary mb-1">Categoría</label>
            <select
              id="catalog-category"
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
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
            <label htmlFor="catalog-sort" className="block text-sm font-medium text-secondary mb-1">Ordenar por</label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Ordenar productos"
            >
              <option value="newest">Más recientes</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="name_asc">Nombre: A-Z</option>
              <option value="name_desc">Nombre: Z-A</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
              aria-label="Aplicar filtros"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <LoadingSpinner aria-label="Cargando productos" />
      ) : products.length === 0 ? (
        <EmptyState message="No se encontraron productos" aria-label="Sin productos" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list" aria-label="Lista de productos">
            {products.map((product) => (
              <div key={product.id} role="listitem">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  comparePrice={product.comparePrice}
                  image={product.images?.[0] || ''}
                  rating={product.rating || 0}
                  onAddToCart={() => handleAddToCart(product.id)}
                  onClick={() => router.push(\`/products/\${product.id}\`)}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <nav className="flex justify-center items-center gap-2 mt-8" role="navigation" aria-label="Paginación del catálogo">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Página anterior"
              >
                Anterior
              </button>
              <span className="text-sm text-secondary" aria-live="polite">
                Página {pagination.currentPage} de {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Página siguiente"
              >
                Siguiente
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
`;
  }

  // ─── 2. Product Detail Page ────────────────────────────────

  static generateProductDetailPage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LoadingSpinner, Toast } from '@/components/shared';
import ProductCard from '@/components/ecommerce/ProductCard';
import QuantitySelector from '@/components/ecommerce/QuantitySelector';

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number | null;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  category: { id: string; name: string };
  variants: ProductVariant[];
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  images: string[];
  rating?: number;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(\`/api/products/\${productId}\`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data.product);
          if (data.product.variants?.length > 0) {
            setSelectedVariant(data.product.variants[0].id);
          }
          setRelatedProducts(data.relatedProducts || []);
        } else {
          setError('Producto no encontrado');
        }
      } catch {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };
    if (productId) loadProduct();
  }, [productId]);

  const currentVariant = product?.variants?.find((v) => v.id === selectedVariant);
  const displayPrice = currentVariant?.price ?? product?.price ?? 0;
  const maxStock = currentVariant?.stock ?? product?.stock ?? 0;

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant || undefined,
          quantity,
        }),
      });
      if (res.ok) {
        setToastMessage('Producto agregado al carrito');
      } else {
        const data = await res.json();
        setError(data.error || 'Error al agregar al carrito');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <LoadingSpinner aria-label="Cargando producto" />;
  if (!product) return <div className="p-6 text-center text-secondary">Producto no encontrado</div>;

  return (
    <div className="p-6 bg-background text-foreground" role="region" aria-label={\`Detalle de \${product.name}\`}>
      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
      )}

      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-primary hover:underline"
        aria-label="Volver al catálogo"
      >
        ← Volver al catálogo
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
            {product.images.length > 0 ? (
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-secondary">Sin imagen</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto" role="listbox" aria-label="Galería de imágenes">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={\`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 transition-colors \${
                    idx === selectedImage ? 'border-primary' : 'border-gray-200'
                  }\`}
                  role="option"
                  aria-selected={idx === selectedImage}
                  aria-label={\`Imagen \${idx + 1}\`}
                >
                  <img src={img} alt={\`\${product.name} - imagen \${idx + 1}\`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-secondary mb-1">{product.category?.name}</p>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-primary">\${displayPrice.toLocaleString()}</span>
            {product.comparePrice && product.comparePrice > displayPrice && (
              <span className="text-lg text-secondary line-through">\${product.comparePrice.toLocaleString()}</span>
            )}
          </div>

          <p className="text-foreground mb-6 leading-relaxed">{product.description}</p>

          {/* Variant Selector */}
          {product.variants.length > 0 && (
            <div className="mb-4">
              <label htmlFor="variant-select" className="block text-sm font-medium text-secondary mb-2">Variante</label>
              <select
                id="variant-select"
                value={selectedVariant}
                onChange={(e) => { setSelectedVariant(e.target.value); setQuantity(1); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Seleccionar variante"
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} {v.price ? \`- \$\${v.price.toLocaleString()}\` : ''} ({v.stock} disponibles)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary mb-2">Cantidad</label>
            <QuantitySelector
              value={quantity}
              min={1}
              max={maxStock}
              onChange={setQuantity}
            />
            <p className="text-xs text-secondary mt-1">{maxStock} disponibles</p>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={adding || maxStock === 0}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            aria-label={maxStock === 0 ? 'Producto agotado' : 'Agregar al carrito'}
          >
            {adding ? 'Agregando...' : maxStock === 0 ? 'Agotado' : 'Agregar al Carrito'}
          </button>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="Productos relacionados">
            {relatedProducts.map((rp) => (
              <div key={rp.id} role="listitem">
                <ProductCard
                  id={rp.id}
                  name={rp.name}
                  price={rp.price}
                  comparePrice={rp.comparePrice}
                  image={rp.images?.[0] || ''}
                  rating={rp.rating || 0}
                  onClick={() => router.push(\`/products/\${rp.id}\`)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
`;
  }

  // ─── 3. Cart Page ──────────────────────────────────────────

  static generateCartPage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner, EmptyState, Toast } from '@/components/shared';
import QuantitySelector from '@/components/ecommerce/QuantitySelector';

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
  variant?: {
    id: string;
    name: string;
    price: number | null;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const loadCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (res.ok) {
        setCart(data.cart);
      } else {
        setError('Error al cargar el carrito');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    setUpdating(itemId);
    try {
      const res = await fetch(\`/api/cart/\${itemId}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (res.ok) {
        await loadCart();
      } else {
        const data = await res.json();
        setError(data.error || 'Error al actualizar cantidad');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdating(itemId);
    try {
      const res = await fetch(\`/api/cart/\${itemId}\`, { method: 'DELETE' });
      if (res.ok) {
        setToastMessage('Producto eliminado del carrito');
        await loadCart();
      } else {
        setError('Error al eliminar producto');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setUpdating(null);
    }
  };

  const getItemPrice = (item: CartItem): number => {
    return item.variant?.price ?? item.product.price;
  };

  const subtotal = cart?.items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0) ?? 0;

  if (loading) return <LoadingSpinner aria-label="Cargando carrito" />;

  return (
    <div className="p-6 bg-background text-foreground" role="region" aria-label="Carrito de Compras">
      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      <h1 className="text-2xl font-heading font-bold text-primary mb-6">Carrito de Compras</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
      )}

      {!cart || cart.items.length === 0 ? (
        <EmptyState
          message="Tu carrito está vacío"
          aria-label="Carrito vacío"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4" role="list" aria-label="Productos en el carrito">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow border border-gray-200 flex gap-4"
                role="listitem"
                aria-label={\`\${item.product.name}\${item.variant ? ' - ' + item.variant.name : ''}\`}
              >
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {item.product.images?.[0] ? (
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-secondary">Sin imagen</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{item.product.name}</h3>
                  {item.variant && (
                    <p className="text-sm text-secondary">{item.variant.name}</p>
                  )}
                  <p className="text-primary font-bold mt-1">\${getItemPrice(item).toLocaleString()}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <QuantitySelector
                    value={item.quantity}
                    min={1}
                    max={99}
                    onChange={(qty) => handleUpdateQuantity(item.id, qty)}
                    disabled={updating === item.id}
                  />
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={updating === item.id}
                    className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                    aria-label={\`Eliminar \${item.product.name} del carrito\`}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200 h-fit" role="complementary" aria-label="Resumen del carrito">
            <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Resumen</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Subtotal ({cart.items.length} productos)</span>
                <span className="text-foreground font-medium">\${subtotal.toLocaleString()}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-primary text-lg">\${subtotal.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/checkout')}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              aria-label="Proceder al checkout"
            >
              Proceder al Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
`;
  }

  // ─── 4. Checkout Page ──────────────────────────────────────

  static generateCheckoutPage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner, Toast } from '@/components/shared';
import CheckoutStepper from '@/components/ecommerce/CheckoutStepper';
import CartSummary from '@/components/ecommerce/CartSummary';

interface CartItem {
  id: string;
  quantity: number;
  product: { id: string; name: string; price: number; images: string[] };
  variant?: { id: string; name: string; price: number | null };
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Step 1: Shipping
  const [shipping, setShipping] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'MX',
  });

  // Step 2: Payment
  const [payment, setPayment] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await fetch('/api/cart');
        const data = await res.json();
        if (res.ok) {
          setCartItems(data.cart?.items || []);
        } else {
          setError('Error al cargar el carrito');
        }
      } catch {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const getItemPrice = (item: CartItem): number => item.variant?.price ?? item.product.price;
  const subtotal = cartItems.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  const shippingCost = subtotal > 500 ? 0 : 99;
  const tax = Math.round(subtotal * 0.16 * 100) / 100;
  const total = subtotal + shippingCost + tax;

  const validateShipping = (): boolean => {
    return !!(shipping.street && shipping.city && shipping.state && shipping.zipCode && shipping.country);
  };

  const validatePayment = (): boolean => {
    return !!(payment.cardNumber && payment.cardName && payment.expiry && payment.cvv);
  };

  const handleSubmitOrder = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingAddress: shipping }),
      });
      const data = await res.json();
      if (res.ok) {
        setToastMessage('Pedido creado exitosamente');
        setTimeout(() => router.push(\`/orders/\${data.order.id}\`), 1500);
      } else {
        setError(data.error || 'Error al crear el pedido');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner aria-label="Cargando checkout" />;

  return (
    <div className="p-6 bg-background text-foreground" role="region" aria-label="Checkout">
      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      <h1 className="text-2xl font-heading font-bold text-primary mb-6">Checkout</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
      )}

      <CheckoutStepper currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="form" aria-label="Dirección de envío">
              <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Dirección de Envío</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="shipping-street" className="block text-sm font-medium text-secondary mb-1">Calle y número</label>
                  <input
                    id="shipping-street"
                    type="text"
                    value={shipping.street}
                    onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Calle y número"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shipping-city" className="block text-sm font-medium text-secondary mb-1">Ciudad</label>
                    <input
                      id="shipping-city"
                      type="text"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Ciudad"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="shipping-state" className="block text-sm font-medium text-secondary mb-1">Estado</label>
                    <input
                      id="shipping-state"
                      type="text"
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Estado"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shipping-zip" className="block text-sm font-medium text-secondary mb-1">Código Postal</label>
                    <input
                      id="shipping-zip"
                      type="text"
                      value={shipping.zipCode}
                      onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Código postal"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="shipping-country" className="block text-sm font-medium text-secondary mb-1">País</label>
                    <input
                      id="shipping-country"
                      type="text"
                      value={shipping.country}
                      onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="País"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => { if (validateShipping()) setStep(2); else setError('Complete todos los campos de envío'); }}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
                  aria-label="Continuar a pago"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="form" aria-label="Información de pago">
              <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Información de Pago</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="payment-name" className="block text-sm font-medium text-secondary mb-1">Nombre en la tarjeta</label>
                  <input
                    id="payment-name"
                    type="text"
                    value={payment.cardName}
                    onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Nombre en la tarjeta"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="payment-number" className="block text-sm font-medium text-secondary mb-1">Número de tarjeta</label>
                  <input
                    id="payment-number"
                    type="text"
                    value={payment.cardNumber}
                    onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Número de tarjeta"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="payment-expiry" className="block text-sm font-medium text-secondary mb-1">Fecha de expiración</label>
                    <input
                      id="payment-expiry"
                      type="text"
                      value={payment.expiry}
                      onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                      placeholder="MM/AA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Fecha de expiración"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="payment-cvv" className="block text-sm font-medium text-secondary mb-1">CVV</label>
                    <input
                      id="payment-cvv"
                      type="text"
                      value={payment.cvv}
                      onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="CVV"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label="Volver a envío"
                >
                  Atrás
                </button>
                <button
                  onClick={() => { if (validatePayment()) setStep(3); else setError('Complete todos los campos de pago'); }}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
                  aria-label="Continuar a revisión"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && (
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="region" aria-label="Revisión del pedido">
              <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Revisar y Confirmar</h2>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-secondary mb-2">Dirección de Envío</h3>
                <p className="text-foreground">{shipping.street}</p>
                <p className="text-foreground">{shipping.city}, {shipping.state} {shipping.zipCode}</p>
                <p className="text-foreground">{shipping.country}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-secondary mb-2">Método de Pago</h3>
                <p className="text-foreground">Tarjeta terminada en {payment.cardNumber.slice(-4)}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-secondary mb-2">Productos ({cartItems.length})</h3>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-foreground">
                        {item.product.name}{item.variant ? \` (\${item.variant.name})\` : ''} x{item.quantity}
                      </span>
                      <span className="text-foreground font-medium">
                        \${(getItemPrice(item) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label="Volver a pago"
                >
                  Atrás
                </button>
                <button
                  onClick={handleSubmitOrder}
                  disabled={submitting}
                  className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  aria-label="Confirmar pedido"
                >
                  {submitting ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <CartSummary
            subtotal={subtotal}
            shipping={shippingCost}
            tax={tax}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
`;
  }

  // ─── 5. Order History Page ─────────────────────────────────

  static generateOrderHistoryPage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, LoadingSpinner, Toast } from '@/components/shared';
import OrderStatusBadge from '@/components/ecommerce/OrderStatusBadge';

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{ id: string; product: { name: string }; quantity: number }>;
}

interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.set('page', String(page));
      queryParams.set('limit', '10');
      if (statusFilter) queryParams.set('status', statusFilter);
      if (dateFrom) queryParams.set('dateFrom', dateFrom);
      if (dateTo) queryParams.set('dateTo', dateTo);

      const res = await fetch(\`/api/orders?\${queryParams.toString()}\`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
        setPagination(data.paginacion || null);
      } else {
        setError('Error al cargar pedidos');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter]);

  const columns = [
    {
      key: 'id',
      label: 'Pedido',
      render: (order: Order) => (
        <span className="text-sm font-mono text-foreground">#{order.id.slice(-8)}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (order: Order) => (
        <span className="text-sm text-secondary">{new Date(order.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'items',
      label: 'Productos',
      render: (order: Order) => (
        <span className="text-sm text-foreground">{order.items.length} producto(s)</span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      render: (order: Order) => (
        <span className="text-sm font-medium text-foreground">\${order.total.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (order: Order) => <OrderStatusBadge status={order.status} />,
    },
  ];

  const actions = [
    {
      label: 'Ver detalle',
      onClick: (order: Order) => router.push(\`/orders/\${order.id}\`),
    },
  ];

  return (
    <div className="p-6 bg-background text-foreground" role="region" aria-label="Historial de Pedidos">
      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      <h1 className="text-2xl font-heading font-bold text-primary mb-6">Historial de Pedidos</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200 mb-6" role="form" aria-label="Filtros de pedidos">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="order-status-filter" className="block text-sm font-medium text-secondary mb-1">Estado</label>
            <select
              id="order-status-filter"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Filtrar por estado"
            >
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="paid">Pagado</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <div>
            <label htmlFor="order-date-from" className="block text-sm font-medium text-secondary mb-1">Desde</label>
            <input
              id="order-date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Fecha desde"
            />
          </div>
          <div>
            <label htmlFor="order-date-to" className="block text-sm font-medium text-secondary mb-1">Hasta</label>
            <input
              id="order-date-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Fecha hasta"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <LoadingSpinner aria-label="Cargando pedidos" />
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          actions={actions}
          pagination={pagination ? {
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            onPageChange: setPage,
          } : undefined}
          emptyMessage="No se encontraron pedidos"
          aria-label="Tabla de pedidos"
        />
      )}
    </div>
  );
}
`;
  }

  // ─── 6. Order Detail Page ──────────────────────────────────

  static generateOrderDetailPage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LoadingSpinner, Toast } from '@/components/shared';
import OrderStatusBadge from '@/components/ecommerce/OrderStatusBadge';

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { id: string; name: string; images: string[] };
  variant?: { name: string };
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  id: string;
  status: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  address?: Address;
}

const STATUS_TIMELINE = ['pending', 'paid', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await fetch(\`/api/orders/\${orderId}\`);
        const data = await res.json();
        if (res.ok) {
          setOrder(data.order);
        } else {
          setError('Pedido no encontrado');
        }
      } catch {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };
    if (orderId) loadOrder();
  }, [orderId]);

  const getStatusIndex = (status: string): number => {
    const idx = STATUS_TIMELINE.indexOf(status);
    return idx >= 0 ? idx : -1;
  };

  if (loading) return <LoadingSpinner aria-label="Cargando detalle del pedido" />;
  if (!order) return <div className="p-6 text-center text-secondary">Pedido no encontrado</div>;

  const currentStatusIndex = getStatusIndex(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="p-6 bg-background text-foreground" role="region" aria-label={\`Detalle del Pedido #\${order.id.slice(-8)}\`}>
      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
      )}

      <button
        onClick={() => router.push('/orders')}
        className="mb-4 text-sm text-primary hover:underline"
        aria-label="Volver al historial de pedidos"
      >
        ← Volver al historial
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Pedido #{order.id.slice(-8)}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Status Timeline */}
      {!isCancelled && (
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200 mb-6" role="progressbar" aria-label="Progreso del pedido" aria-valuenow={currentStatusIndex + 1} aria-valuemin={1} aria-valuemax={STATUS_TIMELINE.length}>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Seguimiento</h2>
          <div className="flex items-center justify-between">
            {STATUS_TIMELINE.map((status, idx) => {
              const isCompleted = idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;
              const labels: Record<string, string> = {
                pending: 'Pendiente',
                paid: 'Pagado',
                shipped: 'Enviado',
                delivered: 'Entregado',
              };

              return (
                <div key={status} className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    {idx > 0 && (
                      <div className={\`flex-1 h-1 \${isCompleted ? 'bg-green-500' : 'bg-gray-200'}\`} />
                    )}
                    <div
                      className={\`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold \${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      } \${isCurrent ? 'ring-2 ring-green-300' : ''}\`}
                      aria-label={\`\${labels[status]}: \${isCompleted ? 'completado' : 'pendiente'}\`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    {idx < STATUS_TIMELINE.length - 1 && (
                      <div className={\`flex-1 h-1 \${idx < currentStatusIndex ? 'bg-green-500' : 'bg-gray-200'}\`} />
                    )}
                  </div>
                  <span className={\`text-xs mt-2 \${isCompleted ? 'text-green-600 font-medium' : 'text-secondary'}\`}>
                    {labels[status]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 mb-6" role="alert">
          <p className="text-red-700 font-medium">Este pedido ha sido cancelado.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Productos</h2>
            <div className="space-y-4" role="list" aria-label="Productos del pedido">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0" role="listitem">
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-secondary">Sin imagen</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.product.name}</p>
                    {item.variant && <p className="text-sm text-secondary">{item.variant.name}</p>}
                    <p className="text-sm text-secondary">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">\${(item.unitPrice * item.quantity).toLocaleString()}</p>
                    <p className="text-xs text-secondary">\${item.unitPrice.toLocaleString()} c/u</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Shipping */}
        <div className="space-y-6">
          {/* Total Breakdown */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="complementary" aria-label="Desglose del total">
            <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Resumen</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Subtotal</span>
                <span className="text-foreground">\${order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Envío</span>
                <span className="text-foreground">\${order.shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Impuestos</span>
                <span className="text-foreground">\${order.tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-primary text-lg">\${order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          {order.address && (
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="complementary" aria-label="Dirección de envío">
              <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Dirección de Envío</h2>
              <p className="text-sm text-foreground">{order.address.street}</p>
              <p className="text-sm text-foreground">{order.address.city}, {order.address.state} {order.address.zipCode}</p>
              <p className="text-sm text-foreground">{order.address.country}</p>
            </div>
          )}

          {/* Order Info */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="complementary" aria-label="Información del pedido">
            <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Información</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Fecha</span>
                <span className="text-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Última actualización</span>
                <span className="text-foreground">{new Date(order.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
  }

  // ─── 7. ProductCard Component ──────────────────────────────

  static generateProductCard(): string {
    return `'use client';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  rating: number;
  onAddToCart?: () => void;
  onClick?: () => void;
}

export default function ProductCard({ id, name, price, comparePrice, image, rating, onAddToCart, onClick }: ProductCardProps) {
  const renderStars = (r: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={\`text-sm \${i < r ? 'text-yellow-400' : 'text-gray-300'}\`} aria-hidden="true">★</span>
    ));

  return (
    <div
      className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
      role="article"
      aria-label={\`\${name} - \$\${price.toLocaleString()}\`}
    >
      <div
        className="aspect-square bg-gray-100 cursor-pointer"
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === 'Enter' && onClick) onClick(); }}
        tabIndex={0}
        role="link"
        aria-label={\`Ver detalle de \${name}\`}
      >
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary">Sin imagen</div>
        )}
      </div>
      <div className="p-4">
        <h3
          className="font-medium text-foreground mb-1 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
          onClick={onClick}
        >
          {name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-primary">\${price.toLocaleString()}</span>
          {comparePrice && comparePrice > price && (
            <span className="text-sm text-secondary line-through">\${comparePrice.toLocaleString()}</span>
          )}
        </div>
        <div className="flex items-center gap-1 mb-3" aria-label={\`Calificación: \${rating} de 5\`}>
          {renderStars(rating)}
        </div>
        {onAddToCart && (
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
            className="w-full px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            aria-label={\`Agregar \${name} al carrito\`}
          >
            Agregar al Carrito
          </button>
        )}
      </div>
    </div>
  );
}
`;
  }

  // ─── 8. CartSummary Component ──────────────────────────────

  static generateCartSummary(): string {
    return `'use client';

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function CartSummary({ subtotal, shipping, tax, total }: CartSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="complementary" aria-label="Resumen del pedido">
      <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Resumen del Pedido</h2>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Subtotal</span>
          <span className="text-foreground">\${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Envío</span>
          <span className="text-foreground">{shipping === 0 ? 'Gratis' : \`\$\${shipping.toLocaleString()}\`}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Impuestos (IVA)</span>
          <span className="text-foreground">\${tax.toLocaleString()}</span>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold text-primary text-xl">\${total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
  }

  // ─── 9. QuantitySelector Component ─────────────────────────

  static generateQuantitySelector(): string {
    return `'use client';

import { useState } from 'react';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function QuantitySelector({ value, min = 1, max = 99, onChange, disabled = false }: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseInt(e.target.value, 10);
    if (!isNaN(newVal)) {
      onChange(Math.min(max, Math.max(min, newVal)));
    }
  };

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Selector de cantidad">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Disminuir cantidad"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        className="w-14 h-8 text-center border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        aria-label="Cantidad"
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  );
}
`;
  }

  // ─── 10. CheckoutStepper Component ─────────────────────────

  static generateCheckoutStepper(): string {
    return `'use client';

interface CheckoutStepperProps {
  currentStep: number;
}

const STEPS = [
  { id: 1, label: 'Envío' },
  { id: 2, label: 'Pago' },
  { id: 3, label: 'Confirmación' },
];

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <nav className="flex items-center justify-center" role="navigation" aria-label="Pasos del checkout">
      {STEPS.map((step, idx) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <div key={step.id} className="flex items-center">
            {idx > 0 && (
              <div className={\`w-12 sm:w-24 h-1 mx-2 \${isCompleted ? 'bg-green-500' : 'bg-gray-200'}\`} />
            )}
            <div className="flex flex-col items-center">
              <div
                className={\`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors \${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }\`}
                role="listitem"
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={\`Paso \${step.id}: \${step.label} - \${isCompleted ? 'completado' : isCurrent ? 'actual' : 'pendiente'}\`}
              >
                {isCompleted ? '✓' : step.id}
              </div>
              <span className={\`text-xs mt-1 \${isCurrent ? 'text-primary font-medium' : isCompleted ? 'text-green-600' : 'text-secondary'}\`}>
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
`;
  }

  // ─── 11. OrderStatusBadge Component ────────────────────────

  static generateOrderStatusBadge(): string {
    return `'use client';

interface OrderStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-700',
  },
  paid: {
    label: 'Pagado',
    className: 'bg-blue-100 text-blue-700',
  },
  shipped: {
    label: 'Enviado',
    className: 'bg-purple-100 text-purple-700',
  },
  delivered: {
    label: 'Entregado',
    className: 'bg-green-100 text-green-700',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-700',
  },
};

export default function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-700' };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={\`inline-flex items-center rounded-full font-medium \${config.className} \${sizeClasses[size]}\`}
      role="status"
      aria-label={\`Estado del pedido: \${config.label}\`}
    >
      {config.label}
    </span>
  );
}
`;
  }

  // ─── 12. Advanced Prisma Schema ────────────────────────────

  static generateAdvancedPrismaSchema(params: BuildParameters): string {
    return `// Prisma schema generado por ${params.appName}
// Template: ECOMMERCE_MINI (Avanzado)

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

  cart          Cart?
  orders        Order[]
  addresses     Address[]
}

model Product {
  id            String   @id @default(cuid())
  name          String
  description   String?
  price         Float
  comparePrice  Float?
  images        String[] @default([])
  stock         Int      @default(0)
  status        String   @default("active")
  categoryId    String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  category      Category         @relation(fields: [categoryId], references: [id])
  variants      ProductVariant[]
  cartItems     CartItem[]
  orderItems    OrderItem[]
}

model ProductVariant {
  id        String  @id @default(cuid())
  productId String
  name      String
  sku       String  @unique
  price     Float?
  stock     Int     @default(0)

  product   Product @relation(fields: [productId], references: [id])
}

model Category {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  createdAt DateTime @default(now())

  products  Product[]
}

model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  user      User       @relation(fields: [userId], references: [id])
  items     CartItem[]
}

model CartItem {
  id        String  @id @default(cuid())
  cartId    String
  productId String
  variantId String?
  quantity  Int     @default(1)

  cart      Cart    @relation(fields: [cartId], references: [id])
  product   Product @relation(fields: [productId], references: [id])

  @@unique([cartId, productId, variantId])
}

model Order {
  id            String      @id @default(cuid())
  userId        String
  status        String      @default("pending")
  subtotal      Float
  tax           Float       @default(0)
  shipping      Float       @default(0)
  total         Float
  shippingAddressId String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  user          User        @relation(fields: [userId], references: [id])
  address       Address?    @relation(fields: [shippingAddressId], references: [id])
  items         OrderItem[]
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  variantId String?
  quantity  Int
  unitPrice Float

  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}

model Address {
  id        String  @id @default(cuid())
  userId    String
  street    String
  city      String
  state     String
  zipCode   String
  country   String  @default("MX")
  isDefault Boolean @default(false)

  user      User    @relation(fields: [userId], references: [id])
  orders    Order[]
}
`;
  }

  // ─── 13. API Routes ────────────────────────────────────────

  static generateApiRoutes(params: BuildParameters): ApiRouteFile[] {
    const routes: ApiRouteFile[] = [];

    routes.push({ path: 'src/app/api/products/route.ts', content: EcommerceAdvancedTemplate._productsListRoute() });
    routes.push({ path: 'src/app/api/products/[id]/route.ts', content: EcommerceAdvancedTemplate._productsDetailRoute() });
    routes.push({ path: 'src/app/api/cart/route.ts', content: EcommerceAdvancedTemplate._cartRoute() });
    routes.push({ path: 'src/app/api/cart/[itemId]/route.ts', content: EcommerceAdvancedTemplate._cartItemRoute() });
    routes.push({ path: 'src/app/api/orders/route.ts', content: EcommerceAdvancedTemplate._ordersListRoute() });
    routes.push({ path: 'src/app/api/orders/[id]/route.ts', content: EcommerceAdvancedTemplate._ordersDetailRoute() });

    return routes;
  }

  // ─── Private API Route Generators ──────────────────────────

  private static _productsListRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const createProductSchema = z.object({`,
      `  name: z.string({ required_error: 'El nombre es obligatorio' })`,
      `    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })`,
      `    .max(200, { message: 'El nombre no debe exceder 200 caracteres' }),`,
      `  description: z.string().max(5000, { message: 'La descripción no debe exceder 5000 caracteres' }).optional(),`,
      `  price: z.number({ required_error: 'El precio es obligatorio' })`,
      `    .min(0, { message: 'El precio debe ser mayor o igual a 0' }),`,
      `  comparePrice: z.number().min(0).optional(),`,
      `  images: z.array(z.string()).optional(),`,
      `  stock: z.number().int().min(0, { message: 'El stock debe ser mayor o igual a 0' }).optional(),`,
      `  categoryId: z.string({ required_error: 'La categoría es obligatoria' }),`,
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
      `    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));`,
      `    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));`,
      `    const skip = (page - 1) * limit;`,
      `    const search = searchParams.get('search') || undefined;`,
      `    const categoryId = searchParams.get('categoryId') || undefined;`,
      `    const priceMin = searchParams.get('priceMin');`,
      `    const priceMax = searchParams.get('priceMax');`,
      `    const sortBy = searchParams.get('sortBy') || 'newest';`,
      ``,
      `    const where: any = { status: 'active' };`,
      `    if (search) {`,
      `      where.OR = [`,
      `        { name: { contains: search, mode: 'insensitive' } },`,
      `        { description: { contains: search, mode: 'insensitive' } },`,
      `      ];`,
      `    }`,
      `    if (categoryId) where.categoryId = categoryId;`,
      `    if (priceMin) where.price = { ...where.price, gte: parseFloat(priceMin) };`,
      `    if (priceMax) where.price = { ...where.price, lte: parseFloat(priceMax) };`,
      ``,
      `    const orderByMap: Record<string, any> = {`,
      `      newest: { createdAt: 'desc' },`,
      `      price_asc: { price: 'asc' },`,
      `      price_desc: { price: 'desc' },`,
      `      name_asc: { name: 'asc' },`,
      `      name_desc: { name: 'desc' },`,
      `    };`,
      `    const orderBy = orderByMap[sortBy] || orderByMap.newest;`,
      ``,
      `    const total = await prisma.product.count({ where });`,
      `    const products = await prisma.product.findMany({`,
      `      where,`,
      `      skip,`,
      `      take: limit,`,
      `      orderBy,`,
      `      include: { category: true, variants: true },`,
      `    });`,
      ``,
      `    const totalPages = Math.ceil(total / limit);`,
      ``,
      `    return NextResponse.json({`,
      `      products,`,
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
      `    const body = await request.json();`,
      `    const datos = createProductSchema.parse(body);`,
      ``,
      `    const product = await prisma.product.create({`,
      `      data: {`,
      `        name: datos.name,`,
      `        description: datos.description || null,`,
      `        price: datos.price,`,
      `        comparePrice: datos.comparePrice || null,`,
      `        images: datos.images || [],`,
      `        stock: datos.stock ?? 0,`,
      `        categoryId: datos.categoryId,`,
      `      },`,
      `    });`,
      ``,
      `    return NextResponse.json({ product }, { status: 201 });`,
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

  private static _productsDetailRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {`,
      `  const params = await props.params;`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json(`,
      `        { error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' },`,
      `        { status: 401 }`,
      `      );`,
      `    }`,
      ``,
      `    const product = await prisma.product.findUnique({`,
      `      where: { id: params.id },`,
      `      include: {`,
      `        category: true,`,
      `        variants: true,`,
      `      },`,
      `    });`,
      ``,
      `    if (!product) {`,
      `      return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 });`,
      `    }`,
      ``,
      `    // Fetch related products from same category`,
      `    const relatedProducts = await prisma.product.findMany({`,
      `      where: {`,
      `        categoryId: product.categoryId,`,
      `        id: { not: product.id },`,
      `        status: 'active',`,
      `      },`,
      `      take: 4,`,
      `      orderBy: { createdAt: 'desc' },`,
      `    });`,
      ``,
      `    return NextResponse.json({ product, relatedProducts });`,
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

  private static _cartRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const addToCartSchema = z.object({`,
      `  productId: z.string({ required_error: 'El producto es obligatorio' }),`,
      `  variantId: z.string().optional(),`,
      `  quantity: z.number({ required_error: 'La cantidad es obligatoria' })`,
      `    .int({ message: 'La cantidad debe ser un número entero' })`,
      `    .min(1, { message: 'La cantidad mínima es 1' }),`,
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
      ``,
      `    let cart = await prisma.cart.findUnique({`,
      `      where: { userId },`,
      `      include: {`,
      `        items: {`,
      `          include: {`,
      `            product: { select: { id: true, name: true, price: true, images: true, stock: true } },`,
      `          },`,
      `        },`,
      `      },`,
      `    });`,
      ``,
      `    if (!cart) {`,
      `      cart = await prisma.cart.create({`,
      `        data: { userId },`,
      `        include: {`,
      `          items: {`,
      `            include: {`,
      `              product: { select: { id: true, name: true, price: true, images: true, stock: true } },`,
      `            },`,
      `          },`,
      `        },`,
      `      });`,
      `    }`,
      ``,
      `    return NextResponse.json({ cart });`,
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
      `    const datos = addToCartSchema.parse(body);`,
      ``,
      `    // Validate product exists and has stock`,
      `    const product = await prisma.product.findUnique({`,
      `      where: { id: datos.productId },`,
      `    });`,
      `    if (!product) {`,
      `      return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 });`,
      `    }`,
      `    if (product.stock < datos.quantity) {`,
      `      return NextResponse.json(`,
      `        { error: 'Stock insuficiente. Disponible: ' + product.stock },`,
      `        { status: 400 }`,
      `      );`,
      `    }`,
      ``,
      `    // Get or create cart`,
      `    let cart = await prisma.cart.findUnique({ where: { userId } });`,
      `    if (!cart) {`,
      `      cart = await prisma.cart.create({ data: { userId } });`,
      `    }`,
      ``,
      `    // Check if item already in cart`,
      `    const existingItem = await prisma.cartItem.findFirst({`,
      `      where: {`,
      `        cartId: cart.id,`,
      `        productId: datos.productId,`,
      `        variantId: datos.variantId || null,`,
      `      },`,
      `    });`,
      ``,
      `    let cartItem;`,
      `    if (existingItem) {`,
      `      cartItem = await prisma.cartItem.update({`,
      `        where: { id: existingItem.id },`,
      `        data: { quantity: existingItem.quantity + datos.quantity },`,
      `      });`,
      `    } else {`,
      `      cartItem = await prisma.cartItem.create({`,
      `        data: {`,
      `          cartId: cart.id,`,
      `          productId: datos.productId,`,
      `          variantId: datos.variantId || null,`,
      `          quantity: datos.quantity,`,
      `        },`,
      `      });`,
      `    }`,
      ``,
      `    return NextResponse.json({ cartItem }, { status: 201 });`,
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

  private static _cartItemRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const updateCartItemSchema = z.object({`,
      `  quantity: z.number({ required_error: 'La cantidad es obligatoria' })`,
      `    .int({ message: 'La cantidad debe ser un número entero' })`,
      `    .min(1, { message: 'La cantidad mínima es 1' }),`,
      `});`,
      ``,
      `export async function PUT(request: NextRequest, props: { params: Promise<{ itemId: string }> }) {`,
      `  const params = await props.params;`,
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
      `    const datos = updateCartItemSchema.parse(body);`,
      ``,
      `    const cartItem = await prisma.cartItem.findUnique({`,
      `      where: { id: params.itemId },`,
      `      include: { cart: true },`,
      `    });`,
      ``,
      `    if (!cartItem) {`,
      `      return NextResponse.json({ error: 'Elemento del carrito no encontrado.' }, { status: 404 });`,
      `    }`,
      ``,
      `    if (cartItem.cart.userId !== userId) {`,
      `      return NextResponse.json(`,
      `        { error: 'No tiene permisos para modificar este carrito.' },`,
      `        { status: 403 }`,
      `      );`,
      `    }`,
      ``,
      `    const updated = await prisma.cartItem.update({`,
      `      where: { id: params.itemId },`,
      `      data: { quantity: datos.quantity },`,
      `    });`,
      ``,
      `    return NextResponse.json({ cartItem: updated });`,
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
      `export async function DELETE(request: NextRequest, props: { params: Promise<{ itemId: string }> }) {`,
      `  const params = await props.params;`,
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
      `    const cartItem = await prisma.cartItem.findUnique({`,
      `      where: { id: params.itemId },`,
      `      include: { cart: true },`,
      `    });`,
      ``,
      `    if (!cartItem) {`,
      `      return NextResponse.json({ error: 'Elemento del carrito no encontrado.' }, { status: 404 });`,
      `    }`,
      ``,
      `    if (cartItem.cart.userId !== userId) {`,
      `      return NextResponse.json(`,
      `        { error: 'No tiene permisos para modificar este carrito.' },`,
      `        { status: 403 }`,
      `      );`,
      `    }`,
      ``,
      `    await prisma.cartItem.delete({ where: { id: params.itemId } });`,
      ``,
      `    return NextResponse.json({ message: 'Producto eliminado del carrito.' });`,
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

  private static _ordersListRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const createOrderSchema = z.object({`,
      `  shippingAddress: z.object({`,
      `    street: z.string({ required_error: 'La calle es obligatoria' }).min(1, { message: 'La calle es obligatoria' }),`,
      `    city: z.string({ required_error: 'La ciudad es obligatoria' }).min(1, { message: 'La ciudad es obligatoria' }),`,
      `    state: z.string({ required_error: 'El estado es obligatorio' }).min(1, { message: 'El estado es obligatorio' }),`,
      `    zipCode: z.string({ required_error: 'El código postal es obligatorio' }).min(1, { message: 'El código postal es obligatorio' }),`,
      `    country: z.string({ required_error: 'El país es obligatorio' }).min(1, { message: 'El país es obligatorio' }),`,
      `  }),`,
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
      `    const dateFrom = searchParams.get('dateFrom') || undefined;`,
      `    const dateTo = searchParams.get('dateTo') || undefined;`,
      ``,
      `    const where: any = { userId };`,
      `    if (status) where.status = status;`,
      `    if (dateFrom || dateTo) {`,
      `      where.createdAt = {};`,
      `      if (dateFrom) where.createdAt.gte = new Date(dateFrom);`,
      `      if (dateTo) where.createdAt.lte = new Date(dateTo + 'T23:59:59.999Z');`,
      `    }`,
      ``,
      `    const total = await prisma.order.count({ where });`,
      `    const orders = await prisma.order.findMany({`,
      `      where,`,
      `      skip,`,
      `      take: limit,`,
      `      orderBy: { createdAt: 'desc' },`,
      `      include: {`,
      `        items: {`,
      `          include: { product: { select: { name: true } } },`,
      `        },`,
      `      },`,
      `    });`,
      ``,
      `    const totalPages = Math.ceil(total / limit);`,
      ``,
      `    return NextResponse.json({`,
      `      orders,`,
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
      `    const datos = createOrderSchema.parse(body);`,
      ``,
      `    // Get user cart`,
      `    const cart = await prisma.cart.findUnique({`,
      `      where: { userId },`,
      `      include: {`,
      `        items: {`,
      `          include: { product: true },`,
      `        },`,
      `      },`,
      `    });`,
      ``,
      `    if (!cart || cart.items.length === 0) {`,
      `      return NextResponse.json(`,
      `        { error: 'El carrito está vacío. Agregue productos antes de crear un pedido.' },`,
      `        { status: 400 }`,
      `      );`,
      `    }`,
      ``,
      `    // Validate stock for all items`,
      `    for (const item of cart.items) {`,
      `      if (item.product.stock < item.quantity) {`,
      `        return NextResponse.json(`,
      `          { error: \`Stock insuficiente para "\${item.product.name}". Disponible: \${item.product.stock}\` },`,
      `          { status: 400 }`,
      `        );`,
      `      }`,
      `    }`,
      ``,
      `    // Calculate totals`,
      `    const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);`,
      `    const shippingCost = subtotal > 500 ? 0 : 99;`,
      `    const tax = Math.round(subtotal * 0.16 * 100) / 100;`,
      `    const total = subtotal + shippingCost + tax;`,
      ``,
      `    // Create address`,
      `    const address = await prisma.address.create({`,
      `      data: {`,
      `        userId,`,
      `        street: datos.shippingAddress.street,`,
      `        city: datos.shippingAddress.city,`,
      `        state: datos.shippingAddress.state,`,
      `        zipCode: datos.shippingAddress.zipCode,`,
      `        country: datos.shippingAddress.country,`,
      `      },`,
      `    });`,
      ``,
      `    // Create order with items`,
      `    const order = await prisma.order.create({`,
      `      data: {`,
      `        userId,`,
      `        status: 'pending',`,
      `        subtotal,`,
      `        tax,`,
      `        shipping: shippingCost,`,
      `        total,`,
      `        shippingAddressId: address.id,`,
      `        items: {`,
      `          create: cart.items.map((item) => ({`,
      `            productId: item.productId,`,
      `            variantId: item.variantId,`,
      `            quantity: item.quantity,`,
      `            unitPrice: item.product.price,`,
      `          })),`,
      `        },`,
      `      },`,
      `      include: { items: true },`,
      `    });`,
      ``,
      `    // Update stock`,
      `    for (const item of cart.items) {`,
      `      await prisma.product.update({`,
      `        where: { id: item.productId },`,
      `        data: { stock: { decrement: item.quantity } },`,
      `      });`,
      `    }`,
      ``,
      `    // Clear cart`,
      `    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });`,
      ``,
      `    return NextResponse.json({ order }, { status: 201 });`,
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

  private static _ordersDetailRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const updateOrderStatusSchema = z.object({`,
      `  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled'], {`,
      `    required_error: 'El estado es obligatorio',`,
      `    invalid_type_error: 'Estado no válido. Valores permitidos: pending, paid, shipped, delivered, cancelled',`,
      `  }),`,
      `});`,
      ``,
      `export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {`,
      `  const params = await props.params;`,
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
      `    const order = await prisma.order.findUnique({`,
      `      where: { id: params.id },`,
      `      include: {`,
      `        items: {`,
      `          include: {`,
      `            product: { select: { id: true, name: true, images: true } },`,
      `          },`,
      `        },`,
      `        address: true,`,
      `      },`,
      `    });`,
      ``,
      `    if (!order) {`,
      `      return NextResponse.json({ error: 'Pedido no encontrado.' }, { status: 404 });`,
      `    }`,
      ``,
      `    if (order.userId !== userId) {`,
      `      return NextResponse.json(`,
      `        { error: 'No tiene permisos para ver este pedido.' },`,
      `        { status: 403 }`,
      `      );`,
      `    }`,
      ``,
      `    return NextResponse.json({ order });`,
      `  } catch (error) {`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json(`,
      `      { error: 'Error interno del servidor. Intente nuevamente más tarde.' },`,
      `      { status: 500 }`,
      `    );`,
      `  }`,
      `}`,
      ``,
      `export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {`,
      `  const params = await props.params;`,
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
      `    const datos = updateOrderStatusSchema.parse(body);`,
      ``,
      `    const order = await prisma.order.findUnique({ where: { id: params.id } });`,
      `    if (!order) {`,
      `      return NextResponse.json({ error: 'Pedido no encontrado.' }, { status: 404 });`,
      `    }`,
      ``,
      `    if (order.userId !== userId) {`,
      `      return NextResponse.json(`,
      `        { error: 'No tiene permisos para modificar este pedido.' },`,
      `        { status: 403 }`,
      `      );`,
      `    }`,
      ``,
      `    const updated = await prisma.order.update({`,
      `      where: { id: params.id },`,
      `      data: { status: datos.status },`,
      `    });`,
      ``,
      `    return NextResponse.json({ order: updated });`,
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
}

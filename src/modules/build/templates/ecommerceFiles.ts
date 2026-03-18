// Template generators for E-commerce Mini files

import { BuildParameters } from '../types';

export class EcommerceGenerator {
  /**
   * Generate prisma/schema.prisma for E-commerce Mini
   */
  static generatePrismaSchema(params: BuildParameters): string {
    return `// Prisma schema for ${params.appName} - E-commerce Mini

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id       String    @id @default(uuid())
  email    String    @unique
  name     String?
  password String
  role     String    @default("customer")
  CartItem CartItem[]
  Order    Order[]
}

model Product {
  id          String     @id @default(uuid())
  name        String
  description String
  price       Float
  imageUrl    String?
  stock       Int        @default(0)
  category    String
  CartItem    CartItem[]
  OrderItem   OrderItem[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model CartItem {
  id        String  @id @default(uuid())
  userId    String
  productId String
  quantity  Int     @default(1)
  User      User    @relation(fields: [userId], references: [id])
  Product   Product @relation(fields: [productId], references: [id])
  @@unique([userId, productId])
}

model Order {
  id        String      @id @default(uuid())
  userId    String
  status    OrderStatus @default(PENDING)
  total     Float
  User      User        @relation(fields: [userId], references: [id])
  OrderItem OrderItem[]
  createdAt DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  productId String
  quantity  Int
  price     Float
  Order     Order   @relation(fields: [orderId], references: [id])
  Product   Product @relation(fields: [productId], references: [id])
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}
`;
  }

  /**
   * Generate src/app/api/products/route.ts - Products CRUD
   */
  static generateProductsRoute(params: BuildParameters): string {
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
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (category) {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
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
    const { name, description, price, imageUrl, stock, category } = body;

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Nombre, descripción, precio y categoría son obligatorios' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl: imageUrl || null,
        stock: parseInt(stock) || 0,
        category,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
  }

  /**
   * Generate src/app/api/products/[id]/route.ts - Single product CRUD
   */
  static generateProductIdRoute(params: BuildParameters): string {
    return `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(product);
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
    const { name, description, price, imageUrl, stock, category } = body;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(category && { category }),
      },
    });

    return NextResponse.json(product);
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

    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Producto eliminado' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
  }

  /**
   * Generate src/app/api/cart/route.ts - Cart management
   */
  static generateCartRoute(params: BuildParameters): string {
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

    const userId = (session.user as any).id;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { Product: true },
      orderBy: { Product: { name: 'asc' } },
    });

    const total = cartItems.reduce(
      (sum, item) => sum + item.Product.price * item.quantity,
      0
    );

    return NextResponse.json({ items: cartItems, total });
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

    const userId = (session.user as any).id;
    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId) {
      return NextResponse.json({ error: 'productId es obligatorio' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    if (product.stock < (quantity || 1)) {
      return NextResponse.json({ error: 'Stock insuficiente' }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity: { increment: quantity || 1 } },
      create: { userId, productId, quantity: quantity || 1 },
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (productId) {
      await prisma.cartItem.deleteMany({ where: { userId, productId } });
    } else {
      await prisma.cartItem.deleteMany({ where: { userId } });
    }

    return NextResponse.json({ message: 'Carrito actualizado' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
  }

  /**
   * Generate src/app/api/orders/route.ts - Orders management
   */
  static generateOrdersRoute(params: BuildParameters): string {
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

    const userId = (session.user as any).id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        OrderItem: {
          include: { Product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
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

    const userId = (session.user as any).id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { Product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    for (const item of cartItems) {
      if (item.Product.stock < item.quantity) {
        return NextResponse.json(
          { error: \`Stock insuficiente para \${item.Product.name}\` },
          { status: 400 }
        );
      }
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.Product.price * item.quantity,
      0
    );

    const order = await prisma.\$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: 'PENDING',
          OrderItem: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.Product.price,
            })),
          },
        },
        include: { OrderItem: { include: { Product: true } } },
      });

      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { userId } });

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
  }
  /**
   * Generate src/app/(dashboard)/dashboard/catalog/page.tsx - Product catalog page
   */
  static generateCatalogPage(params: BuildParameters): string {
    return `'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  category: string;
  createdAt: string;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (category) queryParams.set('category', category);
      if (search) queryParams.set('q', search);

      const res = await fetch(\`/api/products?\${queryParams}\`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const addToCart = async (productId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.ok) {
        alert('Producto agregado al carrito');
      } else {
        const data = await res.json();
        alert(data.error || 'Error al agregar al carrito');
      }
    } catch (error) {
      alert('Error al agregar al carrito');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Catálogo de Productos</h1>
        <Link
          href="/dashboard/cart"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
        >
          🛒 Ver Carrito
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar productos..."
          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-150"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
        >
          Buscar
        </button>
      </form>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando productos...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No se encontraron productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-lg transition-all duration-200"
            >
              <div className="h-48 bg-gray-700/50 flex items-center justify-center">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl">📦</span>
                )}
              </div>
              <div className="p-4">
                <Link href={\`/dashboard/catalog/\${product.id}\`}>
                  <h3 className="text-lg font-semibold text-white hover:text-purple-400 transition-colors">{product.name}</h3>
                </Link>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-purple-400">\${product.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">{product.stock > 0 ? \`\${product.stock} en stock\` : 'Agotado'}</span>
                </div>
                <button
                  onClick={() => addToCart(product.id)}
                  disabled={product.stock === 0}
                  className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
`;
  }

  /**
   * Generate src/app/(dashboard)/dashboard/catalog/[id]/page.tsx - Product detail page
   */
  static generateProductDetailPage(params: BuildParameters): string {
    return `'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  category: string;
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(\`/api/products/\${params.id}\`);
        if (!res.ok) throw new Error('No encontrado');
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Error al cargar producto:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const addToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      if (res.ok) {
        alert('Producto agregado al carrito');
      } else {
        const data = await res.json();
        alert(data.error || 'Error al agregar al carrito');
      }
    } catch (error) {
      alert('Error al agregar al carrito');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Cargando...</div>;
  }

  if (!product) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400 text-lg">Producto no encontrado</p>
        <Link href="/dashboard/catalog" className="mt-4 inline-block text-purple-400 hover:text-purple-300">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/dashboard/catalog" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">
        ← Volver al catálogo
      </Link>

      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="h-64 bg-gray-700/50 flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-6xl">📦</span>
          )}
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                {product.category}
              </span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-purple-400">\${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">
                {product.stock > 0 ? \`\${product.stock} disponibles\` : 'Agotado'}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-3">Descripción</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{product.description}</p>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-gray-400 text-sm">Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  className="w-20 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-center focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <button
                onClick={addToCart}
                disabled={adding}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                {adding ? 'Agregando...' : 'Agregar al Carrito'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`;
  }

  /**
   * Generate src/app/(dashboard)/dashboard/cart/page.tsx - Shopping cart page
   */
  static generateCartPage(params: BuildParameters): string {
    return `'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  Product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    stock: number;
  };
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error al cargar carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await fetch(\`/api/cart?productId=\${productId}\`, { method: 'DELETE' });
      fetchCart();
    } catch (error) {
      alert('Error al eliminar del carrito');
    }
  };

  const clearCart = async () => {
    try {
      await fetch('/api/cart', { method: 'DELETE' });
      fetchCart();
    } catch (error) {
      alert('Error al vaciar el carrito');
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Cargando carrito...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Tu Carrito</h1>
        <Link
          href="/dashboard/catalog"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          ← Seguir comprando
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🛒</p>
          <p className="text-gray-400 text-lg mb-4">Tu carrito está vacío</p>
          <Link
            href="/dashboard/catalog"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
          >
            Explorar Catálogo
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-gray-800/50 border border-gray-700 rounded-xl p-4"
              >
                <div className="w-16 h-16 bg-gray-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.Product.imageUrl ? (
                    <img src={item.Product.imageUrl} alt={item.Product.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{item.Product.name}</h3>
                  <p className="text-gray-500 text-sm">Cantidad: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-purple-400 font-semibold">\${(item.Product.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-400 hover:text-red-300 text-sm mt-1 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400">Total</span>
              <span className="text-2xl font-bold text-white">\${total.toFixed(2)}</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors duration-200"
              >
                Vaciar Carrito
              </button>
              <Link
                href="/dashboard/checkout"
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 text-center"
              >
                Proceder al Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
`;
  }

  /**
   * Generate src/app/(dashboard)/dashboard/checkout/page.tsx - Checkout page
   */
  static generateCheckoutPage(params: BuildParameters): string {
    return `'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  Product: {
    id: string;
    name: string;
    price: number;
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart');
        const data = await res.json();
        setItems(data.items || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error('Error al cargar carrito:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    setProcessing(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al procesar la orden');
        return;
      }

      alert('¡Orden creada con éxito!');
      router.push('/dashboard/orders');
    } catch (err) {
      setError('Error al procesar la orden');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Cargando checkout...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400 text-lg mb-4">Tu carrito está vacío</p>
        <Link
          href="/dashboard/catalog"
          className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
        >
          Ir al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href="/dashboard/cart" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">
        ← Volver al carrito
      </Link>

      <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Resumen del Pedido</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span className="text-gray-300">
                {item.Product.name} × {item.quantity}
              </span>
              <span className="text-gray-400">\${(item.Product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 mt-4 pt-4 flex justify-between items-center">
          <span className="text-white font-semibold">Total</span>
          <span className="text-2xl font-bold text-purple-400">\${total.toFixed(2)}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={processing}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 text-lg"
      >
        {processing ? 'Procesando...' : 'Confirmar Pedido'}
      </button>

      <p className="text-gray-500 text-sm text-center mt-4">
        Al confirmar, se creará tu orden y se descontará el stock de los productos.
      </p>
    </div>
  );
}
`;
  }
}

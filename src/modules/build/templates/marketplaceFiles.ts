// Template generators for Marketplace Mini files

import { BuildParameters } from '../types';

export class MarketplaceGenerator {
  /**
   * Generate prisma/schema.prisma for Marketplace Mini
   */
  static generatePrismaSchema(params: BuildParameters): string {
    return `// Prisma schema for ${params.appName} - Marketplace Mini

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String        @id @default(uuid())
  email       String        @unique
  name        String?
  password    String
  role        UserRole      @default(BUYER)
  Listing     Listing[]
  Transaction Transaction[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Listing {
  id          String        @id @default(uuid())
  title       String
  description String
  price       Float
  category    String
  status      ListingStatus @default(ACTIVE)
  sellerId    String
  Seller      User          @relation(fields: [sellerId], references: [id])
  Transaction Transaction[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Category {
  id   String @id @default(uuid())
  name String @unique
  slug String @unique
}

model Transaction {
  id        String            @id @default(uuid())
  listingId String
  buyerId   String
  status    TransactionStatus @default(PENDING)
  amount    Float
  Listing   Listing           @relation(fields: [listingId], references: [id])
  Buyer     User              @relation(fields: [buyerId], references: [id])
  createdAt DateTime          @default(now())
}

enum UserRole {
  BUYER
  SELLER
  ADMIN
}

enum ListingStatus {
  ACTIVE
  SOLD
  INACTIVE
}

enum TransactionStatus {
  PENDING
  COMPLETED
  CANCELLED
}
`;
  }

  /**
   * Generate src/app/api/listings/route.ts - CRUD for listings
   */
  static generateListingsRoute(params: BuildParameters): string {
    return `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'ACTIVE';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status };
    if (category) {
      where.category = category;
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: { Seller: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
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
    const { title, description, price, category } = body;

    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        sellerId: (session.user as any).id,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
  }

  /**
   * Generate src/app/api/listings/[id]/route.ts - Single listing CRUD
   */
  static generateListingIdRoute(params: BuildParameters): string {
    return `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        Seller: { select: { id: true, name: true, email: true } },
        Transaction: true,
      },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listado no encontrado' }, { status: 404 });
    }

    return NextResponse.json(listing);
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

    const listing = await prisma.listing.findUnique({ where: { id: params.id } });
    if (!listing) {
      return NextResponse.json({ error: 'Listado no encontrado' }, { status: 404 });
    }
    if (listing.sellerId !== (session.user as any).id) {
      return NextResponse.json({ error: 'No tienes permiso para editar este listado' }, { status: 403 });
    }

    const body = await request.json();
    const updated = await prisma.listing.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updated);
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

    const listing = await prisma.listing.findUnique({ where: { id: params.id } });
    if (!listing) {
      return NextResponse.json({ error: 'Listado no encontrado' }, { status: 404 });
    }
    if (listing.sellerId !== (session.user as any).id) {
      return NextResponse.json({ error: 'No tienes permiso para eliminar este listado' }, { status: 403 });
    }

    await prisma.listing.delete({ where: { id: params.id } });

    return NextResponse.json({ message: 'Listado eliminado correctamente' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
  }

  /**
   * Generate src/app/api/listings/search/route.ts - Search and filter
   */
  static generateSearchRoute(params: BuildParameters): string {
    return `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: 'ACTIVE' };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, unknown>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, unknown>).lte = parseFloat(maxPrice);
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: { Seller: { select: { id: true, name: true } } },
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
  }

  /**
   * Generate src/app/api/transactions/route.ts - Transaction management
   */
  static generateTransactionsRoute(params: BuildParameters): string {
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
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'buyer';

    const where = role === 'seller'
      ? { Listing: { sellerId: userId } }
      : { buyerId: userId };

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        Listing: { select: { id: true, title: true, price: true } },
        Buyer: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ transactions });
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
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json({ error: 'Se requiere el ID del listado' }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      return NextResponse.json({ error: 'Listado no encontrado' }, { status: 404 });
    }
    if (listing.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Este listado ya no está disponible' }, { status: 400 });
    }

    const buyerId = (session.user as any).id;
    if (listing.sellerId === buyerId) {
      return NextResponse.json({ error: 'No puedes comprar tu propio listado' }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        listingId,
        buyerId,
        amount: listing.price,
      },
    });

    await prisma.listing.update({
      where: { id: listingId },
      data: { status: 'SOLD' },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
  }

  /**
   * Generate src/app/(dashboard)/dashboard/listings/page.tsx - Listings browse page
   */
  static generateListingsPage(params: BuildParameters): string {
    return `'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: string;
  createdAt: string;
  Seller: { id: string; name: string | null };
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchListings();
  }, [category]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (category) queryParams.set('category', category);
      if (search) queryParams.set('q', search);

      const res = await fetch(\`/api/listings/search?\${queryParams}\`);
      const data = await res.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error('Error al cargar listados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Explorar Listados</h1>
        <Link
          href="/dashboard/listings/publish"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
        >
          Publicar Listado
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar listados..."
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
        <div className="text-center py-12 text-gray-400">Cargando listados...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No se encontraron listados</p>
          <Link
            href="/dashboard/listings/publish"
            className="mt-4 inline-block text-purple-400 hover:text-purple-300"
          >
            Publica el primero
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={\`/dashboard/listings/\${listing.id}\`}
              className="block bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-white truncate">{listing.title}</h3>
                <span className="text-purple-400 font-bold">\${listing.price.toFixed(2)}</span>
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{listing.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{listing.category}</span>
                <span className="text-gray-500">{listing.Seller?.name || 'Vendedor'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
`;
  }

  /**
   * Generate src/app/(dashboard)/dashboard/listings/[id]/page.tsx - Listing detail page
   */
  static generateListingDetailPage(params: BuildParameters): string {
    return `'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: string;
  createdAt: string;
  Seller: { id: string; name: string | null; email: string };
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(\`/api/listings/\${params.id}\`);
        if (!res.ok) throw new Error('No encontrado');
        const data = await res.json();
        setListing(data);
      } catch (error) {
        console.error('Error al cargar listado:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);

  const handlePurchase = async () => {
    if (!listing) return;
    setPurchasing(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Error al procesar la compra');
        return;
      }
      alert('¡Compra realizada con éxito!');
      router.push('/dashboard/transactions');
    } catch (error) {
      alert('Error al procesar la compra');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Cargando...</div>;
  }

  if (!listing) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400 text-lg">Listado no encontrado</p>
        <Link href="/dashboard/listings" className="mt-4 inline-block text-purple-400 hover:text-purple-300">
          Volver a listados
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/dashboard/listings" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">
        ← Volver a listados
      </Link>

      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{listing.title}</h1>
            <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
              {listing.category}
            </span>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-purple-400">\${listing.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">
              {listing.status === 'ACTIVE' ? 'Disponible' : listing.status === 'SOLD' ? 'Vendido' : 'Inactivo'}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">Descripción</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
        </div>

        <div className="mb-8 p-4 bg-gray-900/50 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-2">Vendedor</h2>
          <p className="text-gray-300">{listing.Seller?.name || 'Vendedor anónimo'}</p>
          <p className="text-gray-500 text-sm">{listing.Seller?.email}</p>
        </div>

        <div className="flex gap-4">
          {listing.status === 'ACTIVE' && (
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              {purchasing ? 'Procesando...' : 'Comprar Ahora'}
            </button>
          )}
          <Link
            href="/dashboard/listings"
            className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors duration-200 text-center"
          >
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
}
`;
  }

  /**
   * Generate src/app/(dashboard)/dashboard/listings/publish/page.tsx - Publish listing page
   */
  static generatePublishListingPage(params: BuildParameters): string {
    return `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CATEGORIES = [
  'Tecnología', 'Hogar', 'Moda', 'Deportes', 'Vehículos',
  'Servicios', 'Educación', 'Arte', 'Otros',
];

export default function PublishListingPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, price, category }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al publicar el listado');
        return;
      }

      router.push('/dashboard/listings');
    } catch (err) {
      setError('Error al publicar el listado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href="/dashboard/listings" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">
        ← Volver a listados
      </Link>

      <h1 className="text-3xl font-bold text-white mb-8">Publicar Nuevo Listado</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Título
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-150"
            placeholder="Nombre de tu producto o servicio"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-150 min-h-[120px]"
            placeholder="Describe tu producto o servicio en detalle"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
            Precio (USD)
          </label>
          <input
            id="price"
            type="number"
            required
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-150"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
            Categoría
          </label>
          <select
            id="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-150"
          >
            <option value="">Selecciona una categoría</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Publicando...' : 'Publicar Listado'}
          </button>
          <Link
            href="/dashboard/listings"
            className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors duration-200 text-center"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
`;
  }

  /**
   * Generate src/app/(dashboard)/dashboard/seller/page.tsx - Seller dashboard page
   */
  static generateSellerDashboardPage(params: BuildParameters): string {
    return `'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  price: number;
  status: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  Listing: { id: string; title: string };
  Buyer: { id: string; name: string | null };
}

export default function SellerDashboardPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, transactionsRes] = await Promise.all([
          fetch('/api/listings?status=ALL'),
          fetch('/api/transactions?role=seller'),
        ]);
        const listingsData = await listingsRes.json();
        const transactionsData = await transactionsRes.json();
        setListings(listingsData.listings || []);
        setTransactions(transactionsData.transactions || []);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = transactions
    .filter((t) => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);

  const activeListings = listings.filter((l) => l.status === 'ACTIVE').length;
  const soldListings = listings.filter((l) => l.status === 'SOLD').length;

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Cargando panel de vendedor...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Panel de Vendedor</h1>
        <Link
          href="/dashboard/listings/publish"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
        >
          Nuevo Listado
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Listados Activos</p>
          <p className="text-3xl font-bold text-white">{activeListings}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Vendidos</p>
          <p className="text-3xl font-bold text-green-400">{soldListings}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Ingresos Totales</p>
          <p className="text-3xl font-bold text-purple-400">\${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Mis Listados</h2>
        {listings.length === 0 ? (
          <p className="text-gray-400">No tienes listados aún.</p>
        ) : (
          <div className="space-y-3">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={\`/dashboard/listings/\${listing.id}\`}
                className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-200"
              >
                <div>
                  <h3 className="text-white font-medium">{listing.title}</h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(listing.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-purple-400 font-semibold">\${listing.price.toFixed(2)}</p>
                  <span className={\`text-xs px-2 py-1 rounded-full \${
                    listing.status === 'ACTIVE'
                      ? 'bg-green-500/20 text-green-400'
                      : listing.status === 'SOLD'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }\`}>
                    {listing.status === 'ACTIVE' ? 'Activo' : listing.status === 'SOLD' ? 'Vendido' : 'Inactivo'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Transacciones Recientes</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-400">No hay transacciones aún.</p>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 10).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-xl p-4"
              >
                <div>
                  <h3 className="text-white font-medium">{tx.Listing?.title}</h3>
                  <p className="text-gray-500 text-sm">
                    Comprador: {tx.Buyer?.name || 'Anónimo'} · {new Date(tx.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">\${tx.amount.toFixed(2)}</p>
                  <span className={\`text-xs px-2 py-1 rounded-full \${
                    tx.status === 'COMPLETED'
                      ? 'bg-green-500/20 text-green-400'
                      : tx.status === 'PENDING'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }\`}>
                    {tx.status === 'COMPLETED' ? 'Completada' : tx.status === 'PENDING' ? 'Pendiente' : 'Cancelada'}
                  </span>
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
}

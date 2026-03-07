import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Sidebar from '@/components/layout/Sidebar';
import dynamic from 'next/dynamic';

// Dynamically import client component to avoid SSR issues
const FloatingAssistantWidget = dynamic(
  () => import('@/components/assistant/FloatingAssistantWidget'),
  { ssr: false }
);

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <FloatingAssistantWidget />
    </div>
  );
}

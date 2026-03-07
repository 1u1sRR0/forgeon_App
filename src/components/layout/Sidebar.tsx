'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Lightbulb,
  TrendingUp,
  BookOpen,
  MessageCircle,
  User,
  LogOut,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    {
      name: 'Discover',
      icon: Lightbulb,
      children: [
        { name: 'Opportunities', href: '/dashboard/discover/opportunities' },
        { name: 'Market Gaps', href: '/dashboard/discover/gaps' },
      ],
    },
    { name: 'Learn', href: '/dashboard/learn', icon: BookOpen },
    { name: 'Assistant', href: '/dashboard/assistant', icon: MessageCircle },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  const isParentActive = (children: any[]) => {
    return children.some((child) => pathname?.startsWith(child.href));
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Forgeon</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;

          if (item.children) {
            const parentActive = isParentActive(item.children);
            return (
              <div key={item.name}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    parentActive ? 'text-purple-400' : 'text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => {
                    const active = isActive(child.href);
                    return (
                      <button
                        key={child.name}
                        onClick={() => router.push(child.href)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm ${
                          active
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        {child.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }

          const active = isActive(item.href!);
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href!)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <button
          onClick={() => router.push('/dashboard/profile')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Profile</span>
        </button>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

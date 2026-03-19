'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Lightbulb,
  TrendingUp,
  BookOpen,
  MessageCircle,
  User,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, onboardingKey: undefined },
    { name: 'Proyectos', href: '/dashboard/projects', icon: FolderKanban, onboardingKey: 'projects' },
    { name: 'Generar', href: '/dashboard/generate', icon: Sparkles, onboardingKey: 'generate' },
    {
      name: 'Descubrir',
      icon: Lightbulb,
      onboardingKey: 'discover',
      children: [
        { name: 'Oportunidades', href: '/dashboard/discover/opportunities' },
        { name: 'Brechas de Mercado', href: '/dashboard/discover/gaps' },
      ],
    },
    { name: 'Inteligencia', href: '/dashboard/market-intelligence', icon: TrendingUp, onboardingKey: 'evaluation' },
    { name: 'Aprender', href: '/dashboard/learn', icon: BookOpen, onboardingKey: 'learn' },
    { name: 'Asistente', href: '/dashboard/assistant', icon: MessageCircle, onboardingKey: 'assistant' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname?.startsWith(href);
  };

  const isParentActive = (children: { href: string }[]) => {
    return children.some((child) => pathname?.startsWith(child.href));
  };

  return (
    <div
      className={`${
        collapsed ? 'w-[72px]' : 'w-64'
      } bg-gray-900 flex flex-col h-screen transition-all duration-300 relative`}
    >
      {/* Logo + Collapse toggle */}
      <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && <Image src="/Forgeon_logo_white.png" alt="Forgeon" width={200} height={200} className="h-14 w-auto drop-shadow-[0_0_4px_rgba(255,255,255,0.1)]" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;

          if (item.children) {
            const parentActive = isParentActive(item.children);
            return (
              <div key={item.name} data-onboarding={item.onboardingKey}>
                {collapsed ? (
                  <div className="relative group">
                    <div
                      className={`flex items-center justify-center px-2 py-3 rounded-lg ${
                        parentActive ? 'text-purple-400' : 'text-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {/* Tooltip on hover */}
                    <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50">
                      <div className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-1 shadow-xl min-w-[160px]">
                        <div className="px-3 py-1 text-xs text-gray-400 font-medium">{item.name}</div>
                        {item.children.map((child) => {
                          const active = isActive(child.href);
                          return (
                            <button
                              key={child.name}
                              onClick={() => router.push(child.href)}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                                active
                                  ? 'bg-purple-600 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              }`}
                            >
                              {child.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            );
          }

          const active = isActive(item.href!);
          return collapsed ? (
            <div key={item.name} className="relative group" data-onboarding={item.onboardingKey}>
              <button
                onClick={() => router.push(item.href!)}
                className={`w-full flex items-center justify-center px-2 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
              {/* Tooltip */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block z-50">
                <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 shadow-xl whitespace-nowrap">
                  <span className="text-sm text-gray-200">{item.name}</span>
                </div>
              </div>
            </div>
          ) : (
            <button
              key={item.name}
              onClick={() => router.push(item.href!)}
              data-onboarding={item.onboardingKey}
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
      <div className="p-2 space-y-1">
        {collapsed ? (
          <>
            <div className="relative group">
              <button
                onClick={() => router.push('/dashboard/profile')}
                className="w-full flex items-center justify-center px-2 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
              >
                <User className="w-5 h-5" />
              </button>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block z-50">
                <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 shadow-xl whitespace-nowrap">
                  <span className="text-sm text-gray-200">Perfil</span>
                </div>
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center justify-center px-2 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block z-50">
                <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 shadow-xl whitespace-nowrap">
                  <span className="text-sm text-gray-200">Cerrar Sesión</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push('/dashboard/profile')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Perfil</span>
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

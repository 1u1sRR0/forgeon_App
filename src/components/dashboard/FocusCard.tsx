'use client';

import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ClipboardList,
  ShieldCheck,
  Hammer,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  state: string;
}

interface FocusAction {
  type: 'create' | 'wizard' | 'evaluate' | 'build' | 'explore';
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: typeof Sparkles;
}

export function getFocusAction(
  project: Project | null,
  totalProjects: number
): FocusAction {
  if (totalProjects === 0) {
    return {
      type: 'create',
      title: 'Crea tu primer proyecto',
      description:
        'Comienza tu viaje emprendedor. La IA te guiará paso a paso para transformar tu idea en un negocio digital.',
      cta: 'Crear Proyecto',
      href: '/dashboard/projects/new',
      icon: Sparkles,
    };
  }

  if (project?.state === 'IDEA') {
    return {
      type: 'wizard',
      title: 'Completa el wizard de tu proyecto',
      description: `"${project.name}" necesita más detalles. Completa el wizard para estructurar tu idea de negocio.`,
      cta: 'Continuar Wizard',
      href: `/dashboard/projects/${project.id}/wizard`,
      icon: ClipboardList,
    };
  }

  if (
    project?.state === 'WIZARD_COMPLETE' ||
    project?.state === 'STRUCTURED'
  ) {
    return {
      type: 'evaluate',
      title: 'Evalúa tu proyecto',
      description: `"${project.name}" está listo para ser evaluado. 5 agentes de IA analizarán su viabilidad.`,
      cta: 'Iniciar Evaluación',
      href: `/dashboard/projects/${project.id}/evaluation`,
      icon: ShieldCheck,
    };
  }

  if (project?.state === 'BUILD_READY') {
    return {
      type: 'build',
      title: 'Genera tu MVP',
      description: `"${project.name}" está listo para construir. Genera el código de tu aplicación automáticamente.`,
      cta: 'Generar MVP',
      href: `/dashboard/projects/${project.id}/build`,
      icon: Hammer,
    };
  }

  return {
    type: 'explore',
    title: 'Explora nuevas oportunidades',
    description:
      'Descubre brechas de mercado y oportunidades de negocio que puedes aprovechar con IA.',
    cta: 'Explorar',
    href: '/dashboard/discover/opportunities',
    icon: Compass,
  };
}

interface FocusCardProps {
  project: Project | null;
  totalProjects: number;
}

export default function FocusCard({ project, totalProjects }: FocusCardProps) {
  const router = useRouter();
  const action = getFocusAction(project, totalProjects);
  const Icon = action.icon;

  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white">{action.title}</h2>
          <p className="text-sm text-gray-400 mt-1 leading-relaxed">
            {action.description}
          </p>
        </div>
        <button
          onClick={() => router.push(action.href)}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-200 font-medium flex items-center gap-2 whitespace-nowrap self-start md:self-center"
        >
          {action.cta}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

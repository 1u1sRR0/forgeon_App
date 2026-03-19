// SaasAdvancedTemplate â€” Generates advanced SaaS pages, CRUD, Prisma schema,
// and API routes for the SAAS_BASIC template type.
// All pages use 'use client', useState, useEffect, Tailwind design system classes,
// and import shared components from '@/components/shared'.

import { BuildParameters } from '../types';

interface ApiRouteFile {
  path: string;
  content: string;
}

export class SaasAdvancedTemplate {
  // â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    return SaasAdvancedTemplate.capitalize(str) + 's';
  }

  // â”€â”€â”€ 1. Onboarding Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  static generateOnboardingPage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';

const ONBOARDING_STEPS = [
  {
    id: 1,
    titulo: 'Bienvenido',
    descripcion: 'Te damos la bienvenida a ${appName}. Vamos a configurar tu cuenta.',
    icono: 'ðŸ‘‹',
  },
  {
    id: 2,
    titulo: 'Perfil',
    descripcion: 'Completa tu informaciÃ³n de perfil para personalizar tu experiencia.',
    icono: 'ðŸ‘¤',
  },
  {
    id: 3,
    titulo: 'Preferencias',
    descripcion: 'Configura tus preferencias y notificaciones.',
    icono: 'âš™ï¸',
  },
  {
    id: 4,
    titulo: 'Listo',
    descripcion: 'Â¡Todo configurado! Ya puedes comenzar a usar ${appName}.',
    icono: 'ðŸš€',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [nombre, setNombre] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [notificaciones, setNotificaciones] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Verificar si ya completÃ³ onboarding
    const checkOnboarding = async () => {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        if (data.user?.onboarded) {
          router.push('/dashboard');
        }
      } catch (err) {
        // Continuar con onboarding
      }
    };
    checkOnboarding();
  }, [router]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, empresa, notificaciones, onboarded: true }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al completar onboarding');
        setSaving(false);
        return;
      }

      setToastMessage('Â¡Onboarding completado exitosamente!');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      setError('Error de conexiÃ³n. Intenta de nuevo.');
      setSaving(false);
    }
  };

  const step = ONBOARDING_STEPS.find((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6" role="region" aria-label="Onboarding">
      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={ONBOARDING_STEPS.length} aria-label="Progreso de onboarding">
          {ONBOARDING_STEPS.map((s) => (
            <div
              key={s.id}
              className={\`h-2 flex-1 rounded-full transition-colors \${
                s.id <= currentStep ? 'bg-primary' : 'bg-gray-200'
              }\`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block" aria-hidden="true">{step?.icono}</span>
          <h1 className="text-2xl font-heading font-bold text-primary mb-2">{step?.titulo}</h1>
          <p className="text-secondary">{step?.descripcion}</p>
        </div>

        {/* Step Forms */}
        {currentStep === 2 && (
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="onb-nombre" className="block text-sm font-medium text-secondary mb-1">Nombre completo</label>
              <input
                id="onb-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tu nombre"
                aria-label="Nombre completo"
              />
            </div>
            <div>
              <label htmlFor="onb-empresa" className="block text-sm font-medium text-secondary mb-1">Empresa (opcional)</label>
              <input
                id="onb-empresa"
                type="text"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nombre de tu empresa"
                aria-label="Empresa"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <input
                id="onb-notif"
                type="checkbox"
                checked={notificaciones}
                onChange={(e) => setNotificaciones(e.target.checked)}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                aria-label="Recibir notificaciones por email"
              />
              <label htmlFor="onb-notif" className="text-sm text-foreground">Recibir notificaciones por email</label>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep <= 1}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors"
            aria-label="Paso anterior"
          >
            Anterior
          </button>

          {currentStep < ONBOARDING_STEPS.length ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
              aria-label="Siguiente paso"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
              aria-label="Completar onboarding"
            >
              {saving ? 'Completando...' : 'Comenzar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
`;
  }

  // â”€â”€â”€ 2. Settings Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  static generateSettingsPage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { Toast } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';

export default function SettingsPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [idioma, setIdioma] = useState('es');
  const [notificacionesEmail, setNotificacionesEmail] = useState(true);
  const [notificacionesPush, setNotificacionesPush] = useState(false);
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        if (res.ok && data.user) {
          setNombre(data.user.name || '');
          setEmail(data.user.email || '');
        }
      } catch (err) {
        setError('Error al cargar configuraciÃ³n');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          idioma,
          notificacionesEmail,
          notificacionesPush,
          temaOscuro,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al guardar configuraciÃ³n');
        setToastMessage('Error al guardar');
        setToastType('error');
      } else {
        setToastMessage('ConfiguraciÃ³n guardada exitosamente');
        setToastType('success');
      }
    } catch (err) {
      setError('Error de conexiÃ³n');
      setToastMessage('Error de conexiÃ³n');
      setToastType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner aria-label="Cargando configuraciÃ³n" />;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-background text-foreground" role="region" aria-label="ConfiguraciÃ³n">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      <h1 className="text-2xl font-heading font-bold text-primary mb-6">ConfiguraciÃ³n</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
      )}

      <form onSubmit={handleSave} className="space-y-8" noValidate aria-label="Formulario de configuraciÃ³n">
        {/* Perfil */}
        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Perfil</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="set-nombre" className="block text-sm font-medium text-secondary mb-1">Nombre</label>
              <input
                id="set-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Nombre"
              />
            </div>
            <div>
              <label htmlFor="set-email" className="block text-sm font-medium text-secondary mb-1">Email</label>
              <input
                id="set-email"
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                aria-label="Email (no editable)"
              />
            </div>
          </div>
        </section>

        {/* Preferencias */}
        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Preferencias</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="set-idioma" className="block text-sm font-medium text-secondary mb-1">Idioma</label>
              <select
                id="set-idioma"
                value={idioma}
                onChange={(e) => setIdioma(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Idioma"
              >
                <option value="es">EspaÃ±ol</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="set-tema"
                type="checkbox"
                checked={temaOscuro}
                onChange={(e) => setTemaOscuro(e.target.checked)}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                aria-label="Tema oscuro"
              />
              <label htmlFor="set-tema" className="text-sm text-foreground">Tema oscuro</label>
            </div>
          </div>
        </section>

        {/* Notificaciones */}
        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Notificaciones</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                id="set-notif-email"
                type="checkbox"
                checked={notificacionesEmail}
                onChange={(e) => setNotificacionesEmail(e.target.checked)}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                aria-label="Notificaciones por email"
              />
              <label htmlFor="set-notif-email" className="text-sm text-foreground">Notificaciones por email</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="set-notif-push"
                type="checkbox"
                checked={notificacionesPush}
                onChange={(e) => setNotificacionesPush(e.target.checked)}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                aria-label="Notificaciones push"
              />
              <label htmlFor="set-notif-push" className="text-sm text-foreground">Notificaciones push</label>
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
          aria-label="Guardar configuraciÃ³n"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}
`;
  }

  // â”€â”€â”€ 3. Billing Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  static generateBillingPage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { Toast } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';

interface Plan {
  id: string;
  nombre: string;
  precio: string;
  periodo: string;
  caracteristicas: string[];
  destacado: boolean;
}

const PLANES: Plan[] = [
  {
    id: 'free',
    nombre: 'Gratuito',
    precio: '$0',
    periodo: '/mes',
    caracteristicas: ['1 proyecto', 'Funciones bÃ¡sicas', 'Soporte por email'],
    destacado: false,
  },
  {
    id: 'pro',
    nombre: 'Pro',
    precio: '$29',
    periodo: '/mes',
    caracteristicas: ['10 proyectos', 'Todas las funciones', 'Soporte prioritario', 'API access', 'ExportaciÃ³n avanzada'],
    destacado: true,
  },
  {
    id: 'enterprise',
    nombre: 'Enterprise',
    precio: '$99',
    periodo: '/mes',
    caracteristicas: ['Proyectos ilimitados', 'Funciones premium', 'Soporte dedicado', 'API ilimitada', 'SSO', 'SLA garantizado'],
    destacado: false,
  },
];

export default function BillingPage() {
  const [planActual, setPlanActual] = useState('free');
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const res = await fetch('/api/subscription');
        const data = await res.json();
        if (res.ok && data.subscription) {
          setPlanActual(data.subscription.plan || 'free');
        }
      } catch (err) {
        // Default to free
      } finally {
        setLoading(false);
      }
    };
    loadSubscription();
  }, []);

  const handleChangePlan = async (planId: string) => {
    if (planId === planActual) return;
    setChanging(true);
    setError('');

    try {
      const res = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al cambiar plan');
        setToastMessage('Error al cambiar plan');
        setToastType('error');
      } else {
        setPlanActual(planId);
        setToastMessage('Plan actualizado exitosamente');
        setToastType('success');
      }
    } catch (err) {
      setError('Error de conexiÃ³n');
      setToastMessage('Error de conexiÃ³n');
      setToastType('error');
    } finally {
      setChanging(false);
    }
  };

  if (loading) {
    return <LoadingSpinner aria-label="Cargando suscripciÃ³n" />;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-background text-foreground" role="region" aria-label="FacturaciÃ³n y SuscripciÃ³n">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      <h1 className="text-2xl font-heading font-bold text-primary mb-2">FacturaciÃ³n y SuscripciÃ³n</h1>
      <p className="text-secondary mb-8">Gestiona tu plan y mÃ©todo de pago para ${appName}.</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
      )}

      {/* Current Plan */}
      <div className="mb-8 p-4 bg-white rounded-lg border border-gray-200">
        <p className="text-sm text-secondary">Plan actual</p>
        <p className="text-lg font-semibold text-foreground">{PLANES.find((p) => p.id === planActual)?.nombre || 'Gratuito'}</p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list" aria-label="Planes disponibles">
        {PLANES.map((plan) => (
          <div
            key={plan.id}
            className={\`relative p-6 bg-white rounded-xl border-2 transition-colors \${
              plan.id === planActual
                ? 'border-primary shadow-lg'
                : plan.destacado
                ? 'border-primary/50'
                : 'border-gray-200'
            }\`}
            role="listitem"
          >
            {plan.destacado && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                Recomendado
              </span>
            )}

            <h3 className="text-lg font-heading font-bold text-foreground mb-2">{plan.nombre}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-primary">{plan.precio}</span>
              <span className="text-secondary">{plan.periodo}</span>
            </div>

            <ul className="space-y-2 mb-6" aria-label={\`CaracterÃ­sticas del plan \${plan.nombre}\`}>
              {plan.caracteristicas.map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="text-primary" aria-hidden="true">âœ“</span>
                  {c}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleChangePlan(plan.id)}
              disabled={plan.id === planActual || changing}
              className={\`w-full py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 \${
                plan.id === planActual
                  ? 'bg-gray-100 text-secondary cursor-default'
                  : 'bg-primary text-white hover:opacity-90'
              }\`}
              aria-label={plan.id === planActual ? \`Plan actual: \${plan.nombre}\` : \`Seleccionar plan \${plan.nombre}\`}
            >
              {plan.id === planActual ? 'Plan Actual' : changing ? 'Cambiando...' : 'Seleccionar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
`;
  }

  // â”€â”€â”€ 4. Profile Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  static generateProfilePage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { Toast } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';

export default function ProfilePage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        if (res.ok && data.user) {
          setNombre(data.user.name || '');
          setEmail(data.user.email || '');
          setBio(data.user.bio || '');
          setTelefono(data.user.telefono || '');
        }
      } catch (err) {
        setError('Error al cargar perfil');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, bio, telefono }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al guardar perfil');
        setToastMessage('Error al guardar');
        setToastType('error');
      } else {
        setToastMessage('Perfil actualizado exitosamente');
        setToastType('success');
      }
    } catch (err) {
      setError('Error de conexiÃ³n');
      setToastMessage('Error de conexiÃ³n');
      setToastType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner aria-label="Cargando perfil" />;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-background text-foreground" role="region" aria-label="Perfil de Usuario">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      <h1 className="text-2xl font-heading font-bold text-primary mb-6">Mi Perfil</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
      )}

      {/* Avatar Placeholder */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center" aria-label="Avatar del usuario">
          <span className="text-3xl text-primary font-bold">{nombre ? nombre.charAt(0).toUpperCase() : '?'}</span>
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">{nombre || 'Sin nombre'}</p>
          <p className="text-sm text-secondary">{email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4" noValidate aria-label="Formulario de perfil">
        <div>
          <label htmlFor="prof-nombre" className="block text-sm font-medium text-secondary mb-1">Nombre completo</label>
          <input
            id="prof-nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={\`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary \${errors.nombre ? 'border-red-500' : 'border-gray-300'}\`}
            aria-label="Nombre completo"
            aria-describedby="nombre-error"
            aria-required="true"
          />
          {errors.nombre && <p id="nombre-error" className="mt-1 text-sm text-red-600" role="alert">{errors.nombre}</p>}
        </div>

        <div>
          <label htmlFor="prof-email" className="block text-sm font-medium text-secondary mb-1">Email</label>
          <input
            id="prof-email"
            type="email"
            value={email}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            aria-label="Email (no editable)"
          />
        </div>

        <div>
          <label htmlFor="prof-bio" className="block text-sm font-medium text-secondary mb-1">BiografÃ­a</label>
          <textarea
            id="prof-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="CuÃ©ntanos sobre ti..."
            aria-label="BiografÃ­a"
          />
        </div>

        <div>
          <label htmlFor="prof-tel" className="block text-sm font-medium text-secondary mb-1">TelÃ©fono</label>
          <input
            id="prof-tel"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="+52 123 456 7890"
            aria-label="TelÃ©fono"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
            aria-label="Guardar perfil"
          >
            {saving ? 'Guardando...' : 'Guardar Perfil'}
          </button>
        </div>
      </form>
    </div>
  );
}
`;
  }

  // â”€â”€â”€ 5. Notifications Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  static generateNotificationsPage(params: BuildParameters): string {
    const appName = params.appName;

    return `'use client';

import { useState, useEffect } from 'react';
import { Toast } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';
import { EmptyState } from '@/components/shared';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: string;
}

const typeIcons: Record<string, string> = {
  info: 'â„¹ï¸',
  warning: 'âš ï¸',
  success: 'âœ…',
  error: 'âŒ',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications || []);
      } else {
        setError('Error al cargar notificaciones');
      }
    } catch (err) {
      setError('Error de conexiÃ³n');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(\`/api/notifications/\${id}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    } catch (err) {
      // Silently fail
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setToastMessage('Todas las notificaciones marcadas como leÃ­das');
      }
    } catch (err) {
      // Silently fail
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return <LoadingSpinner aria-label="Cargando notificaciones" />;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-background text-foreground" role="region" aria-label="Notificaciones">
      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary">Notificaciones</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-secondary mt-1">{unreadCount} sin leer</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 text-sm text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors"
            aria-label="Marcar todas como leÃ­das"
          >
            Marcar todas como leÃ­das
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6" role="tablist" aria-label="Filtrar notificaciones">
        {(['all', 'unread', 'read'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={\`px-3 py-1 text-sm rounded-full transition-colors \${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-secondary hover:bg-gray-200'
            }\`}
            role="tab"
            aria-selected={filter === f}
            aria-label={\`Filtrar: \${f === 'all' ? 'Todas' : f === 'unread' ? 'Sin leer' : 'LeÃ­das'}\`}
          >
            {f === 'all' ? 'Todas' : f === 'unread' ? 'Sin leer' : 'LeÃ­das'}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          title="Sin notificaciones"
          description={filter === 'all' ? 'No tienes notificaciones.' : \`No tienes notificaciones \${filter === 'unread' ? 'sin leer' : 'leÃ­das'}.\`}
          aria-label="Sin notificaciones"
        />
      ) : (
        <div className="space-y-3" role="list" aria-label="Lista de notificaciones">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={\`p-4 rounded-lg border transition-colors cursor-pointer \${
                notif.read
                  ? 'bg-white border-gray-200'
                  : 'bg-primary/5 border-primary/20'
              }\`}
              onClick={() => !notif.read && handleMarkAsRead(notif.id)}
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !notif.read) handleMarkAsRead(notif.id);
              }}
              aria-label={\`\${notif.read ? 'LeÃ­da' : 'Sin leer'}: \${notif.title}\`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg" aria-hidden="true">{typeIcons[notif.type] || typeIcons.info}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={\`text-sm font-medium \${notif.read ? 'text-foreground' : 'text-primary font-semibold'}\`}>
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-primary" aria-label="Sin leer" />
                    )}
                  </div>
                  <p className="text-sm text-secondary mt-1">{notif.message}</p>
                  <p className="text-xs text-secondary mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
                </div>
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

  // â”€â”€â”€ 6. Dashboard Layout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  static generateDashboardLayout(params: BuildParameters): string {
    const appName = params.appName;
    const e = SaasAdvancedTemplate.lower(params.entityName);
    const ePlural = SaasAdvancedTemplate.plural(params.entityName);
    const eUpper = SaasAdvancedTemplate.capitalize(params.entityName);
    const ePluralUpper = SaasAdvancedTemplate.pluralUpper(params.entityName);

    return `'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/shared';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: BreadcrumbItem[] = [{ label: 'Inicio', href: '/dashboard' }];

  const labelMap: Record<string, string> = {
    dashboard: 'Dashboard',
    '${ePlural}': '${ePluralUpper}',
    new: 'Nuevo',
    edit: 'Editar',
    settings: 'ConfiguraciÃ³n',
    billing: 'FacturaciÃ³n',
    profile: 'Perfil',
    notifications: 'Notificaciones',
    onboarding: 'Onboarding',
  };

  let path = '';
  for (let i = 0; i < segments.length; i++) {
    path += '/' + segments[i];
    const label = labelMap[segments[i]] || segments[i];
    if (i < segments.length - 1) {
      crumbs.push({ label, href: path });
    } else {
      crumbs.push({ label });
    }
  }

  return crumbs;
}

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'ðŸ“Š' },
  { label: '${ePluralUpper}', href: '/dashboard/${ePlural}', icon: 'ðŸ“‹' },
  { label: 'Notificaciones', href: '/dashboard/notifications', icon: 'ðŸ””' },
];

const SIDEBAR_SECTIONS = [
  {
    title: 'Cuenta',
    items: [
      { label: 'Perfil', href: '/dashboard/profile', icon: 'ðŸ‘¤' },
      { label: 'ConfiguraciÃ³n', href: '/dashboard/settings', icon: 'âš™ï¸' },
      { label: 'FacturaciÃ³n', href: '/dashboard/billing', icon: 'ðŸ’³' },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const breadcrumbs = getBreadcrumbs(pathname);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        if (res.ok && data.user) {
          setUserName(data.user.name || '');
          setUserEmail(data.user.email || '');
        }
      } catch (err) {
        // Silently fail
      }
    };
    loadUser();
  }, []);

  return (
    <div className="flex h-screen bg-background" role="region" aria-label="Dashboard ${appName}">
      {/* Sidebar */}
      <Sidebar
        items={SIDEBAR_ITEMS}
        sections={SIDEBAR_SECTIONS}
        aria-label="NavegaciÃ³n principal"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6" role="banner">
          <div>
            <h1 className="text-lg font-heading font-bold text-primary">${appName}</h1>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="MenÃº de usuario"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{userName ? userName.charAt(0).toUpperCase() : '?'}</span>
              </div>
              <span className="text-sm text-foreground hidden sm:block">{userName || userEmail}</span>
              <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50" role="menu">
                <a href="/dashboard/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100" role="menuitem">Mi Perfil</a>
                <a href="/dashboard/settings" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100" role="menuitem">ConfiguraciÃ³n</a>
                <a href="/dashboard/billing" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100" role="menuitem">FacturaciÃ³n</a>
                <hr className="my-1 border-gray-200" />
                <a href="/api/auth/signout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100" role="menuitem">Cerrar SesiÃ³n</a>
              </div>
            )}
          </div>
        </header>

        {/* Breadcrumbs */}
        <nav className="px-6 py-3 bg-gray-50 border-b border-gray-200" aria-label="Breadcrumbs">
          <ol className="flex items-center gap-2 text-sm" role="list">
            {breadcrumbs.map((crumb, idx) => (
              <li key={idx} className="flex items-center gap-2">
                {idx > 0 && <span className="text-secondary" aria-hidden="true">/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="text-primary hover:underline">{crumb.label}</a>
                ) : (
                  <span className="text-secondary">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}
`;
  }

  // â”€â”€â”€ 7. Advanced Prisma Schema â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  static generateAdvancedPrismaSchema(params: BuildParameters): string {
    const entityLower = SaasAdvancedTemplate.lower(params.entityName);
    const entityUpper = SaasAdvancedTemplate.capitalize(params.entityName);
    const entityPlural = SaasAdvancedTemplate.plural(params.entityName);

    return `// Prisma schema generado por ${params.appName}
// Template: SAAS_BASIC (Avanzado)

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
  onboarded     Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  ${entityPlural}      ${entityUpper}[]
  subscriptions Subscription[]
  notifications Notification[]
  auditLogs     AuditLog[]
}

model ${entityUpper} {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      String   @default("active")
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id])
}

model Subscription {
  id        String    @id @default(cuid())
  userId    String
  plan      String    @default("free")
  status    String    @default("active")
  startDate DateTime  @default(now())
  endDate   DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  user      User      @relation(fields: [userId], references: [id])
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  title     String
  message   String
  read      Boolean  @default(false)
  type      String   @default("info")
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String
  action    String
  entity    String
  entityId  String?
  metadata  Json?
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
}
`;
  }

  // â”€â”€â”€ 8. CRUD List Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  static generateCrudListPage(params: BuildParameters): string {
    const e = SaasAdvancedTemplate.lower(params.entityName);
    const eUpper = SaasAdvancedTemplate.capitalize(params.entityName);
    const ePlural = SaasAdvancedTemplate.plural(params.entityName);
    const ePluralUpper = SaasAdvancedTemplate.pluralUpper(params.entityName);

    return `'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';
import { EmptyState } from '@/components/shared';
import { Toast } from '@/components/shared';

interface ${eUpper} {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

const columns: Column[] = [
  { key: 'title', label: 'TÃ­tulo', sortable: true },
  { key: 'status', label: 'Estado', sortable: true },
  { key: 'createdAt', label: 'Creado', sortable: true },
];

export default function ${ePluralUpper}ListPage() {
  const router = useRouter();
  const [${ePlural}, set${ePluralUpper}] = useState<${eUpper}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const pageSize = 10;

  useEffect(() => {
    fetchData();
  }, [currentPage, sortField, sortDirection, filterStatus]);

  const fetchData = async () => {
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

      const res = await fetch(\`/api/${ePlural}?\${params.toString()}\`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al cargar ${ePlural}');
        return;
      }

      set${ePluralUpper}(data.datos || data.${ePlural} || []);
      setTotalPages(data.paginacion?.totalPages || data.totalPages || 1);
    } catch (err) {
      setError('Error de conexiÃ³n al cargar ${ePlural}');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (ev: React.FormEvent) => {
    ev.preventDefault();
    setCurrentPage(1);
    fetchData();
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

  if (loading && ${ePlural}.length === 0) {
    return <LoadingSpinner aria-label="Cargando ${ePlural}" />;
  }

  return (
    <div className="p-6 bg-background text-foreground" role="region" aria-label="Listado de ${ePluralUpper}">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-primary">${ePluralUpper}</h1>
        <button
          onClick={() => router.push('/dashboard/${ePlural}/new')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
          aria-label="Crear nuevo ${e}"
        >
          Crear ${eUpper}
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2" role="search" aria-label="Buscar ${ePlural}">
        <input
          type="text"
          value={searchQuery}
          onChange={(ev) => setSearchQuery(ev.target.value)}
          placeholder="Buscar ${ePlural}..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="TÃ©rmino de bÃºsqueda"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
          aria-label="Ejecutar bÃºsqueda"
        >
          Buscar
        </button>
      </form>

      {/* Filters */}
      <div className="mb-4 flex gap-4 flex-wrap" role="group" aria-label="Filtros">
        <div className="flex items-center gap-2">
          <label htmlFor="filter-status" className="text-sm font-medium text-secondary">Estado</label>
          <select
            id="filter-status"
            value={filterStatus}
            onChange={(ev) => { setFilterStatus(ev.target.value); setCurrentPage(1); }}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Filtrar por estado"
          >
            <option value="">Todos</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="archived">Archivado</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
      )}

      {${ePlural}.length === 0 && !loading ? (
        <EmptyState
          title="Sin ${ePlural}"
          description="No se encontraron ${ePlural}. Crea el primero."
          actionLabel="Crear ${eUpper}"
          onAction={() => router.push('/dashboard/${ePlural}/new')}
          aria-label="No hay ${ePlural}"
        />
      ) : (
        <DataTable
          columns={columns}
          data={${ePlural}}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={(row: Record<string, any>) => router.push(\`/dashboard/${ePlural}/\${row.id}\`)}
          loading={loading}
          aria-label="Tabla de ${ePlural}"
        />
      )}

      {/* Pagination */}
      <nav className="mt-6 flex justify-center items-center gap-2" role="navigation" aria-label="PaginaciÃ³n">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
          aria-label="PÃ¡gina anterior"
        >
          Anterior
        </button>
        <span className="text-sm text-secondary" aria-live="polite" aria-atomic="true">
          PÃ¡gina {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
          aria-label="PÃ¡gina siguiente"
        >
          Siguiente
        </button>
      </nav>
    </div>
  );
}
`;
  }

  // â”€â”€â”€ 9. CRUD Create Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  static generateCrudCreatePage(params: BuildParameters): string {
    const e = SaasAdvancedTemplate.lower(params.entityName);
    const eUpper = SaasAdvancedTemplate.capitalize(params.entityName);
    const ePlural = SaasAdvancedTemplate.plural(params.entityName);

    return `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from '@/components/shared';

export default function Create${eUpper}Page() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'El tÃ­tulo es requerido';
    if (title.trim().length < 3) newErrors.title = 'El tÃ­tulo debe tener al menos 3 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError('');
    setSuccess(false);

    if (!validate()) return;

    setSaving(true);
    try {
      const res = await fetch('/api/${ePlural}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al crear ${e}');
        setSaving(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/dashboard/${ePlural}'), 1500);
    } catch (err) {
      setError('Error de conexiÃ³n. Intenta de nuevo.');
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-background text-foreground" role="region" aria-label="Crear ${eUpper}">
      {success && (
        <Toast message="${eUpper} creado exitosamente" type="success" onClose={() => setSuccess(false)} aria-live="polite" />
      )}

      <h1 className="text-2xl font-heading font-bold text-primary mb-6">Crear ${eUpper}</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Formulario de creaciÃ³n de ${e}">
        <div>
          <label htmlFor="create-title" className="block text-sm font-medium text-secondary mb-1">TÃ­tulo</label>
          <input
            id="create-title"
            type="text"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            className={\`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary \${errors.title ? 'border-red-500' : 'border-gray-300'}\`}
            placeholder="TÃ­tulo del ${e}"
            aria-label="TÃ­tulo"
            aria-describedby="title-error"
            aria-required="true"
          />
          {errors.title && <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="create-desc" className="block text-sm font-medium text-secondary mb-1">DescripciÃ³n</label>
          <textarea
            id="create-desc"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="DescripciÃ³n (opcional)"
            aria-label="DescripciÃ³n"
          />
        </div>

        <div>
          <label htmlFor="create-status" className="block text-sm font-medium text-secondary mb-1">Estado</label>
          <select
            id="create-status"
            value={status}
            onChange={(ev) => setStatus(ev.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Estado"
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
            aria-label="Crear ${eUpper}"
          >
            {saving ? 'Creando...' : 'Crear ${eUpper}'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Cancelar"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
`;
  }

  // â”€â”€â”€ 10. CRUD Detail Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  static generateCrudDetailPage(params: BuildParameters): string {
    const e = SaasAdvancedTemplate.lower(params.entityName);
    const eUpper = SaasAdvancedTemplate.capitalize(params.entityName);
    const ePlural = SaasAdvancedTemplate.plural(params.entityName);

    return `'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';
import { Toast } from '@/components/shared';

interface ${eUpper} {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ${eUpper}DetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [${e}, set${eUpper}] = useState<${eUpper} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(\`/api/${ePlural}/\${params.id}\`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || '${eUpper} no encontrado');
          setLoading(false);
          return;
        }
        set${eUpper}(data.${e});
      } catch (err) {
        setError('Error al cargar ${e}');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(\`/api/${ePlural}/\${params.id}\`, { method: 'DELETE' });
      if (res.ok) {
        setToastMessage('${eUpper} eliminado exitosamente');
        setToastType('success');
        setTimeout(() => router.push('/dashboard/${ePlural}'), 1500);
      } else {
        const data = await res.json();
        setToastMessage(data.error || 'Error al eliminar ${e}');
        setToastType('error');
      }
    } catch (err) {
      setToastMessage('Error de conexiÃ³n');
      setToastType('error');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return <LoadingSpinner aria-label="Cargando detalle de ${e}" />;
  }

  if (error || !${e}) {
    return (
      <div className="p-6 bg-background text-foreground" role="alert">
        <p className="text-red-600">{error || '${eUpper} no encontrado'}</p>
        <button
          onClick={() => router.push('/dashboard/${ePlural}')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
          aria-label="Volver al listado"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-background text-foreground" role="region" aria-label="Detalle de ${eUpper}">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} aria-live="polite" />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-primary">Detalle de ${eUpper}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(\`/dashboard/${ePlural}/\${params.id}/edit\`)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Editar ${e}"
          >
            Editar
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            aria-label="Eliminar ${e}"
          >
            Eliminar
          </button>
        </div>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow" role="list" aria-label="Campos de ${e}">
        <div>
          <dt className="text-sm font-medium text-secondary">TÃ­tulo</dt>
          <dd className="mt-1 text-foreground">{${e}.title}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-secondary">Estado</dt>
          <dd className="mt-1">
            <span className={\`inline-block px-2 py-1 text-xs font-medium rounded-full \${
              ${e}.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }\`}>
              {${e}.status === 'active' ? 'Activo' : ${e}.status}
            </span>
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm font-medium text-secondary">DescripciÃ³n</dt>
          <dd className="mt-1 text-foreground">{${e}.description || 'Sin descripciÃ³n'}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-secondary">Creado</dt>
          <dd className="mt-1 text-foreground">{new Date(${e}.createdAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-secondary">Actualizado</dt>
          <dd className="mt-1 text-foreground">{new Date(${e}.updatedAt).toLocaleString()}</dd>
        </div>
      </dl>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Eliminar ${eUpper}"
        message="Â¿EstÃ¡s seguro de que deseas eliminar este ${e}? Esta acciÃ³n no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        loading={deleting}
        aria-label="Confirmar eliminaciÃ³n"
      />
    </div>
  );
}
`;
  }

  // â”€â”€â”€ 11. CRUD Edit Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  static generateCrudEditPage(params: BuildParameters): string {
    const e = SaasAdvancedTemplate.lower(params.entityName);
    const eUpper = SaasAdvancedTemplate.capitalize(params.entityName);
    const ePlural = SaasAdvancedTemplate.plural(params.entityName);

    return `'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';

export default function Edit${eUpper}Page(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(\`/api/${ePlural}/\${params.id}\`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || '${eUpper} no encontrado');
          setLoading(false);
          return;
        }
        const item = data.${e};
        setTitle(item.title || '');
        setDescription(item.description || '');
        setStatus(item.status || 'active');
      } catch (err) {
        setError('Error al cargar ${e}');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'El tÃ­tulo es requerido';
    if (title.trim().length < 3) newErrors.title = 'El tÃ­tulo debe tener al menos 3 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError('');
    setSuccess(false);

    if (!validate()) return;

    setSaving(true);
    try {
      const res = await fetch(\`/api/${ePlural}/\${params.id}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al actualizar ${e}');
        setSaving(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push(\`/dashboard/${ePlural}/\${params.id}\`), 1500);
    } catch (err) {
      setError('Error de conexiÃ³n. Intenta de nuevo.');
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner aria-label="Cargando formulario de ediciÃ³n" />;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-background text-foreground" role="region" aria-label="Editar ${eUpper}">
      {success && (
        <Toast message="${eUpper} actualizado exitosamente" type="success" onClose={() => setSuccess(false)} aria-live="polite" />
      )}

      <h1 className="text-2xl font-heading font-bold text-primary mb-6">Editar ${eUpper}</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Formulario de ediciÃ³n de ${e}">
        <div>
          <label htmlFor="edit-title" className="block text-sm font-medium text-secondary mb-1">TÃ­tulo</label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            className={\`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary \${errors.title ? 'border-red-500' : 'border-gray-300'}\`}
            placeholder="TÃ­tulo del ${e}"
            aria-label="TÃ­tulo"
            aria-describedby="edit-title-error"
            aria-required="true"
          />
          {errors.title && <p id="edit-title-error" className="mt-1 text-sm text-red-600" role="alert">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="edit-desc" className="block text-sm font-medium text-secondary mb-1">DescripciÃ³n</label>
          <textarea
            id="edit-desc"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="DescripciÃ³n (opcional)"
            aria-label="DescripciÃ³n"
          />
        </div>

        <div>
          <label htmlFor="edit-status" className="block text-sm font-medium text-secondary mb-1">Estado</label>
          <select
            id="edit-status"
            value={status}
            onChange={(ev) => setStatus(ev.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Estado"
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="archived">Archivado</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
            aria-label="Guardar cambios"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Cancelar"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
`;
  }

  // â”€â”€â”€ 12. API Routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  static generateApiRoutes(params: BuildParameters): ApiRouteFile[] {
    const e = SaasAdvancedTemplate.lower(params.entityName);
    const eUpper = SaasAdvancedTemplate.capitalize(params.entityName);
    const ePlural = SaasAdvancedTemplate.plural(params.entityName);

    return SaasAdvancedTemplate._buildRoutes(e, eUpper, ePlural);
  }

  private static _buildRoutes(e: string, eUpper: string, ePlural: string): ApiRouteFile[] {
    const routes: ApiRouteFile[] = [];

    routes.push({ path: `src/app/api/${ePlural}/route.ts`, content: SaasAdvancedTemplate._entityListRoute(e, eUpper, ePlural) });
    routes.push({ path: `src/app/api/${ePlural}/[id]/route.ts`, content: SaasAdvancedTemplate._entityDetailRoute(e, eUpper, ePlural) });
    routes.push({ path: `src/app/api/subscription/route.ts`, content: SaasAdvancedTemplate._subscriptionRoute() });
    routes.push({ path: `src/app/api/notifications/route.ts`, content: SaasAdvancedTemplate._notificationsListRoute() });
    routes.push({ path: `src/app/api/notifications/[id]/route.ts`, content: SaasAdvancedTemplate._notificationDetailRoute() });
    routes.push({ path: `src/app/api/notifications/mark-all-read/route.ts`, content: SaasAdvancedTemplate._markAllReadRoute() });
    routes.push({ path: `src/app/api/user/profile/route.ts`, content: SaasAdvancedTemplate._userProfileRoute() });

    return routes;
  }

  // ─── Private API Route Generators ───────────────────────────

  private static _entityListRoute(e: string, eUpper: string, ePlural: string): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const create${eUpper}Schema = z.object({`,
      `  title: z.string({ required_error: 'El título es obligatorio' })`,
      `    .min(3, { message: 'El título debe tener al menos 3 caracteres' })`,
      `    .max(200, { message: 'El título no debe exceder 200 caracteres' }),`,
      `  description: z.string().max(2000, { message: 'La descripción no debe exceder 2000 caracteres' }).optional(),`,
      `  status: z.string().optional(),`,
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
      ``,
      `    const total = await prisma.${e}.count({ where: { userId } });`,
      `    const ${ePlural} = await prisma.${e}.findMany({`,
      `      where: { userId },`,
      `      skip,`,
      `      take: limit,`,
      `      orderBy: { createdAt: 'desc' },`,
      `    });`,
      ``,
      `    const totalPages = Math.ceil(total / limit);`,
      ``,
      `    return NextResponse.json({`,
      `      datos: ${ePlural},`,
      `      ${ePlural},`,
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
      `    const datos = create${eUpper}Schema.parse(body);`,
      ``,
      `    const ${e} = await prisma.${e}.create({`,
      `      data: { ...datos, userId },`,
      `    });`,
      ``,
      `    return NextResponse.json({ ${e} }, { status: 201 });`,
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

  private static _entityDetailRoute(e: string, eUpper: string, ePlural: string): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const update${eUpper}Schema = z.object({`,
      `  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres' }).max(200).optional(),`,
      `  description: z.string().max(2000).optional(),`,
      `  status: z.string().optional(),`,
      `});`,
      ``,
      `export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {`,
      `  const params = await props.params;`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json({ error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' }, { status: 401 });`,
      `    }`,
      `    const userId = (session.user as any).id;`,
      `    const ${e} = await prisma.${e}.findUnique({ where: { id: params.id } });`,
      `    if (!${e}) {`,
      `      return NextResponse.json({ error: '${eUpper} no encontrado.' }, { status: 404 });`,
      `    }`,
      `    if (${e}.userId !== userId) {`,
      `      return NextResponse.json({ error: 'No tiene permisos para acceder a este recurso.' }, { status: 403 });`,
      `    }`,
      `    return NextResponse.json({ ${e} });`,
      `  } catch (error) {`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json({ error: 'Error interno del servidor. Intente nuevamente más tarde.' }, { status: 500 });`,
      `  }`,
      `}`,
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
      `    const datos = update${eUpper}Schema.parse(body);`,
      `    const ${e}Existente = await prisma.${e}.findUnique({ where: { id: params.id } });`,
      `    if (!${e}Existente) {`,
      `      return NextResponse.json({ error: '${eUpper} no encontrado.' }, { status: 404 });`,
      `    }`,
      `    if (${e}Existente.userId !== userId) {`,
      `      return NextResponse.json({ error: 'No tiene permisos para modificar este recurso.' }, { status: 403 });`,
      `    }`,
      `    const ${e}Updated = await prisma.${e}.update({ where: { id: params.id }, data: datos });`,
      `    return NextResponse.json({ ${e}: ${e}Updated });`,
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
      `    const ${e}Existente = await prisma.${e}.findUnique({ where: { id: params.id } });`,
      `    if (!${e}Existente) {`,
      `      return NextResponse.json({ error: '${eUpper} no encontrado.' }, { status: 404 });`,
      `    }`,
      `    if (${e}Existente.userId !== userId) {`,
      `      return NextResponse.json({ error: 'No tiene permisos para eliminar este recurso.' }, { status: 403 });`,
      `    }`,
      `    await prisma.${e}.delete({ where: { id: params.id } });`,
      `    return NextResponse.json({ mensaje: '${eUpper} eliminado correctamente.' });`,
      `  } catch (error) {`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json({ error: 'Error interno del servidor. Intente nuevamente más tarde.' }, { status: 500 });`,
      `  }`,
      `}`,
    ].join('\n');
  }

  private static _subscriptionRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const subscriptionSchema = z.object({`,
      `  plan: z.enum(['free', 'pro', 'enterprise'], {`,
      `    required_error: 'El plan es obligatorio',`,
      `    invalid_type_error: 'Plan no válido',`,
      `  }),`,
      `});`,
      ``,
      `export async function GET(request: NextRequest) {`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json({ error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' }, { status: 401 });`,
      `    }`,
      `    const userId = (session.user as any).id;`,
      `    const subscription = await prisma.subscription.findFirst({`,
      `      where: { userId, status: 'active' },`,
      `      orderBy: { createdAt: 'desc' },`,
      `    });`,
      `    return NextResponse.json({ subscription: subscription || { plan: 'free', status: 'active' } });`,
      `  } catch (error) {`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json({ error: 'Error interno del servidor. Intente nuevamente más tarde.' }, { status: 500 });`,
      `  }`,
      `}`,
      ``,
      `export async function POST(request: NextRequest) {`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json({ error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' }, { status: 401 });`,
      `    }`,
      `    const userId = (session.user as any).id;`,
      `    const body = await request.json();`,
      `    const datos = subscriptionSchema.parse(body);`,
      `    await prisma.subscription.updateMany({`,
      `      where: { userId, status: 'active' },`,
      `      data: { status: 'cancelled', endDate: new Date() },`,
      `    });`,
      `    const subscription = await prisma.subscription.create({`,
      `      data: { userId, plan: datos.plan, status: 'active', startDate: new Date() },`,
      `    });`,
      `    return NextResponse.json({ subscription }, { status: 201 });`,
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

  private static _notificationsListRoute(): string {
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
      `      return NextResponse.json({ error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' }, { status: 401 });`,
      `    }`,
      `    const userId = (session.user as any).id;`,
      `    const { searchParams } = new URL(request.url);`,
      `    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));`,
      `    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));`,
      `    const skip = (page - 1) * limit;`,
      `    const total = await prisma.notification.count({ where: { userId } });`,
      `    const notifications = await prisma.notification.findMany({`,
      `      where: { userId },`,
      `      skip,`,
      `      take: limit,`,
      `      orderBy: { createdAt: 'desc' },`,
      `    });`,
      `    const totalPages = Math.ceil(total / limit);`,
      `    return NextResponse.json({`,
      `      notifications,`,
      `      paginacion: { total, totalPages, currentPage: page, hasNext: page < totalPages, hasPrev: page > 1 },`,
      `    });`,
      `  } catch (error) {`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json({ error: 'Error interno del servidor. Intente nuevamente más tarde.' }, { status: 500 });`,
      `  }`,
      `}`,
    ].join('\n');
  }

  private static _notificationDetailRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const updateNotificationSchema = z.object({`,
      `  read: z.boolean({ required_error: 'El campo read es obligatorio' }),`,
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
      `    const datos = updateNotificationSchema.parse(body);`,
      `    const notificacion = await prisma.notification.findUnique({ where: { id: params.id } });`,
      `    if (!notificacion) {`,
      `      return NextResponse.json({ error: 'Notificación no encontrada.' }, { status: 404 });`,
      `    }`,
      `    if (notificacion.userId !== userId) {`,
      `      return NextResponse.json({ error: 'No tiene permisos para modificar esta notificación.' }, { status: 403 });`,
      `    }`,
      `    const updated = await prisma.notification.update({ where: { id: params.id }, data: { read: datos.read } });`,
      `    return NextResponse.json({ notification: updated });`,
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

  private static _markAllReadRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      ``,
      `export async function POST(request: NextRequest) {`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json({ error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' }, { status: 401 });`,
      `    }`,
      `    const userId = (session.user as any).id;`,
      `    await prisma.notification.updateMany({`,
      `      where: { userId, read: false },`,
      `      data: { read: true },`,
      `    });`,
      `    return NextResponse.json({ mensaje: 'Todas las notificaciones marcadas como leídas.' });`,
      `  } catch (error) {`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json({ error: 'Error interno del servidor. Intente nuevamente más tarde.' }, { status: 500 });`,
      `  }`,
      `}`,
    ].join('\n');
  }

  private static _userProfileRoute(): string {
    return [
      `import { NextRequest, NextResponse } from 'next/server';`,
      `import { getServerSession } from 'next-auth';`,
      `import { authOptions } from '@/lib/auth';`,
      `import { prisma } from '@/lib/prisma';`,
      `import { z } from 'zod';`,
      ``,
      `const updateProfileSchema = z.object({`,
      `  nombre: z.string().min(1, { message: 'El nombre es obligatorio' }).max(100).optional(),`,
      `  bio: z.string().max(500).optional(),`,
      `  telefono: z.string().max(20).optional(),`,
      `  empresa: z.string().max(100).optional(),`,
      `  onboarded: z.boolean().optional(),`,
      `  idioma: z.string().optional(),`,
      `  notificacionesEmail: z.boolean().optional(),`,
      `  notificacionesPush: z.boolean().optional(),`,
      `  temaOscuro: z.boolean().optional(),`,
      `  notificaciones: z.boolean().optional(),`,
      `});`,
      ``,
      `export async function GET(request: NextRequest) {`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json({ error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' }, { status: 401 });`,
      `    }`,
      `    const userId = (session.user as any).id;`,
      `    const user = await prisma.user.findUnique({`,
      `      where: { id: userId },`,
      `      select: { id: true, email: true, name: true, onboarded: true, createdAt: true },`,
      `    });`,
      `    if (!user) {`,
      `      return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });`,
      `    }`,
      `    return NextResponse.json({ user });`,
      `  } catch (error) {`,
      `    console.error('Error en operación de base de datos:', error);`,
      `    return NextResponse.json({ error: 'Error interno del servidor. Intente nuevamente más tarde.' }, { status: 500 });`,
      `  }`,
      `}`,
      ``,
      `export async function PATCH(request: NextRequest) {`,
      `  try {`,
      `    const session = await getServerSession(authOptions);`,
      `    if (!session?.user) {`,
      `      return NextResponse.json({ error: 'No autorizado. Debe iniciar sesión para acceder a este recurso.' }, { status: 401 });`,
      `    }`,
      `    const userId = (session.user as any).id;`,
      `    const body = await request.json();`,
      `    const datos = updateProfileSchema.parse(body);`,
      `    const updateData: Record<string, any> = {};`,
      `    if (datos.nombre !== undefined) updateData.name = datos.nombre;`,
      `    if (datos.onboarded !== undefined) updateData.onboarded = datos.onboarded;`,
      `    const user = await prisma.user.update({`,
      `      where: { id: userId },`,
      `      data: updateData,`,
      `      select: { id: true, email: true, name: true, onboarded: true },`,
      `    });`,
      `    return NextResponse.json({ user });`,
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

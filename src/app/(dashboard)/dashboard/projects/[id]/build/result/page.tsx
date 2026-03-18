'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

interface BuildStatusResponse {
  buildId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  buildLog: string[];
  errorMessage: string | null;
  zipPath: string | null;
  qualityChecksPassed: boolean;
  templateType: string;
  createdAt: string;
  completedAt: string | null;
}

export default function BuildResultPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [buildData, setBuildData] = useState<BuildStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuildStatus = async () => {
      try {
        const res = await fetch(`/api/projects/${params.id}/build`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al obtener el estado del build');
        setBuildData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBuildStatus();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-800 rounded w-2/3 mb-8" />
          <div className="h-64 bg-gray-800/50 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !buildData) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl mb-6">
            {error || 'Build no encontrado'}
          </div>
          <Link
            href={`/dashboard/projects/${params.id}`}
            className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            ← Volver al Proyecto
          </Link>
        </div>
      </div>
    );
  }

  const isSuccess = buildData.status === 'COMPLETED';
  const isFailed = buildData.status === 'FAILED';

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/dashboard/projects/${params.id}`}
            className="text-purple-400 hover:text-purple-300 transition-colors duration-200 text-sm mb-4 inline-block"
          >
            ← Volver al Proyecto
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isSuccess ? '¡Build Completado!' : 'Build Fallido'}
          </h1>
          <p className="text-gray-400">
            {isSuccess
              ? 'Tu MVP ha sido generado exitosamente.'
              : 'Hubo un error al generar tu MVP.'}
          </p>
        </div>

        {/* Success State */}
        {isSuccess && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 mb-6">
            <div className="flex items-start gap-5">
              {/* Success icon */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-3">
                  MVP Generado Exitosamente
                </h2>
                <p className="text-gray-400 mb-4">
                  Tu código base está listo para descargar. El proyecto generado incluye:
                </p>
                <ul className="space-y-2 text-gray-300 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span> Aplicación Next.js con TypeScript
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span> Esquema de base de datos Prisma
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span> Configuración de autenticación
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span> Rutas API y páginas de UI
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span> README con instrucciones de configuración
                  </li>
                </ul>

                {buildData.qualityChecksPassed && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 mb-6">
                    <p className="text-green-400 font-medium text-sm">
                      ✓ Todas las verificaciones de calidad pasaron
                    </p>
                  </div>
                )}

                {/* Download Button - Prominent with gradient */}
                {buildData.zipPath ? (
                  <a
                    href={`/api/builds/${buildData.buildId}/download`}
                    download
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Descargar MVP (ZIP)
                  </a>
                ) : (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3">
                    <p className="text-yellow-400 text-sm">
                      El enlace de descarga estará disponible en breve...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Failed State */}
        {isFailed && (
          <div className="bg-gray-800/50 border border-red-500/30 rounded-2xl p-8 mb-6">
            <div className="flex items-start gap-5">
              {/* Error icon */}
              <div className="w-14 h-14 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-3">
                  Error en la Generación
                </h2>

                {buildData.errorMessage && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
                    <p className="text-red-300 font-mono text-sm">{buildData.errorMessage}</p>
                  </div>
                )}

                <p className="text-gray-400 mb-6">
                  Puedes reintentar la generación o revisar los logs para más detalles.
                </p>

                {/* Retry Button */}
                <Link
                  href={`/dashboard/projects/${params.id}/build`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reintentar Build
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Build Log (shown for both states, but especially important for failed) */}
        {buildData.buildLog && buildData.buildLog.length > 0 && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <h2 className="text-sm font-medium text-gray-400 ml-2">Build Log</h2>
            </div>
            <div className="max-h-96 overflow-y-auto font-mono text-sm space-y-1">
              {buildData.buildLog.map((line, idx) => (
                <div
                  key={idx}
                  className={`py-0.5 ${
                    /error|fail|FAILED/i.test(line)
                      ? 'text-red-400'
                      : /warning/i.test(line)
                        ? 'text-yellow-400'
                        : /completed|success|passed/i.test(line)
                          ? 'text-green-400'
                          : 'text-gray-300'
                  }`}
                >
                  <span className="text-gray-600 select-none mr-2">{String(idx + 1).padStart(2, '0')}</span>
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps (Success only) */}
        {isSuccess && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Siguientes Pasos
            </h3>
            <ol className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-semibold">1</span>
                <span>Descarga y extrae el archivo ZIP</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-semibold">2</span>
                <span>Abre la terminal y navega a la carpeta extraída</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-semibold">3</span>
                <span>Copia <code className="bg-gray-700 px-2 py-0.5 rounded text-purple-300 text-sm">.env.example</code> a <code className="bg-gray-700 px-2 py-0.5 rounded text-purple-300 text-sm">.env</code> y configura tu URL de base de datos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-semibold">4</span>
                <span>Ejecuta: <code className="bg-gray-700 px-2 py-0.5 rounded text-purple-300 text-sm">npm install</code></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-semibold">5</span>
                <span>Ejecuta: <code className="bg-gray-700 px-2 py-0.5 rounded text-purple-300 text-sm">npx prisma generate</code></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-semibold">6</span>
                <span>Ejecuta: <code className="bg-gray-700 px-2 py-0.5 rounded text-purple-300 text-sm">npx prisma migrate dev --name init</code></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-semibold">7</span>
                <span>(Opcional) Ejecuta: <code className="bg-gray-700 px-2 py-0.5 rounded text-purple-300 text-sm">npx prisma db seed</code></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-semibold">8</span>
                <span>Ejecuta: <code className="bg-gray-700 px-2 py-0.5 rounded text-purple-300 text-sm">npm run dev</code></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-semibold">9</span>
                <span>Abre <code className="bg-gray-700 px-2 py-0.5 rounded text-purple-300 text-sm">http://localhost:3000</code> en tu navegador</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-semibold">10</span>
                <span>¡Comienza a personalizar tu MVP!</span>
              </li>
            </ol>

            <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-3">
              <p className="text-sm text-purple-300">
                <strong>Credenciales demo (si ejecutaste el seed):</strong><br />
                Email: demo@example.com<br />
                Contraseña: demo123
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ReactComponentGenerator — Generates functional React/Next.js components
// with hooks, typed props, state management, and accessibility attributes.
// Replaces static HTML generation with dangerouslySetInnerHTML.
//
// Design System Integration:
// - Uses Tailwind extended classes: text-primary, bg-primary, text-secondary,
//   bg-secondary, text-accent, bg-accent, text-foreground, bg-background,
//   font-heading, font-body, focus:ring-primary
// - CSS custom properties: var(--color-primary), var(--color-secondary),
//   var(--color-accent), var(--font-heading), var(--font-body)
// - NO hardcoded hex color values — all colors come from the design system
// - Semantic colors (red for errors, green for success) use Tailwind defaults
//   as they represent UI semantics, not branding
// - When Premium Engine design tokens are unavailable, components fall back
//   to Tailwind's default theme values which are always functional

import { ComponentSpec, FieldSpec } from '../types';

interface EntityNameVariants {
  lower: string;
  upper: string;
  plural: string;
  pluralUpper: string;
}

export class ReactComponentGenerator {
  // ─── Helpers ───────────────────────────────────────────────

  private static getEntityNameVariants(entityName: string): EntityNameVariants {
    const lower = entityName.toLowerCase();
    const upper = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    const plural = lower + 's';
    const pluralUpper = upper + 's';
    return { lower, upper, plural, pluralUpper };
  }

  private static generateFieldInterface(entityName: string, fields: FieldSpec[]): string {
    const { upper } = this.getEntityNameVariants(entityName);
    const fieldLines = fields
      .map((f) => `  ${f.name}: ${this.tsType(f.type)}${f.required ? '' : ' | null'};`)
      .join('\n');
    return `interface ${upper} {\n  id: string;\n${fieldLines}\n  createdAt: string;\n  updatedAt: string;\n}`;
  }

  private static tsType(fieldType: string): string {
    switch (fieldType) {
      case 'number':
      case 'float':
      case 'int':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'date':
        return 'string';
      default:
        return 'string';
    }
  }

  private static inputType(fieldType: string): string {
    switch (fieldType) {
      case 'number':
      case 'float':
      case 'int':
        return 'number';
      case 'email':
        return 'email';
      case 'date':
        return 'date';
      case 'boolean':
        return 'checkbox';
      case 'text':
        return 'textarea';
      default:
        return 'text';
    }
  }

  private static generateFieldColumns(fields: FieldSpec[]): string {
    return fields
      .map(
        (f) =>
          `    { key: '${f.name}', label: '${f.label}', sortable: true }`,
      )
      .join(',\n');
  }

  // ─── generateComponent ─────────────────────────────────────

  static generateComponent(spec: ComponentSpec, designTokens?: any): string {
    const propsInterface = spec.props.length
      ? `interface ${spec.name}Props {\n${spec.props.map((p) => `  ${p.name}${p.required ? '' : '?'}: ${p.type};`).join('\n')}\n}`
      : `interface ${spec.name}Props {}`;

    const stateDeclarations = spec.states
      .map(
        (s) =>
          `  const [${s.name}, set${s.name.charAt(0).toUpperCase() + s.name.slice(1)}] = useState<${s.type}>(${s.initial});`,
      )
      .join('\n');

    const needsUseClient = spec.states.length > 0 || spec.hasForm || spec.hasDataFetching;
    const useClientDirective = needsUseClient ? "'use client';\n\n" : '';

    const imports: string[] = [];
    const hooksUsed: string[] = [];
    if (spec.states.length > 0 || spec.hasForm) hooksUsed.push('useState');
    if (spec.hasDataFetching) hooksUsed.push('useEffect');
    if (hooksUsed.length) imports.push(`import { ${hooksUsed.join(', ')} } from 'react';`);

    const effectBlock = spec.hasDataFetching
      ? `\n  useEffect(() => {\n    // Fetch data on mount\n  }, []);\n`
      : '';

    const propsParam = spec.props.length ? `{ ${spec.props.map((p) => p.name).join(', ')} }: ${spec.name}Props` : `_props: ${spec.name}Props`;

    return `${useClientDirective}${imports.join('\n')}

${propsInterface}

export default function ${spec.name}(${propsParam}) {
${stateDeclarations}
${effectBlock}
  return (
    <div className="p-6 bg-background text-foreground" role="region" aria-label="${spec.name}">
      <h2 className="text-2xl font-heading font-bold text-primary">${spec.name}</h2>
    </div>
  );
}
`;
  }

  // ─── generateListPage ──────────────────────────────────────

  static generateListPage(entityName: string, fields: FieldSpec[]): string {
    const e = this.getEntityNameVariants(entityName);
    const fieldInterface = this.generateFieldInterface(entityName, fields);
    const columns = this.generateFieldColumns(fields);

    return `'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';
import { EmptyState } from '@/components/shared';
import { Toast } from '@/components/shared';

${fieldInterface}

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

const columns: Column[] = [
${columns}
];

export default function ${e.pluralUpper}ListPage() {
  const router = useRouter();
  const [${e.plural}, set${e.pluralUpper}] = useState<${e.upper}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterField, setFilterField] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const pageSize = 10;

  useEffect(() => {
    fetch${e.pluralUpper}();
  }, [currentPage, sortField, sortDirection, filterField, filterValue]);

  const fetch${e.pluralUpper} = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(pageSize),
        sortBy: sortField,
        sortDir: sortDirection,
      });
      if (searchQuery) params.set('search', searchQuery);
      if (filterField && filterValue) params.set(filterField, filterValue);

      const res = await fetch(\`/api/${e.plural}?\${params.toString()}\`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al cargar ${e.plural}');
        return;
      }

      set${e.pluralUpper}(data.${e.plural} || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError('Error de conexión al cargar ${e.plural}');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetch${e.pluralUpper}();
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

  const handleFilterChange = (field: string, value: string) => {
    setFilterField(field);
    setFilterValue(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading && ${e.plural}.length === 0) {
    return <LoadingSpinner aria-label="Cargando ${e.plural}" />;
  }

  return (
    <div className="p-6 bg-background text-foreground" role="region" aria-label="Listado de ${e.pluralUpper}">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
          aria-live="polite"
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-primary">${e.pluralUpper}</h1>
        <button
          onClick={() => router.push('/dashboard/${e.plural}/new')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
          aria-label="Crear nuevo ${e.lower}"
        >
          Crear ${e.upper}
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2" role="search" aria-label="Buscar ${e.plural}">
        <input
          type="text"
          value={searchQuery}
          onChange={(ev) => setSearchQuery(ev.target.value)}
          placeholder="Buscar ${e.plural}..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Término de búsqueda"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
          aria-label="Ejecutar búsqueda"
        >
          Buscar
        </button>
      </form>

      {/* Filters */}
      <div className="mb-4 flex gap-4 flex-wrap" role="group" aria-label="Filtros">
${fields
  .filter((f) => f.type === 'string' || f.type === 'boolean')
  .slice(0, 3)
  .map(
    (f) => `        <div className="flex items-center gap-2">
          <label htmlFor="filter-${f.name}" className="text-sm font-medium text-secondary">${f.label}</label>
          <input
            id="filter-${f.name}"
            type="text"
            value={filterField === '${f.name}' ? filterValue : ''}
            onChange={(ev) => handleFilterChange('${f.name}', ev.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Filtrar por ${f.label}"
          />
        </div>`,
  )
  .join('\n')}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert" aria-describedby="error-message">
          <span id="error-message">{error}</span>
        </div>
      )}

      {${e.plural}.length === 0 && !loading ? (
        <EmptyState
          title="Sin ${e.plural}"
          description="No se encontraron ${e.plural}. Crea el primero."
          aria-label="No hay ${e.plural}"
        />
      ) : (
        <DataTable
          columns={columns}
          data={${e.plural}}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={(row: ${e.upper}) => router.push(\`/dashboard/${e.plural}/\${row.id}\`)}
          loading={loading}
          aria-label="Tabla de ${e.plural}"
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

  // ─── generateFormPage ──────────────────────────────────────

  static generateFormPage(
    entityName: string,
    fields: FieldSpec[],
    mode: 'create' | 'edit',
  ): string {
    const e = this.getEntityNameVariants(entityName);
    const isEdit = mode === 'edit';
    const pageName = isEdit ? `Edit${e.upper}Page` : `Create${e.upper}Page`;
    const title = isEdit ? `Editar ${e.upper}` : `Crear ${e.upper}`;
    const submitLabel = isEdit ? 'Guardar Cambios' : `Crear ${e.upper}`;
    const savingLabel = isEdit ? 'Guardando...' : 'Creando...';
    const httpMethod = isEdit ? 'PATCH' : 'POST';
    const apiUrl = isEdit
      ? `\`/api/${e.plural}/\${params.id}\``
      : `'/api/${e.plural}'`;

    const stateDeclarations = fields
      .map((f) => {
        const initial = f.type === 'boolean' ? 'false' : f.type === 'number' || f.type === 'float' || f.type === 'int' ? '0' : "''";
        return `  const [${f.name}, set${f.name.charAt(0).toUpperCase() + f.name.slice(1)}] = useState<${this.tsType(f.type)}>(${initial});`;
      })
      .join('\n');

    const validationChecks = fields
      .filter((f) => f.required)
      .map((f) => {
        if (f.type === 'string' || f.type === 'text' || f.type === 'email') {
          return `    if (!${f.name}.trim()) { newErrors.${f.name} = '${f.label} es requerido'; }`;
        }
        return `    if (!${f.name} && ${f.name} !== 0) { newErrors.${f.name} = '${f.label} es requerido'; }`;
      })
      .join('\n');

    const bodyFields = fields.map((f) => `      ${f.name}`).join(',\n');

    const editFetchBlock = isEdit
      ? `
  useEffect(() => {
    const load${e.upper} = async () => {
      try {
        const res = await fetch(\`/api/${e.plural}/\${params.id}\`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || '${e.upper} no encontrado');
          setLoading(false);
          return;
        }
        const item = data.${e.lower};
${fields.map((f) => `        set${f.name.charAt(0).toUpperCase() + f.name.slice(1)}(item.${f.name} ?? ${f.type === 'boolean' ? 'false' : f.type === 'number' || f.type === 'float' || f.type === 'int' ? '0' : "''"});`).join('\n')}
      } catch (err) {
        setError('Error al cargar ${e.lower}');
      } finally {
        setLoading(false);
      }
    };
    load${e.upper}();
  }, [params.id]);
`
      : '';

    const editParamsLine = isEdit
      ? `\n  const params = use(props.params);\n`
      : '';

    const editPropsType = isEdit
      ? `(props: { params: Promise<{ id: string }> })`
      : '()';

    const editImports = isEdit
      ? "import { use, useState, useEffect } from 'react';"
      : "import { useState } from 'react';";

    const formFields = fields
      .map((f) => {
        const inputT = this.inputType(f.type);
        const setter = `set${f.name.charAt(0).toUpperCase() + f.name.slice(1)}`;

        if (inputT === 'textarea') {
          return `        <div>
          <label htmlFor="field-${f.name}" className="block text-sm font-medium text-secondary mb-1">${f.label}</label>
          <textarea
            id="field-${f.name}"
            value={${f.name}}
            onChange={(ev) => ${setter}(ev.target.value)}
            rows={4}
            className={\`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary \${errors.${f.name} ? 'border-red-500' : 'border-gray-300'}\`}
            aria-label="${f.label}"
            aria-describedby="${f.name}-error"
            ${f.required ? 'aria-required="true"' : ''}
          />
          {errors.${f.name} && <p id="${f.name}-error" className="mt-1 text-sm text-red-600" role="alert">{errors.${f.name}}</p>}
        </div>`;
        }

        if (inputT === 'checkbox') {
          return `        <div className="flex items-center gap-2">
          <input
            id="field-${f.name}"
            type="checkbox"
            checked={${f.name} as unknown as boolean}
            onChange={(ev) => ${setter}(ev.target.checked as any)}
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            aria-label="${f.label}"
            aria-describedby="${f.name}-error"
          />
          <label htmlFor="field-${f.name}" className="text-sm font-medium text-secondary">${f.label}</label>
          {errors.${f.name} && <p id="${f.name}-error" className="mt-1 text-sm text-red-600" role="alert">{errors.${f.name}}</p>}
        </div>`;
        }

        const valueHandler =
          inputT === 'number'
            ? `onChange={(ev) => ${setter}(Number(ev.target.value))}`
            : `onChange={(ev) => ${setter}(ev.target.value)}`;

        return `        <div>
          <label htmlFor="field-${f.name}" className="block text-sm font-medium text-secondary mb-1">${f.label}</label>
          <input
            id="field-${f.name}"
            type="${inputT}"
            value={${f.name}}
            ${valueHandler}
            className={\`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary \${errors.${f.name} ? 'border-red-500' : 'border-gray-300'}\`}
            aria-label="${f.label}"
            aria-describedby="${f.name}-error"
            ${f.required ? 'aria-required="true"' : ''}
          />
          {errors.${f.name} && <p id="${f.name}-error" className="mt-1 text-sm text-red-600" role="alert">{errors.${f.name}}</p>}
        </div>`;
      })
      .join('\n');

    const errorsType = `Record<string, string>`;

    return `'use client';

${editImports}
import { useRouter } from 'next/navigation';
import { Toast } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';

export default function ${pageName}${editPropsType} {
  const router = useRouter();${editParamsLine}
${stateDeclarations}
  const [errors, setErrors] = useState<${errorsType}>({});
  const [loading, setLoading] = useState(${isEdit ? 'true' : 'false'});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
${editFetchBlock}
  const validate = (): boolean => {
    const newErrors: ${errorsType} = {};
${validationChecks}
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validate()) return;

    setSaving(true);
    try {
      const res = await fetch(${apiUrl}, {
        method: '${httpMethod}',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
${bodyFields}
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al ${isEdit ? 'actualizar' : 'crear'} ${e.lower}');
        setSaving(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/${e.plural}');
      }, 1500);
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner aria-label="Cargando formulario" />;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-background text-foreground" role="region" aria-label="${title}">
      {success && (
        <Toast
          message="${isEdit ? `${e.upper} actualizado exitosamente` : `${e.upper} creado exitosamente`}"
          type="success"
          onClose={() => setSuccess(false)}
          aria-live="polite"
        />
      )}

      <h1 className="text-2xl font-heading font-bold text-primary mb-6">${title}</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md" role="alert" aria-describedby="form-error">
          <span id="form-error">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Formulario de ${e.lower}">
${formFields}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
            aria-label="${submitLabel}"
          >
            {saving ? '${savingLabel}' : '${submitLabel}'}
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

  // ─── generateDetailPage ────────────────────────────────────

  static generateDetailPage(entityName: string, fields: FieldSpec[]): string {
    const e = this.getEntityNameVariants(entityName);

    const fieldDisplay = fields
      .map(
        (f) => `          <div>
            <dt className="text-sm font-medium text-secondary">${f.label}</dt>
            <dd className="mt-1 text-foreground">{${e.lower}.${f.name}${f.required ? '' : ` ?? '-'`}}</dd>
          </div>`,
      )
      .join('\n');

    return `'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';
import { Toast } from '@/components/shared';

${this.generateFieldInterface(entityName, fields)}

export default function ${e.upper}DetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [${e.lower}, set${e.upper}] = useState<${e.upper} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const load${e.upper} = async () => {
      try {
        const res = await fetch(\`/api/${e.plural}/\${params.id}\`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || '${e.upper} no encontrado');
          setLoading(false);
          return;
        }
        set${e.upper}(data.${e.lower});
      } catch (err) {
        setError('Error al cargar ${e.lower}');
      } finally {
        setLoading(false);
      }
    };
    load${e.upper}();
  }, [params.id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(\`/api/${e.plural}/\${params.id}\`, { method: 'DELETE' });
      if (res.ok) {
        setToastMessage('${e.upper} eliminado exitosamente');
        setToastType('success');
        setTimeout(() => router.push('/dashboard/${e.plural}'), 1500);
      } else {
        const data = await res.json();
        setToastMessage(data.error || 'Error al eliminar ${e.lower}');
        setToastType('error');
      }
    } catch (err) {
      setToastMessage('Error de conexión');
      setToastType('error');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return <LoadingSpinner aria-label="Cargando detalle de ${e.lower}" />;
  }

  if (error || !${e.lower}) {
    return (
      <div className="p-6 bg-background text-foreground" role="alert" aria-describedby="detail-error">
        <p id="detail-error" className="text-red-600">{error || '${e.upper} no encontrado'}</p>
        <button
          onClick={() => router.push('/dashboard/${e.plural}')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
          aria-label="Volver al listado"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-background text-foreground" role="region" aria-label="Detalle de ${e.upper}">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
          aria-live="polite"
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-primary">Detalle de ${e.upper}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(\`/dashboard/${e.plural}/\${params.id}/edit\`)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Editar ${e.lower}"
          >
            Editar
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            aria-label="Eliminar ${e.lower}"
          >
            Eliminar
          </button>
        </div>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-background p-6 rounded-lg shadow" role="list" aria-label="Campos de ${e.lower}">
${fieldDisplay}
          <div>
            <dt className="text-sm font-medium text-secondary">Creado</dt>
            <dd className="mt-1 text-foreground">{new Date(${e.lower}.createdAt).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-secondary">Actualizado</dt>
            <dd className="mt-1 text-foreground">{new Date(${e.lower}.updatedAt).toLocaleString()}</dd>
          </div>
      </dl>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Eliminar ${e.upper}"
        message="¿Estás seguro de que deseas eliminar este ${e.lower}? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        loading={deleting}
        aria-label="Confirmar eliminación"
      />
    </div>
  );
}
`;
  }
}

// SharedComponentsGenerator — Generates reusable UI component library
// for src/components/shared/ in the generated project output.
// All components use 'use client', Tailwind design system classes,
// TypeScript typing, and ARIA accessibility attributes.
//
// Design System Integration:
// - Uses Tailwind extended classes: text-primary, bg-primary, text-secondary,
//   bg-secondary, text-accent, bg-accent, text-foreground, bg-background,
//   font-heading, font-body, focus:ring-primary
// - CSS custom properties: var(--color-primary), var(--color-secondary),
//   var(--color-accent), var(--font-heading), var(--font-body)
// - NO hardcoded hex color values — all colors come from the design system
// - Semantic colors (red for errors/danger, green for success, yellow for
//   warning, blue for info) use Tailwind defaults as UI semantics
// - When Premium Engine design tokens are unavailable, components fall back
//   to Tailwind's default theme values which are always functional

export class SharedComponentsGenerator {
  // ─── DataTable ─────────────────────────────────────────────

  static generateDataTable(): string {
    return `'use client';

import { useState } from 'react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  onRowClick?: (row: Record<string, any>) => void;
  loading?: boolean;
  'aria-label'?: string;
}

export function DataTable({
  columns,
  data,
  sortField,
  sortDirection = 'asc',
  onSort,
  onRowClick,
  loading = false,
  'aria-label': ariaLabel = 'Data table',
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getSortIndicator = (col: Column) => {
    if (!col.sortable || sortField !== col.key) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  const getAriaSortValue = (col: Column): 'ascending' | 'descending' | 'none' | undefined => {
    if (!col.sortable) return undefined;
    if (sortField !== col.key) return 'none';
    return sortDirection === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <div className="relative overflow-x-auto rounded-lg border border-gray-200">
      {loading && (
        <div className="absolute inset-0 bg-background/70 flex items-center justify-center z-10" aria-live="polite">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status" aria-label="Cargando datos" />
        </div>
      )}

      {data.length === 0 && !loading ? (
        <div className="p-8 text-center text-secondary" role="status">
          <p className="text-lg font-medium">Sin datos</p>
          <p className="text-sm mt-1">No hay registros para mostrar.</p>
        </div>
      ) : (
        <>
          <table className="w-full text-sm text-left" role="table" aria-label={ariaLabel}>
            <thead className="text-xs uppercase bg-gray-50 text-secondary">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={\`px-4 py-3 font-medium \${col.sortable ? 'cursor-pointer select-none hover:text-primary' : ''}\`}
                    onClick={() => col.sortable && onSort?.(col.key)}
                    aria-sort={getAriaSortValue(col)}
                    tabIndex={col.sortable ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (col.sortable && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onSort?.(col.key);
                      }
                    }}
                  >
                    {col.label}{getSortIndicator(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className={\`border-b border-gray-100 \${onRowClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}\`}
                  onClick={() => onRowClick?.(row)}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onRowClick(row);
                    }
                  }}
                  role={onRowClick ? 'button' : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-foreground">
                      {row[col.key] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 text-sm text-secondary">
            <span>
              Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, data.length)} de {data.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
                aria-label="Página anterior"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
                aria-label="Página siguiente"
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
`;
  }

  // ─── Modal ───────────────────────────────────────────────

  static generateModal(): string {
    return `'use client';

import { useEffect, useRef, useCallback } from 'react';

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actions?: ModalAction[];
  'aria-label'?: string;
}

export function Modal({
  open,
  title,
  children,
  onClose,
  actions = [],
  'aria-label': ariaLabel,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = 'modal-title-' + title.toLowerCase().replace(/\\s+/g, '-');

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // Basic focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus the modal on open
      modalRef.current?.focus();
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const getButtonClasses = (variant?: string) => {
    switch (variant) {
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700';
      case 'secondary':
        return 'border border-gray-300 text-foreground hover:bg-gray-100';
      default:
        return 'bg-primary text-white hover:opacity-90';
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={ariaLabel}
        className="bg-background rounded-lg shadow-xl w-full max-w-md mx-4 p-6 focus:outline-none"
        tabIndex={-1}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id={titleId} className="text-lg font-heading font-bold text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-foreground transition-colors"
            aria-label="Cerrar modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="text-foreground mb-6">{children}</div>

        {actions.length > 0 && (
          <div className="flex justify-end gap-3">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={\`px-4 py-2 rounded-md text-sm font-medium transition-colors \${getButtonClasses(action.variant)}\`}
                aria-label={action.label}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
`;
  }

  // ─── FormField ─────────────────────────────────────────────

  static generateFormField(): string {
    return `'use client';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'number' | 'textarea' | 'checkbox' | 'select';
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  placeholder,
  options = [],
}: FormFieldProps) {
  const fieldId = \`field-\${name}\`;
  const errorId = \`\${name}-error\`;
  const describedBy = error ? errorId : undefined;

  const baseInputClasses = \`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors \${
    error ? 'border-red-500' : 'border-gray-300'
  } \${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-background'}\`;

  if (type === 'checkbox') {
    return (
      <div className="flex items-start gap-3">
        <input
          id={fieldId}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          aria-describedby={describedBy}
          aria-required={required}
        />
        <div>
          <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {error && (
            <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div>
        <label htmlFor={fieldId} className="block text-sm font-medium text-foreground mb-1">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          id={fieldId}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={baseInputClasses}
          aria-describedby={describedBy}
          aria-required={required}
        >
          <option value="">{placeholder || 'Seleccionar...'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div>
        <label htmlFor={fieldId} className="block text-sm font-medium text-foreground mb-1">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          id={fieldId}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          rows={4}
          className={baseInputClasses}
          aria-describedby={describedBy}
          aria-required={required}
        />
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium text-foreground mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={fieldId}
        type={type}
        value={type === 'number' ? Number(value) : String(value)}
        onChange={(e) =>
          type === 'number' ? onChange(Number(e.target.value)) : onChange(e.target.value)
        }
        disabled={disabled}
        placeholder={placeholder}
        className={baseInputClasses}
        aria-describedby={describedBy}
        aria-required={required}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
`;
  }

  // ─── Toast ───────────────────────────────────────────────

  static generateToast(): string {
    return `'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  autoDismiss?: number;
  'aria-live'?: 'polite' | 'assertive';
}

const typeStyles: Record<string, string> = {
  success: 'bg-green-50 border-green-400 text-green-800',
  error: 'bg-red-50 border-red-400 text-red-800',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
  info: 'bg-blue-50 border-blue-400 text-blue-800',
};

const typeIcons: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

export function Toast({
  message,
  type = 'info',
  onClose,
  autoDismiss = 5000,
  'aria-live': ariaLive = 'polite',
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onClose]);

  if (!visible) return null;

  return (
    <div
      className={\`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 border-l-4 rounded-md shadow-lg max-w-sm \${typeStyles[type] || typeStyles.info}\`}
      role="status"
      aria-live={ariaLive}
    >
      <span className="text-lg font-bold" aria-hidden="true">
        {typeIcons[type] || typeIcons.info}
      </span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setVisible(false);
          onClose();
        }}
        className="ml-2 text-current opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Cerrar notificación"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
`;
  }

  // ─── Sidebar ─────────────────────────────────────────────

  static generateSidebar(): string {
    return `'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  label: string;
  href: string;
  icon?: string;
}

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface SidebarProps {
  items?: SidebarItem[];
  sections?: SidebarSection[];
  collapsed?: boolean;
  'aria-label'?: string;
}

export function Sidebar({
  items = [],
  sections = [],
  collapsed: initialCollapsed = false,
  'aria-label': ariaLabel = 'Navegación principal',
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const renderItem = (item: SidebarItem) => (
    <Link
      key={item.href}
      href={item.href}
      className={\`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors \${
        isActive(item.href)
          ? 'bg-primary text-white font-medium'
          : 'text-secondary hover:bg-gray-100 hover:text-foreground'
      }\`}
      aria-current={isActive(item.href) ? 'page' : undefined}
    >
      {item.icon && <span className="text-lg" aria-hidden="true">{item.icon}</span>}
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );

  return (
    <nav
      role="navigation"
      aria-label={ariaLabel}
      className={\`flex flex-col h-full bg-background border-r border-gray-200 transition-all duration-200 \${
        collapsed ? 'w-16' : 'w-64'
      }\`}
    >
      <div className="flex items-center justify-end p-3 border-b border-gray-200">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-secondary hover:bg-gray-100 hover:text-foreground transition-colors"
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* Flat items */}
        {items.map(renderItem)}

        {/* Sections */}
        {sections.map((section, idx) => (
          <div key={section.title || idx} className="mt-4">
            {section.title && !collapsed && (
              <button
                onClick={() => toggleSection(section.title!)}
                className="flex items-center justify-between w-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-foreground"
                aria-expanded={!collapsedSections[section.title]}
                aria-controls={\`section-\${idx}\`}
              >
                <span>{section.title}</span>
                <svg
                  className={\`w-3 h-3 transition-transform \${collapsedSections[section.title!] ? '' : 'rotate-180'}\`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            {(!section.title || !collapsedSections[section.title]) && (
              <div id={\`section-\${idx}\`} className="mt-1 space-y-1">
                {section.items.map(renderItem)}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
`;
  }

  // ─── Utility Components (LoadingSpinner, EmptyState, ConfirmDialog) ──

  static generateUtilityComponents(): string {
    return `'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── LoadingSpinner ──────────────────────────────────────

interface LoadingSpinnerProps {
  'aria-label'?: string;
}

export function LoadingSpinner({
  'aria-label': ariaLabel = 'Cargando',
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center p-8" role="status" aria-label={ariaLabel}>
      <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}

// ─── EmptyState ──────────────────────────────────────────

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  'aria-label'?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  'aria-label': ariaLabel,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center p-12 text-center"
      role="status"
      aria-label={ariaLabel || title}
    >
      <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-heading font-semibold text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-secondary max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
          aria-label={actionLabel}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ─── ConfirmDialog ───────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  destructive?: boolean;
  'aria-label'?: string;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
  destructive = false,
  'aria-label': ariaLabel,
}: ConfirmDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = 'confirm-dialog-title';

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    },
    [onCancel],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      dialogRef.current?.focus();
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onCancel();
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={ariaLabel}
        className="bg-background rounded-lg shadow-xl w-full max-w-sm mx-4 p-6 focus:outline-none"
        tabIndex={-1}
      >
        <h2 id={titleId} className="text-lg font-heading font-bold text-foreground mb-2">
          {title}
        </h2>
        <p className="text-sm text-secondary mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-foreground hover:bg-gray-100 transition-colors disabled:opacity-50"
            aria-label={cancelLabel}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={\`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors disabled:opacity-50 \${
              destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:opacity-90'
            }\`}
            aria-label={confirmLabel}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
`;
  }

  // ─── Index ───────────────────────────────────────────────

  static generateIndex(components: string[]): string {
    const exports = components
      .map((name) => `export { ${name} } from './${name}';`)
      .join('\n');
    return `${exports}\n`;
  }
}

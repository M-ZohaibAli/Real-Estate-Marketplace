import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export function Button({ children, className, variant = 'primary', size = 'md', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}) {
  const variants = {
    primary: 'bg-brand-700 hover:bg-brand-800 text-white shadow-sm',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700',
    outline: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </button>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder:text-slate-400 transition-colors',
        className
      )}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder:text-slate-400 transition-colors resize-none',
        className
      )}
    />
  );
}

export function Select({ children, className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        'w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors appearance-none bg-no-repeat bg-right pr-10',
        className
      )}
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center' }}
    >
      {children}
    </select>
  );
}

export function Badge({ children, variant = 'default', className }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'luxury'; className?: string }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    info: 'bg-brand-50 text-brand-700 border border-brand-200',
    luxury: 'bg-gradient-to-r from-amber-500 to-amber-700 text-white',
  };
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full', variants[variant], className)}>
      {children}
    </span>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white border border-slate-200 rounded-2xl shadow-sm', className)}>
      {children}
    </div>
  );
}

export function Section({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return <section id={id} className={cn('py-16', className)}>{children}</section>;
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}

export function Label({ children, htmlFor, className }: { children: ReactNode; htmlFor?: string; className?: string }) {
  return <label htmlFor={htmlFor} className={cn('block text-sm font-medium text-slate-700 mb-1.5', className)}>{children}</label>;
}

export function Modal({ open, onClose, children, title, size = 'md' }: { open: boolean; onClose: () => void; children: ReactNode; title?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <div className={cn('relative bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col', sizes[size])} onClick={e => e.stopPropagation()}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('bg-slate-200 animate-pulse rounded-lg', className)} />;
}

export function Stat({ label, value, sub, icon }: { label: string; value: string | number; sub?: string; icon?: ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-emerald-600 mt-1 font-medium">{sub}</p>}
        </div>
        {icon && <div className="p-2.5 bg-brand-50 text-brand-700 rounded-xl">{icon}</div>}
      </div>
    </Card>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="text-center py-16 px-4">
      {icon && <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 text-slate-400 rounded-full mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-slate-500 mt-2 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all',
            active === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

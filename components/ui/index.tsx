import { clsx } from 'clsx';
import Link from 'next/link';
import type { ReactNode } from 'react';

// ── BUTTON ───────────────────────────────────────────
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
}

export function Button({ children, variant = 'primary', size = 'md', href, onClick, disabled, type = 'button', className, fullWidth }: ButtonProps) {
  const base = clsx(
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer border-2 select-none',
    {
      'px-4 py-2 text-sm': size === 'sm',
      'px-5 py-2.5 text-sm': size === 'md',
      'px-7 py-3.5 text-base': size === 'lg',
      'w-full': fullWidth,
      'opacity-60 pointer-events-none': disabled,
    },
    {
      'border-transparent hover:-translate-y-0.5 hover:shadow-lg': variant === 'primary',
      'border-transparent hover:-translate-y-0.5': variant === 'secondary',
      'bg-transparent hover:shadow-sm': variant === 'outline',
      'border-transparent bg-transparent': variant === 'ghost',
    },
    className
  );

  const styles: React.CSSProperties =
    variant === 'primary' ? { background: 'var(--accent)', color: 'var(--navy)', borderColor: 'transparent' }
    : variant === 'secondary' ? { background: 'var(--blue)', color: 'white', borderColor: 'transparent' }
    : variant === 'outline' ? { borderColor: 'var(--blue)', color: 'var(--blue)', background: 'transparent' }
    : { borderColor: 'transparent', color: 'var(--blue)', background: 'transparent' };

  if (href) {
    return <Link href={href} className={base} style={styles}>{children}</Link>;
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base} style={styles}>
      {children}
    </button>
  );
}

// ── BADGE ────────────────────────────────────────────
type BadgeVariant = 'green' | 'yellow' | 'blue' | 'red' | 'gray' | 'orange';
export function Badge({ children, variant = 'blue' }: { children: ReactNode; variant?: BadgeVariant }) {
  const styles: Record<BadgeVariant, string> = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-700',
    orange: 'bg-orange-100 text-orange-800',
  };
  return (
    <span className={clsx('inline-block px-2.5 py-0.5 rounded-full text-xs font-bold', styles[variant])}>
      {children}
    </span>
  );
}

// ── CARD ─────────────────────────────────────────────
export function Card({ children, className, hover = true }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={clsx(
      'bg-white rounded-2xl border shadow-sm',
      hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-200',
      className
    )} style={{ borderColor: 'var(--gray-100)' }}>
      {children}
    </div>
  );
}

// ── SECTION HEADER ───────────────────────────────────
export function SectionHeader({ label, title, subtitle, center = false }: {
  label?: string; title: string; subtitle?: string; center?: boolean;
}) {
  return (
    <div className={clsx('mb-12', center && 'text-center')}>
      {label && <div className={clsx('section-label', center && 'justify-center')}>{label}</div>}
      <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--navy)' }}>{title}</h2>
      {subtitle && (
        <p className={clsx('text-base leading-relaxed', center ? 'max-w-xl mx-auto' : 'max-w-xl')}
          style={{ color: 'var(--gray-600)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── PAGE HERO ────────────────────────────────────────
export function PageHero({ breadcrumb, title, subtitle }: {
  breadcrumb?: string; title: string; subtitle?: string;
}) {
  return (
    <section className="py-20 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, var(--navy) 0%, #1B5CA8 100%)',
      color: 'white',
    }}>
      <div className="absolute right-0 top-0 w-80 h-80 rounded-full opacity-10"
        style={{ background: 'var(--accent)', transform: 'translate(30%,-30%)' }} />
      <div className="max-w-7xl mx-auto px-6">
        {breadcrumb && (
          <div className="text-xs mb-4 flex gap-2 items-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--accent)' }}>{breadcrumb}</span>
          </div>
        )}
        <h1 className="text-3xl md:text-5xl text-white font-black mb-4">{title}</h1>
        {subtitle && (
          <p className="text-base md:text-lg max-w-xl" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

// ── SKELETON ─────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('skeleton', className)} />;
}

// ── STAT CARD ────────────────────────────────────────
export function StatCard({ num, label }: { num: string; label: string }) {
  return (
    <Card className="p-8 text-center" hover={false}>
      <div className="text-4xl font-black mb-2" style={{ fontFamily: "'Playfair Display',serif", color: 'var(--blue)' }}>
        {num}
      </div>
      <div className="text-sm font-medium" style={{ color: 'var(--gray-600)' }}>{label}</div>
    </Card>
  );
}

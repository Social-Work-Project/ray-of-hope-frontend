'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart } from 'lucide-react';
import { clsx } from 'clsx';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/stories', label: 'Stories' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/97 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-18.25">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-full flex items-center justify-center" >
              <Image src="/logo.png" alt="Ray of Hope Society" width={44} height={44} />
            </div>
            <div className="leading-none">
              <div className="font-bold text-sm" style={{ fontFamily: "'Playfair Display',serif", color: 'var(--navy)' }}>
                Ray of Hope Society
              </div>
              <div className="text-[0.65rem] mt-0.5" style={{ color: 'var(--gray-600)' }}>
                Nagarkata · Est. 2008
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  'px-3.5 py-2 rounded-lg text-[0.87rem] font-medium transition-all',
                  pathname === l.href
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-500 hover:text-blue-700 hover:bg-gray-50'
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/volunteer"
              className="px-5 py-2 rounded-lg text-sm font-semibold border-2 transition-all"
              style={{ borderColor: 'var(--blue)', color: 'var(--blue)' }}
            >
              Volunteer
            </Link>
            <Link
              href="/donate"
              className="px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'var(--accent)', color: 'var(--navy)' }}
            >
              <Heart className="w-3.5 h-3.5 fill-current" /> Donate
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-[73px] left-0 right-0 z-40 bg-white border-b shadow-lg lg:hidden">
          <div className="flex flex-col p-4 gap-1">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  'px-4 py-3 rounded-lg text-[0.95rem] font-medium transition-all',
                  pathname === l.href ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-3 pb-1">
              <Link href="/volunteer" onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-3 rounded-lg text-sm font-semibold border-2"
                style={{ borderColor: 'var(--blue)', color: 'var(--blue)' }}>
                Volunteer
              </Link>
              <Link href="/donate" onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-3 rounded-lg text-sm font-semibold"
                style={{ background: 'var(--accent)', color: 'var(--navy)' }}>
                ♥ Donate
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

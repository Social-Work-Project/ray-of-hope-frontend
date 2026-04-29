"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const quickLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/programs', label: 'Our Programs' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/stories', label: 'Success Stories' },
  { href: '/team', label: 'Our Team' },
];

const involvedLinks = [
  { href: '/donate', label: 'Donate' },
  { href: '/volunteer', label: 'Volunteer' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/testimonials', label: 'Testimonials' },
];

export function Footer() {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) return null;
  return (
    <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.7)' }} className="pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="text-white font-bold text-lg mb-3" style={{ fontFamily: "'Playfair Display',serif" }}>
              Nagarkata Ray of Hope Society
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
              A nonprofit organisation serving the underprivileged communities of Dooars, West Bengal. Founded on the belief that every person deserves hope.
            </p>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)', lineHeight: 1.8 }}>
              Reg. No: S/IL/54901<br />
              NGO Darpan: WB/2024/0416685<br />
              West Bengal Society Act 1961
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm transition-colors hover:text-yellow-400"
                    style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="text-white text-sm font-bold mb-4">Get Involved</h4>
            <ul className="space-y-2">
              {involvedLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm transition-colors hover:text-yellow-400"
                    style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-bold mb-4">Contact</h4>
            <div className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <p>Sukhani Busty, Nagrakata<br />Dist. Jalpaiguri, WB – 735225</p>
              <a href="tel:+919641361319" className="block hover:text-yellow-400 transition-colors">
                +91 9641361319
              </a>
              <a href="mailto:nagarkatarayofhopesociety@gmail.com"
                className="block hover:text-yellow-400 transition-colors break-all text-xs">
                nagarkatarayofhopesociety@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
          <div>
            © 2025 Nagarkata Ray of Hope Society. All rights reserved.{' '}
            <Link href="/admin" className="ml-2 hover:text-white transition-colors">Staff Login</Link>
          </div>
          <div className="flex gap-3">
            {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
              <div key={i}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-base cursor-pointer transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.08)' }}>
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

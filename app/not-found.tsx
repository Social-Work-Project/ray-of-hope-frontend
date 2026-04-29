import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6" style={{ background: 'var(--gray-50)' }}>
      <div>
        <div className="text-8xl font-black mb-4" style={{ fontFamily: "'Playfair Display',serif", color: 'var(--gray-200)' }}>404</div>
        <h1 className="text-3xl font-black mb-3" style={{ color: 'var(--navy)' }}>Page Not Found</h1>
        <p className="text-base mb-8 max-w-sm mx-auto" style={{ color: 'var(--gray-600)' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/"
          className="inline-flex px-7 py-3.5 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg"
          style={{ background: 'var(--blue)', color: 'white' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

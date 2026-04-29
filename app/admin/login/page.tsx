'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAdminStore } from '@/store/adminStore';

export default function AdminLoginPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAdminStore(s => s.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const ok = login(user, pass);
    setLoading(false);
    if (ok) { toast.success('Welcome back, Admin!'); router.push('/admin/dashboard'); }
    else toast.error('Invalid credentials. Try admin / admin123');
  };

  const inputCls = "w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200";

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gray-50)' }}>
      <div className="bg-white rounded-2xl p-10 shadow-xl border w-full max-w-sm" style={{ borderColor: 'var(--gray-100)' }}>
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--blue)' }}>
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-white" strokeWidth={2}>
              <path d="M12 2 L4 8 L4 20 L20 20 L20 8 Z" strokeLinejoin="round" />
              <circle cx="12" cy="14" r="3" />
            </svg>
          </div>
          <h2 className="text-2xl font-black" style={{ color: 'var(--navy)' }}>Admin Panel</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--gray-400)' }}>Ray of Hope Society — Staff Login</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--gray-800)' }}>Username</label>
            <input value={user} onChange={e => setUser(e.target.value)} placeholder="admin"
              className={inputCls} style={{ borderColor: 'var(--gray-200)' }} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--gray-800)' }}>Password</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••"
              className={inputCls} style={{ borderColor: 'var(--gray-200)' }} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-60 mt-2"
            style={{ background: 'var(--blue)', color: 'white' }}>
            {loading ? 'Signing in...' : 'Sign In to Dashboard'}
          </button>
          <p className="text-center text-xs mt-3" style={{ color: 'var(--gray-400)' }}>Demo: admin / admin123</p>
        </form>
      </div>
    </div>
  );
}
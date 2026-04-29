'use client';
import { useEffect } from 'react';
import { AdminGuard } from '@/components/Admin/AdminGuard';
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { useAdminStore } from '@/store/adminStore';
import { getTestimonials } from '@/lib/data';
import { Badge } from '@/components/ui';
import { toast } from 'sonner';

export default function AdminTestimonialsPage() {
  const { testimonials, setTestimonials, updateTestimonialStatus } = useAdminStore();
  useEffect(() => { getTestimonials().then(setTestimonials); }, []);

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1">
          <div className="bg-white border-b px-8 py-4 sticky top-0 z-10" style={{ borderColor: 'var(--gray-100)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--navy)' }}>Testimonials Manager</h2>
          </div>
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: 'var(--gray-100)' }}>
              <div className="px-5 py-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--gray-100)' }}>
                <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>All Testimonials ({testimonials.length})</h3>
                <button onClick={() => toast.info('Add testimonial coming soon!')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--blue)' }}>
                  + Add Testimonial
                </button>
              </div>
              <table className="w-full text-sm">
                <thead><tr style={{ background: 'var(--gray-50)' }}>
                  {['Name','Role','Preview','Status','Actions'].map(h => (
                    <th key={h} className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--gray-400)' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {testimonials.map(t => (
                    <tr key={t.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--gray-100)' }}>
                      <td className="px-5 py-3 font-medium whitespace-nowrap" style={{ color: 'var(--text)' }}>{t.name}</td>
                      <td className="px-5 py-3" style={{ color: 'var(--gray-600)' }}>{t.role}</td>
                      <td className="px-5 py-3" style={{ color: 'var(--gray-600)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text}</td>
                      <td className="px-5 py-3"><Badge variant={t.status === 'published' ? 'green' : 'yellow'}>{t.status}</Badge></td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => { updateTestimonialStatus(t.id, t.status === 'published' ? 'draft' : 'published'); toast.success('Status updated'); }}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-blue-50"
                            style={{ borderColor: 'var(--sky)', color: 'var(--sky)' }}>
                            {t.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                          <button onClick={() => toast.info('Edit coming soon!')}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-gray-50"
                            style={{ borderColor: 'var(--gray-200)', color: 'var(--gray-800)' }}>Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
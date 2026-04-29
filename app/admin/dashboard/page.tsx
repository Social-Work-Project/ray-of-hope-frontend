'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { AdminGuard } from '@/components/Admin/AdminGuard';
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { useAdminStore } from '@/store/adminStore';
import { getEvents, getVolunteerApplications, getDonationInquiries, getTestimonials } from '@/lib/data';
import { Badge } from '@/components/ui';

const stats = [
  { label: 'Total Events', value: '5', delta: '↑ 2 this year', color: 'var(--blue)' },
  { label: 'Volunteer Applications', value: '23', delta: '↑ 8 this month', color: '#22c55e' },
  { label: 'Donation Inquiries', value: '14', delta: '↑ 3 this week', color: 'var(--accent)' },
  { label: 'Unread Messages', value: '7', delta: '3 new today', color: '#f59e0b' },
];

export default function AdminDashboard() {
  const { setEvents, setVolunteers, setDonations, setTestimonials, volunteers, events } = useAdminStore();

  useEffect(() => {
    Promise.all([getEvents(), getVolunteerApplications(), getDonationInquiries(), getTestimonials()])
      .then(([ev, vol, don, test]) => { setEvents(ev); setVolunteers(vol); setDonations(don); setTestimonials(test); });
  }, []);

  const pending = volunteers.filter(v => v.status === 'pending').slice(0, 5);
  const upcoming = events.filter(e => e.status === 'published').slice(0, 4);

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 flex flex-col">
          <div className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10" style={{ borderColor: 'var(--gray-100)' }}>
            <h2 className="font-bold text-lg" style={{ fontFamily: "'DM Sans',sans-serif", color: 'var(--navy)' }}>Dashboard Overview</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: 'var(--gray-400)' }}>Welcome, Admin</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--blue)' }}>A</div>
            </div>
          </div>
          <div className="p-8 flex-1">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {stats.map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: 'var(--gray-100)' }}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--gray-400)' }}>{s.label}</div>
                  <div className="text-3xl font-black mb-1" style={{ fontFamily: "'Playfair Display',serif", color: s.color }}>{s.value}</div>
                  <div className="text-xs font-medium" style={{ color: '#22c55e' }}>{s.delta}</div>
                </div>
              ))}
            </div>
            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: 'var(--gray-100)' }}>
                <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--gray-100)' }}>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>Recent Volunteer Applications</h3>
                  <Link href="/admin/volunteers" className="text-xs font-semibold" style={{ color: 'var(--sky)' }}>View All →</Link>
                </div>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: 'var(--gray-50)' }}>
                    {['Name','City','Status','Action'].map(h => <th key={h} className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--gray-400)' }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {pending.map(v => (
                      <tr key={v.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--gray-100)' }}>
                        <td className="px-5 py-3 font-medium" style={{ color: 'var(--text)' }}>{v.name}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--gray-600)' }}>{v.city}</td>
                        <td className="px-5 py-3"><Badge variant={v.status === 'approved' ? 'green' : v.status === 'declined' ? 'red' : 'yellow'}>{v.status}</Badge></td>
                        <td className="px-5 py-3"><Link href="/admin/volunteers" className="text-xs font-semibold px-3 py-1 rounded-lg border transition-all hover:bg-blue-50" style={{ borderColor: 'var(--sky)', color: 'var(--sky)' }}>Review</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: 'var(--gray-100)' }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--gray-100)' }}>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>Upcoming Events</h3>
                </div>
                <div className="p-4 space-y-3">
                  {upcoming.map(e => (
                    <div key={e.id} className="p-3 rounded-xl" style={{ background: 'var(--gray-50)' }}>
                      <div className="text-xs font-bold mb-1" style={{ color: 'var(--sky)' }}>{e.date}</div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{e.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
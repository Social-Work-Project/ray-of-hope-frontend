'use client';
import { useEffect, useState } from 'react';

import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { useAdminStore } from '@/store/adminStore';
import { getVolunteerApplications } from '@/lib/data';
import { Badge } from '@/components/ui';
import { toast } from 'sonner';
import AdminGuard from '@/components/Admin/AdminGuard';

export default function AdminVolunteersPage() {
  const { volunteers, setVolunteers, updateVolunteerStatus } = useAdminStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { getVolunteerApplications().then(setVolunteers); }, []);

  const filtered = volunteers.filter(v =>
    (filterStatus === 'all' || v.status === filterStatus) &&
    (v.name.toLowerCase().includes(search.toLowerCase()) || v.city.toLowerCase().includes(search.toLowerCase()))
  );

  const handleStatus = (id: string, status: 'approved' | 'declined') => {
    updateVolunteerStatus(id, status);
    toast.success(`Application ${status}`);
  };

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1">
          <div className="bg-white border-b px-8 py-4 sticky top-0 z-10" style={{ borderColor: 'var(--gray-100)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--navy)' }}>Volunteer Applications</h2>
          </div>
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: 'var(--gray-100)' }}>
              <div className="px-5 py-4 border-b flex flex-wrap items-center gap-3" style={{ borderColor: 'var(--gray-100)' }}>
                <h3 className="font-bold text-sm mr-auto" style={{ color: 'var(--navy)' }}>All Applications ({filtered.length})</h3>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or city..."
                  className="px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: 'var(--gray-200)', width: 220 }} />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: 'var(--gray-200)' }}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr style={{ background: 'var(--gray-50)' }}>
                    {['Name','Email','City','Skills','Availability','Status','Actions'].map(h => (
                      <th key={h} className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--gray-400)' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filtered.map(v => (
                      <tr key={v.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--gray-100)' }}>
                        <td className="px-5 py-3 font-medium whitespace-nowrap" style={{ color: 'var(--text)' }}>{v.name}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--gray-600)' }}>{v.email}</td>
                        <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--gray-600)' }}>{v.city}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--gray-600)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.skills}</td>
                        <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--gray-600)' }}>{v.availability}</td>
                        <td className="px-5 py-3"><Badge variant={v.status === 'approved' ? 'green' : v.status === 'declined' ? 'red' : 'yellow'}>{v.status}</Badge></td>
                        <td className="px-5 py-3">
                          {v.status === 'pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleStatus(v.id, 'approved')}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-green-50"
                                style={{ borderColor: '#86efac', color: '#16a34a' }}>Approve</button>
                              <button onClick={() => handleStatus(v.id, 'declined')}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-red-50"
                                style={{ borderColor: '#f87171', color: '#dc2626' }}>Decline</button>
                            </div>
                          )}
                          {v.status !== 'pending' && <span className="text-xs" style={{ color: 'var(--gray-400)' }}>Resolved</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
'use client';
import { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { useAdminStore } from '@/store/adminStore';
import { getEvents } from '@/lib/data';
import { Badge } from '@/components/ui';
import { toast } from 'sonner';
import AdminGuard from '@/components/Admin/AdminGuard';
import { EventModal } from '@/components/Admin/EventModal';

export default function AdminEventsPage() {
  const { events, setEvents, deleteEvent, updateEvent } = useAdminStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { getEvents().then(setEvents); }, []);

  const filtered = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: string, title: string) => {
    deleteEvent(id);
    toast.success(`"${title}" deleted`);
  };

  const handleToggle = (id: string, status: 'published' | 'draft') => {
    const next = status === 'published' ? 'draft' : 'published';
    updateEvent(id, { status: next });
    toast.success(`Event ${next === 'published' ? 'published' : 'unpublished'}`);
  };
const handleSave = () => {
    
}
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1">
          <div className="bg-white border-b px-8 py-4 sticky top-0 z-10" style={{ borderColor: 'var(--gray-100)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--navy)' }}>Manage Events</h2>
          </div>
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: 'var(--gray-100)' }}>
              <div className="px-5 py-4 border-b flex items-center justify-between flex-wrap gap-3" style={{ borderColor: 'var(--gray-100)' }}>
                <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>All Events ({filtered.length})</h3>
                <div className="flex gap-2">
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..."
                    className="px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: 'var(--gray-200)', width: 200 }} />
                  <button onClick={() => setShowModal(true)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--blue)' }}>
                    + Add Event
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr style={{ background: 'var(--gray-50)' }}>
                    {['Event Name','Date','Location','Volunteers','Status','Actions'].map(h => (
                      <th key={h} className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--gray-400)' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filtered.map(e => (
                      <tr key={e.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--gray-100)' }}>
                        <td className="px-5 py-3 font-medium" style={{ color: 'var(--text)' }}>{e.title}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--gray-600)' }}>{e.date}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--gray-600)' }}>{e.location}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--gray-600)' }}>{e.volunteersNeeded}</td>
                        <td className="px-5 py-3"><Badge variant={e.status === 'published' ? 'green' : 'yellow'}>{e.status}</Badge></td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => handleToggle(e.id, e.status)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-blue-50"
                              style={{ borderColor: 'var(--sky)', color: 'var(--sky)' }}>
                              {e.status === 'published' ? 'Unpublish' : 'Publish'}
                            </button>
                            <button onClick={() => handleDelete(e.id, e.title)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-red-50"
                              style={{ borderColor: '#f87171', color: '#dc2626' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
        {showModal && <EventModal isOpen onSave={handleSave} onClose={() => setShowModal(false)} />}
      </div>
    </AdminGuard>
  );
}
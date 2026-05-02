'use client';
import { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { Badge } from '@/components/ui';
import { toast } from 'sonner';
import AdminGuard from '@/components/Admin/AdminGuard';
import { EventModal } from '@/components/Admin/EventModal';
import { AdminService } from '@/services/adminService';
import { EventResponse } from '@/types';

export default function AdminEventsPage() {

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(null); // ← track which event is being edited

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await AdminService.getEvents();
      setEvents(res.data.results);
    } catch (error) {
      toast.error('Failed to fetch events. Please try again later.');
    }
  };

  const filtered = events.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id: string) => {
    try {
      await AdminService.deleteEvent(id);
      setEvents(events.filter(e => e.reference_id !== id));
      toast.success('Event deleted!');
    } catch (error) {
      toast.error('Failed to delete event. Please try again.');
    }
  };

  // ── Open modal for a new event ──
  const handleAddNew = () => {
    setSelectedEvent(null);
    setShowModal(true);
  };

  // ── Open modal pre-filled for an existing event ──
  const handleEdit = (event: EventResponse) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  // ── Close modal and clear selection ──
  const handleClose = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  // ── Called by EventModal with FormData ──
  const handleSave = async (formData: FormData) => {
    try {
      if (selectedEvent) {
        // Edit — pass the existing event's id so the service knows which to PATCH/PUT
        await AdminService.updateEvent(selectedEvent.reference_id, formData);
        toast.success('Event updated!');
      } else {
        // Create
        await AdminService.createEvent(formData);
        toast.success('Event created!');
      }
      fetchEvents(); // refresh the table
    } catch (error) {
      toast.error('Failed to save event. Please try again.');
    }
  };

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
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search events..."
                    className="px-3 py-2 border rounded-lg text-sm outline-none"
                    style={{ borderColor: 'var(--gray-200)', width: 200 }}
                  />
                  <button
                    onClick={handleAddNew}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                    style={{ background: 'var(--blue)' }}
                  >
                    + Add Event
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'var(--gray-50)' }}>
                      {['Event Name', 'Date', 'Location', 'Volunteers', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--gray-400)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(e => (
                      <tr key={e.reference_id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--gray-100)' }}>
                        <td className="px-5 py-3 font-medium" style={{ color: 'var(--text)' }}>{e.name}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--gray-600)' }}>{e.event_date}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--gray-600)' }}>{e.location}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--gray-600)' }}>{e.volunteers_needed}</td>
                        <td className="px-5 py-3">
                          <Badge variant={e.status === 'published' ? 'green' : 'yellow'}>{e.status}</Badge>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(e)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-blue-50 cursor-pointer"
                              style={{ borderColor: 'var(--sky)', color: 'var(--sky)' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(e.reference_id)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-red-50 cursor-pointer"
                              style={{ borderColor: '#f87171', color: '#dc2626' }}
                            >
                              Delete
                            </button>
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

        {showModal && (
          <EventModal
            isOpen
            event={selectedEvent}   // null → create mode, EventResponse → edit mode
            onSave={handleSave}
            onClose={handleClose}
          />
        )}
      </div>
    </AdminGuard>
  );
}
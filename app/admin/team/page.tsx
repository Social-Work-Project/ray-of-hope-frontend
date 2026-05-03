'use client';
import Image from 'next/image';

import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { Badge } from '@/components/ui';
import { toast } from 'sonner';
import AdminGuard from '@/components/Admin/AdminGuard';
import { useState } from 'react';
import { TeamMembersModal } from '@/components/Admin/TeamMembersModal';

const teamData = [
  { id: '1', name: 'Arjun Biswakarma', role: 'Founder & Secretary', since: '16 Sep 2008', contact: '+91 9933071201', photo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&q=80' },
  { id: '2', name: 'Antony Praveen K M', role: 'President', since: '10 Jun 2025', contact: '+91 9800321965', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' },
  { id: '3', name: 'Kanchan Siwa', role: 'Treasurer', since: '12 Mar 2018', contact: '+91 9382733711', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80' },
  { id: '4', name: 'Alka Oraon Keshor', role: 'Board Member', since: '10 Jun 2025', contact: '+91 8942024382', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80' },
  { id: '5', name: 'Benu Kami', role: 'Board Member', since: '10 Oct 2021', contact: '+91 7364049046', photo: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=100&q=80' },
  { id: '6', name: 'Rajkapur Karmakar', role: 'Board Member', since: '10 Jun 2025', contact: '+91 8317821877', photo: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=100&q=80' },
  { id: '7', name: 'Suganti Lakra Oraon', role: 'Board Member', since: '10 Jun 2025', contact: '+91 8967491403', photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=80' },
];

export default function AdminTeamPage() {
    const [openModal, setOpenModal] = useState(false);
  
  
    const handleSave = (formData: FormData) => {
      // Implementation for saving testimonial
      toast.success('Testimonial saved! (This is a placeholder action.)');
      setOpenModal(false);
    };
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1">
          <div className="bg-white border-b px-8 py-4 sticky top-0 z-10" style={{ borderColor: 'var(--gray-100)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--navy)' }}>Team Members</h2>
          </div>
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: 'var(--gray-100)' }}>
              <div className="px-5 py-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--gray-100)' }}>
                <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>Governing Body ({teamData.length} members)</h3>
                <button
                  onClick={() => setOpenModal(true)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer bg-(--blue) hover:bg-blue-800/80 transition-all"
                  >
                  + Add Member
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'var(--gray-50)' }}>
                      {['Member', 'Role', 'Working Since', 'Contact', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                          style={{ color: 'var(--gray-400)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {teamData.map(m => (
                      <tr key={m.id} className="border-t hover:bg-gray-50 transition-colors"
                        style={{ borderColor: 'var(--gray-100)' }}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Image src={m.photo} alt={m.name} width={32} height={32}
                              className="rounded-full object-cover shrink-0"
                              style={{ width: 32, height: 32 }} />
                            <span className="font-medium whitespace-nowrap" style={{ color: 'var(--text)' }}>{m.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--gray-600)' }}>{m.role}</td>
                        <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--gray-600)' }}>{m.since}</td>
                        <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--gray-600)' }}>{m.contact}</td>
                        <td className="px-5 py-3"><Badge variant="green">Active</Badge></td>
                        <td className="px-5 py-3 flex gap-2">
                          <button
                            onClick={() => toast.info(`Edit form for ${m.name} coming soon!`)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-blue-50 cursor-pointer"
                            style={{ borderColor: 'var(--sky)', color: 'var(--sky)' }}>
                            Edit
                          </button>
                          <button
                            onClick={() => toast.error(`Delete action for ${m.name} is not implemented yet!`)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-red-50 cursor-pointer"
                            style={{ borderColor: '#f87171', color: '#dc2626' }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {openModal && <TeamMembersModal isOpen={openModal} onClose={() => setOpenModal(false)} onSave={handleSave} />}
        </main>
      </div>
    </AdminGuard>
  );
}

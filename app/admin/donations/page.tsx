'use client';
import { useEffect } from 'react';
import { AdminGuard } from '@/components/Admin/AdminGuard';
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { useAdminStore } from '@/store/adminStore';
import { getDonationInquiries } from '@/lib/data';
import { Badge } from '@/components/ui';

export default function AdminDonationsPage() {
  const { donations, setDonations } = useAdminStore();
  useEffect(() => { getDonationInquiries().then(setDonations); }, []);

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1">
          <div className="bg-white border-b px-8 py-4 sticky top-0 z-10" style={{ borderColor: 'var(--gray-100)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--navy)' }}>Donation Details</h2>
          </div>
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: 'var(--gray-100)' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--gray-100)' }}>
                <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>Donation Enquiries ({donations.length})</h3>
              </div>
              <table className="w-full text-sm">
                <thead><tr style={{ background: 'var(--gray-50)' }}>
                  {['Name','Contact','Method','Amount','Status','Date','Action'].map(h => (
                    <th key={h} className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--gray-400)' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {donations.map(d => (
                    <tr key={d.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--gray-100)' }}>
                      <td className="px-5 py-3 font-medium" style={{ color: 'var(--text)' }}>{d.name}</td>
                      <td className="px-5 py-3" style={{ color: 'var(--gray-600)' }}>{d.contact}</td>
                      <td className="px-5 py-3" style={{ color: 'var(--gray-600)' }}>{d.method}</td>
                      <td className="px-5 py-3 font-semibold" style={{ color: 'var(--navy)' }}>{d.amount}</td>
                      <td className="px-5 py-3"><Badge variant={d.status === 'received' ? 'green' : d.status === 'arranged' ? 'blue' : 'yellow'}>{d.status}</Badge></td>
                      <td className="px-5 py-3" style={{ color: 'var(--gray-600)' }}>{d.createdAt}</td>
                      <td className="px-5 py-3">
                        <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-gray-50"
                          style={{ borderColor: 'var(--gray-200)', color: 'var(--gray-800)' }}>View</button>
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
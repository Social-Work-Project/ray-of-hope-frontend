'use client';
import { useState } from 'react';
import { AdminGuard } from '@/components/Admin/AdminGuard';
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { toast } from 'sonner';

const inputCls = "w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200";

export default function AdminCMSPage() {
  const [heroTitle, setHeroTitle] = useState("Bringing Hope to the Hearts of Dooars");
  const [heroSub, setHeroSub] = useState("Nagarkata Ray of Hope Society serves the underprivileged communities of West Bengal's Dooars region.");
  const [hostelCount, setHostelCount] = useState("16+");
  const [familiesCount, setFamiliesCount] = useState("500+");
  const [mission, setMission] = useState("To be Hope for No Hope — reaching the unprivileged, the left-out, and those with no one to help.");
  const [vision, setVision] = useState("To create a platform where every individual can stand on their own feet with dignity.");
  const [upi, setUpi] = useState("+91 9641361319");
  const [email, setEmail] = useState("nagarkatarayofhopesociety@gmail.com");
  const [address, setAddress] = useState("Sukhani Busty, Nagrakata, Jalpaiguri, WB – 735225");

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1">
          <div className="bg-white border-b px-8 py-4 sticky top-0 z-10" style={{ borderColor: 'var(--gray-100)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--navy)' }}>CMS Content Editor</h2>
          </div>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Home Page */}
            <div className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: 'var(--gray-100)' }}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>Home Page Content</h3>
                <button onClick={() => toast.success('Home page content saved!')}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: 'var(--blue)' }}>Save Changes</button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-xs font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>Hero Title</label>
                  <input value={heroTitle} onChange={e => setHeroTitle(e.target.value)} className={inputCls} style={{ borderColor: 'var(--gray-200)' }} /></div>
                <div><label className="block text-xs font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>Hero Subtitle</label>
                  <textarea value={heroSub} onChange={e => setHeroSub(e.target.value)} rows={3} className={inputCls} style={{ borderColor: 'var(--gray-200)', resize: 'vertical' }} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>Children in Hostel</label>
                    <input value={hostelCount} onChange={e => setHostelCount(e.target.value)} className={inputCls} style={{ borderColor: 'var(--gray-200)' }} /></div>
                  <div><label className="block text-xs font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>Families Reached</label>
                    <input value={familiesCount} onChange={e => setFamiliesCount(e.target.value)} className={inputCls} style={{ borderColor: 'var(--gray-200)' }} /></div>
                </div>
              </div>
            </div>

            {/* About Page */}
            <div className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: 'var(--gray-100)' }}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>About Page Content</h3>
                <button onClick={() => toast.success('About page content saved!')}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: 'var(--blue)' }}>Save Changes</button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-xs font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>Mission Statement</label>
                  <textarea value={mission} onChange={e => setMission(e.target.value)} rows={3} className={inputCls} style={{ borderColor: 'var(--gray-200)', resize: 'vertical' }} /></div>
                <div><label className="block text-xs font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>Vision Statement</label>
                  <textarea value={vision} onChange={e => setVision(e.target.value)} rows={3} className={inputCls} style={{ borderColor: 'var(--gray-200)', resize: 'vertical' }} /></div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-xl shadow-sm border p-6 lg:col-span-2" style={{ borderColor: 'var(--gray-100)' }}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>Contact & Payment Details</h3>
                <button onClick={() => toast.success('Payment details updated!')}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: 'var(--blue)' }}>Update</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><label className="block text-xs font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>UPI Contact</label>
                  <input value={upi} onChange={e => setUpi(e.target.value)} className={inputCls} style={{ borderColor: 'var(--gray-200)' }} /></div>
                <div><label className="block text-xs font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>Contact Email</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} className={inputCls} style={{ borderColor: 'var(--gray-200)' }} /></div>
                <div><label className="block text-xs font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>Address</label>
                  <input value={address} onChange={e => setAddress(e.target.value)} className={inputCls} style={{ borderColor: 'var(--gray-200)' }} /></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
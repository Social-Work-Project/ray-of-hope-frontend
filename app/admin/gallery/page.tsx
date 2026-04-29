'use client';
import Image from 'next/image';
import { AdminGuard } from '@/components/Admin/AdminGuard';
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { toast } from 'sonner';

const images = [
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300&q=80", label: "Community Work" },
  { src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=300&q=80", label: "Food Distribution" },
  { src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&q=80", label: "Medical Camp" },
  { src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=80", label: "Sports Training" },
];

export default function AdminGalleryPage() {
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1">
          <div className="bg-white border-b px-8 py-4 sticky top-0 z-10" style={{ borderColor: 'var(--gray-100)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--navy)' }}>Gallery Manager</h2>
          </div>
          <div className="p-8">
            <div className="flex justify-between mb-6">
              <h3 className="font-bold" style={{ color: 'var(--navy)' }}>All Images ({images.length})</h3>
              <button onClick={() => toast.info('Upload coming soon!')}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--blue)' }}>
                + Upload Images
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden shadow-sm border group" style={{ borderColor: 'var(--gray-100)' }}>
                  <Image src={img.src} alt={img.label} width={300} height={160} className="w-full object-cover" style={{ height: 160 }} />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <button onClick={() => toast.info('Deleted!')} className="text-white text-sm font-semibold bg-red-500 px-3 py-1.5 rounded-lg">✕ Remove</button>
                  </div>
                  <div className="p-2.5 text-xs font-medium" style={{ color: 'var(--gray-600)' }}>{img.label}</div>
                </div>
              ))}
              <div onClick={() => toast.info('Upload coming soon!')}
                className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-gray-50" style={{ borderColor: 'var(--gray-200)', minHeight: 180 }}>
                <div className="text-3xl" style={{ color: 'var(--gray-400)' }}>+</div>
                <div className="text-sm" style={{ color: 'var(--gray-400)' }}>Add Image</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
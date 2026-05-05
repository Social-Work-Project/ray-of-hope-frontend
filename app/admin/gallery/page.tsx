'use client';
import { useEffect, useState, useCallback } from 'react';
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { toast } from 'sonner';
import AdminGuard from '@/components/Admin/AdminGuard';
import { GalleryModal } from '@/components/Admin/GalleryModal';
import { AdminService } from '@/services/adminService';
import {
  Pencil, Trash2, ImageIcon, FolderOpen,
  Loader2, Plus, Eye, EyeOff, X, ChevronLeft, ChevronRight, Upload,
} from 'lucide-react';
import { Album, GalleryCategory, GalleryImage } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────


// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose, onChange }: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const img = images[index];
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && index < images.length - 1) onChange(index + 1);
      if (e.key === 'ArrowLeft' && index > 0) onChange(index - 1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [index, images.length, onClose, onChange]);

  return (
    <div
      className="fixed inset-0 z-99999 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <button onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/10 z-10">
        <X className="w-5 h-5" />
      </button>
      <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium">
        {index + 1} / {images.length}
      </span>
      {index > 0 && (
        <button onClick={e => { e.stopPropagation(); onChange(index - 1); }}
          className="absolute left-4 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/10 z-10">
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {index < images.length - 1 && (
        <button onClick={e => { e.stopPropagation(); onChange(index + 1); }}
          className="absolute right-4 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/10 z-10">
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
      <div className="mx-20 max-w-4xl" onClick={e => e.stopPropagation()}>
        <img src={img.image} alt={img.title}
          className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl mx-auto block" />
        <p className="text-white/60 text-sm text-center mt-3 font-medium">{img.title}</p>
      </div>
    </div>
  );
}

// ── Album Detail Modal ────────────────────────────────────────────────────────
function AlbumDetailModal({ album, onClose, onDeleteCategory, onDeleteImage, onOpenUploadModal, deletingId }: {
    album: Album;
  onClose: () => void;
  onDeleteCategory: (album: Album) => void;
  onDeleteImage: (img: GalleryImage) => void;
  onOpenUploadModal: (album: Album) => void; // ← new
  deletingId: string | null;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && lightboxIndex === null) onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, lightboxIndex]);

  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);

  const allPublished  = album.images.every(i => i.is_active);
  const somePublished = album.images.some(i => i.is_active);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-9998 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: 'rgba(11,31,58,0.65)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <div
          className="relative w-full sm:max-w-3xl rounded-t-3xl sm:rounded-2xl shadow-2xl bg-white"
          style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b shrink-0"
            style={{ borderColor: 'var(--gray-100)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--gray-100)' }}>
                <FolderOpen className="w-4.5 h-4.5" style={{ color: 'var(--blue)' }} />
              </div>
              <div>
                <h3 className="font-black text-base" style={{ color: 'var(--navy)' }}>{album.category.name}</h3>
                <p className="text-xs" style={{ color: 'var(--gray-400)' }}>
                  {album.images.length} photo{album.images.length !== 1 ? 's' : ''}
                  {' · '}
                  {allPublished ? 'All published' : somePublished ? 'Partially published' : 'All drafts'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Add images button */}
              <button
                onClick={() => onOpenUploadModal(album)}
               
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                style={{ background: 'var(--blue)', color: 'white' }}
              >
          
                   <Upload className="w-3.5 h-3.5" />
                Add Photos
              </button>
              {/* Delete category */}
              <button
                onClick={() => onDeleteCategory(album)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all hover:bg-red-50"
                style={{ borderColor: '#fca5a5', color: '#dc2626' }}
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Album
              </button>
              <button onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100 ml-1">
                <X className="w-4 h-4" style={{ color: 'var(--gray-500)' }} />
              </button>
            </div>
          </div>

          {/* Image grid */}
          <div className="flex-1 overflow-y-auto p-5">
            {album.images.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'var(--gray-100)' }}>
                  <ImageIcon className="w-6 h-6" style={{ color: 'var(--gray-300)' }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: 'var(--gray-500)' }}>No photos in this album</p>
                <button
                   onClick={() => onOpenUploadModal(album)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background: 'var(--blue)' }}>
                  + Add Photos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {album.images.map((img, idx) => (
                  <div key={img.reference_id}
                    className="relative group rounded-xl overflow-hidden border aspect-square cursor-pointer"
                    style={{ borderColor: 'var(--gray-100)' }}
                    onClick={() => setLightboxIndex(idx)}>
                    <img src={img.image} alt={img.title} className="w-full h-full object-cover" />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex flex-col items-end justify-between p-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)' }}>
                      {/* Delete button top-right */}
                      <button
                        onClick={e => { e.stopPropagation(); onDeleteImage(img); }}
                        disabled={deletingId === img.reference_id}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50"
                        style={{ background: 'rgba(239,68,68,0.9)' }}
                        title="Delete"
                      >
                        {deletingId === img.reference_id
                          ? <Loader2 className="w-3 h-3 text-white animate-spin" />
                          : <Trash2 className="w-3 h-3 text-white" />}
                      </button>
                      {/* Title + status bottom */}
                      <div className="w-full">
                        <p className="text-white text-xs font-semibold truncate">{img.title}</p>
                        <span className="flex items-center gap-0.5 text-white/70 text-xs mt-0.5">
                          {img.is_active ? <><Eye className="w-2.5 h-2.5" /> Published</> : <><EyeOff className="w-2.5 h-2.5" /> Draft</>}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add more tile */}
                <button
                  onClick={() => onOpenUploadModal(album)}
                  className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all hover:border-blue-400 hover:bg-blue-50"
                  style={{ borderColor: 'var(--gray-200)' }}
                >
                  <Plus className="w-5 h-5" style={{ color: 'var(--gray-400)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--gray-400)' }}>Add more</span>
                </button>
              </div>
            )}
          </div>

          {/* Hidden file input */}
        
        </div>
      </div>

      {/* Lightbox (higher z than modal) */}
      {lightboxIndex !== null && (
        <Lightbox
          images={album.images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      )}
    </>
  );
}

// ── Album card (single cover image) ──────────────────────────────────────────
function AlbumCard({ album, onClick }: { album: Album; onClick: () => void }) {
  const cover = album.images[0];
  const allPublished  = album.images.every(i => i.is_active);
  const somePublished = album.images.some(i => i.is_active);

  return (
    <div
      className="rounded-2xl border overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
      style={{ borderColor: 'var(--gray-100)', background: 'white' }}
      onClick={onClick}
    >
      {/* Cover */}
      <div className="relative" style={{ height: 200, background: 'var(--gray-100)' }}>
        {cover ? (
          <img src={cover.image} alt={cover.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-10 h-10" style={{ color: 'var(--gray-300)' }} />
          </div>
        )}
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          {album.images.length === 0 ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: 'rgba(0,0,0,0.45)', color: 'white' }}>Empty</span>
          ) : allPublished ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: '#dcfce7', color: '#16a34a' }}>
              <Eye className="w-3 h-3" /> Published
            </span>
          ) : somePublished ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: '#fef9c3', color: '#a16207' }}>
              <Eye className="w-3 h-3" /> Partial
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: 'rgba(0,0,0,0.45)', color: 'white' }}>
              <EyeOff className="w-3 h-3" /> Draft
            </span>
          )}
        </div>
        {/* Photo count badge */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.5)', color: 'white' }}>
          {album.images.length} photo{album.images.length !== 1 ? 's' : ''}
        </div>
        {/* Dim overlay on hover */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center gap-2">
        <FolderOpen className="w-4 h-4 shrink-0" style={{ color: 'var(--blue)' }} />
        <span className="font-bold text-sm truncate flex-1" style={{ color: 'var(--navy)' }}>
          {album.category.name}
        </span>
        <ChevronRight className="w-4 h-4 shrink-0" style={{ color: 'var(--gray-300)' }} />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminGalleryPage() {
  const [images, setImages]               = useState<GalleryImage[]>([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeAlbum, setActiveAlbum]     = useState<Album | null>(null);
  const [deletingId, setDeletingId]       = useState<string | null>(null);
  const [addingImages, setAddingImages]   = useState(false);
  const [uploadForAlbum, setUploadForAlbum] = useState<Album | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await AdminService.getGalleryItems();
      setImages(res.data.results ?? []);
    } catch {
      toast.error('Failed to load gallery.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const fetchCategories = useCallback(async () => {
    const res = await AdminService.getGalleryCategories();
    return (res.data.results ?? []).map((c: GalleryCategory) => ({
      id: c.reference_id,
      category_name: c.name,
    }));
  }, []);

  // Group images into albums
  const allAlbums: Album[] = Object.values(
    images.reduce<Record<string, Album>>((acc, img) => {
      const key = img.category.reference_id;
      if (!acc[key]) acc[key] = { category: img.category, images: [] };
      acc[key].images.push(img);
      return acc;
    }, {})
  );

  const albums = allAlbums.filter(a =>
    a.category.name.toLowerCase().includes(search.toLowerCase())
  );

  // Keep activeAlbum in sync with fresh image data
  const syncedActiveAlbum = activeAlbum
    ? allAlbums.find(a => a.category.reference_id === activeAlbum.category.reference_id) ?? null
    : null;

  // ── Delete a single image ──
  const handleDeleteImage = async (img: GalleryImage) => {
    if (!confirm(`Delete "${img.title}"?`)) return;
    setDeletingId(img.reference_id);
    try {
      await AdminService.deleteSinglePhoto(img.reference_id);
      setImages(prev => prev.filter(i => i.reference_id !== img.reference_id));
      toast.success('Photo deleted.');
    } catch {
      toast.error('Failed to delete photo.');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Delete entire category (and all its images) ──
  const handleDeleteCategory = async (album: Album) => {
    if (!confirm(`Delete the entire "${album.category.name}" album and all its photos? This cannot be undone.`)) return;
    try {
      // Delete all images in parallel
      await AdminService.deleteGalleryCategory(album.category.reference_id)
      setImages(prev => prev.filter(i => i.category.reference_id !== album.category.reference_id));
      setActiveAlbum(null);
      toast.success(`Album "${album.category.name}" deleted.`);
    } catch {
      toast.error('Failed to delete album.');
    }
  };

  // ── Add images to existing album ──
  const handleAddImages = async (album: Album, files: FileList) => {
    setAddingImages(true);
    try {
      const arr = Array.from(files).slice(0, 20);
      await Promise.all(arr.map(file => {
        const fd = new FormData();
        fd.append('category', album.category.reference_id);
        fd.append('title', album.category.name);
        fd.append('image', file, file.name);
        fd.append('is_active', 'true');
        return AdminService.createGallery(fd);
      }));
      toast.success(`${arr.length} photo${arr.length !== 1 ? 's' : ''} added.`);
      await fetchImages();
    } catch {
      toast.error('Failed to upload photos.');
    } finally {
      setAddingImages(false);
    }
  };

  // ── Create new gallery (via GalleryModal) ──
  const handleSave = async (fd: FormData) => {
    await AdminService.createGallery(fd);
    toast.success('Gallery uploaded!');
    await fetchImages();
  };

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1">

          {/* Header */}
          <div className="bg-white border-b px-8 py-4 sticky top-0 z-10 flex items-center justify-between flex-wrap gap-3"
            style={{ borderColor: 'var(--gray-100)' }}>
            <div>
              <h2 className="font-bold text-lg" style={{ color: 'var(--navy)' }}>Gallery Manager</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--gray-400)' }}>
                {allAlbums.length} album{allAlbums.length !== 1 ? 's' : ''} · {images.length} photo{images.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <div className="flex gap-2">
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search albums..."
                className="px-3 py-2 border rounded-lg text-sm outline-none"
                style={{ borderColor: 'var(--gray-200)', width: 200 }} />
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white flex items-center gap-1.5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ background: 'var(--blue)' }}>
                <Plus className="w-4 h-4" /> Upload Images
              </button>
            </div>
          </div>

          <div className="p-8">
            {loading && (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--blue)' }} />
              </div>
            )}

            {!loading && images.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 rounded-2xl border-2 border-dashed"
                style={{ borderColor: 'var(--gray-200)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--gray-100)' }}>
                  <ImageIcon className="w-7 h-7" style={{ color: 'var(--gray-400)' }} />
                </div>
                <p className="font-bold text-base mb-1" style={{ color: 'var(--navy)' }}>No gallery images yet</p>
                <p className="text-sm mb-5" style={{ color: 'var(--gray-400)' }}>Upload your first images to get started.</p>
                <button onClick={() => setShowUploadModal(true)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'var(--blue)' }}>
                  + Upload Images
                </button>
              </div>
            )}

            {!loading && images.length > 0 && albums.length === 0 && (
              <div className="text-center py-20">
                <p className="font-semibold" style={{ color: 'var(--gray-600)' }}>No albums match "{search}"</p>
                <button onClick={() => setSearch('')} className="text-sm mt-2 underline" style={{ color: 'var(--sky)' }}>
                  Clear search
                </button>
              </div>
            )}

            {!loading && albums.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {albums.map(album => (
                  <AlbumCard key={album.category.reference_id} album={album}
                    onClick={() => setActiveAlbum(album)} />
                ))}
                {/* New album tile */}
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all hover:bg-gray-50 hover:border-blue-300 min-h-65"
                  style={{ borderColor: 'var(--gray-200)' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gray-100)' }}>
                    <Plus className="w-5 h-5" style={{ color: 'var(--gray-400)' }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--gray-400)' }}>New Album</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Album detail modal */}
      {syncedActiveAlbum && (
  <AlbumDetailModal
    album={syncedActiveAlbum}
    onClose={() => setActiveAlbum(null)}
    onDeleteCategory={handleDeleteCategory}
    onDeleteImage={handleDeleteImage}
    onOpenUploadModal={(album) => {
      setUploadForAlbum(album);   // ← remember which album
      setShowUploadModal(true);
    }}
    deletingId={deletingId}
  />
)}

      {/* Upload / create new gallery modal */}
      {showUploadModal && (
  <GalleryModal
    isOpen
    item={uploadForAlbum ? {          // ← pre-fill category
      category: uploadForAlbum.category,
    } : null}
    onClose={() => { setShowUploadModal(false); setUploadForAlbum(null); }}
    onSave={async (fd) => {
      await handleSave(fd);
      setShowUploadModal(false);
      setUploadForAlbum(null);
    }}
    fetchCategories={fetchCategories}
  />
)}
    </AdminGuard>
  );
}
"use client"
import { PageHero } from '@/components/ui';
import { useEffect, useState, useCallback } from 'react';
import { WebsiteService } from '@/services/websiteService';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface GalleryImage {
  reference_id: string;
  title: string;
  image: string;
  category: {
    reference_id: string;
    name: string;
  };
  is_active: boolean;
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose, onChange }: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const img = images[index];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && index < images.length - 1) onChange(index + 1);
      if (e.key === 'ArrowLeft' && index > 0) onChange(index - 1);
    };
    window.addEventListener('keydown', h);
    return () => {
      window.removeEventListener('keydown', h);
      document.body.style.overflow = '';
    };
  }, [index, images.length, onClose, onChange]);

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/10 z-10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium select-none">
        {index + 1} / {images.length}
      </span>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={e => { e.stopPropagation(); onChange(index - 1); }}
          className="absolute left-4 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/10 z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next */}
      {index < images.length - 1 && (
        <button
          onClick={e => { e.stopPropagation(); onChange(index + 1); }}
          className="absolute right-4 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/10 z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Image */}
      <div className="mx-16 max-w-5xl w-full" onClick={e => e.stopPropagation()}>
        <img
          src={img.image}
          alt={img.title}
          className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl mx-auto block"
        />
        <div className="text-center mt-4">
          <p className="text-white/80 text-sm font-semibold">{img.title}</p>
          <p className="text-white/40 text-xs mt-1">{img.category.name}</p>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const [allImages, setAllImages]         = useState<GalleryImage[]>([]);
  const [loading, setLoading]             = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await WebsiteService.getAllGallery();
        // Only show published/active images on the public page
        const results: GalleryImage[] = (res.data.results ?? []).filter(
          (img: GalleryImage) => img.is_active
        );
        setAllImages(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Derive unique categories from the images list — no extra API call needed
  const categories = [
    { reference_id: 'all', name: 'All' },
    ...Array.from(
      new Map(
        allImages.map(img => [img.category.reference_id, img.category])
      ).values()
    ),
  ];

  // Filtered images for the active tab
  const filtered =
    activeCategory === 'all'
      ? allImages
      : allImages.filter(img => img.category.reference_id === activeCategory);

  // When lightbox is open it navigates within filtered list
  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);

  return (
    <div className="pt-18.25">
      <PageHero
        breadcrumb="Gallery"
        title="Photo Gallery"
        subtitle="Moments captured from our programs, events, and community interactions across the Dooars region."
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* ── Category filter tabs ── */}
          <div className="flex gap-2 flex-wrap mb-10">
            {loading ? (
              // Skeleton pills while loading
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 rounded-lg animate-pulse"
                  style={{ width: 80 + i * 20, background: 'var(--gray-100)' }}
                />
              ))
            ) : (
              categories.map(cat => {
                const isActive = activeCategory === cat.reference_id;
                return (
                  <button
                    key={cat.reference_id}
                    onClick={() => {
                      setActiveCategory(cat.reference_id);
                      setLightboxIndex(null);
                    }}
                    className="px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all hover:-translate-y-0.5 hover:shadow-sm"
                    style={{
                      background: isActive ? 'var(--sky)' : 'white',
                      color: isActive ? 'white' : 'var(--gray-600)',
                      borderColor: isActive ? 'var(--sky)' : 'var(--gray-200)',
                    }}
                  >
                    {cat.name}
                    {cat.reference_id !== 'all' && (
                      <span
                        className="ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--gray-100)',
                          color: isActive ? 'white' : 'var(--gray-500)',
                        }}
                      >
                        {allImages.filter(img => img.category.reference_id === cat.reference_id).length}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* ── Loading skeleton grid ── */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl animate-pulse"
                  style={{
                    height: i % 5 === 0 ? 300 : 240,
                    background: 'var(--gray-100)',
                  }}
                />
              ))}
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg font-bold" style={{ color: 'var(--navy)' }}>No photos here yet</p>
              <p className="text-sm mt-1" style={{ color: 'var(--gray-400)' }}>Check back soon for updates.</p>
            </div>
          )}

          {/* ── Masonry-style grid ── */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((img, i) => {
                // Every 5th image (0-indexed: 0, 5, 10…) spans 2 columns for visual rhythm
                const isWide = i % 5 === 0;
                return (
                  <div
                    key={img.reference_id}
                    className={`relative overflow-hidden rounded-2xl group cursor-pointer ${isWide ? 'sm:col-span-2' : ''}`}
                    onClick={() => openLightbox(i)}
                  >
                    <img
                      src={img.image}
                      alt={img.title}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ height: isWide ? 300 : 240 }}
                      loading="lazy"
                    />
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2"
                      style={{ background: 'rgba(11,31,58,0.6)' }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/60"
                        style={{ background: 'rgba(255,255,255,0.15)' }}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                      </div>
                      <p className="text-white text-xs font-semibold uppercase tracking-wider">{img.category.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Result count ── */}
          {!loading && filtered.length > 0 && (
            <p className="text-center text-xs mt-8" style={{ color: 'var(--gray-400)' }}>
              Showing {filtered.length} photo{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'all' && ` in ${categories.find(c => c.reference_id === activeCategory)?.name}`}
            </p>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && filtered.length > 0 && (
        <Lightbox
          images={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
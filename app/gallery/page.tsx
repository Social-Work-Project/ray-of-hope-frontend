import Image from 'next/image';
import { PageHero } from '@/components/ui';

const images = [
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80", alt: "Community Work", category: "Community", large: true },
  { src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=500&q=80", alt: "Children", category: "Hostel Life" },
  { src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&q=80", alt: "Medical Camp", category: "Medical Camps" },
  { src: "https://images.unsplash.com/photo-1591711436-50c7fee96a8a?w=500&q=80", alt: "Tea Garden", category: "Community" },
  { src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80", alt: "Food Distribution", category: "Humanitarian", large: true },
  { src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80", alt: "Football Training", category: "Sports" },
  { src: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&q=80", alt: "Children Smiling", category: "Hostel Life" },
  { src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=500&q=80", alt: "Awareness Camp", category: "Events" },
  { src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=500&q=80", alt: "Education Session", category: "Education" },
];

const cats = ["All", "Hostel Life", "Medical Camps", "Sports", "Events", "Community", "Humanitarian"];

export default function GalleryPage() {
  return (
    <div className='pt-18.25'>
      <PageHero breadcrumb="Gallery" title="Photo Gallery"
        subtitle="Moments captured from our programs, events, and community interactions across the Dooars region." />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 flex-wrap mb-10">
            {cats.map((c, i) => (
              <button key={i} className="px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:shadow-sm"
                style={{ background: i === 0 ? "var(--sky)" : "white", color: i === 0 ? "white" : "var(--gray-600)", borderColor: i === 0 ? "var(--sky)" : "var(--gray-200)" }}>
                {c}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div key={i} className={`relative overflow-hidden rounded-2xl group cursor-pointer ${img.large ? "sm:col-span-2" : ""}`}>
                <Image src={img.src} alt={img.alt} width={800} height={img.large ? 300 : 240}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ height: img.large ? 300 : 240 }} />
                <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl mb-1">🔍</div>
                    <div className="text-xs font-semibold uppercase tracking-wider">{img.category}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
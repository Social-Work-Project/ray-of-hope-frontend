import Image from 'next/image';
import { getStories } from '@/lib/data';
import { PageHero, Card } from '@/components/ui';

export default async function StoriesPage() {
  const stories = await getStories();
  return (
    <div className='pt-18.25'>
      <PageHero breadcrumb="Success Stories" title="Stories of Impact & Hope"
        subtitle="Every life touched by our work is a story worth telling. Here are some of the journeys of transformation." />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {stories.map(s => (
              <Card key={s.id} className="p-0 overflow-hidden">
                <div className="overflow-hidden" style={{ height: 210 }}>
                  <Image src={s.image} alt={s.title} width={600} height={210}
                    className="w-full object-cover transition-transform duration-500 hover:scale-105" style={{ height: 210 }} />
                </div>
                <div className="p-7">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ background: "var(--accent-soft)", color: "#b87a10" }}>{s.tag}</span>
                  <h3 className="text-lg font-bold mb-3" style={{ color: "var(--navy)" }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--gray-600)" }}>{s.excerpt}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
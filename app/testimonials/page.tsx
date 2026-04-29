import Image from 'next/image';
import { getTestimonials } from '@/lib/data';
import { PageHero, Card } from '@/components/ui';

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  return (
    <div className='pt-18.25'>
      <PageHero breadcrumb="Testimonials" title="Voices from the Community"
        subtitle="Real stories from the people whose lives have been touched by Nagarkata Ray of Hope Society." />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <Card key={t.id} className="p-8 relative">
                <div className="absolute top-6 left-6 text-6xl leading-none font-black opacity-20"
                  style={{ fontFamily: "'Playfair Display',serif", color: "var(--accent)" }}>&ldquo;</div>
                <p className="text-sm leading-loose mb-6 mt-4" style={{ color: "var(--gray-600)" }}>{t.text}</p>
                <div className="flex items-center gap-3">
                  <Image src="/images/user.png" alt={t.name} width={44} height={44} className="rounded-full object-cover shrink-0" />
                  <div>
                    <div className="font-bold text-sm" style={{ color: "var(--navy)" }}>{t.name}</div>
                    <div className="text-xs" style={{ color: "var(--gray-400)" }}>{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
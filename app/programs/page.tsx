import Link from 'next/link';
import { getPrograms } from '@/lib/data';
import { PageHero, Card } from '@/components/ui';

const planned = [
  { icon: "✂️", title: "Vocational Training", desc: "Cutting & Tailoring, Computer, Beautician, Mobile Repair courses" },
  { icon: "🏢", title: "Youth Centre", desc: "Multipurpose hall, library, classrooms, recreational activities" },
  { icon: "🌱", title: "Sustainable Agriculture", desc: "Dairy farming, organic agriculture training for local families" },
  { icon: "🏡", title: "Old Age Home", desc: "Dignified care for elderly who are neglected or homeless" },
];

export default async function ProgramsPage() {
  const programs = await getPrograms();
  return (
    <div className='pt-18.25'>
      <PageHero breadcrumb="Programs" title="Our Programs & Services"
        subtitle="Comprehensive programmes addressing the root causes of poverty, ill-health, and vulnerability in the Dooars region." />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map(p => (
              <Card key={p.id} className="p-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6" style={{ background: p.color }}>{p.icon}</div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--navy)" }}>{p.title}</h3>
                <p className="text-base leading-relaxed mb-4" style={{ color: "var(--gray-600)" }}>{p.description}</p>
                <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: p.color, color: "var(--navy)" }}>{p.detail}</div>
              </Card>
            ))}
          </div>

          <div className="mt-20">
            <div className="section-label">Coming Soon</div>
            <h2 className="text-3xl font-black mb-3" style={{ color: "var(--navy)" }}>Expansion Plans</h2>
            <p className="text-base mb-10 max-w-xl" style={{ color: "var(--gray-600)" }}>Our project proposal outlines ambitious plans to serve the Nagrakata Block and Jalpaiguri District more comprehensively.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {planned.map((p, i) => (
                <Card key={i} className="p-7 text-center">
                  <div className="text-3xl mb-3">{p.icon}</div>
                  <h4 className="font-bold mb-2" style={{ fontFamily: "'DM Sans',sans-serif", color: "var(--navy)" }}>{p.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--gray-600)" }}>{p.desc}</p>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/donate" className="inline-flex px-7 py-3.5 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: "var(--accent)", color: "var(--navy)" }}>Support Our Expansion →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
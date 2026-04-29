import Image from 'next/image';
import { getTeam } from '@/lib/data';
import { PageHero } from '@/components/ui';

export default async function TeamPage() {
  const team = await getTeam();
  return (
    <div className='pt-18.25'>
      <PageHero breadcrumb="Team" title="Our Leadership Team"
        subtitle="Dedicated individuals who volunteer their time, skills, and heart to serve the communities of Dooars." />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-label">Board Members</div>
          <h2 className="text-3xl font-black mb-10" style={{ color: "var(--navy)" }}>The People Behind the Mission</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {team.map(m => (
              <div key={m.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md" style={{ borderColor: "var(--gray-100)" }}>
                <div className="overflow-hidden" style={{ height: 220 }}>
                  <Image src={m.photo} alt={m.name} width={400} height={220}
                    className="w-full object-cover transition-transform duration-500 hover:scale-105 object-top" style={{ height: 220 }} />
                </div>
                <div className="p-5 text-center">
                  <div className="font-bold text-base mb-1" style={{ fontFamily: "'Playfair Display',serif", color: "var(--navy)" }}>{m.name}</div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--sky)" }}>{m.role}</div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--gray-600)" }}>{m.bio}</p>
                  <div className="text-xs" style={{ color: "var(--gray-400)" }}>Since {m.workingSince}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
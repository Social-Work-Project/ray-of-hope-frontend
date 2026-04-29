import Link from 'next/link';
import { getEvents } from '@/lib/data';
import { PageHero, Card, Badge } from '@/components/ui';

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <div className='pt-18.25'>
      <PageHero breadcrumb="Events" title="Events & Activities"
        subtitle="Join us in our community initiatives, awareness camps, and celebration of milestones." />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-label">2025 Calendar</div>
          <h2 className="text-3xl font-black mb-10" style={{ color: "var(--navy)" }}>Upcoming Events</h2>
          <div className="flex flex-col gap-5 max-w-4xl">
            {events.map(e => (
              <Card key={e.id} className="p-0 overflow-hidden">
                <Link href={`/events/${e.id}`} className="flex gap-6 p-6 items-center hover:bg-gray-50 transition-colors group">
                  <div className="rounded-xl px-5 py-4 text-center shrink-0" style={{ background: "var(--blue)", color: "white", minWidth: 70 }}>
                    <div className="text-3xl font-black leading-none" style={{ fontFamily: "'Playfair Display',serif" }}>{e.day}</div>
                    <div className="text-xs uppercase tracking-wider mt-1 opacity-80">{e.month}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-base" style={{ color: "var(--navy)" }}>{e.title}</h3>
                      <Badge variant={e.status === "published" ? "green" : "yellow"}>{e.status}</Badge>
                    </div>
                    <p className="text-sm mb-2 line-clamp-1" style={{ color: "var(--gray-600)" }}>{e.summary}</p>
                    <div className="flex gap-5 flex-wrap">
                      <span className="text-xs" style={{ color: "var(--gray-400)" }}>📍 {e.location}</span>
                      <span className="text-xs" style={{ color: "var(--gray-400)" }}>🕐 {e.time}</span>
                      <span className="text-xs" style={{ color: "var(--gray-400)" }}>👥 {e.volunteersNeeded} volunteers needed</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold hidden sm:block group-hover:translate-x-1 transition-transform" style={{ color: "var(--sky)" }}>View Details →</span>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
"use client"
import Link from 'next/link';
import { PageHero, Card, Badge } from '@/components/ui';
import { useEffect, useState } from 'react';
import { EventResponse } from '@/types';
import { useRouter } from 'next/navigation';
import { formatToAmPm } from '@/helpers/timeFormatter';
import { WebsiteService } from '@/services/websiteService';

export function parseEventDate(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.getUTCDate().toString(),
    month: date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await WebsiteService.getAllEvents();
        setEvents(res.data.results || [])
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
    fetchEvents();
  }, [router]);



  return (
    <div className='pt-18.25'>
      <PageHero breadcrumb="Events" title="Events & Activities"
        subtitle="Join us in our community initiatives, awareness camps, and celebration of milestones." />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-label">{new Date().getFullYear()} Calendar</div>
          <h2 className="text-3xl font-black mb-10" style={{ color: "var(--navy)" }}>Upcoming Events</h2>
          <div className="flex flex-col gap-5 max-w-4xl">
            {events.map(e => {
              const { day, month } = parseEventDate(e.event_date);
              return (
                <Card key={e.reference_id} className="p-0 overflow-hidden">
                  <Link href={`/events/${e.reference_id}`} className="flex gap-6 p-6 items-center hover:bg-gray-50 transition-colors group">
                    <div className="rounded-xl px-5 py-4 text-center shrink-0" style={{ background: "var(--blue)", color: "white", minWidth: 70 }}>
                      <div className="text-3xl font-black leading-none" style={{ fontFamily: "'Playfair Display',serif" }}>{day}</div>
                      <div className="text-xs uppercase tracking-wider mt-1 opacity-80">{month}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-base" style={{ color: "var(--navy)" }}>{e.name}</h3>
                        <Badge variant="green">{e.status}</Badge>
                      </div>
                      <p className="text-sm mb-2 line-clamp-1" style={{ color: "var(--gray-600)" }}>{e.description}</p>
                      <div className="flex gap-5 flex-wrap">
                        <span className="text-xs" style={{ color: "var(--gray-400)" }}>📍 {e.location}</span>
                        <span className="text-xs" style={{ color: "var(--gray-400)" }}>🕐 {formatToAmPm(e.start_time)} - {formatToAmPm(e.end_time)}</span>
                        <span className="text-xs" style={{ color: "var(--gray-400)" }}>👥 {e.volunteers_needed} volunteers needed</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold hidden sm:block group-hover:translate-x-1 transition-transform" style={{ color: "var(--sky)" }}>View Details →</span>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
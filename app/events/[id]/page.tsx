"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { EventVolunteerForm } from "@/components/Sections/EventVolunteerForm";
import { useEffect, useState } from "react";
import { WebsiteService } from "@/services/websiteService";
import { EventDetailResponse } from "@/types";
import { formatToAmPm } from "@/helpers/timeFormatter";

export default function EventDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [event, setEvent] = useState<EventDetailResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await WebsiteService.getEventFromId(id || "");
        setEvent(res.data.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="pt-18.25">
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--navy) 0%, #1B5CA8 100%)",
          color: "white",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="text-xs mb-4 flex gap-2 items-center"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/events" className="hover:text-white transition-colors">
              Events
            </Link>
            <span>/</span>
            <span style={{ color: "var(--accent)" }}>{event.name}</span>
          </div>
          <h1 className="text-3xl md:text-4xl text-white font-black mb-3">
            {event.name}
          </h1>
          <p className="text-base" style={{ color: "rgba(255,255,255,0.75)" }}>
            {event.location} · {event.event_date}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
              <Image
                src={event.logo || "/images/event-placeholder.jpg"}
                alt={event.name}
                width={800}
                height={360}
                className="w-full object-cover"
                style={{ height: 340 }}
              />
            </div>
            <div className="section-label">About This Event</div>
            <h2
              className="text-2xl font-black mb-4"
              style={{ color: "var(--navy)" }}
            >
              {event.name}
            </h2>
            <p
              className="text-base leading-loose mb-8"
              style={{ color: "var(--gray-600)" }}
            >
              {event.description}
            </p>
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: "var(--navy)" }}
            >
              Schedule
            </h3>
            <div className="space-y-3 mb-12">
              {event.schedule?.map((s, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-center px-4 py-3 rounded-xl"
                  style={{ background: "var(--gray-50)" }}
                >
                  <span
                    className="text-sm font-bold min-w-20"
                    style={{ color: "var(--sky)" }}
                  >
                    {formatToAmPm(s.time)}
                  </span>
                  <span className="text-sm" style={{ color: "var(--text)" }}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
            <EventVolunteerForm
              eventId={event.reference_id}
              eventTitle={event.name}
            />
          </div>

          <div className="space-y-5">
            <div
              className="bg-white rounded-2xl p-6 shadow-sm border"
              style={{ borderColor: "var(--gray-100)" }}
            >
              <h4
                className="font-bold mb-5"
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  color: "var(--navy)",
                }}
              >
                Event Details
              </h4>
              <div className="space-y-4">
                {[
                  { icon: "📅", label: "Date", value: event.event_date },
                  { icon: "🕐", label: "Time", value: { start: formatToAmPm(event.start_time), end: formatToAmPm(event.end_time) } },
                  { icon: "📍", label: "Venue", value: event.location },
                  {
                    icon: "👤",
                    label: "Organiser",
                    value: event.organizer_name,
                  },
                  {
                    icon: "👥",
                    label: "Volunteers Needed",
                    value: `${event.volunteers_needed} people`,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-3 text-sm"
                    style={{ color: "var(--gray-600)" }}
                  >
                    <span>{item.icon}</span>
                    <div>
                      <strong style={{ color: "var(--text)" }}>
                        {item.label}
                      </strong>
                      <br />
                      {typeof item.value === "string" ? item.value : `${item.value.start} - ${item.value.end}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="p-5 rounded-xl border"
              style={{
                background: "var(--accent-soft)",
                borderColor: "rgba(244,164,53,0.3)",
              }}
            >
              <div
                className="font-bold text-sm mb-2"
                style={{ color: "var(--navy)" }}
              >
                📞 Contact for This Event
              </div>
              <div
                className="text-sm leading-loose"
                style={{ color: "var(--gray-600)" }}
              >
                Phone:{" "}
                <a href={`tel:${event.phone_number}`} className="text-blue-600">
                  {event.phone_number}
                </a>
                <br />
                Email: {event.email}
              </div>
            </div>
            <Link
              href="/events"
              className="block text-center px-5 py-3 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-blue-50"
              style={{ borderColor: "var(--blue)", color: "var(--blue)" }}
            >
              ← Back to Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client"
import Link from 'next/link';
import Image from 'next/image';
import { PROGRAMS } from '@/lib/data';
import { StatCard, Card } from '@/components/ui';
import { useEffect, useMemo, useState } from 'react';
import { WebsiteService } from '@/services/websiteService';
import { EventResponse, HomeData, TestimonialsResponse } from '@/types';
import { parseEventDate } from './events/page';
import { formatToAmPm } from '@/helpers/timeFormatter';

export default function HomePage() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialsResponse[]>([]);
  const [homeContent, setHomeContent] = useState<HomeData | null>(null);

  useEffect(() => {
    Promise.all([
      WebsiteService.getHomePageContent()
        .then((res) => setHomeContent(res.data.results || null))
        .catch(console.error),

      WebsiteService.getAllEvents()
        .then((res) => setEvents(res.data.results || []))
        .catch(console.error),

      WebsiteService.getTestimonials()
        .then((res) => setTestimonials(res.data.results || []))
        .catch(console.error),
    ]);
  }, []);

  const upcomingEvents = useMemo(
    () => events.filter((e) => e.status === "published").slice(0, 2),
    [events]
  );

  const featuredTestimonials = useMemo(
    () => testimonials.slice(0, 3),
    [testimonials]
  );

  const featuredPrograms = useMemo(() => PROGRAMS.slice(0, 6), []);

  const yearFounded = homeContent?.year_of_establishment || "2008";
  const childrenInHostel = homeContent?.children_in_hostel || "16+";
  const familiesReached = homeContent?.families_reached || "500+";
  const activePrograms = homeContent?.active_programs || "5+";

  return (
    <div className="pb-20 lg:pb-0 pt-18.25">
      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--navy) 0%, var(--blue) 60%, #1B5CA8 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, rgba(45,125,210,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(244,164,53,0.15) 0%, transparent 40%)",
          }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block overflow-hidden">
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(90deg, var(--navy) 0%, transparent 40%)",
            }}
          />
          <Image
            src="/images/dooars.jpeg"
            alt="Community"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <div
              className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{
                background: "rgba(244,164,53,0.2)",
                border: "1px solid rgba(244,164,53,0.4)",
                color: "var(--accent)",
              }}
            >
              🌟 Hope for No Hope · Since {yearFounded}
            </div>
            <h1
              className="animate-fade-up-1 text-white font-black mb-5"
              style={{ fontSize: "clamp(2.4rem,5vw,3.6rem)", lineHeight: 1.1 }}
            >
              Bringing{" "}
              <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
                Hope
              </em>{" "}
              to
              <br />
              the Hearts of Dooars
            </h1>
            <p
              className="animate-fade-up-2 text-base md:text-lg mb-9 max-w-xl"
              style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}
            >
              Nagarkata Ray of Hope Society serves the underprivileged
              communities of West Bengal&apos;s Dooars region — providing
              shelter, education, healthcare and rescue to those who need it
              most.
            </p>
            <div className="animate-fade-up-3 flex justify-center md:justify-start gap-3 flex-wrap">
              <Link
                href="/donate"
                className="px-12 md:px-7 py-3.5 rounded-xl text-base font-bold transition-all hover:-translate-y-0.5 hover:shadow-xl bg-accent text-(--navy)"
              >
                ♥ Donate Now
              </Link>
              <Link
                href="/volunteer"
                className="px-7 py-3.5 rounded-xl text-base font-semibold transition-all hover:bg-white/20"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "white",
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              >
                Become a Volunteer
              </Link>
            </div>
            <div className="animate-fade-up-4 flex justify-center md:justify-start gap-12 md:gap-8 mt-14 flex-wrap">
              {[
                { num: yearFounded, label: "Year Founded" },
                { num: childrenInHostel, label: "Children in Hostel" },
                { num: familiesReached, label: "Families Aided" },
                { num: activePrograms, label: "Active Programs" },
              ].map((s, i) => (
                <div key={i} className="text-white">
                  <div
                    className="font-black text-2xl leading-none"
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      color: "var(--accent)",
                    }}
                  >
                    {s.num}
                  </div>
                  <div
                    className="text-xs mt-1 font-medium"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 bg-(--navy)">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <div
              className="section-label"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Our Story
            </div>
            <h2 className="text-white text-3xl md:text-4xl font-black mb-5">
              A Tiny Dew Drop That Grew Into a River of Change
            </h2>
            <blockquote
              className="text-xl mb-5 pl-5 border-l-4"
              style={{
                borderColor: "var(--accent)",
                color: "var(--accent)",
                fontFamily: "'Cormorant Garamond',serif",
                fontStyle: "italic",
              }}
            >
              &ldquo;Hope for No Hope&rdquo; — when there is no one to help, we
              stand with you.
            </blockquote>
            <p
              className="text-base leading-loose mb-6"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Founded by Arjun Biswakarma in the Dooars valley of West Bengal,
              Nagarkata Ray of Hope Society began in a corner of his own home in{" "}
              {yearFounded}. Today it is registered under West Bengal Society Act 1961
              and NGO Darpan (NITI Aayog).
            </p>
            <Link
              href="/about"
              className="inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}
            >
              Read Our Full Story →
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/community-work.jpeg"
              alt="Community work"
              width={700}
              height={380}
              className="w-full object-cover"
              style={{ height: 380 }}
            />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-(--gray-50)">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-label justify-center">Our Impact</div>
            <h2 className="text-3xl md:text-4xl font-black text-(--navy)">
              Numbers That Tell Our Story
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard num={childrenInHostel} label="Children in Hostel" />
            <StatCard num={familiesReached} label="Families Aided in COVID Relief" />
            <StatCard num="100+" label="Youth Trained in Sports" />
            <StatCard num="7" label="Board Members Serving" />
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="section-label">What We Do</div>
            <h2
              className="text-3xl md:text-4xl font-black mb-4"
              style={{ color: "var(--navy)" }}
            >
              Programs That Transform Lives
            </h2>
            <p
              className="text-base leading-relaxed max-w-xl"
              style={{ color: "var(--gray-600)" }}
            >
              From sheltering vulnerable children to rescuing trafficking
              victims, our work spans the most pressing needs of the Dooars
              region.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPrograms.map((p) => (
              <Card key={p.id} className="p-8">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                  style={{ background: p.color }}
                >
                  {p.icon}
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: "var(--navy)" }}
                >
                  {p.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-3"
                  style={{ color: "var(--gray-600)" }}
                >
                  {p.description}
                </p>
                <p
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{
                    background: "var(--gray-50)",
                    color: "var(--gray-600)",
                  }}
                >
                  {p.detail}
                </p>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/programs"
              className="inline-flex px-6 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-blue-50"
              style={{ borderColor: "var(--blue)", color: "var(--blue)" }}
            >
              View All Programs →
            </Link>
          </div>
        </div>
      </section>

      {/* EVENTS — hidden when there are no published upcoming events */}
      {upcomingEvents.length > 0 && (
        <section className="py-20" style={{ background: "var(--gray-50)" }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="section-label">Events</div>
            <h2
              className="text-3xl font-black mb-2"
              style={{ color: "var(--navy)" }}
            >
              Upcoming Events
            </h2>
            <p className="text-sm mb-10" style={{ color: "var(--gray-600)" }}>
              Join us in our community programs and awareness campaigns.
            </p>
            <div className="flex flex-col gap-4 max-w-3xl">
              {upcomingEvents.map((e) => {
                const { day, month } = parseEventDate(e.event_date);
                return (
                  <Card key={e.reference_id} className="p-0 overflow-hidden">
                    <Link
                      href={`/events/${e.reference_id}`}
                      className="grid grid-cols-[auto_1fr_auto] gap-6 p-6 items-center hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className="rounded-xl px-4 py-3 text-center min-w-15"
                        style={{ background: "var(--blue)", color: "white" }}
                      >
                        <div
                          className="text-2xl font-black leading-none"
                          style={{ fontFamily: "'Playfair Display',serif" }}
                        >
                          {day}
                        </div>
                        <div className="text-xs uppercase tracking-wider mt-1 opacity-80">
                          {month}
                        </div>
                      </div>
                      <div>
                        <h3
                          className="font-bold text-base mb-1"
                          style={{ color: "var(--navy)" }}
                        >
                          {e.name}
                        </h3>
                        <div className="flex gap-4 flex-wrap">
                          <span
                            className="text-xs"
                            style={{ color: "var(--gray-400)" }}
                          >
                            📍 {e.location}
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: "var(--gray-400)" }}
                          >
                            🕐 {formatToAmPm(e.start_time)} - {formatToAmPm(e.end_time)}
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-sm font-semibold hidden sm:block"
                        style={{ color: "var(--sky)" }}
                      >
                        Details →
                      </span>
                    </Link>
                  </Card>
                );
              })}
            </div>
            <div className="mt-8">
              <Link
                href="/events"
                className="inline-flex px-6 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-blue-50"
                style={{ borderColor: "var(--blue)", color: "var(--blue)" }}
              >
                See All Events →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS — hidden when there are no testimonials */}
      {featuredTestimonials.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="section-label">Voices</div>
            <h2
              className="text-3xl font-black mb-10"
              style={{ color: "var(--navy)" }}
            >
              What People Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTestimonials.map((t) => (
                <Card key={t.reference_id} className="p-8 relative">
                  <div
                    className="absolute top-6 left-6 text-6xl leading-none font-black opacity-20"
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      color: "var(--accent)",
                    }}
                  >
                    &ldquo;
                  </div>
                  <p
                    className="text-sm leading-loose mb-6 mt-4"
                    style={{ color: "var(--gray-600)" }}
                  >
                    {t.message}
                  </p>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/user.png"
                      alt={t.name}
                      width={44}
                      height={44}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <div
                        className="font-bold text-sm"
                        style={{ color: "var(--navy)" }}
                      >
                        {t.name}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--gray-400)" }}
                      >
                        {t.role}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/testimonials"
                className="inline-flex px-6 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-blue-50"
                style={{ borderColor: "var(--blue)", color: "var(--blue)" }}
              >
                Read More Testimonials →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(135deg, var(--accent), #e8952a)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2
            className="text-3xl md:text-4xl font-black mb-4"
            style={{ color: "var(--navy)" }}
          >
            Be the Ray of Hope for Someone Today
          </h2>
          <p
            className="max-w-md mx-auto mb-8"
            style={{ color: "rgba(11,31,58,0.7)" }}
          >
            Your support — however small — can change a life in the Dooars
            valley.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/donate"
              className="px-7 py-3.5 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: "var(--navy)", color: "white" }}
            >
              Donate Now
            </Link>
            <Link
              href="/volunteer"
              className="px-7 py-3.5 rounded-xl font-semibold text-base border-2 transition-all hover:bg-black/10"
              style={{
                borderColor: "rgba(11,31,58,0.4)",
                color: "var(--navy)",
              }}
            >
              Join as Volunteer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
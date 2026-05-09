'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { Badge } from '@/components/ui';
import AdminGuard from '@/components/Admin/AdminGuard';
import { AdminService } from '@/services/adminService';

interface AreaOfInterest {
  reference_id: string;
  name: string;
}

interface EventVolunteerApplication {
  reference_id: string;
  event_id: string;
  event_name: string;
  full_name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  skills: string;
  created_at: string;
}

interface GeneralVolunteerApplication {
  reference_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  city: string;
  status: 'pending' | 'accepted' | 'rejected';
  availability: string;
  created_at: string;
  skills: string;
  areas_of_interest: AreaOfInterest[];
}

interface UpcomingEvent {
  reference_id: string;
  name: string;
  description: string;
  category: string;
  logo: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  organizer_name: string;
  phone_number: string;
  email: string;
  volunteers_needed: number;
  registered_volunteers_count: number;
  status: string;
  schedule: { reference_id: string; time: string; title: string }[];
  created_at: string;
  updated_at: string;
}

interface DashboardStats {
  total_events: number;
  total_event_volunteer_applications: number;
  total_approved_event_volunteer_applications: number;
  total_rejected_event_volunteer_applications: number;
  total_general_volunteer_applications: number;
  total_pending_general_volunteer_applications: number;
  total_approved_general_volunteer_applications: number;
  total_rejected_general_volunteer_applications: number;
  total_upcoming_events: number;
  recent_event_volunteer_applications: EventVolunteerApplication[];
  recent_general_volunteer_applications: GeneralVolunteerApplication[];
  upcoming_events: UpcomingEvent[];
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: 'green' | 'red' | 'yellow' | 'blue' }> = {
    approved: { label: 'Approved', variant: 'green' },
    accepted: { label: 'Accepted', variant: 'green' },
    rejected: { label: 'Rejected', variant: 'red' },
    pending: { label: 'Pending', variant: 'yellow' },
    published: { label: 'Published', variant: 'blue' },
  };
  const config = map[status] ?? { label: status, variant: 'yellow' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const date = new Date();
  date.setHours(Number(h), Number(m));
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// ── Mobile card: Event Volunteer Application ──────────────────────────────────
function EventAppCard({ app }: { app: EventVolunteerApplication }) {
  return (
    <div
      className="p-4 rounded-xl border"
      style={{ borderColor: 'var(--gray-100)', background: 'var(--gray-50)' }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>
            {app.full_name}
          </div>
          <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--gray-400)' }} title={app.event_name}>
            {app.event_name}
          </div>
        </div>
        <div className="shrink-0">
          <StatusBadge status={app.status} />
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        <span className="text-xs" style={{ color: 'var(--gray-400)' }}>🛠 {app.skills}</span>
        <span className="text-xs" style={{ color: 'var(--gray-400)' }}>🗓 {formatDate(app.created_at)}</span>
      </div>
    </div>
  );
}

// ── Mobile card: General Volunteer Application ────────────────────────────────
function GeneralAppCard({ app }: { app: GeneralVolunteerApplication }) {
  return (
    <div
      className="p-4 rounded-xl border"
      style={{ borderColor: 'var(--gray-100)', background: 'var(--gray-50)' }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>
            {app.full_name}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--gray-400)' }}>
            📍 {app.city}
          </div>
        </div>
        <div className="shrink-0">
          <StatusBadge status={app.status} />
        </div>
      </div>
      {app.areas_of_interest.length > 0 && (
        <div className="flex flex-wrap gap-1 my-2">
          {app.areas_of_interest.map((area) => (
            <span
              key={area.reference_id}
              className="text-xs px-2 py-0.5 rounded-full capitalize"
              style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }}
            >
              {area.name}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span className="text-xs" style={{ color: 'var(--gray-400)' }}>🛠 {app.skills}</span>
        <span className="text-xs" style={{ color: 'var(--gray-400)' }}>🕒 {app.availability}</span>
        <span className="text-xs" style={{ color: 'var(--gray-400)' }}>🗓 {formatDate(app.created_at)}</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await AdminService.getDashbaordStats();
        setStats(res.data.results);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        {
          label: 'Total Events',
          value: stats.total_events,
          sub: `${stats.total_upcoming_events} upcoming`,
          color: 'var(--blue)',
          icon: '📅',
        },
        {
          label: 'Event Volunteer Apps',
          value: stats.total_event_volunteer_applications,
          sub: `${stats.total_approved_event_volunteer_applications} approved · ${stats.total_rejected_event_volunteer_applications} rejected`,
          color: '#22c55e',
          icon: '📢',
        },
        {
          label: 'General Volunteer Apps',
          value: stats.total_general_volunteer_applications,
          sub: `${stats.total_approved_general_volunteer_applications} approved · ${stats.total_rejected_general_volunteer_applications} rejected`,
          color: 'var(--accent)',
          icon: '👥',
        },
        {
          label: 'Upcoming Events',
          value: stats.total_upcoming_events,
          sub: 'Scheduled & published',
          color: '#f59e0b',
          icon: '🗓',
        },
      ]
    : [];

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />

        {/* min-w-0 prevents flex child overflow on mobile */}
        <main className="flex-1 flex flex-col bg-gray-50 min-w-0">

          {/* ── Top Bar ──────────────────────────────────────────────────── */}
          <div
            className="bg-white border-b px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10"
            style={{ borderColor: 'var(--gray-100)' }}
          >
            {/* Indent title on mobile to clear the fixed hamburger button */}
            <h2
              className="font-bold text-base sm:text-lg pl-12 lg:pl-0 truncate"
              style={{ fontFamily: "'DM Sans',sans-serif", color: 'var(--navy)' }}
            >
              Dashboard Overview
            </h2>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
              <span className="hidden sm:block text-sm" style={{ color: 'var(--gray-400)' }}>
                Welcome, Admin
              </span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'var(--blue)' }}
              >
                A
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-sm" style={{ color: 'var(--gray-400)' }}>
                Loading dashboard...
              </div>
            ) : !stats ? (
              <div className="flex items-center justify-center h-64 text-sm text-red-400">
                Failed to load dashboard data.
              </div>
            ) : (
              <>
                {/* ── Stat Cards ─────────────────────────────────────────── */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
                  {statCards.map((s, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border"
                      style={{ borderColor: 'var(--gray-100)' }}
                    >
                      <div
                        className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                        style={{ color: 'var(--gray-400)' }}
                      >
                        <span>{s.icon}</span>
                        <span className="leading-tight">{s.label}</span>
                      </div>
                      <div
                        className="text-2xl sm:text-3xl font-black mb-1"
                        style={{ fontFamily: "'Playfair Display',serif", color: s.color }}
                      >
                        {s.value}
                      </div>
                      <div className="text-xs font-medium leading-tight" style={{ color: 'var(--gray-400)' }}>
                        {s.sub}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Event Apps + Upcoming Events ────────────────────────── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">

                  {/* Recent Event Volunteer Applications */}
                  <div
                    className="xl:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden"
                    style={{ borderColor: 'var(--gray-100)' }}
                  >
                    <div
                      className="px-4 sm:px-5 py-4 border-b flex items-center justify-between"
                      style={{ borderColor: 'var(--gray-100)' }}
                    >
                      <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>
                        Recent Event Volunteer Applications
                      </h3>
                      <Link
                        href="/admin/event-volunteers"
                        className="text-xs font-semibold shrink-0 ml-3"
                        style={{ color: 'var(--sky)' }}
                      >
                        View All →
                      </Link>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ background: 'var(--gray-50)' }}>
                            {['Name', 'Event', 'Skills', 'Status', 'Date'].map((h) => (
                              <th
                                key={h}
                                className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                                style={{ color: 'var(--gray-400)' }}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recent_event_volunteer_applications.map((app) => (
                            <tr
                              key={app.reference_id}
                              className="border-t hover:bg-gray-50 transition-colors"
                              style={{ borderColor: 'var(--gray-100)' }}
                            >
                              <td className="px-5 py-3 font-medium whitespace-nowrap" style={{ color: 'var(--text)' }}>
                                {app.full_name}
                              </td>
                              <td
                                className="px-5 py-3 max-w-[160px] truncate"
                                style={{ color: 'var(--gray-600)' }}
                                title={app.event_name}
                              >
                                {app.event_name}
                              </td>
                              <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--gray-600)' }}>
                                {app.skills}
                              </td>
                              <td className="px-5 py-3">
                                <StatusBadge status={app.status} />
                              </td>
                              <td className="px-5 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--gray-400)' }}>
                                {formatDate(app.created_at)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="sm:hidden p-3 space-y-3">
                      {stats.recent_event_volunteer_applications.map((app) => (
                        <EventAppCard key={app.reference_id} app={app} />
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Events */}
                  <div
                    className="bg-white rounded-xl shadow-sm border overflow-hidden"
                    style={{ borderColor: 'var(--gray-100)' }}
                  >
                    <div className="px-4 sm:px-5 py-4 border-b" style={{ borderColor: 'var(--gray-100)' }}>
                      <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>
                        Upcoming Events
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {stats.upcoming_events.length === 0 ? (
                        <p className="text-xs text-center py-6" style={{ color: 'var(--gray-400)' }}>
                          No upcoming events.
                        </p>
                      ) : (
                        stats.upcoming_events.map((event) => (
                          <div
                            key={event.reference_id}
                            className="p-3 rounded-xl"
                            style={{ background: 'var(--gray-50)' }}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-bold" style={{ color: 'var(--sky)' }}>
                                {formatDate(event.event_date)}
                              </span>
                              <StatusBadge status={event.status} />
                            </div>
                            <div className="text-sm font-medium mb-1 line-clamp-2" style={{ color: 'var(--text)' }}>
                              {event.name}
                            </div>
                            <div className="text-xs" style={{ color: 'var(--gray-400)' }}>
                              📍 {event.location} · {formatTime(event.start_time)}
                            </div>
                            <div className="text-xs mt-1" style={{ color: 'var(--gray-400)' }}>
                              👥 {event.registered_volunteers_count}/{event.volunteers_needed} volunteers
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* ── General Volunteer Applications ─────────────────────── */}
                <div
                  className="bg-white rounded-xl shadow-sm border overflow-hidden"
                  style={{ borderColor: 'var(--gray-100)' }}
                >
                  <div
                    className="px-4 sm:px-5 py-4 border-b flex items-center justify-between"
                    style={{ borderColor: 'var(--gray-100)' }}
                  >
                    <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>
                      Recent General Volunteer Applications
                    </h3>
                    <Link
                      href="/admin/volunteers"
                      className="text-xs font-semibold shrink-0 ml-3"
                      style={{ color: 'var(--sky)' }}
                    >
                      View All →
                    </Link>
                  </div>

                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: 'var(--gray-50)' }}>
                          {['Name', 'City', 'Availability', 'Interests', 'Skills', 'Status', 'Date'].map((h) => (
                            <th
                              key={h}
                              className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                              style={{ color: 'var(--gray-400)' }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recent_general_volunteer_applications.map((app) => (
                          <tr
                            key={app.reference_id}
                            className="border-t hover:bg-gray-50 transition-colors"
                            style={{ borderColor: 'var(--gray-100)' }}
                          >
                            <td className="px-5 py-3 font-medium whitespace-nowrap" style={{ color: 'var(--text)' }}>
                              {app.full_name}
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--gray-600)' }}>
                              {app.city}
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--gray-600)' }}>
                              {app.availability}
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex flex-wrap gap-1 min-w-[140px]">
                                {app.areas_of_interest.map((area) => (
                                  <span
                                    key={area.reference_id}
                                    className="text-xs px-2 py-0.5 rounded-full capitalize"
                                    style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }}
                                  >
                                    {area.name}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--gray-600)' }}>
                              {app.skills}
                            </td>
                            <td className="px-5 py-3">
                              <StatusBadge status={app.status} />
                            </td>
                            <td className="px-5 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--gray-400)' }}>
                              {formatDate(app.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="sm:hidden p-3 space-y-3">
                    {stats.recent_general_volunteer_applications.map((app) => (
                      <GeneralAppCard key={app.reference_id} app={app} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Event, VolunteerApplication, DonationInquiry, Testimonial } from '@/types';

interface AdminStore {
  isAuthenticated: boolean;
  events: Event[];
  volunteers: VolunteerApplication[];
  donations: DonationInquiry[];
  testimonials: Testimonial[];
  unreadMessages: number;

  login: (user: string, pass: string) => boolean;
  logout: () => void;

  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;

  setVolunteers: (v: VolunteerApplication[]) => void;
  updateVolunteerStatus: (id: string, status: VolunteerApplication['status']) => void;

  setDonations: (d: DonationInquiry[]) => void;
  setTestimonials: (t: Testimonial[]) => void;
  updateTestimonialStatus: (id: string, status: Testimonial['status']) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      events: [],
      volunteers: [],
      donations: [],
      testimonials: [],
      unreadMessages: 7,

      login: (user, pass) => {
        if (user === 'admin' && pass === 'admin123') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),

      setEvents: (events) => set({ events }),
      addEvent: (event) => set(s => ({ events: [...s.events, event] })),
      updateEvent: (id, updates) => set(s => ({ events: s.events.map(e => e.id === id ? { ...e, ...updates } : e) })),
      deleteEvent: (id) => set(s => ({ events: s.events.filter(e => e.id !== id) })),

      setVolunteers: (volunteers) => set({ volunteers }),
      updateVolunteerStatus: (id, status) => set(s => ({ volunteers: s.volunteers.map(v => v.id === id ? { ...v, status } : v) })),

      setDonations: (donations) => set({ donations }),
      setTestimonials: (testimonials) => set({ testimonials }),
      updateTestimonialStatus: (id, status) => set(s => ({ testimonials: s.testimonials.map(t => t.id === id ? { ...t, status } : t) })),
    }),
    {
      name: 'ray-of-hope-admin',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);

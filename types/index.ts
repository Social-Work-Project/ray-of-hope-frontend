export interface Event {
  id: string;
  title: string;
  date: string;
  month: string;
  day: string;
  time: string;
  location: string;
  summary: string;
  description: string;
  volunteersNeeded: number;
  organizer: string;
  image: string;
  status: 'published' | 'draft';
  schedule: { time: string; activity: string }[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar: string;
  status: 'published' | 'draft';
}

export interface Story {
  id: string;
  title: string;
  tag: string;
  image: string;
  excerpt: string;
  content: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  workingSince: string;
  contact?: string;
}

export interface Program {
  id: string;
  icon: string;
  title: string;
  description: string;
  detail: string;
  color: string;
}

export interface VolunteerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  skills: string;
  availability: string;
  interest: string;
  reason: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
  eventId?: string;
}

export interface DonationInquiry {
  id: string;
  name: string;
  contact: string;
  method: string;
  amount: string;
  status: 'pending' | 'received' | 'arranged';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

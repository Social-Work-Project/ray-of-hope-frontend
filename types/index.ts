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


export interface EventResponse {
  reference_id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  organizer_name: string;
  volunteers_needed: number;
  registered_volunterrs_count: number;
  status: 'published' | 'draft';
  created_at: string;
}

export interface EventDetailResponse extends EventResponse {
  schedule: { time: string; title: string }[];
  volunteers: { name: string; email: string }[];
  phone_number: string;
  email: string;
}

type AreaOfInterest = {
  reference_id: string;
  name: string;
};

export type VolunteerResponse = {
  reference_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  city: string;
  status: "pending" | "accepted" | "rejected"; // restrict if possible
  availability: string;
  created_at: string; // ISO datetime
  skills: string;
  areas_of_interest: AreaOfInterest[];
};


export interface TeamResponse {
  reference_id: string;
  name: string;
  designation: string;
  joined_date: string;
  bio: string;
  image?: string;
  is_active: boolean;
}

export interface User {
  reference_id: string;
  full_name: string;
  email: string;
  is_admin: boolean;
  is_banned: boolean;
  avatar?: string;
  date_joined: string;
}

export interface GalleryCategory {
  reference_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  reference_id: string;
  title: string;
  image: string;
  category: GalleryCategory;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Album {
  category: GalleryCategory;
  images: GalleryImage[];
}

export interface TestimonialsResponse {
  reference_id: string;
  name: string;
  role: string;
  message: string;
  is_active: string;
}

export interface HomeData {
  hero_title: string;
  hero_subtitle: string;
  year_of_establishment: string;
  active_programs: string;
  children_in_hostel: string;
  families_reached: string;
}

export interface AboutData {
  mission_statement: string;
  vision_statement: string;
}

export interface ContactData {
  phones: string[];
  emails: string[];
  address: string;
}

export interface UpiData {
  upi_ids: string[];
  qr_code: string | null;
}

export interface BankData {
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  branch_name: string;
  account_type: string;
  qr_code: string | null;
}

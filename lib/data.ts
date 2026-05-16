import type { Event, Testimonial, Story, TeamMember, Program, VolunteerApplication, DonationInquiry } from '@/types';

// Simulated async delay
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

// ── STORIES ──────────────────────────────────────────
export const STORIES: Story[] = [
  { id: 'aarati', title: "Aarati's Rescue: A Minor Brought Home After 4 Years", tag: 'Rescue', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80', excerpt: 'A 13-year-old from the Dooars was trafficked as domestic labour. After 4 years, the society worked with police to bring her home.', content: 'A 13-year-old girl from the Dooars was trafficked to another state as domestic labour. For four years her family could only wait. The society worked with local police to mount a rescue, and Aarati was reunited with her mother in April 2018.' },
  { id: 'football', title: 'From the Tea Garden to the District Football Team', tag: 'Youth & Sports', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80', excerpt: 'Young men from closed tea garden families joined football coaching and went on to compete at district level.', content: 'Several young men from closed tea garden families who had no structured opportunities enrolled in the society\'s football coaching and were selected for district-level competitions.' },
  { id: 'hostel', title: '16 Children Who Found a Second Home', tag: "Children's Welfare", image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80', excerpt: 'From 2 children in 2008 to 16 today — all thriving students with dreams of their own.', content: 'From the initial 2 children in 2008, today 16 children from the most deprived families live in the hostel — receiving nutritious food, clothing, schooling, and love.' },
  { id: 'covid', title: 'Feeding 500+ Families During the COVID Lockdown', tag: 'Humanitarian', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80', excerpt: 'When tea gardens closed entirely, the society mobilized emergency donations and distributed food village by village.', content: 'When the pandemic struck and tea gardens closed entirely, families had no income or food. The society mobilized emergency donations and distributed food village by village across the Dooars region.' },
  { id: 'medical', title: "The Patient Who Couldn't Walk — But Did", tag: 'Health', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80', excerpt: 'A bedridden man in a remote tea garden area was identified, transported, and treated at North Bengal Medical College.', content: 'A severely ill man in a remote tea garden area had been bedridden for weeks. The society arranged ambulance transport through the SDO office and facilitated treatment at North Bengal Medical College, Siliguri.' },
  { id: 'education', title: 'Anita: From Dropout to Nursing Aspirant', tag: 'Education', image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&q=80', excerpt: 'Free coaching classes helped a dropout student clear her exams. She now prepares for nursing entrance.', content: 'Anita had dropped out of school to support her family. The society\'s free coaching classes helped her clear her exams. She is now preparing for nursing entrance examinations.' },
];

export const getStories = async (): Promise<Story[]> => { await delay(); return STORIES; };

// ── PROGRAMS ─────────────────────────────────────────
export const PROGRAMS: Program[] = [
  { id: 'hostel', icon: '🏠', title: "Children's Hostel", description: 'A second home for children from extremely poor families — nutritious food, clothing, school uniforms.', detail: 'Current residents: 10 Boys, 6 Girls. Field staff verify eligibility to ensure only the most needy children are admitted.', color: '#EEF2F7' },
  { id: 'health', icon: '🩺', title: 'Health & Medical Aid', description: 'Medical camps, disease awareness and hospital transport across tea garden communities.', detail: 'Focus diseases: Malaria, Pneumonia, Diarrhea, Malnutrition. Links to Sulkhapara Govt. Hospital.', color: '#FFF3DC' },
  { id: 'education', icon: '🎓', title: 'Education Support', description: 'Free coaching classes, scholarships, school materials and planned Free Primary School.', detail: 'Goal: Opening a Free Primary School for BPL families in the Nagrakata Block.', color: '#F0FDF4' },
  { id: 'rescue', icon: '🛡️', title: 'Rescue Programme', description: 'Working with local police to rescue trafficking victims from the vulnerable Dooars region.', detail: 'West Bengal accounts for 44% of India\'s trafficking cases. Multiple rescues documented.', color: '#FEF2F2' },
  { id: 'sports', icon: '⚽', title: 'Sports & Youth', description: 'Football coaching, volleyball, and fitness training for underprivileged youth.', detail: 'District-level players have emerged from the coaching sessions. Plans for a full Sports Centre.', color: '#EFF6FF' },
  { id: 'awareness', icon: '🌾', title: 'Social Awareness', description: 'Awareness camps covering COVID protocols, health, anti-trafficking and social issues.', detail: 'Areas: Nagrakata, Bhagatpur, Kurti Tea Garden, Sulkhapara. Conducted with local admin permission.', color: '#F3F4F6' },
];

export const getPrograms = async (): Promise<Program[]> => { await delay(); return PROGRAMS; };


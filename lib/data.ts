import type { Event, Testimonial, Story, TeamMember, Program, VolunteerApplication, DonationInquiry } from '@/types';

// Simulated async delay
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

// ── EVENTS ──────────────────────────────────────────
export const EVENTS: Event[] = [
  {
    id: 'annual-health',
    title: 'Annual Health Awareness Camp',
    date: 'May 15, 2025',
    month: 'May',
    day: '15',
    time: '10:00 AM – 4:00 PM',
    location: 'Nagrakata Tea Garden Area',
    summary: 'Free health screenings, disease awareness, sanitation education across tea garden communities.',
    description: 'Our annual health camp brings together volunteers, medical professionals, and community workers to educate residents of Nagrakata tea garden areas about preventable diseases — malaria, pneumonia, diarrhea, and malnutrition — that disproportionately affect these communities. Free basic health screenings are offered, health materials distributed, and referrals made to Sulkhapara Government Hospital for those requiring immediate care.',
    volunteersNeeded: 50,
    organizer: 'Arjun Biswakarma',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    status: 'published',
    schedule: [
      { time: '10:00 AM', activity: 'Registration & Opening' },
      { time: '11:00 AM', activity: 'Health Awareness Sessions' },
      { time: '1:00 PM', activity: 'Free Medical Screenings' },
      { time: '3:00 PM', activity: 'Distribution of Materials' },
      { time: '4:00 PM', activity: 'Closing Ceremony' },
    ],
  },
  {
    id: 'football-tournament',
    title: 'Youth Football Tournament 2025',
    date: 'June 22, 2025',
    month: 'Jun',
    day: '22',
    time: '8:00 AM – 6:00 PM',
    location: 'Nagrakata Sports Ground',
    summary: 'Annual football tournament for youth from tea garden communities — district-level talent showcase.',
    description: 'Nagarkata Ray of Hope Society organises this annual football tournament to provide structured sporting opportunities for underprivileged youth. The tournament has produced district-level players and serves as a talent identification platform.',
    volunteersNeeded: 20,
    organizer: 'Arjun Biswakarma',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    status: 'published',
    schedule: [
      { time: '8:00 AM', activity: 'Opening Ceremony & Registration' },
      { time: '9:00 AM', activity: 'Group Stage Matches' },
      { time: '1:00 PM', activity: 'Lunch Break' },
      { time: '2:00 PM', activity: 'Semi Finals' },
      { time: '4:30 PM', activity: 'Final Match' },
      { time: '6:00 PM', activity: 'Prize Distribution' },
    ],
  },
  {
    id: 'independence-day',
    title: 'Independence Day Cultural Programme',
    date: 'August 15, 2025',
    month: 'Aug',
    day: '15',
    time: '9:00 AM',
    location: 'Sukhani Busty Community Hall',
    summary: 'Cultural celebration with children from the hostel, community members, and local dignitaries.',
    description: 'Annual Independence Day celebration featuring cultural performances by hostel children, flag hoisting, community gathering, and awareness talks.',
    volunteersNeeded: 15,
    organizer: 'Arjun Biswakarma',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
    status: 'draft',
    schedule: [
      { time: '9:00 AM', activity: 'Flag Hoisting' },
      { time: '9:30 AM', activity: 'Cultural Performances' },
      { time: '11:00 AM', activity: 'Community Address' },
      { time: '12:00 PM', activity: 'Lunch & Fellowship' },
    ],
  },
  {
    id: 'hostel-annual-day',
    title: "Children's Hostel Annual Day",
    date: 'October 10, 2025',
    month: 'Oct',
    day: '10',
    time: '11:00 AM',
    location: 'Nagrakata Ray of Hope Centre',
    summary: 'Celebrating the achievements of hostel children with performances, awards, and community gathering.',
    description: 'Annual day for the children of our hostel — showcasing their academic and cultural achievements over the past year. Open to donors, volunteers, and community members.',
    volunteersNeeded: 10,
    organizer: 'Arjun Biswakarma',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
    status: 'draft',
    schedule: [
      { time: '11:00 AM', activity: 'Welcome & Opening' },
      { time: '11:30 AM', activity: 'Children\'s Performances' },
      { time: '1:00 PM', activity: 'Awards & Recognition' },
      { time: '2:00 PM', activity: 'Lunch' },
    ],
  },
  {
    id: 'anti-trafficking',
    title: 'Anti-Trafficking Awareness Workshop',
    date: 'December 5, 2025',
    month: 'Dec',
    day: '5',
    time: '10:00 AM',
    location: 'Bhagatpur Tea Garden',
    summary: 'Community awareness on human trafficking risks, prevention, and rescue resources in the Dooars region.',
    description: 'Working with local police and administration, this workshop educates tea garden communities about the warning signs of trafficking, safe migration, and how to report suspicious activity.',
    volunteersNeeded: 30,
    organizer: 'Arjun Biswakarma',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    status: 'draft',
    schedule: [
      { time: '10:00 AM', activity: 'Introduction & Opening' },
      { time: '10:30 AM', activity: 'Awareness Session with Police' },
      { time: '12:00 PM', activity: 'Community Discussion' },
      { time: '1:00 PM', activity: 'Resource Distribution' },
    ],
  },
];

export const getEvents = async (): Promise<Event[]> => { await delay(); return EVENTS; };
export const getEvent = async (id: string): Promise<Event | undefined> => { await delay(200); return EVENTS.find(e => e.id === id); };

// ── TESTIMONIALS ─────────────────────────────────────
export const TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'Sunita Kami', role: 'Parent, Nagrakata Tea Garden', text: 'Nagarkata Ray of Hope gave my daughter a safe place to study and eat. She is now in class 8 and dreams of becoming a nurse. We were struggling badly after the tea garden closed — they stood with us when no one else did.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', status: 'published' },
  { id: '2', name: 'Rajan Oraon', role: 'Youth Volunteer & Footballer', text: 'The football coaching changed my entire life. I never imagined I\'d play at the district level. Mr. Arjun believed in me when no one else did. This society isn\'t just an NGO — it\'s a family.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', status: 'published' },
  { id: '3', name: 'Meena Tirkey', role: 'Beneficiary, Bhagatpur Tea Garden', text: 'During the COVID lockdown, we had no food for days. The Ray of Hope team came village to village with essentials and masks. Their work is a true blessing to the poorest families of Dooars.', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80', status: 'published' },
  { id: '4', name: 'Dipak Biswakarma', role: 'Resident, Kurti Tea Garden', text: 'They took my sick grandfather to Sulkhapara Hospital when we had no way to transport him. Without them, I don\'t know what would have happened. The love they show to strangers is extraordinary.', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80', status: 'published' },
  { id: '5', name: 'Anita Oraon', role: 'Student Beneficiary', text: 'I was a dropout student who had lost all hope of education. The coaching classes at the society centre helped me clear my exams. Today I am preparing for nursing entrance. They gave me my future back.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', status: 'published' },
  { id: '6', name: 'Samir Chakraborty', role: 'Donor, Siliguri', text: 'As a donor from Siliguri, I feel confident that my contributions reach the right people. The transparency and dedication of the team is rare. I have visited the centre and seen the impact firsthand.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', status: 'published' },
];

export const getTestimonials = async (): Promise<Testimonial[]> => { await delay(); return TESTIMONIALS; };

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

// ── TEAM ─────────────────────────────────────────────
export const TEAM: TeamMember[] = [
  { id: '1', name: 'Arjun Biswakarma', role: 'Founder & Secretary', bio: 'Social worker and founder of the society. Converted his own home to begin this mission in 2008. The driving force behind all programmes.', photo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80', workingSince: '16 Sep 2008', contact: '+91 9933071201' },
  { id: '2', name: 'Antony Praveen K M', role: 'President', bio: 'Current President of the Governing Body. Working with the society since June 2025. Located in Mal, Jalpaiguri.', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', workingSince: '10 Jun 2025', contact: '+91 9800321965' },
  { id: '3', name: 'Kanchan Siwa', role: 'Treasurer', bio: 'Manages the financial affairs of the society. Working since March 2018. Located at Maraghat Tea Garden, Banarhat.', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80', workingSince: '12 Mar 2018', contact: '+91 9382733711' },
  { id: '4', name: 'Alka Oraon Keshor', role: 'Board Member', bio: 'Board member since June 2025. Resides in Sulkapara, Nagrakata. Committed to women\'s welfare and community development.', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', workingSince: '10 Jun 2025', contact: '+91 8942024382' },
  { id: '5', name: 'Benu Kami', role: 'Board Member', bio: 'Dedicated board member since October 2021. Based in Sukhani Busty, Nagrakata. Supports community outreach.', photo: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&q=80', workingSince: '10 Oct 2021', contact: '+91 7364049046' },
  { id: '6', name: 'Rajkapur Karmakar', role: 'Board Member', bio: 'Board member since June 2025. Located in Banarhat, Jalpaiguri. Contributes to sports and youth programmes.', photo: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=400&q=80', workingSince: '10 Jun 2025', contact: '+91 8317821877' },
  { id: '7', name: 'Suganti Lakra Oraon', role: 'Board Member', bio: 'Board member since June 2025. From Bhagatpur Tea Garden, Jalpaiguri. Focuses on women and community welfare.', photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', workingSince: '10 Jun 2025', contact: '+91 8967491403' },
];

export const getTeam = async (): Promise<TeamMember[]> => { await delay(); return TEAM; };

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

// ── MOCK FORM SUBMISSIONS ─────────────────────────────
export const submitVolunteerForm = async (data: Omit<VolunteerApplication, 'id' | 'status' | 'createdAt'>): Promise<{ success: boolean }> => {
  await delay(1800);
  console.log('Volunteer submitted:', data);
  return { success: true };
};

export const submitContactForm = async (data: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<{ success: boolean }> => {
  await delay(1500);
  console.log('Contact submitted:', data);
  return { success: true };
};

export const submitEventVolunteer = async (data: { name: string; email: string; phone: string; skills: string; notes: string; eventId: string }): Promise<{ success: boolean }> => {
  await delay(1500);
  console.log('Event volunteer submitted:', data);
  return { success: true };
};

// ── ADMIN MOCK DATA ───────────────────────────────────
export const VOLUNTEER_APPLICATIONS: VolunteerApplication[] = [
  { id: '1', name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 9876543210', city: 'Siliguri', skills: 'Teaching, Bengali', availability: 'Weekends', interest: 'Education', reason: 'Want to contribute to education.', status: 'pending', createdAt: '2025-04-10', eventId: 'annual-health' },
  { id: '2', name: 'Rahul Das', email: 'rahul@email.com', phone: '+91 9876543211', city: 'Jalpaiguri', skills: 'Medical, First Aid', availability: 'Weekends', interest: 'Health Camps', reason: 'Medical professional wanting to serve.', status: 'approved', createdAt: '2025-04-08', eventId: 'annual-health' },
  { id: '3', name: 'Anjali Oraon', email: 'anjali@email.com', phone: '+91 9876543212', city: 'Nagrakata', skills: 'Sports Coaching', availability: 'Full-time', interest: 'Sports', reason: 'Love sports and community.', status: 'approved', createdAt: '2025-04-05', eventId: 'football-tournament' },
  { id: '4', name: 'Suresh Kami', email: 'suresh@email.com', phone: '+91 9876543213', city: 'Mal', skills: 'Language, Admin', availability: 'Event-based', interest: 'Any', reason: 'Ready to help wherever needed.', status: 'pending', createdAt: '2025-04-12' },
  { id: '5', name: 'Monika Tirkey', email: 'monika@email.com', phone: '+91 9876543214', city: 'Siliguri', skills: 'Social Work', availability: 'Weekdays', interest: 'Social Awareness', reason: 'Social work background.', status: 'declined', createdAt: '2025-03-28' },
];

export const DONATION_INQUIRIES: DonationInquiry[] = [
  { id: '1', name: 'Samir Chakraborty', contact: 'samir@email.com', method: 'Bank Transfer', amount: '₹5,000', status: 'received', createdAt: '2025-04-15' },
  { id: '2', name: 'Anjana Dey', contact: 'anjana@email.com', method: 'UPI', amount: '₹1,000', status: 'received', createdAt: '2025-04-14' },
  { id: '3', name: 'John Thomas', contact: 'john@email.com', method: 'PayPal (International)', amount: '$50', status: 'pending', createdAt: '2025-04-13' },
  { id: '4', name: 'Rima Lepcha', contact: 'rima@email.com', method: 'In Kind (Clothes)', amount: 'Clothing Bundle', status: 'arranged', createdAt: '2025-04-10' },
];

export const getVolunteerApplications = async (): Promise<VolunteerApplication[]> => { await delay(); return VOLUNTEER_APPLICATIONS; };
export const getDonationInquiries = async (): Promise<DonationInquiry[]> => { await delay(); return DONATION_INQUIRIES; };

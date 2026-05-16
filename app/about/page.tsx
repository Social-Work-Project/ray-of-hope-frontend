"use client";
import Image from 'next/image';
import { PageHero, Card, SectionHeader } from '@/components/ui';
import { useEffect, useState } from 'react';
import { AboutData, HomeData, ImagesData } from '@/types';
import { WebsiteService } from '@/services/websiteService';

const timeline = [
  { year: 'August 2008', title: 'Society Founded', desc: 'Arjun Biswakarma and six founding members sign the Memorandum of Association at Sukhani Busty, Nagrakata.' },
  { year: '16 September 2008', title: 'Official Registration', desc: 'Registered under West Bengal Society Act 1961 (S/IL/54901) by the Registrar of Firms, Societies & Non-Trading Corporations, West Bengal.' },
  { year: '2009–2015', title: 'Early Growth', desc: 'First children admitted to hostel. Social awareness programmes launched across Nagrakata tea garden areas. Community trust grows through consistent work.' },
  { year: '2016–2019', title: 'Rescue Programme Launched', desc: 'Working with local administration to rescue trafficking victims from tea garden areas. Football coaching programme begins.' },
  { year: '2019–2021', title: 'COVID-19 Relief Response', desc: 'Emergency food distribution to 500+ families. Medical camps, mask distribution, and health awareness campaigns organised across Dooars.' },
  { year: 'May 2024', title: 'NGO Darpan Registration', desc: 'Registered with NITI Aayog NGO Darpan portal (WB/2024/0416685) — national-level recognition and expanded partnership opportunities.' },
  { year: 'Today', title: 'Growing & Expanding', desc: '16+ children in the hostel, 7 active board members, multiple ongoing programmes. Project proposal submitted for education, health, vocational training and youth centre.' },
];

export default function AboutPage() {

    const [homeContent, setHomeContent] = useState<HomeData | null>(null);
    const [aboutContent, setAboutContent] = useState<AboutData | null>(null)
    const [images, setImages] = useState<ImagesData | null>(null)
  
    useEffect(() => {
      Promise.all([
        WebsiteService.getHomePageContent()
          .then((res) => setHomeContent(res.data.results || null))
          .catch(console.error),

        WebsiteService.getAboutPageContent()
          .then((res) => setAboutContent(res.data.results || null))
          .catch(console.error),

        WebsiteService.getImages()
          .then((res) => setImages(res.data.results || null))
          .catch(console.error),
      ]);
    }, []);
    
  return (
    <div className='pt-18.25'>
      <PageHero breadcrumb="About Us" title="About Nagarkata Ray of Hope Society"
        subtitle="A grassroots NGO serving the underprivileged communities of West Bengal&apos;s beautiful but marginalized Dooars region since 2008." />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="section-label">Our Foundation</div>
            <h2 className="text-3xl font-black mb-5 text-(--navy)" >Born from Compassion in Dooars Valley</h2>
            <p className="text-base leading-loose mb-4 text-(--gray-600)" >
              Nagarkata Ray of Hope Society was founded in 2008 by <strong>Arjun Biswakarma</strong> at Sukhani Busty, P.O./P.S. Nagrakata, District Jalpaiguri, West Bengal. When it was started it was just like a tiny little dew drop with the goal to reach out to the unprivileged, left out with no one to help, support and hope.
            </p>
            <p className="text-base leading-loose mb-6 text-(--gray-600)">
              Mr. Biswakarma converted part of his own home into the office and first centre. Today it is registered under West Bengal Society Act 1961 (Reg. No. S/IL/54901) and NGO Darpan (NITI Aayog): DARPAN ID WB/2024/0416685. The society runs entirely on public donations.
            </p>
            <div className="space-y-2.5">
              {["Registered: West Bengal Society Act 1961", "NGO Darpan ID: WB/2024/0416685 (Active)", "Registration No: S/IL/54901 · Date: 16 Sep 2008", "7 Board Members · Jalpaiguri, West Bengal"].map((item, i) => (
                <div key={i} className="flex gap-3 items-center text-sm" style={{ color: "var(--gray-600)" }}>
                  <span className="text-base text-(--sky)">✓</span> {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="rounded-2xl overflow-hidden shadow-xl mb-5">
              <Image src={images?.about_foundation_image || "/images/dooars.jpeg"} alt="Dooars" width={700} height={280} className="w-full object-cover h-70 " />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ n: homeContent?.children_in_hostel || "16+", l: "Children Housed" }, { n: homeContent?.families_reached || "500+", l: "Families Aided" }].map((s, i) => (
                <Card key={i} className="p-6 text-center" hover={false}>
                  <div className="text-3xl font-black mb-1 text-blue-900 font-['Playfair_Display',serif]" >{s.n}</div>
                  <div className="text-sm text-gray-600" >{s.l}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-(--gray-50)" >
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader label="Purpose" title="Mission & Vision" center />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-10 shadow-sm border-t-4" style={{ borderColor: "var(--blue)", borderLeft: "1px solid var(--gray-100)", borderRight: "1px solid var(--gray-100)", borderBottom: "1px solid var(--gray-100)" }}>
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--navy)" }}>Our Mission</h3>
              <p className="text-sm leading-loose mb-4" style={{ color: "var(--gray-600)" }}>{aboutContent?.mission_statement || "To transform people and the society through Social Awareness Programmes, Humanitarian and Charity work, Health Programmes, Medical Services, Educational Support, Sports & Youth programmes — reaching the unprivileged, the left-out, and those with no one to help, support or hope."}</p>
              <blockquote className="text-lg pl-5 border-l-4 mt-4" style={{ borderColor: "var(--accent)", color: "var(--accent)", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}>&ldquo;To be Hope for No Hope&rdquo;</blockquote>
            </div>
            <div className="bg-white rounded-2xl p-10 shadow-sm border-t-4" style={{ borderColor: "var(--accent)", borderLeft: "1px solid var(--gray-100)", borderRight: "1px solid var(--gray-100)", borderBottom: "1px solid var(--gray-100)" }}>
              <div className="text-3xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--navy)" }}>Our Vision</h3>
              <p className="text-sm leading-loose mb-4" style={{ color: "var(--gray-600)" }}>{aboutContent?.vision_statement || "To create a platform where every individual — regardless of caste, poverty, or circumstance — can stand on their own feet with dignity. We dream of opening a Free Primary School, Vocational Training Centre, Youth Centre, and Old Age Home across the Dooars region."}</p>
              <div className="text-xs px-4 py-3 rounded-xl" style={{ background: "var(--gray-50)", color: "var(--gray-600)" }}>Planned: Education · Health · Vocational Skills · Sports · Youth Centre · Agriculture · Old Age Home</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-label">Our Journey</div>
          <h2 className="text-3xl font-black mb-12" style={{ color: "var(--navy)" }}>History & Milestones</h2>
          <div className="max-w-2xl relative pl-1">
            <div className="absolute left-0 top-2 bottom-2 w-0.5" style={{ background: "var(--gray-200)" }} />
            {timeline.map((item, i) => (
              <div key={i} className="pl-9 relative mb-9">
                <div className="absolute -left-1.5 top-1.5 w-3.5 h-3.5 rounded-full border-[3px] border-white" style={{ background: "var(--blue)", boxShadow: "0 0 0 2px var(--blue)" }} />
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--sky)" }}>{item.year}</div>
                <h4 className="font-bold mb-1" style={{ fontFamily: "'DM Sans',sans-serif", color: "var(--navy)" }}>{item.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: "var(--gray-600)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-label">The Context</div>
            <h2 className="text-3xl font-black mb-5" style={{ color: "var(--navy)" }}>Why Nagrakata & Dooars?</h2>
            <p className="text-sm leading-loose mb-4" style={{ color: "var(--gray-600)" }}>Dooars — the plains region of North Bengal bordering Bhutan, Nepal and Bangladesh — is famous for its breathtaking tea gardens. Yet beneath the surface lies acute poverty, unemployment, and social vulnerability.</p>
            <p className="text-sm leading-loose mb-4" style={{ color: "var(--gray-600)" }}>North Bengal has over <strong>280 tea gardens employing ~350,000 workers</strong>. Garden closures trigger unemployment, forced migration, and human trafficking — particularly of young girls and boys to other states as domestic labourers.</p>
            <p className="text-sm leading-loose" style={{ color: "var(--gray-600)" }}>Nagrakata Block population stands at ~170,000, with a literacy rate of just 53.10%. This is exactly where Nagarkata Ray of Hope Society steps in.</p>
          </div>
          <div>
            <div className="rounded-2xl overflow-hidden shadow-xl mb-5">
              <Image src={images?.about_content_image || "/images/tea-garden.jpg"} alt="Tea garden" width={700} height={280} className="w-full object-cover" style={{ height: 280 }} />
            </div>
            <div className="p-5 rounded-xl border" style={{ background: "var(--accent-soft)", borderColor: "rgba(244,164,53,0.3)" }}>
              <div className="font-bold mb-2 text-sm" style={{ color: "var(--navy)" }}>Key Statistics — Nagrakata Block</div>
              <div className="text-sm leading-loose" style={{ color: "var(--gray-600)" }}>Population (2024): ~170,712 · Literacy Rate: 53.10%<br />Tea Gardens in North Bengal: 280+ · Workers at Risk: ~350,000</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
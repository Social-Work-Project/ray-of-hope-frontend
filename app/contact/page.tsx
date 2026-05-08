"use client"
import { PageHero } from '@/components/ui';
import { ContactForm } from '@/components/Sections/ContactForm';
import { useEffect, useMemo, useState } from 'react';
import { ContactResponse } from '@/types';
import { WebsiteService } from '@/services/websiteService';

export default function ContactPage() {
  const [contacts, setContacts] = useState<ContactResponse | null>(null);

  useEffect(() => {
    WebsiteService.getContantDetails()
      .then((res) => setContacts(res.data.results || null))
      .catch(console.error);
  }, []);

  const info = useMemo(() => {
    if (!contacts) return [];

    const items = [];

    if (contacts.address) {
      items.push({ icon: "📍", title: "Address", lines: [contacts.address] });
    }

    if (contacts.phone_numbers?.length) {
      items.push({
        icon: "📞",
        title: "Phone",
        lines: contacts.phone_numbers.map((p) => p.phone_number),
      });
    }

    if (contacts.emails?.length) {
      items.push({
        icon: "✉️",
        title: "Email",
        lines: contacts.emails.map((e) => e.email),
      });
    }

    return items;
  }, [contacts]);

  return (
    <div className='pt-18.25'>
      <PageHero
        breadcrumb="Contact"
        title="Get In Touch"
        subtitle="Reach out to us for donations, volunteering, partnerships, or any enquiries about our work."
      />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="section-label">Contact Form</div>
            <h2 className="text-2xl font-black mb-8" style={{ color: "var(--navy)" }}>Send Us a Message</h2>
            <ContactForm />
          </div>
          <div>
            <div className="section-label">Find Us</div>
            <h2 className="text-2xl font-black mb-6" style={{ color: "var(--navy)" }}>Contact Information</h2>
            <div className="space-y-4">
              {/* Static registration card — this never comes from the API */}
              {[
                ...info,
                {
                  icon: "📋",
                  title: "Registration",
                  lines: ["Reg. No: S/IL/54901", "NGO Darpan: WB/2024/0416685", "Registered: 16 September 2008"],
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start bg-white rounded-xl p-5 shadow-sm border"
                  style={{ borderColor: "var(--gray-100)" }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: "var(--gray-50)" }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4
                      className="font-bold text-sm mb-1"
                      style={{ fontFamily: "'DM Sans',sans-serif", color: "var(--navy)" }}
                    >
                      {item.title}
                    </h4>
                    {item.lines.map((l, j) => (
                      <p key={j} className="text-sm" style={{ color: "var(--gray-600)" }}>{l}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div
              className="mt-5 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-14 gap-2"
              style={{ borderColor: "var(--gray-200)", color: "var(--gray-400)" }}
            >
              <div className="text-3xl">🗺️</div>
              <div className="font-medium text-sm">Nagrakata, Jalpaiguri District</div>
              <div className="text-xs">26.88824° N, 88.91226° E</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
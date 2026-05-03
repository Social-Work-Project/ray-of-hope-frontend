"use client"
import { VolunteerForm } from '@/components/Sections/VolunteerForm';
import { WebsiteService } from '@/services/websiteService';
import { useState } from 'react';
import { toast } from 'sonner';

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);

  const onSave = async (data: any) => {
    try {
      await WebsiteService.submitVolunteerForm(data);
      toast.success('Application submitted! We will contact you within 3–5 working days.');
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting volunteer form:", error);
      toast.error('Failed to submit application. Please try again.');
      setSubmitted(false);
    }
  };

  return (
    <div className='pt-18.25'>
      <section className="py-20 text-center" style={{ background: "linear-gradient(135deg, var(--navy), #1B5CA8)", color: "white" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs mb-4 flex gap-2 items-center justify-center" style={{ color: "rgba(255,255,255,0.5)" }}>
            <span>Home</span><span>/</span><span style={{ color: "var(--accent)" }}>Volunteer</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Become a Volunteer</h1>
          <p className="text-base max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.8)" }}>
            Join our family of dedicated volunteers and help us create a better future for the communities of Dooars.
          </p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-2xl p-10 shadow-xl border -mt-10 mb-16" style={{ borderColor: "var(--gray-100)" }}>
          <h3 className="text-xl font-bold mb-1" style={{ color: "var(--navy)" }}>Volunteer Application</h3>
          <p className="text-sm mb-8" style={{ color: "var(--gray-400)" }}>We will get back to you within 3–5 working days.</p>
         { !submitted && <VolunteerForm onSave={onSave} /> }
         { submitted && (
            <div className="text-center">
              <p className="text-lg font-semibold" style={{ color: "var(--navy)" }}>Thank you for your application!</p>
              <p className="text-base" style={{ color: "var(--gray-400)" }}>We will contact you within 3–5 working days.</p>
            </div>
          ) }
        </div>
      </div>
    </div>
  );
}
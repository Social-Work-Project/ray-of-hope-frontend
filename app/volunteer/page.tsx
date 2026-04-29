import { VolunteerForm } from '@/components/Sections/VolunteerForm';

export default function VolunteerPage() {
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
          <VolunteerForm />
        </div>
      </div>
    </div>
  );
}
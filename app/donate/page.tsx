import Link from 'next/link';
import { PageHero } from '@/components/ui';

const methods = [
  {
    icon: "🏦", title: "Bank Transfer / NEFT",
    desc: "Transfer directly to our registered bank account. Safest and most transparent donation method.",
    detail: ["Account Name: Nagarkata Ray of Hope Society", "Contact us for full bank details."],
    action: "Request Bank Details", href: "/contact"
  },
  {
    icon: "📱", title: "UPI / Google Pay",
    desc: "Instant UPI transfer — quickest way to contribute from anywhere in India.",
    detail: ["UPI Contact: +91 9641361319", "Search by mobile number on any UPI app"],
    action: null, href: null
  },
  {
    icon: "🌐", title: "PayPal / International",
    desc: "For international donors who wish to contribute from outside India.",
    detail: ["Email: nagarkatarayofhopesociety@gmail.com", "Contact us to arrange PayPal transfer"],
    action: "Email Us", href: "mailto:nagarkatarayofhopesociety@gmail.com"
  },
  {
    icon: "📦", title: "Donate in Kind",
    desc: "We accept clothes, food, stationery, school bags, medicines and other essentials.",
    detail: ["Drop-off: Sukhani Busty, P.O./P.S. Nagrakata", "Dist. Jalpaiguri, WB – 735225"],
    action: "Call to Coordinate", href: "tel:+919641361319"
  },
];

const fundUse = [
  { pct: "40%", label: "Children's Hostel", desc: "Food, clothing, school materials, utilities" },
  { pct: "25%", label: "Health & Medical", desc: "Camps, transport, medicines, awareness" },
  { pct: "20%", label: "Education", desc: "Teachers, materials, coaching, scholarships" },
  { pct: "15%", label: "Community Programs", desc: "Sports, awareness, humanitarian relief" },
];

export default function DonatePage() {
  return (
    <div className='pt-18.25'>
      <section className="py-20 text-center" style={{ background: "linear-gradient(135deg, var(--navy), #1B5CA8)", color: "white" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
            style={{ background: "rgba(244,164,53,0.2)", border: "1px solid rgba(244,164,53,0.4)", color: "var(--accent)" }}>
            ♥ Your Generosity Saves Lives
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Support Our Mission</h1>
          <p className="text-lg max-w-lg mx-auto mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
            Every rupee goes directly toward sheltering children, health camps, education, and rescue programmes in the Dooars region.
          </p>
          <Link href="/volunteer" className="inline-flex px-6 py-3 rounded-xl font-semibold text-sm border-2 transition-all hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.4)", color: "white" }}>Volunteer Instead →</Link>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-label">Donation Methods</div>
          <h2 className="text-3xl font-black mb-3" style={{ color: "var(--navy)" }}>Ways to Donate</h2>
          <p className="text-base mb-12 max-w-xl" style={{ color: "var(--gray-600)" }}>All contributions are used 100% for our community programmes.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {methods.map((m, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border transition-all hover:-translate-y-1 hover:shadow-md text-center" style={{ borderColor: "var(--gray-100)" }}>
                <div className="text-4xl mb-4">{m.icon}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--navy)" }}>{m.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--gray-600)" }}>{m.desc}</p>
                <div className="px-4 py-3 rounded-xl text-sm font-medium mb-5 text-left" style={{ background: "var(--gray-50)", color: "var(--navy)" }}>
                  {m.detail.map((d, j) => <div key={j}>{d}</div>)}
                </div>
                {m.action && m.href && (
                  <a href={m.href} className="inline-flex w-full justify-center px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-blue-50"
                    style={{ borderColor: "var(--blue)", color: "var(--blue)" }}>{m.action}</a>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 p-7 rounded-2xl border flex gap-5 items-start" style={{ background: "var(--accent-soft)", borderColor: "rgba(244,164,53,0.3)" }}>
            <div className="text-4xl shrink-0">🔒</div>
            <div>
              <h4 className="font-bold mb-2" style={{ fontFamily: "'DM Sans',sans-serif", color: "var(--navy)" }}>Your Donation Is Safe & Accountable</h4>
              <p className="text-sm leading-relaxed" style={{ color: "var(--gray-600)" }}>Nagarkata Ray of Hope Society is registered under West Bengal Society Act 1961 (S/IL/54901) and listed on NGO Darpan (NITI Aayog, Govt. of India). All funds are utilised exclusively for programme activities.</p>
            </div>
          </div>

          <div className="mt-20">
            <div className="section-label">Transparency</div>
            <h2 className="text-3xl font-black mb-10" style={{ color: "var(--navy)" }}>How Your Funds Are Used</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {fundUse.map((f, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: "var(--gray-100)", borderTop: "4px solid var(--blue)" }}>
                  <div className="text-3xl font-black mb-2" style={{ fontFamily: "'Playfair Display',serif", color: "var(--blue)" }}>{f.pct}</div>
                  <div className="font-bold mb-1 text-sm" style={{ color: "var(--navy)" }}>{f.label}</div>
                  <p className="text-xs" style={{ color: "var(--gray-600)" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

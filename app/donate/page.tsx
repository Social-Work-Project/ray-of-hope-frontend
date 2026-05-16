"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { WebsiteService } from "@/services/websiteService";
import { BankData, ContactResponse, UpiData, UPIResponse } from "@/types";

const fundUse = [
  {
    pct: "40%",
    label: "Children's Hostel",
    desc: "Food, clothing, school materials, utilities",
  },
  {
    pct: "25%",
    label: "Health & Medical",
    desc: "Camps, transport, medicines, awareness",
  },
  {
    pct: "20%",
    label: "Education",
    desc: "Teachers, materials, coaching, scholarships",
  },
  {
    pct: "15%",
    label: "Community Programs",
    desc: "Sports, awareness, humanitarian relief",
  },
];

export default function DonatePage() {
  // const [bank, setBank] = useState<BankData | null>(null);
  const [upi, setUpi] = useState<UPIResponse | null>(null);
  const [contacts, setContacts] = useState<ContactResponse | null>(null);

  useEffect(() => {
    Promise.all([
      // WebsiteService.getBankAccountDetails()
      //   .then((res) => setBank(res.data.results || null))
      //   .catch(console.error),
      WebsiteService.getUPIDetails()
        .then((res) => setUpi(res.data.results || null))
        .catch(console.error),
      WebsiteService.getContantDetails()
        .then((res) => setContacts(res.data.results || null))
        .catch(console.error),
    ]);
  }, []);

  const primaryEmail =
    contacts?.emails?.[0]?.email ?? "nagarkatarayofhopesociety@gmail.com";
  const primaryPhone =
    contacts?.phone_numbers?.[0]?.phone_number ?? "+91 9641361319";
  const dropoffAddress =
    contacts?.address ??
    "Sukhani Busty, P.O./P.S. Nagrakata, Dist. Jalpaiguri, WB – 735225";

  return (
    <div className="pt-18.25">
      <section
        className="py-20 text-center"
        style={{
          background: "linear-gradient(135deg, var(--navy), #1B5CA8)",
          color: "white",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
            style={{
              background: "rgba(244,164,53,0.2)",
              border: "1px solid rgba(244,164,53,0.4)",
              color: "var(--accent)",
            }}
          >
            ♥ Your Generosity Saves Lives
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Support Our Mission
          </h1>
          <p
            className="text-lg max-w-lg mx-auto mb-8"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            Every rupee goes directly toward sheltering children, health camps,
            education, and rescue programmes in the Dooars region.
          </p>
          <Link
            href="/volunteer"
            className="inline-flex px-6 py-3 rounded-xl font-semibold text-sm border-2 transition-all hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.4)", color: "white" }}
          >
            Volunteer Instead →
          </Link>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-label">Donation Methods</div>
          <h2
            className="text-3xl font-black mb-3"
            style={{ color: "var(--navy)" }}
          >
            Ways to Donate
          </h2>
          <p
            className="text-base mb-12 max-w-xl"
            style={{ color: "var(--gray-600)" }}
          >
            All contributions are used 100% for our community programmes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BANK TRANSFER */}
            {/* {bank && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border transition-all hover:-translate-y-1 hover:shadow-md text-center" style={{ borderColor: "var(--gray-100)" }}>
                <div className="text-4xl mb-4">🏦</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--navy)" }}>Bank Transfer / NEFT</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--gray-600)" }}>
                  Transfer directly to our registered bank account. Safest and most transparent donation method.
                </p>
                <div className="px-4 py-3 rounded-xl text-sm text-left space-y-1 mb-5" style={{ background: "var(--gray-50)", color: "var(--navy)" }}>
                  <div><span className="font-semibold">Account Name:</span> {bank.account_holder_name}</div>
                  <div><span className="font-semibold">Bank:</span> {bank.bank_name}</div>
                  <div><span className="font-semibold">Account No:</span> {bank.account_number}</div>
                  <div><span className="font-semibold">IFSC:</span> {bank.ifsc_code}</div>
                  <div><span className="font-semibold">Branch:</span> {bank.branch_name}</div>
                  <div><span className="font-semibold">Type:</span> {bank.account_type}</div>
                </div>
                {bank.qr_code && (
                  <div className="flex flex-col items-center gap-2 mt-4">
                    <p className="text-xs font-semibold" style={{ color: "var(--gray-600)" }}>Scan to Pay</p>
                    <Image src={bank.qr_code} alt="Bank QR Code" width={140} height={140} className="rounded-xl border" style={{ borderColor: "var(--gray-200)" }} />
                  </div>
                )}
              </div>
            )} */}

            {/* Bank Details India only */}

            <div
  className="bg-white rounded-2xl p-8 shadow-sm border transition-all hover:-translate-y-1 hover:shadow-md text-center"
  style={{ borderColor: "var(--gray-100)" }}
>
  <div className="text-4xl mb-4">🏦</div>
  <h3
    className="text-xl font-bold mb-2"
    style={{ color: "var(--navy)" }}
  >
    Bank Transfer / NEFT
  </h3>
  <p
    className="text-sm leading-relaxed mb-4"
    style={{ color: "var(--gray-600)" }}
  >
    Transfer directly to our registered bank account. Safest and most
    transparent donation method.
  </p>

  {/* India-only notice */}
  <div
    className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs text-left mb-4"
    style={{ background: "#fefce8", border: "1px solid #fde68a" }}
  >
    <span className="mt-0.5 shrink-0">⚠️</span>
    <p style={{ color: "#92400e" }}>
      <span className="font-semibold">India only.</span> Due to our registration
      type, this account cannot accept international wire transfers. If you are
      donating from outside India, please use UPI or contact us for alternatives.
    </p>
  </div>

  <div
    className="px-4 py-3 rounded-xl text-sm text-left mb-5 space-y-1"
    style={{ background: "var(--gray-50)", color: "var(--navy)" }}
  >
    <div>
      <span className="font-semibold">Email:</span> {primaryEmail}
    </div>
    <div className="text-xs" style={{ color: "var(--gray-600)" }}>
      Contact us to arrange bank transfer
    </div>
  </div>

  <a
    href={`mailto:${primaryEmail}`}
    className="inline-flex w-full justify-center px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-blue-50"
    style={{ borderColor: "var(--blue)", color: "var(--blue)" }}
  >
    Email Us
  </a>
</div>

            {/* UPI */}
            {upi && (
              <div
                className="bg-white rounded-2xl p-8 shadow-sm border transition-all hover:-translate-y-1 hover:shadow-md text-center"
                style={{ borderColor: "var(--gray-100)" }}
              >
                <div className="text-4xl mb-4">📱</div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "var(--navy)" }}
                >
                  UPI / Google Pay
                </h3>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: "var(--gray-600)" }}
                >
                  Instant UPI transfer — quickest way to contribute from
                  anywhere in India.
                </p>
                <div
                  className="px-4 py-3 rounded-xl text-sm text-left mb-5 space-y-1"
                  style={{ background: "var(--gray-50)", color: "var(--navy)" }}
                >
                  {upi.upi_ids.map((u) => (
                    <div key={u.reference_id}>
                      <span className="font-semibold">UPI ID:</span> {u.upi_id}
                    </div>
                  ))}
                  <div
                    className="text-xs mt-1"
                    style={{ color: "var(--gray-600)" }}
                  >
                    Search by UPI ID on any UPI app
                  </div>
                </div>
                {upi.qr_code && (
                  <div className="flex flex-col items-center gap-2 mt-4">
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "var(--gray-600)" }}
                    >
                      Scan to Donate
                    </p>
                    <Image
                      src={upi.qr_code}
                      alt="UPI QR Code"
                      width={140}
                      height={140}
                      className="rounded-xl border"
                      style={{ borderColor: "var(--gray-200)" }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* INTERNATIONAL / PAYPAL — static, uses contact email */}
            {/* <div className="bg-white rounded-2xl p-8 shadow-sm border transition-all hover:-translate-y-1 hover:shadow-md text-center" style={{ borderColor: "var(--gray-100)" }}>
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--navy)" }}>PayPal / International</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--gray-600)" }}>
                For international donors who wish to contribute from outside India.
              </p>
              <div className="px-4 py-3 rounded-xl text-sm text-left mb-5 space-y-1" style={{ background: "var(--gray-50)", color: "var(--navy)" }}>
                <div><span className="font-semibold">Email:</span> {primaryEmail}</div>
                <div className="text-xs" style={{ color: "var(--gray-600)" }}>Contact us to arrange PayPal transfer</div>
              </div>
              <a href={`mailto:${primaryEmail}`}
                className="inline-flex w-full justify-center px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-blue-50"
                style={{ borderColor: "var(--blue)", color: "var(--blue)" }}>
                Email Us
              </a>
            </div> */}

            {/* DONATE IN KIND — fully static */}
            <div
              className="bg-white rounded-2xl p-8 shadow-sm border transition-all hover:-translate-y-1 hover:shadow-md text-center"
              style={{ borderColor: "var(--gray-100)" }}
            >
              <div className="text-4xl mb-4">📦</div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--navy)" }}
              >
                Donate in Kind
              </h3>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "var(--gray-600)" }}
              >
                We accept clothes, food, stationery, school bags, medicines and
                other essentials.
              </p>
              <div
                className="px-4 py-3 rounded-xl text-sm text-left mb-5 space-y-1"
                style={{ background: "var(--gray-50)", color: "var(--navy)" }}
              >
                <div>
                  <span className="font-semibold">Drop-off:</span>{" "}
                  {dropoffAddress}
                </div>
              </div>
              <a
                href={`tel:${primaryPhone}`}
                className="inline-flex w-full justify-center px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-blue-50"
                style={{ borderColor: "var(--blue)", color: "var(--blue)" }}
              >
                Call to Coordinate
              </a>
            </div>
          </div>

          <div
            className="mt-10 p-7 rounded-2xl border flex gap-5 items-start"
            style={{
              background: "var(--accent-soft)",
              borderColor: "rgba(244,164,53,0.3)",
            }}
          >
            <div className="text-4xl shrink-0">🔒</div>
            <div>
              <h4
                className="font-bold mb-2"
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  color: "var(--navy)",
                }}
              >
                Your Donation Is Safe & Accountable
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--gray-600)" }}
              >
                Nagarkata Ray of Hope Society is registered under West Bengal
                Society Act 1961 (S/IL/54901) and listed on NGO Darpan (NITI
                Aayog, Govt. of India). All funds are utilised exclusively for
                programme activities.
              </p>
            </div>
          </div>

          <div className="mt-20">
            <div className="section-label">Transparency</div>
            <h2
              className="text-3xl font-black mb-10"
              style={{ color: "var(--navy)" }}
            >
              How Your Funds Are Used
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {fundUse.map((f, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-sm border"
                  style={{
                    borderColor: "var(--gray-100)",
                    borderTop: "4px solid var(--blue)",
                  }}
                >
                  <div
                    className="text-3xl font-black mb-2"
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      color: "var(--blue)",
                    }}
                  >
                    {f.pct}
                  </div>
                  <div
                    className="font-bold mb-1 text-sm"
                    style={{ color: "var(--navy)" }}
                  >
                    {f.label}
                  </div>
                  <p className="text-xs" style={{ color: "var(--gray-600)" }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';
import { useState, useRef } from 'react';
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { toast } from 'sonner';
import AdminGuard from '@/components/Admin/AdminGuard';

const inputCls = "w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200";
const labelCls = "block text-xs font-semibold mb-1";

// --- Reusable Multi-Input Component ---
function MultiInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (vals: string[]) => void;
  placeholder?: string;
}) {
  const add = () => onChange([...values, '']);
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const update = (i: number, val: string) =>
    onChange(values.map((v, idx) => (idx === i ? val : v)));

  return (
    <div>
      <label className={labelCls} style={{ color: 'var(--gray-800)' }}>{label}</label>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={v}
              onChange={e => update(i, e.target.value)}
              placeholder={placeholder}
              className={inputCls}
              style={{ borderColor: 'var(--gray-200)' }}
            />
            {values.length > 1 && (
              <button
                onClick={() => remove(i)}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                title="Remove"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={add}
          className="mt-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-blue-50"
          style={{ color: 'var(--blue)', borderColor: 'var(--blue)' }}
        >
          + Add {label}
        </button>
      </div>
    </div>
  );
}

// --- QR Upload Field ---
function QRUpload({
  label,
  preview,
  onUpload,
}: {
  label: string;
  preview: string | null;
  onUpload: (dataUrl: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className={labelCls} style={{ color: 'var(--gray-800)' }}>{label}</label>
      <div
        onClick={() => ref.current?.click()}
        className="cursor-pointer border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
        style={{ borderColor: 'var(--gray-200)', minHeight: 120 }}
      >
        {preview ? (
          <img src={preview} alt="QR Preview" className="h-24 w-24 object-contain rounded-lg" />
        ) : (
          <>
            <span className="text-2xl">📷</span>
            <span className="text-xs text-gray-400">Click to upload QR code image</span>
          </>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {preview && (
        <button
          onClick={() => onUpload('')}
          className="mt-1 text-xs text-red-400 hover:text-red-600"
        >
          Remove image
        </button>
      )}
    </div>
  );
}

// --- Section Card Wrapper ---
function SectionCard({
  title,
  onSave,
  saveLabel = 'Save Changes',
  children,
  span2 = false,
}: {
  title: string;
  onSave: () => void;
  saveLabel?: string;
  children: React.ReactNode;
  span2?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border p-6 ${span2 ? 'lg:col-span-2' : ''}`}
      style={{ borderColor: 'var(--gray-100)' }}
    >
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>{title}</h3>
        <button
          onClick={onSave}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
          style={{ background: 'var(--blue)' }}
        >
          {saveLabel}
        </button>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
export default function AdminCMSPage() {
  // Home / About state (unchanged)
  const [heroTitle, setHeroTitle] = useState("Bringing Hope to the Hearts of Dooars");
  const [heroSub, setHeroSub] = useState("Nagarkata Ray of Hope Society serves the underprivileged communities of West Bengal's Dooars region.");
  const [hostelCount, setHostelCount] = useState("16+");
  const [familiesCount, setFamiliesCount] = useState("500+");
  const [mission, setMission] = useState("To be Hope for No Hope — reaching the unprivileged, the left-out, and those with no one to help.");
  const [vision, setVision] = useState("To create a platform where every individual can stand on their own feet with dignity.");

  // Contact Details
  const [phones, setPhones] = useState(["+91 9641361319"]);
  const [emails, setEmails] = useState(["nagarkatarayofhopesociety@gmail.com"]);
  const [address, setAddress] = useState("Sukhani Busty, Nagrakata, Jalpaiguri, WB – 735225");

  // UPI Payment
  const [upiIds, setUpiIds] = useState(["9641361319@upi"]);
  const [upiQR, setUpiQR] = useState<string | null>(null);

  // Bank Details
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [branch, setBranch] = useState("");
  const [accountType, setAccountType] = useState("Savings");
  const [bankQR, setBankQR] = useState<string | null>(null);

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1">
          <div className="bg-white border-b px-8 py-4 sticky top-0 z-10" style={{ borderColor: 'var(--gray-100)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--navy)' }}>CMS Content Editor</h2>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── Home Page ── */}
            <SectionCard title="Home Page Content" onSave={() => toast.success('Home page content saved!')}>
              <div>
                <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Hero Title</label>
                <input value={heroTitle} onChange={e => setHeroTitle(e.target.value)} className={inputCls} style={{ borderColor: 'var(--gray-200)' }} />
              </div>
              <div>
                <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Hero Subtitle</label>
                <textarea value={heroSub} onChange={e => setHeroSub(e.target.value)} rows={3} className={inputCls} style={{ borderColor: 'var(--gray-200)', resize: 'vertical' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Children in Hostel</label>
                  <input value={hostelCount} onChange={e => setHostelCount(e.target.value)} className={inputCls} style={{ borderColor: 'var(--gray-200)' }} />
                </div>
                <div>
                  <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Families Reached</label>
                  <input value={familiesCount} onChange={e => setFamiliesCount(e.target.value)} className={inputCls} style={{ borderColor: 'var(--gray-200)' }} />
                </div>
              </div>
            </SectionCard>

            {/* ── About Page ── */}
            <SectionCard title="About Page Content" onSave={() => toast.success('About page content saved!')}>
              <div>
                <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Mission Statement</label>
                <textarea value={mission} onChange={e => setMission(e.target.value)} rows={3} className={inputCls} style={{ borderColor: 'var(--gray-200)', resize: 'vertical' }} />
              </div>
              <div>
                <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Vision Statement</label>
                <textarea value={vision} onChange={e => setVision(e.target.value)} rows={3} className={inputCls} style={{ borderColor: 'var(--gray-200)', resize: 'vertical' }} />
              </div>
            </SectionCard>

            {/* ── Contact Details ── */}
            <SectionCard title="Contact Details" onSave={() => toast.success('Contact details saved!')}>
              <MultiInput
                label="Phone Numbers"
                values={phones}
                onChange={setPhones}
                placeholder="+91 XXXXXXXXXX"
              />
              <MultiInput
                label="Email Addresses"
                values={emails}
                onChange={setEmails}
                placeholder="example@email.com"
              />
              <div>
                <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Address <span className="text-gray-400 font-normal">(one only)</span></label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={2}
                  className={inputCls}
                  style={{ borderColor: 'var(--gray-200)', resize: 'vertical' }}
                />
              </div>
            </SectionCard>

            {/* ── UPI Payment ── */}
            <SectionCard title="UPI Payment" onSave={() => toast.success('UPI details saved!')}>
              <MultiInput
                label="UPI IDs / Numbers"
                values={upiIds}
                onChange={setUpiIds}
                placeholder="yourname@upi or +91 XXXXXXXXXX"
              />
              <QRUpload
                label="UPI QR Code"
                preview={upiQR}
                onUpload={setUpiQR}
              />
            </SectionCard>

            {/* ── Bank Details ── */}
            <SectionCard title="Bank Account Details" onSave={() => toast.success('Bank details saved!')} saveLabel="Save Bank Details" span2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Bank Name</label>
                  <input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g. State Bank of India" className={inputCls} style={{ borderColor: 'var(--gray-200)' }} />
                </div>
                <div>
                  <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Account Holder Name</label>
                  <input value={accountHolder} onChange={e => setAccountHolder(e.target.value)} placeholder="Full name on account" className={inputCls} style={{ borderColor: 'var(--gray-200)' }} />
                </div>
                <div>
                  <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Account Number</label>
                  <input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="XXXXXXXXXXXXXXXX" className={inputCls} style={{ borderColor: 'var(--gray-200)' }} />
                </div>
                <div>
                  <label className={labelCls} style={{ color: 'var(--gray-800)' }}>IFSC Code</label>
                  <input value={ifsc} onChange={e => setIfsc(e.target.value)} placeholder="e.g. SBIN0001234" className={inputCls} style={{ borderColor: 'var(--gray-200)' }} />
                </div>
                <div>
                  <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Branch Name</label>
                  <input value={branch} onChange={e => setBranch(e.target.value)} placeholder="e.g. Nagrakata Branch" className={inputCls} style={{ borderColor: 'var(--gray-200)' }} />
                </div>
                <div>
                  <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Account Type</label>
                  <select
                    value={accountType}
                    onChange={e => setAccountType(e.target.value)}
                    className={inputCls}
                    style={{ borderColor: 'var(--gray-200)' }}
                  >
                    <option>Savings</option>
                    <option>Current</option>
                    <option>NGO / Trust Account</option>
                  </select>
                </div>
              </div>
              <QRUpload
                label="Bank QR Code"
                preview={bankQR}
                onUpload={setBankQR}
              />
            </SectionCard>

          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
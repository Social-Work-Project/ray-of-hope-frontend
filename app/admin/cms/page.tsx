'use client';
import { useEffect, useRef, useState } from 'react';
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import AdminGuard from '@/components/Admin/AdminGuard';
import { SectionCard } from '@/components/Admin/cms/SectionCard';
import { MultiInput } from '@/components/Admin/cms/MultiInput';
import { QRUpload } from '@/components/Admin/cms/QRUpload';
import { Field, TextInput, TextArea, SelectInput } from '@/components/Admin/cms/FieldInput';
import { useCMSSection } from '@/hooks/useCMSSection';
import { AdminService } from '@/services/adminService';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// ── Defaults ──────────────────────────────────────────────────────────────────
const D = {
  home:    { hero_title: "Bringing Hope to the Hearts of Dooars", hero_subtitle: "Nagarkata Ray of Hope Society serves the underprivileged communities of West Bengal's Dooars region.", children_in_hostel: "16+", families_reached: "500+", year_of_establishment: "2008", active_programs: "5+" },
  about:   { mission_statement: "To transform people and the society through Social Awareness Programmes, Humanitarian and Charity work, Health Programmes, Medical Services, Educational Support, Sports & Youth programmes — reaching the unprivileged, the left-out, and those with no one to help, support or hope.", vision_statement: "To create a platform where every individual — regardless of caste, poverty, or circumstance — can stand on their own feet with dignity. We dream of opening a Free Primary School, Vocational Training Centre, Youth Centre, and Old Age Home across the Dooars region." },
  contact: { phones: ["+91 9641361319"], emails: ["nagarkatarayofhopesociety@gmail.com"], address: "Sukhani Busty, Nagrakata, Jalpaiguri, WB – 735225" },
  upi:     { upi_ids: ["9641361319@upi"], qr_code: null },
  bank:    { bank_name: "", account_holder_name: "", account_number: "", ifsc_code: "", branch_name: "", account_type: "Savings", qr_code: null },
};

// ── Image slot definitions ────────────────────────────────────────────────────
const IMAGE_SLOTS = [
  { key: 'home_hero_image',        label: 'Home Hero Image',        hint: 'Main banner on the homepage' },
  { key: 'home_story_image',       label: 'Home Story Image',       hint: 'Home page story section' },
  { key: 'about_foundation_image', label: 'About Foundation Image', hint: 'Shown on the About page' },
  { key: 'about_content_image',    label: 'About Context Image',    hint: 'Context section' },
] as const;
 
type ImageKey = typeof IMAGE_SLOTS[number]['key'];
 
// The "data" shape the hook stores — just the server URLs
type ImageData = Record<ImageKey, string | null>;
 
const IMAGE_DEFAULTS: ImageData = {
  home_hero_image:        null,
  home_story_image:       null,
  about_foundation_image: null,
  about_content_image:    null,
};
 
// Per-slot UI state (lives outside the hook — purely local)
interface SlotUIState {
  pendingFile:       File   | null;
  previewUrl:        string | null;
  markedForDeletion: boolean;
}
 
const emptyUI = (): SlotUIState => ({
  pendingFile: null, previewUrl: null, markedForDeletion: false,
});
 
// ── Single image picker ───────────────────────────────────────────────────────
function ImageSlot({
  label, hint,
  serverUrl, ui,
  onChange,
}: {
  label:     string;
  hint:      string;
  serverUrl: string | null;
  ui:        SlotUIState;
  onChange:  (patch: Partial<SlotUIState>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
 
  const displaySrc = ui.markedForDeletion
    ? null
    : ui.previewUrl ?? serverUrl ?? null;
 
  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/'))  { toast.error('Please select a valid image file.'); return; }
    if (file.size > 5 * 1024 * 1024)     { toast.error('Image must be smaller than 5 MB.');  return; }
    if (ui.previewUrl) URL.revokeObjectURL(ui.previewUrl);
    onChange({ pendingFile: file, previewUrl: URL.createObjectURL(file), markedForDeletion: false });
  };
 
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (ui.previewUrl) URL.revokeObjectURL(ui.previewUrl);
    onChange({ pendingFile: null, previewUrl: null, markedForDeletion: Boolean(serverUrl) });
    if (inputRef.current) inputRef.current.value = '';
  };
 
  return (
    <div className="flex flex-col gap-1.5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--gray-800)' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--gray-400)' }}>{hint}</p>
      </div>
 
      <div
        onClick={() => !ui.markedForDeletion && inputRef.current?.click()}
        onDragOver={e  => { e.preventDefault(); setDragging(true);  }}
        onDragLeave={() => setDragging(false)}
        onDrop={e      => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0] ?? null); }}
        className="relative rounded-xl border-2 border-dashed overflow-hidden transition-all"
        style={{
          borderColor: dragging ? 'var(--blue)' : 'var(--gray-200)',
          background:  dragging ? 'rgba(59,130,246,0.04)' : 'var(--gray-50)',
          aspectRatio: '16/9',
          cursor:      ui.markedForDeletion ? 'default' : 'pointer',
        }}
      >
        {displaySrc ? (
          <>
            <img src={displaySrc} alt={label} className="w-full h-full object-cover" />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(0,0,0,0.45)' }}
            >
              <Upload className="w-5 h-5 text-white" />
              <span className="text-white text-xs font-semibold">Replace image</span>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10"
              style={{ background: 'rgba(220,38,38,0.9)' }}
              aria-label={`Remove ${label}`}
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
            {ui.pendingFile && (
              <span
                className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: 'var(--blue)', color: 'white' }}
              >
                Unsaved
              </span>
            )}
          </>
        ) : ui.markedForDeletion ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#fee2e2' }}>
              <X className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-xs font-semibold text-red-500">Will be deleted on save</p>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onChange({ markedForDeletion: false }); }}
              className="text-xs underline mt-1"
              style={{ color: 'var(--blue)' }}
            >
              Undo
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gray-100)' }}>
              <ImageIcon className="w-5 h-5" style={{ color: 'var(--gray-400)' }} />
            </div>
            <p className="text-xs font-semibold" style={{ color: 'var(--gray-600)' }}>
              {dragging ? 'Drop here' : 'Click or drag & drop'}
            </p>
            <p className="text-xs" style={{ color: 'var(--gray-400)' }}>PNG, JPG, WEBP — max 5 MB</p>
          </div>
        )}
      </div>
 
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
 
// ── Images Section ────────────────────────────────────────────────────────────
export function ImagesSection() {
  // Per-slot UI state — completely local, never sent to the hook
  const [uiStates, setUiStates] = useState<Record<ImageKey, SlotUIState>>(
    () => Object.fromEntries(IMAGE_SLOTS.map(s => [s.key, emptyUI()])) as Record<ImageKey, SlotUIState>
  );
 
  const patchUI = (key: ImageKey, patch: Partial<SlotUIState>) =>
    setUiStates(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));
 
  // ── buildPayload: called by the hook right before save ──────────────────
  // Builds FormData from the current uiStates.
  // Returns null to abort when there is nothing to upload.
  const buildPayload = (data: ImageData): FormData | null => {
    const pending = IMAGE_SLOTS.filter(
      s => uiStates[s.key].pendingFile ||
           (uiStates[s.key].markedForDeletion && data[s.key]),
    );
 
    if (pending.length === 0) {
      toast.info('No image changes to save.');
      return null; // aborts save inside the hook
    }
 
    const fd = new FormData();
    for (const slot of IMAGE_SLOTS) {
      const ui = uiStates[slot.key];
      if (ui.pendingFile) {
        fd.append(slot.key, ui.pendingFile, ui.pendingFile.name);
      } else if (ui.markedForDeletion && data[slot.key]) {
        fd.append(slot.key, ''); // signal deletion to the API
      }
    }
    return fd;
  };
 
  // ── Hook — identical create/update lifecycle as every other CMS section ──
  const images = useCMSSection<ImageData, FormData>(
    AdminService.getImagesContent,
    AdminService.createImagesContent,
    AdminService.updateImagesContent,
    IMAGE_DEFAULTS,
    'Images saved!',
    buildPayload,
  );
 
  // After a successful save the hook has already re-run fetchFn.
  // We need to reset local UI states so previews/badges clear.
  // We do this by wrapping `save` and resetting on success.
  const handleSave = async () => {
    const prevExists = images.saving; // just to satisfy lint; see note below
    await images.save();
    // Reset UI slots — the hook will have refreshed `data` with new server URLs
    setUiStates(
      Object.fromEntries(IMAGE_SLOTS.map(s => [s.key, emptyUI()])) as Record<ImageKey, SlotUIState>
    );
  };
 
  const pendingCount = IMAGE_SLOTS.filter(
    s => uiStates[s.key].pendingFile ||
         (uiStates[s.key].markedForDeletion && images.data[s.key]),
  ).length;
 
  return (
    <div
      className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 lg:col-span-2"
      style={{ borderColor: 'var(--gray-100)' }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
        <div>
          <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>Website Images</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--gray-400)' }}>
            Upload hero, story, and about section images. Click <strong>Save Images</strong> to apply.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {pendingCount > 0 && (
            <span
              className="text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap"
              style={{ background: '#fef3c7', color: '#92400e' }}
            >
              {pendingCount} unsaved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={images.saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            style={{ background: 'var(--blue)' }}
          >
            {images.saving
              ? <><Loader2 className="w-3 h-3 animate-spin" /> Saving…</>
              : 'Save Images'
            }
          </button>
        </div>
      </div>
 
      {images.loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--blue)' }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {IMAGE_SLOTS.map(slot => (
            <ImageSlot
              key={slot.key}
              label={slot.label}
              hint={slot.hint}
              serverUrl={images.data[slot.key]}   // ← comes from hook data
              ui={uiStates[slot.key]}              // ← local file/preview state
              onChange={patch => patchUI(slot.key, patch)}
            />
          ))}
        </div>
      )}
 
      <p className="text-xs mt-4" style={{ color: 'var(--gray-400)' }}>
        💡 Unsaved changes are discarded if you refresh the page.
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminCMSPage() {
  const home    = useCMSSection(AdminService.getHomePageContent,  AdminService.createHomePageContent,  AdminService.updateHomePageContent,  D.home,    'Home content saved!');
  const about   = useCMSSection(AdminService.getAboutPageContent, AdminService.createAboutPageContent, AdminService.updateAboutPageContent, D.about,   'About content saved!');
  const contact = useCMSSection(AdminService.getContactContent,   AdminService.createContactContent,   AdminService.updateContactContent,   D.contact, 'Contact details saved!');

  const [upiQRFile,  setUpiQRFile]  = useState<File | null>(null);
  const [bankQRFile, setBankQRFile] = useState<File | null>(null);

  const upi  = useCMSSection(AdminService.getUpiContent,  (d) => AdminService.createUpiContent(d, upiQRFile),   (d) => AdminService.updateUpiContent(d, upiQRFile),   D.upi,  'UPI details saved!');
  const bank = useCMSSection(AdminService.getBankContent, (d) => AdminService.createBankContent(d, bankQRFile), (d) => AdminService.updateBankContent(d, bankQRFile), D.bank, 'Bank details saved!');

  const set = <T, K extends keyof T>(hook: { data: T; setData: (d: T) => void }, key: K) =>
    (val: T[K]) => hook.setData({ ...hook.data, [key]: val });

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 flex flex-col bg-gray-50 min-w-0">
          {/* Top bar */}
          <div
            className="bg-white border-b px-4 sm:px-8 py-4 sticky top-0 z-10"
            style={{ borderColor: 'var(--gray-100)' }}
          >
            <h2
              className="font-bold text-base sm:text-lg pl-12 lg:pl-0"
              style={{ color: 'var(--navy)', fontFamily: "'DM Sans',sans-serif" }}
            >
              CMS Content Editor
            </h2>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

            {/* ── Images — spans full width, always first ── */}
            <ImagesSection />

            {/* Home */}
            <SectionCard title="Home Page Content" onSave={home.save} saving={home.saving}>
              <Field label="Hero Title">
                <TextInput value={home.data.hero_title ?? ''} onChange={set(home, 'hero_title')} />
              </Field>
              <Field label="Hero Subtitle">
                <TextArea value={home.data.hero_subtitle ?? ''} onChange={set(home, 'hero_subtitle')} />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Children in Hostel">
                  <TextInput value={home.data.children_in_hostel ?? ''} onChange={set(home, 'children_in_hostel')} />
                </Field>
                <Field label="Families Reached">
                  <TextInput value={home.data.families_reached ?? ''} onChange={set(home, 'families_reached')} />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Year of Establishment">
                  <TextInput value={home.data.year_of_establishment ?? ''} onChange={set(home, 'year_of_establishment')} />
                </Field>
                <Field label="Active Programs">
                  <TextInput value={home.data.active_programs ?? ''} onChange={set(home, 'active_programs')} />
                </Field>
              </div>
            </SectionCard>

            {/* About */}
            <SectionCard title="About Page Content" onSave={about.save} saving={about.saving}>
              <Field label="Mission Statement">
                <TextArea rows={6} value={about.data.mission_statement ?? ''} onChange={set(about, 'mission_statement')} />
              </Field>
              <Field label="Vision Statement">
                <TextArea rows={6} value={about.data.vision_statement ?? ''} onChange={set(about, 'vision_statement')} />
              </Field>
            </SectionCard>

            {/* Contact */}
            <SectionCard title="Contact Details" onSave={contact.save} saving={contact.saving}>
              <MultiInput label="Phone Numbers" values={contact.data.phones ?? ''}
                onChange={set(contact, 'phones')} placeholder="+91 XXXXXXXXXX" />
              <MultiInput label="Email Addresses" values={contact.data.emails ?? ''}
                onChange={set(contact, 'emails')} placeholder="example@email.com" />
              <Field label="Address" hint="(one only)">
                <TextArea value={contact.data.address} onChange={set(contact, 'address')} rows={2} />
              </Field>
            </SectionCard>

            {/* UPI */}
            <SectionCard title="UPI Payment" onSave={upi.save} saving={upi.saving}>
              <MultiInput label="UPI IDs / Numbers" values={upi.data.upi_ids ?? ''}
                onChange={set(upi, 'upi_ids')} placeholder="yourname@upi or +91 XXXXXXXXXX" />
              <QRUpload
                label="UPI QR Code"
                previewUrl={upi.data.qr_code ?? ''}
                pendingFile={upiQRFile}
                onFileChange={setUpiQRFile}
                onRemove={() => { setUpiQRFile(null); upi.setData({ ...upi.data, qr_code: null }); }}
              />
            </SectionCard>

            {/* Bank — spans both columns */}
            <SectionCard title="Bank Account Details" onSave={bank.save} saving={bank.saving}
              saveLabel="Save Bank Details" span2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Field label="Bank Name">
                  <TextInput value={bank.data.bank_name ?? ''} onChange={set(bank, 'bank_name')} placeholder="e.g. State Bank of India" />
                </Field>
                <Field label="Account Holder Name">
                  <TextInput value={bank.data.account_holder_name ?? ''} onChange={set(bank, 'account_holder_name')} placeholder="Full name on account" />
                </Field>
                <Field label="Account Number">
                  <TextInput value={bank.data.account_number ?? ''} onChange={set(bank, 'account_number')} placeholder="XXXXXXXXXXXXXXXX" />
                </Field>
                <Field label="IFSC Code">
                  <TextInput value={bank.data.ifsc_code ?? ''} onChange={set(bank, 'ifsc_code')} placeholder="e.g. SBIN0001234" />
                </Field>
                <Field label="Branch Name">
                  <TextInput value={bank.data.branch_name ?? ''} onChange={set(bank, 'branch_name')} placeholder="e.g. Nagrakata Branch" />
                </Field>
                <Field label="Account Type">
                  <SelectInput value={bank.data.account_type ?? ''} onChange={set(bank, 'account_type')}
                    options={['Savings', 'Current', 'NGO / Trust Account']} />
                </Field>
              </div>
              <QRUpload
                label="Bank QR Code"
                previewUrl={bank.data.qr_code ?? ''}
                pendingFile={bankQRFile}
                onFileChange={setBankQRFile}
                onRemove={() => { setBankQRFile(null); bank.setData({ ...bank.data, qr_code: null }); }}
              />
            </SectionCard>

          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
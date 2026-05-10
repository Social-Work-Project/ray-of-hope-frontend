'use client';
import { useState } from 'react';
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import AdminGuard from '@/components/Admin/AdminGuard';
import { SectionCard } from '@/components/Admin/cms/SectionCard';
import { MultiInput } from '@/components/Admin/cms/MultiInput';
import { QRUpload } from '@/components/Admin/cms/QRUpload';
import { Field, TextInput, TextArea, SelectInput } from '@/components/Admin/cms/FieldInput';
import { useCMSSection } from '@/hooks/useCMSSection';
import { AdminService } from '@/services/adminService';

const D = {
  home:    { hero_title: "Bringing Hope to the Hearts of Dooars", hero_subtitle: "Nagarkata Ray of Hope Society serves the underprivileged communities of West Bengal's Dooars region.", children_in_hostel: "16+", families_reached: "500+", year_of_establishment: "2008", active_programs: "5+" },
  about:   { mission_statement: "To be Hope for No Hope — reaching the unprivileged, the left-out, and those with no one to help.", vision_statement: "To create a platform where every individual can stand on their own feet with dignity." },
  contact: { phones: ["+91 9641361319"], emails: ["nagarkatarayofhopesociety@gmail.com"], address: "Sukhani Busty, Nagrakata, Jalpaiguri, WB – 735225" },
  upi:     { upi_ids: ["9641361319@upi"], qr_code: null },
  bank:    { bank_name: "", account_holder_name: "", account_number: "", ifsc_code: "", branch_name: "", account_type: "Savings", qr_code: null },
};

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

          {/* 1-col on mobile, 2-col on lg+ */}
          <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

            {/* Home */}
            <SectionCard title="Home Page Content" onSave={home.save} saving={home.saving}>
              <Field label="Hero Title">
                <TextInput value={home.data.hero_title ?? ''} onChange={set(home, 'hero_title')} />
              </Field>
              <Field label="Hero Subtitle">
                <TextArea value={home.data.hero_subtitle ?? ''} onChange={set(home, 'hero_subtitle')} />
              </Field>
              {/* Stack 1-col on mobile, 2-col on sm+ */}
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

            {/* Bank — spans both columns on lg+ */}
            <SectionCard title="Bank Account Details" onSave={bank.save} saving={bank.saving}
              saveLabel="Save Bank Details" span2>
              {/* 1-col → 2-col → 3-col as viewport grows */}
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
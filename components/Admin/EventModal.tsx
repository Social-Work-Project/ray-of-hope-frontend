'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X, Plus, Trash2, CalendarDays, MapPin, Clock,
  Users, User, FileText, Upload, ImageIcon,
  Eye, EyeOff, Tag, Phone, Mail,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Event, EventResponse } from '@/types';
import { ca } from 'zod/locales';
import { AdminService } from '@/services/adminService';

// ── ZOD SCHEMA ───────────────────────────────────────────────────
const scheduleItemSchema = z.object({
  time: z.string().min(1, 'Time is required'),
  title: z.string().min(1, 'Activity description is required'),
});

const eventSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(2, 'Category is required'),
  event_date: z.string().min(1, 'Date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  organizer_name: z.string().min(2, 'Organizer name is required'),
  phone_number: z.string().min(7, 'Phone number is required'),
  email: z.string().email('Enter a valid email'),
  volunteers_needed: z
    .number()
    .min(1, 'At least 1 volunteer required')
    .max(500, 'Cannot exceed 500'),
  status: z.enum(['published', 'draft']),
  schedules: z.array(scheduleItemSchema).min(1, 'At least one schedule item is required'),
});

type EventFormData = z.infer<typeof eventSchema>;

// ── HELPERS ──────────────────────────────────────────────────────
function toInputDate(dateStr: string): string {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Strip seconds for <input type="time"> which expects HH:MM
function toInputTime(t: string): string {
  if (!t) return '';
  if (/^\d{2}:\d{2}$/.test(t)) return t;
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t.slice(0, 5);
  return t;
}

// Convert HH:MM (from <input type="time">) → HH:MM:SS for start_time / end_time
function toTimeSeconds(t: string): string {
  return t ? `${t}:00` : '';
}

// Normalise any time string → HH:MM:SS for schedule slot times
// Handles: "10:00 AM", "4:30PM", "14:00", "14:00:00"
function normaliseTime(t: string): string {
  if (!t) return '';
  t = t.trim();
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;                          // already HH:MM:SS
  if (/^\d{1,2}:\d{2}$/.test(t)) return `${t.padStart(5, '0')}:00`;    // HH:MM → HH:MM:SS
  const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = match[2];
    if (match[3].toUpperCase() === 'AM' && h === 12) h = 0;
    if (match[3].toUpperCase() === 'PM' && h !== 12) h += 12;
    return `${String(h).padStart(2, '0')}:${m}:00`;
  }
  return t; // fallback
}

function uid() { return Math.random().toString(36).slice(2, 9); }

// ── SMALL UI HELPERS ─────────────────────────────────────────────
const inp =
  'w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200 bg-white';

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs mt-1 font-medium text-red-500">{msg}</p>;
}

function Lbl({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--gray-800)' }}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--sky)' }}>
          {title}
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--gray-100)' }} />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// ── IMAGE UPLOAD ──────────────────────────────────────────────────
interface ImageUploadProps {
  existingImageUrl?: string;
  onFileChange: (file: File | null) => void;
  error?: string;
}

function ImageUpload({ existingImageUrl, onFileChange, error }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(existingImageUrl ?? '');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => { setPreview(existingImageUrl ?? ''); }, [existingImageUrl]);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select a valid image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be smaller than 5 MB.'); return; }
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    onFileChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  };

  const clearImage = () => {
    setPreview('');
    onFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <Lbl>Logo / Cover Image</Lbl>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className="relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden"
        style={{
          borderColor: isDragging ? 'var(--blue)' : error ? '#ef4444' : 'var(--gray-200)',
          background: isDragging ? 'rgba(59,130,246,0.04)' : 'var(--gray-50)',
          minHeight: preview ? 160 : 96,
        }}
      >
        {preview ? (
          <>
            <img src={preview} alt="Logo preview" className="w-full object-cover" style={{ height: 160 }} />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(0,0,0,0.45)' }}
            >
              <Upload className="w-5 h-5 text-white" />
              <span className="text-white text-xs font-semibold">Replace image</span>
            </div>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); clearImage(); }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.55)' }}
              aria-label="Remove image"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-7">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gray-100)' }}>
              <ImageIcon className="w-5 h-5" style={{ color: 'var(--gray-400)' }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: 'var(--gray-600)' }}>Click to upload or drag & drop</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--gray-400)' }}>PNG, JPG, WEBP — max 5 MB</p>
            </div>
          </div>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0] ?? null)} />
      {error && <Err msg={error} />}
    </div>
  );
}

// ── MAIN MODAL ────────────────────────────────────────────────────
export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: EventResponse | null;
  /** Receives FormData ready to POST as multipart/form-data */
  onSave: (formData: FormData) => void;
}

export function EventModal({ isOpen, onClose, event, onSave }: EventModalProps) {
  const isEdit = Boolean(event);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      event_date: '',
      start_time: '',
      end_time: '',
      location: '',
      organizer_name: '',
      phone_number: '',
      email: '',
      volunteers_needed: 10,
      status: 'draft',
      schedules: [{ time: '', title: '' }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({ control, name: 'schedules' });
  const watchedStatus = watch('status');

  // Populate / reset on open
  useEffect(() => {
    if (!isOpen) return;
    if (event) {
      const ev = event as any;
      reset({
        name: ev.name ?? ev.title ?? '',
        description: ev.description ?? '',
        category: ev.category ?? '',
        event_date: toInputDate(ev.event_date ?? ev.date ?? ''),
        start_time: toInputTime(ev.start_time ?? ''),
        end_time: toInputTime(ev.end_time ?? ''),
        location: ev.location ?? '',
        organizer_name: ev.organizer_name ?? ev.organizer ?? '',
        phone_number: ev.phone_number ?? '',
        email: ev.email ?? '',
        volunteers_needed: ev.volunteers_needed ?? ev.volunteersNeeded ?? 10,
        status: ev.status ?? 'draft',
        schedules: ev.schedules?.length
          ? ev.schedules
          : ev.schedule?.length
            ? ev.schedule
            : [{ time: '', title: '' }],
      });
    } else {
      reset({
        name: '',
        description: '',
        category: '',
        event_date: '',
        start_time: '',
        end_time: '',
        location: '',
        organizer_name: '',
        phone_number: '',
        email: '',
        volunteers_needed: 10,
        status: 'draft',
        schedules: [{ time: '', title: '' }],
      });
    }
    setLogoFile(null);
  }, [isOpen, event, reset]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target !== overlayRef.current) return;
    if (isDirty && !confirm('You have unsaved changes. Close anyway?')) return;
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isDirty && !confirm('You have unsaved changes. Close anyway?')) return;
      onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, isDirty, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── SUBMIT ───────────────────────────────────────────────────
  const onSubmit =  (data: EventFormData) => {
    setSaving(true);
    try {
    const fd = new FormData();
    fd.append('name', data.name);
    fd.append('description', data.description);
    fd.append('category', data.category);
    fd.append('event_date', data.event_date);                 // YYYY-MM-DD
    fd.append('start_time', toTimeSeconds(data.start_time)); // HH:MM:SS
    fd.append('end_time', toTimeSeconds(data.end_time));     // HH:MM:SS
    fd.append('location', data.location);
    fd.append('organizer_name', data.organizer_name);
    fd.append('phone_number', data.phone_number);
    fd.append('email', data.email);
    fd.append('volunteers_needed', String(data.volunteers_needed));
    fd.append('status', data.status);
    fd.append('schedules', JSON.stringify(
      data.schedules.map(s => ({ ...s, time: normaliseTime(s.time) }))
    ));

    if (logoFile) {
      fd.append('logo', logoFile, logoFile.name);     // File object
    } else if ((event as any)?.logo) {
      fd.append('logo', (event as any).logo);          // Keep existing URL
    }
    setSaving(false);
    onSave(fd);
    toast.success(isEdit ? `"${data.name}" updated!` : `"${data.name}" created!`);
    onClose();
  } catch (err) {
  toast.error('An error occurred while saving the event. Please try again.');
  setSaving(false);
}

  }

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(11,31,58,0.6)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl shadow-2xl bg-white animate-fade-up my-auto"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-7 py-5 border-b flex-shrink-0" style={{ borderColor: 'var(--gray-100)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: isEdit ? '#FFF3DC' : '#EEF2F7' }}>
              <CalendarDays className="w-5 h-5" style={{ color: isEdit ? '#b87a10' : 'var(--blue)' }} />
            </div>
            <div>
              <h2 className="text-lg font-black" style={{ color: 'var(--navy)' }}>
                {isEdit ? 'Edit Event' : 'Create New Event'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--gray-400)' }}>
                {isEdit ? `Editing: ${(event as any)?.name ?? event?.name}` : 'Fill in the details below to add a new event'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100" aria-label="Close">
            <X className="w-5 h-5" style={{ color: 'var(--gray-600)' }} />
          </button>
        </div>

        {/* ── FORM ── */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="px-7 py-6 space-y-7 overflow-y-auto flex-1">

            {/* ── BASIC INFO ── */}
            <Section title="Basic Information">

              {/* Name — full width single row */}
              <div>
                <Lbl required>Event Name</Lbl>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                  <input
                    {...register('name')}
                    placeholder="e.g. Tech Volunteer Meetup 2027 with schedule"
                    className={inp + ' pl-10'}
                    style={{ borderColor: errors.name ? '#ef4444' : 'var(--gray-200)' }}
                  />
                </div>
                <Err msg={errors.name?.message} />
              </div>

              {/* Category + Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Lbl required>Category</Lbl>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                    <input
                      {...register('category')}
                      placeholder="e.g. technology"
                      className={inp + ' pl-10'}
                      style={{ borderColor: errors.category ? '#ef4444' : 'var(--gray-200)' }}
                    />
                  </div>
                  <Err msg={errors.category?.message} />
                </div>
                <div>
                  <Lbl required>Event Date</Lbl>
                  <div className="relative">
                    <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                    <input
                      {...register('event_date')}
                      type="date"
                      className={inp + ' pl-10'}
                      style={{ borderColor: errors.event_date ? '#ef4444' : 'var(--gray-200)' }}
                    />
                  </div>
                  <Err msg={errors.event_date?.message} />
                </div>
              </div>

              {/* Start Time + End Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Lbl required>Start Time</Lbl>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                    <input
                      {...register('start_time')}
                      type="time"
                      className={inp + ' pl-10'}
                      style={{ borderColor: errors.start_time ? '#ef4444' : 'var(--gray-200)' }}
                    />
                  </div>
                  <Err msg={errors.start_time?.message} />
                </div>
                <div>
                  <Lbl required>End Time</Lbl>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                    <input
                      {...register('end_time')}
                      type="time"
                      className={inp + ' pl-10'}
                      style={{ borderColor: errors.end_time ? '#ef4444' : 'var(--gray-200)' }}
                    />
                  </div>
                  <Err msg={errors.end_time?.message} />
                </div>
              </div>

              {/* Location */}
              <div>
                <Lbl required>Location / Venue</Lbl>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                  <input
                    {...register('location')}
                    placeholder="e.g. Pokhara"
                    className={inp + ' pl-10'}
                    style={{ borderColor: errors.location ? '#ef4444' : 'var(--gray-200)' }}
                  />
                </div>
                <Err msg={errors.location?.message} />
              </div>
            </Section>

            {/* ── ORGANIZER ── */}
            <Section title="Organizer Details">
              {/* Organizer name + Volunteers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Lbl required>Organizer Name</Lbl>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                    <input
                      {...register('organizer_name')}
                      placeholder="e.g. Tech Nepal"
                      className={inp + ' pl-10'}
                      style={{ borderColor: errors.organizer_name ? '#ef4444' : 'var(--gray-200)' }}
                    />
                  </div>
                  <Err msg={errors.organizer_name?.message} />
                </div>
                <div>
                  <Lbl required>Volunteers Needed</Lbl>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                    <input
                      {...register('volunteers_needed', { valueAsNumber: true })}
                      type="number"
                      min={1}
                      max={500}
                      placeholder="20"
                      className={inp + ' pl-10'}
                      style={{ borderColor: errors.volunteers_needed ? '#ef4444' : 'var(--gray-200)' }}
                    />
                  </div>
                  <Err msg={errors.volunteers_needed?.message} />
                </div>
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Lbl required>Phone Number</Lbl>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                    <input
                      {...register('phone_number')}
                      type="tel"
                      placeholder="9800000000"
                      className={inp + ' pl-10'}
                      style={{ borderColor: errors.phone_number ? '#ef4444' : 'var(--gray-200)' }}
                    />
                  </div>
                  <Err msg={errors.phone_number?.message} />
                </div>
                <div>
                  <Lbl required>Email</Lbl>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="info@technepal.com"
                      className={inp + ' pl-10'}
                      style={{ borderColor: errors.email ? '#ef4444' : 'var(--gray-200)' }}
                    />
                  </div>
                  <Err msg={errors.email?.message} />
                </div>
              </div>
            </Section>

            {/* ── CONTENT ── */}
            <Section title="Content">
              <div>
                <Lbl required>Description</Lbl>
                <textarea
                  {...register('description')}
                  rows={5}
                  placeholder="A community-driven tech meetup focused on networking and volunteering..."
                  className={inp}
                  style={{ borderColor: errors.description ? '#ef4444' : 'var(--gray-200)', resize: 'vertical' }}
                />
                <Err msg={errors.description?.message} />
              </div>
            </Section>

            {/* ── MEDIA & STATUS ── */}
            <Section title="Media & Status">
              <ImageUpload
                existingImageUrl={isEdit ? (event as any)?.logo : undefined}
                onFileChange={setLogoFile}
              />
              <div>
                <Lbl required>Publish Status</Lbl>
                <div className="flex gap-3">
                  {(['draft', 'published'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setValue('status', s, { shouldDirty: true })}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all"
                      style={
                        watchedStatus === s
                          ? s === 'published'
                            ? { background: '#dcfce7', borderColor: '#86efac', color: '#16a34a' }
                            : { background: '#fef9c3', borderColor: '#fbbf24', color: '#a16207' }
                          : { background: 'white', borderColor: 'var(--gray-200)', color: 'var(--gray-400)' }
                      }
                    >
                      {s === 'published' ? <><Eye className="w-4 h-4" /> Published</> : <><EyeOff className="w-4 h-4" /> Draft</>}
                    </button>
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--gray-400)' }}>
                  {watchedStatus === 'published'
                    ? '✓ This event will be visible on the public website.'
                    : 'This event will be hidden from the public website.'}
                </p>
              </div>
            </Section>

            {/* ── SCHEDULE BUILDER ── */}
            <Section title="Event Schedule">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs" style={{ color: 'var(--gray-600)' }}>Add time-slots in chronological order.</p>
                    {typeof errors.schedules?.message === 'string' && (
                      <p className="text-xs text-red-500 font-medium mt-0.5">{errors.schedules.message}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => append({ time: '', title: '' })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-md"
                    style={{ background: 'var(--blue)', color: 'white' }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Slot
                  </button>
                </div>
                <div className="space-y-2.5">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex gap-2.5 items-start p-3.5 rounded-xl border"
                      style={{ background: 'var(--gray-50)', borderColor: 'var(--gray-100)' }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-2"
                        style={{ background: 'var(--blue)', color: 'white' }}
                      >
                        {index + 1}
                      </div>
                      <div style={{ width: 140, flexShrink: 0 }}>
                        <input
                          {...register(`schedules.${index}.time`)}
                          placeholder="10:00 AM"
                          className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-200 bg-white transition-all"
                          style={{ borderColor: errors.schedules?.[index]?.time ? '#ef4444' : 'var(--gray-200)' }}
                        />
                        <Err msg={errors.schedules?.[index]?.time?.message} />
                      </div>
                      <div className="flex-1">
                        <input
                          {...register(`schedules.${index}.title`)}
                          placeholder="e.g. Registration & Opening Ceremony"

                          className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-200 bg-white transition-all"
                          style={{ borderColor: errors.schedules?.[index]?.title ? '#ef4444' : 'var(--gray-200)' }}
                        />
                        <Err msg={errors.schedules?.[index]?.title?.message} />
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0 mt-1">
                        <button
                          type="button"
                          onClick={() => index > 0 && move(index, index - 1)}
                          disabled={index === 0}
                          className="w-6 h-6 flex items-center justify-center rounded text-xs transition-all"
                          style={{ color: index === 0 ? 'var(--gray-300)' : 'var(--gray-600)', background: 'white', border: '1px solid var(--gray-200)', cursor: index === 0 ? 'not-allowed' : 'pointer' }}
                          title="Move up"
                        >↑</button>
                        <button
                          type="button"
                          onClick={() => index < fields.length - 1 && move(index, index + 1)}
                          disabled={index === fields.length - 1}
                          className="w-6 h-6 flex items-center justify-center rounded text-xs transition-all"
                          style={{ color: index === fields.length - 1 ? 'var(--gray-300)' : 'var(--gray-600)', background: 'white', border: '1px solid var(--gray-200)', cursor: index === fields.length - 1 ? 'not-allowed' : 'pointer' }}
                          title="Move down"
                        >↓</button>
                        <button
                          type="button"
                          onClick={() => fields.length > 1 && remove(index)}
                          disabled={fields.length === 1}
                          className="w-6 h-6 flex items-center justify-center rounded transition-all"
                          style={{
                            background: fields.length === 1 ? 'var(--gray-50)' : '#fee2e2',
                            color: fields.length === 1 ? 'var(--gray-300)' : '#dc2626',
                            border: '1px solid ' + (fields.length === 1 ? 'var(--gray-200)' : '#fca5a5'),
                            cursor: fields.length === 1 ? 'not-allowed' : 'pointer',
                          }}
                          title={fields.length === 1 ? 'At least one slot required' : 'Remove'}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

          </div>

          {/* ── FOOTER ── */}
          <div
            className="px-7 py-4 border-t flex items-center justify-between gap-3 flex-shrink-0"
            style={{ borderColor: 'var(--gray-100)', background: 'var(--gray-50)', borderRadius: '0 0 1rem 1rem' }}
          >
            <p className="text-xs" style={{ color: 'var(--gray-400)' }}>
              {isEdit ? 'Changes update the event immediately.' : 'New event is saved as draft by default.'}
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-gray-100"
                style={{ borderColor: 'var(--gray-200)', color: 'var(--gray-600)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                style={{ background: isEdit ? 'var(--accent)' : 'var(--blue)', color: isEdit ? 'var(--navy)' : 'white' }}
              >
                {saving ? (
                  <><span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />{isEdit ? 'Saving...' : 'Creating...'}</>
                ) : isEdit ? '✓ Save Changes' : '+ Create Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
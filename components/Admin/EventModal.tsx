'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X, Plus, Trash2, CalendarDays, MapPin, Clock,
  Users, User, FileText, AlignLeft, Image as ImageIcon,
  ChevronDown, Eye, EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Event } from '@/types';

// ── ZOD SCHEMA (Zod v4) ─────────────────────────────────────────
const scheduleItemSchema = z.object({
  time: z.string().min(1, 'Time is required'),
  activity: z.string().min(1, 'Activity description is required'),
});

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  summary: z
    .string()
    .min(10, 'Summary must be at least 10 characters')
    .max(200, 'Summary cannot exceed 200 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  volunteersNeeded: z
    .number()
    .min(1, 'At least 1 volunteer required')
    .max(500, 'Cannot exceed 500'),
  organizer: z.string().min(2, 'Organizer name is required'),
  image: z.string().optional(),
  status: z.enum(['published', 'draft']),
  schedule: z.array(scheduleItemSchema).min(1, 'At least one schedule item is required'),
});

type EventFormData = z.infer<typeof eventSchema>;

// ── HELPERS ──────────────────────────────────────────────────────
function toInputDate(dateStr: string): string {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toDisplayDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function extractDayMonth(iso: string) {
  if (!iso) return { day: '', month: '' };
  const d = new Date(iso + 'T00:00:00');
  return {
    day: String(d.getDate()),
    month: d.toLocaleDateString('en-IN', { month: 'short' }),
  };
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ── SMALL UI HELPERS ─────────────────────────────────────────────
const inp =
  'w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200 bg-white';

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs mt-1 font-medium text-red-500">{msg}</p>;
}

function Lbl({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label
      className="block text-xs font-bold uppercase tracking-wider mb-1.5"
      style={{ color: 'var(--gray-800)' }}
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

// ── SECTION DIVIDER ──────────────────────────────────────────────
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

// ── MAIN MODAL ────────────────────────────────────────────────────
export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null;
  onSave: (event: Event) => void;
}

export function EventModal({ isOpen, onClose, event, onSave }: EventModalProps) {
  const isEdit = Boolean(event);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [previewImg, setPreviewImg] = useState('');

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
      title: '',
      date: '',
      time: '',
      location: '',
      summary: '',
      description: '',
      volunteersNeeded: 10,
      organizer: 'Arjun Biswakarma',
      image: '',
      status: 'draft',
      schedule: [{ time: '', activity: '' }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({ control, name: 'schedule' });

  const watchedImage = watch('image');
  const watchedSummary = watch('summary') ?? '';
  const watchedStatus = watch('status');

  // Update image preview on change
  useEffect(() => {
    const t = setTimeout(() => setPreviewImg(watchedImage ?? ''), 600);
    return () => clearTimeout(t);
  }, [watchedImage]);

  // Populate / clear form when modal opens
  useEffect(() => {
    if (!isOpen) return;
    if (event) {
      reset({
        title: event.title,
        date: toInputDate(event.date),
        time: event.time,
        location: event.location,
        summary: event.summary,
        description: event.description,
        volunteersNeeded: event.volunteersNeeded,
        organizer: event.organizer,
        image: event.image ?? '',
        status: event.status,
        schedule: event.schedule.length ? event.schedule : [{ time: '', activity: '' }],
      });
      setPreviewImg(event.image ?? '');
    } else {
      reset({
        title: '',
        date: '',
        time: '',
        location: '',
        summary: '',
        description: '',
        volunteersNeeded: 10,
        organizer: 'Arjun Biswakarma',
        image: '',
        status: 'draft',
        schedule: [{ time: '', activity: '' }],
      });
      setPreviewImg('');
    }
  }, [isOpen, event, reset]);

  // Overlay click → close (with dirty check)
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target !== overlayRef.current) return;
    if (isDirty && !confirm('You have unsaved changes. Close anyway?')) return;
    onClose();
  };

  // Esc key → close
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

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Submit
  const onSubmit = async (data: EventFormData) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    const { day, month } = extractDayMonth(data.date);
    const saved: Event = {
      id: event?.id ?? uid(),
      title: data.title,
      date: toDisplayDate(data.date),
      month,
      day,
      time: data.time,
      location: data.location,
      summary: data.summary,
      description: data.description,
      volunteersNeeded: data.volunteersNeeded,
      organizer: data.organizer,
      image: data.image || 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
      status: data.status,
      schedule: data.schedule,
    };
    setSaving(false);
    onSave(saved);
    toast.success(isEdit ? `"${data.title}" updated!` : `"${data.title}" created!`);
    onClose();
  };

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

        {/* ── MODAL HEADER ── */}
        <div
          className="flex items-center justify-between px-7 py-5 border-b flex-shrink-0"
          style={{ borderColor: 'var(--gray-100)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: isEdit ? '#FFF3DC' : '#EEF2F7' }}
            >
              <CalendarDays className="w-5 h-5" style={{ color: isEdit ? '#b87a10' : 'var(--blue)' }} />
            </div>
            <div>
              <h2 className="text-lg font-black" style={{ color: 'var(--navy)' }}>
                {isEdit ? 'Edit Event' : 'Create New Event'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--gray-400)' }}>
                {isEdit
                  ? `Editing: ${event?.title}`
                  : 'Fill in the details below to add a new event'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" style={{ color: 'var(--gray-600)' }} />
          </button>
        </div>

        {/* ── FORM SCROLL AREA ── */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="px-7 py-6 space-y-7 overflow-y-auto flex-1">

            {/* BASIC INFO */}
            <Section title="Basic Information">
              {/* Title */}
              <div>
                <Lbl required>Event Title</Lbl>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                  <input
                    {...register('title')}
                    placeholder="e.g. Annual Health Awareness Camp"
                    className={inp + ' pl-10'}
                    style={{ borderColor: errors.title ? '#ef4444' : 'var(--gray-200)' }}
                  />
                </div>
                <Err msg={errors.title?.message} />
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Lbl required>Date</Lbl>
                  <div className="relative">
                    <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                    <input
                      {...register('date')}
                      type="date"
                      className={inp + ' pl-10'}
                      style={{ borderColor: errors.date ? '#ef4444' : 'var(--gray-200)' }}
                    />
                  </div>
                  <Err msg={errors.date?.message} />
                </div>
                <div>
                  <Lbl required>Time / Duration</Lbl>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                    <input
                      {...register('time')}
                      placeholder="10:00 AM – 4:00 PM"
                      className={inp + ' pl-10'}
                      style={{ borderColor: errors.time ? '#ef4444' : 'var(--gray-200)' }}
                    />
                  </div>
                  <Err msg={errors.time?.message} />
                </div>
              </div>

              {/* Location */}
              <div>
                <Lbl required>Location / Venue</Lbl>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                  <input
                    {...register('location')}
                    placeholder="e.g. Nagrakata Tea Garden Area, Jalpaiguri"
                    className={inp + ' pl-10'}
                    style={{ borderColor: errors.location ? '#ef4444' : 'var(--gray-200)' }}
                  />
                </div>
                <Err msg={errors.location?.message} />
              </div>

              {/* Organizer + Volunteers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Lbl required>Organizer</Lbl>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                    <input
                      {...register('organizer')}
                      placeholder="Organizer name"
                      className={inp + ' pl-10'}
                      style={{ borderColor: errors.organizer ? '#ef4444' : 'var(--gray-200)' }}
                    />
                  </div>
                  <Err msg={errors.organizer?.message} />
                </div>
                <div>
                  <Lbl required>Volunteers Needed</Lbl>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                    <input
                      {...register('volunteersNeeded', { valueAsNumber: true })}
                      type="number"
                      min={1}
                      max={500}
                      placeholder="30"
                      className={inp + ' pl-10'}
                      style={{ borderColor: errors.volunteersNeeded ? '#ef4444' : 'var(--gray-200)' }}
                    />
                  </div>
                  <Err msg={errors.volunteersNeeded?.message} />
                </div>
              </div>
            </Section>

            {/* CONTENT */}
            <Section title="Content">
              {/* Summary */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Lbl required>Short Summary</Lbl>
                  <span
                    className="text-xs font-medium"
                    style={{ color: watchedSummary.length > 180 ? '#ef4444' : 'var(--gray-400)' }}
                  >
                    {watchedSummary.length}/200
                  </span>
                </div>
                <textarea
                  {...register('summary')}
                  rows={2}
                  placeholder="A brief one-line description shown on the events listing page..."
                  className={inp}
                  style={{ borderColor: errors.summary ? '#ef4444' : 'var(--gray-200)', resize: 'vertical' }}
                />
                <Err msg={errors.summary?.message} />
              </div>

              {/* Description */}
              <div>
                <Lbl required>Full Description</Lbl>
                <textarea
                  {...register('description')}
                  rows={5}
                  placeholder="Detailed description of the event — its purpose, activities, target beneficiaries, and what attendees can expect..."
                  className={inp}
                  style={{ borderColor: errors.description ? '#ef4444' : 'var(--gray-200)', resize: 'vertical' }}
                />
                <Err msg={errors.description?.message} />
              </div>
            </Section>

            {/* MEDIA + STATUS */}
            <Section title="Media & Status">
              {/* Cover Image */}
              <div>
                <Lbl>Cover Image URL</Lbl>
                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                  <input
                    {...register('image')}
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    className={inp + ' pl-10'}
                    style={{ borderColor: errors.image ? '#ef4444' : 'var(--gray-200)' }}
                  />
                </div>
                <Err msg={errors.image?.message} />
                {/* Image preview */}
                {previewImg && (
                  <div className="mt-3 rounded-xl overflow-hidden border" style={{ borderColor: 'var(--gray-200)', height: 120 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewImg}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                      onError={() => setPreviewImg('')}
                    />
                  </div>
                )}
                {!previewImg && (
                  <p className="text-xs mt-1.5" style={{ color: 'var(--gray-400)' }}>
                    Leave blank to use a default image. Paste any public image URL to preview.
                  </p>
                )}
              </div>

              {/* Status toggle */}
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
                      {s === 'published'
                        ? <><Eye className="w-4 h-4" /> Published</>
                        : <><EyeOff className="w-4 h-4" /> Draft</>}
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

            {/* SCHEDULE BUILDER */}
            <Section title="Event Schedule">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs" style={{ color: 'var(--gray-600)' }}>
                      Add time-slots in chronological order.
                    </p>
                    {typeof errors.schedule?.message === 'string' && (
                      <p className="text-xs text-red-500 font-medium mt-0.5">{errors.schedule.message}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => append({ time: '', activity: '' })}
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
                      className="flex gap-2.5 items-start p-3.5 rounded-xl border group"
                      style={{ background: 'var(--gray-50)', borderColor: 'var(--gray-100)' }}
                    >
                      {/* Step badge */}
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-2"
                        style={{ background: 'var(--blue)', color: 'white' }}
                      >
                        {index + 1}
                      </div>

                      {/* Time input */}
                      <div style={{ width: 140, flexShrink: 0 }}>
                        <input
                          {...register(`schedule.${index}.time`)}
                          placeholder="10:00 AM"
                          className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-200 bg-white transition-all"
                          style={{ borderColor: errors.schedule?.[index]?.time ? '#ef4444' : 'var(--gray-200)' }}
                        />
                        <Err msg={errors.schedule?.[index]?.time?.message} />
                      </div>

                      {/* Activity input */}
                      <div className="flex-1">
                        <input
                          {...register(`schedule.${index}.activity`)}
                          placeholder="e.g. Registration & Opening Ceremony"
                          className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-200 bg-white transition-all"
                          style={{ borderColor: errors.schedule?.[index]?.activity ? '#ef4444' : 'var(--gray-200)' }}
                        />
                        <Err msg={errors.schedule?.[index]?.activity?.message} />
                      </div>

                      {/* Move up / Move down / Delete */}
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

          {/* ── MODAL FOOTER ── */}
          <div
            className="px-7 py-4 border-t flex items-center justify-between gap-3 flex-shrink-0"
            style={{ borderColor: 'var(--gray-100)', background: 'var(--gray-50)', borderRadius: '0 0 1rem 1rem' }}
          >
            <p className="text-xs" style={{ color: 'var(--gray-400)' }}>
              {isEdit
                ? 'Changes update the event immediately in the store.'
                : 'New event is saved as draft by default unless you change status.'}
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
                style={{
                  background: isEdit ? 'var(--accent)' : 'var(--blue)',
                  color: isEdit ? 'var(--navy)' : 'white',
                }}
              >
                {saving ? (
                  <>
                    <span
                      className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                    />
                    {isEdit ? 'Saving...' : 'Creating...'}
                  </>
                ) : isEdit ? (
                  '✓ Save Changes'
                ) : (
                  '+ Create Event'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

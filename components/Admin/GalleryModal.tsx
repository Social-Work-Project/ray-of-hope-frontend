'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X, Plus, Upload, ImageIcon, Eye, EyeOff,
  FolderOpen, Tag, Type, ChevronDown, Trash2,
  CheckCircle2, AlertCircle, Loader2, Grid3x3,
} from 'lucide-react';
import { toast } from 'sonner';

// ── TYPES ──────────────────────────────────────────────────────────────────
export interface GalleryCategory {
  id: string | number;
  category_name: string;
  title?: string;
}

export interface GalleryCategory {
    reference_id: string;
    name: string;
    created_at: string;
    updated_at: string;
}


export interface GalleryItemResponse {
  reference_id: string;
  category: string | number;
  category_name?: string;
  title: string;
  images?: string[];
  is_active: boolean;
}

// ── ZOD SCHEMA ─────────────────────────────────────────────────────────────
const gallerySchema = z.object({
  category_mode: z.enum(['existing', 'new']),
  existing_category_id: z.string().optional(),
  new_category_name: z.string().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  is_active: z.boolean(),
}).superRefine((data, ctx) => {
  if (data.category_mode === 'existing' && !data.existing_category_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['existing_category_id'],
      message: 'Please select a category',
    });
  }

  if (
    data.category_mode === 'new' &&
    (!data.new_category_name || data.new_category_name.trim().length < 2)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['new_category_name'],
      message: 'Category name must be at least 2 characters',
    });
  }
});

type GalleryFormData = z.infer<typeof gallerySchema>;

// ── SMALL UI HELPERS ───────────────────────────────────────────────────────
const inp = 'w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200 bg-white';

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-xs mt-1.5 font-medium text-red-500">
      <AlertCircle className="w-3 h-3 shrink-0" />{msg}
    </p>
  );
}

function Lbl({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--gray-800)' }}>
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--blue)', opacity: 0.9 }}>
          <span className="text-white" style={{ transform: 'scale(0.7)', display: 'flex' }}>{icon}</span>
        </div>
        <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--sky)' }}>{title}</span>
        <div className="flex-1 h-px" style={{ background: 'var(--gray-100)' }} />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// ── IMAGE PREVIEW CARD ─────────────────────────────────────────────────────
function ImageCard({
  src, name, size, onRemove, index,
}: { src: string; name: string; size?: number; onRemove: () => void; index: number }) {
  return (
    <div
      className="relative group rounded-xl overflow-hidden border-2 aspect-square"
      style={{ borderColor: 'var(--gray-100)' }}
    >
      <img src={src} alt={name} className="w-full h-full object-cover" />
      {/* overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200"
        style={{ background: 'rgba(11,31,58,0.65)', backdropFilter: 'blur(2px)' }}
      >
        <button
          type="button"
          onClick={onRemove}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: '#ef4444' }}
        >
          <Trash2 className="w-3.5 h-3.5 text-white" />
        </button>
        <span className="text-white text-xs font-medium px-2 text-center truncate max-w-full">{name}</span>
      </div>
      {/* index badge */}
      <div
        className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white font-black"
        style={{ background: 'var(--blue)', fontSize: 9 }}
      >
        {index + 1}
      </div>
    </div>
  );
}

// ── MAIN MODAL ─────────────────────────────────────────────────────────────
export interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: GalleryItemResponse | null;
  /** Called with final FormData — POST for create, PATCH for edit */
  onSave: (formData: FormData, isEdit: boolean) => Promise<void>;
  /** Async function that fetches categories from /api/events/gallery-category/list/ */
  fetchCategories: () => Promise<GalleryCategory[]>;
}

interface ImageEntry {
  id: string;
  file?: File;
  preview: string;
  name: string;
  isExisting?: boolean; // true = from server (edit mode)
}

export function GalleryModal({ isOpen, onClose, item, onSave, fetchCategories }: GalleryModalProps) {
  const isEdit = Boolean(item);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState('');

  const MAX_IMAGES = 20;

  const {
    register, handleSubmit, reset, watch, setValue,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      category_mode: 'existing',
      existing_category_id: '',
      new_category_name: '',
      title: '',
      is_active: false,
    },
  });

  const categoryMode = watch('category_mode');
  const watchedStatus = watch('is_active');

  // ── Load categories on open ──────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    setCatLoading(true);
    fetchCategories()
      .then(cats => setCategories(cats))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setCatLoading(false));
  }, [isOpen, fetchCategories]);


  // ── Populate form in edit mode ───────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    if (item) {
      reset({
        category_mode: 'existing',
        existing_category_id: String(item.category),
        new_category_name: '',
        title: item.title ?? '',
        is_active: item.is_active ?? false,
      });
      // Hydrate existing images
      const existing: ImageEntry[] = (item.images ?? []).map((url, i) => ({
        id: `existing-${i}`,
        preview: url,
        name: url.split('/').pop() ?? `image-${i + 1}`,
        isExisting: true,
      }));
      setImages(existing);
    } else {
      reset({
        category_mode: 'existing',
        existing_category_id: '',
        new_category_name: '',
        title: '',
        is_active: false,
      });
      setImages([]);
    }
    setImageError('');
  }, [isOpen, item, reset]);

  // ── Scroll lock ──────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── Keyboard ESC ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isDirty && !confirm('Unsaved changes. Close anyway?')) return;
      onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, isDirty, onClose]);

  // ── Add image files ──────────────────────────────────────────────────────
  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!arr.length) { toast.error('Please select valid image files.'); return; }

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) { toast.error(`Maximum ${MAX_IMAGES} images allowed.`); return; }

    const toAdd = arr.slice(0, remaining);
    if (arr.length > remaining) toast.warning(`Only ${remaining} more image(s) allowed. Extra files skipped.`);

    const oversized = toAdd.filter(f => f.size > 10 * 1024 * 1024);
    if (oversized.length) { toast.error(`${oversized.length} file(s) exceed 10 MB limit and were skipped.`); }

    const valid = toAdd.filter(f => f.size <= 10 * 1024 * 1024);

    const newEntries: ImageEntry[] = valid.map(file => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setImages(prev => [...prev, ...newEntries]);
    setImageError('');
  }, [images.length]);

  const removeImage = (id: string) => setImages(prev => prev.filter(img => img.id !== id));

  // ── Drag & drop ──────────────────────────────────────────────────────────
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  // ── SUBMIT ───────────────────────────────────────────────────────────────
  const onSubmit = async (data: GalleryFormData) => {
    // Validate images
    const newImages = images.filter(img => !img.isExisting);
    if (!isEdit && images.length < 1) { setImageError('Please upload at least 1 image.'); return; }
    if (isEdit && images.length < 1) { setImageError('At least 1 image must remain.'); return; }

    setSaving(true);
    try {
      const fd = new FormData();

      if (isEdit) {
        // Only send dirty fields
        if (dirtyFields.title) fd.append('title', data.title);
        if (dirtyFields.is_active) fd.append('is_active', String(data.is_active));

        if (data.category_mode === 'new' && dirtyFields.new_category_name) {
          fd.append('category_name', data.new_category_name!.trim());
        } else if (data.category_mode === 'existing' && dirtyFields.existing_category_id) {
          fd.append('category', data.existing_category_id!);
        }

        // Only new files (existing images stay on server)
        newImages.forEach(img => {
          if (img.file) fd.append('images', img.file, img.file.name);
        });

        // Deleted existing images: send remaining existing URLs so server knows what to keep
        const keptExisting = images.filter(img => img.isExisting).map(img => img.preview);
        if (keptExisting.length > 0) {
          fd.append('existing_images', JSON.stringify(keptExisting));
        }
      } else {
        // Create — send everything
        fd.append('title', data.title);
        fd.append('is_active', String(data.is_active));

        if (data.category_mode === 'new') {
          fd.append('category_name', data.new_category_name!.trim());
        } else {
          fd.append('category', data.existing_category_id!);
        }

        images.forEach(img => {
          if (img.file) fd.append('images', img.file, img.file.name);
        });
      }

      await onSave(fd, isEdit);
    } catch {
      toast.error('Failed to save gallery. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const newImageCount = images.filter(i => !i.isExisting).length;
  const canAddMore = images.length < MAX_IMAGES;

  return (
    <div
      ref={overlayRef}
      onClick={e => {
        if (e.target !== overlayRef.current) return;
        if (isDirty && !confirm('Unsaved changes. Close anyway?')) return;
        onClose();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(11,31,58,0.65)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl shadow-2xl bg-white my-auto"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* ── HEADER ── */}
        <div
          className="flex items-center justify-between px-7 py-5 border-b shrink-0"
          style={{ borderColor: 'var(--gray-100)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: isEdit ? '#FFF3DC' : '#EEF4FF' }}
            >
              <Grid3x3 className="w-5 h-5" style={{ color: isEdit ? '#b87a10' : 'var(--blue)' }} />
            </div>
            <div>
              <h2 className="text-lg font-black" style={{ color: 'var(--navy)' }}>
                {isEdit ? 'Edit Gallery Item' : 'Upload Gallery Images'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--gray-400)' }}>
                {isEdit
                  ? `Editing: ${item?.title}`
                  : `Up to ${MAX_IMAGES} images · PNG, JPG, WEBP · 10 MB each`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100"
          >
            <X className="w-5 h-5" style={{ color: 'var(--gray-600)' }} />
          </button>
        </div>

        {/* ── FORM ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
        >
          <div className="px-7 py-6 space-y-7 overflow-y-auto flex-1">

            {/* ── CATEGORY ── */}
            <Section title="Category" icon={<FolderOpen className="w-3.5 h-3.5" />}>
              {/* Mode toggle */}
              <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-100)' }}>
                {(['existing', 'new'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setValue('category_mode', mode, { shouldDirty: true })}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
                    style={
                      categoryMode === mode
                        ? { background: 'var(--blue)', color: 'white', boxShadow: '0 2px 8px rgba(59,130,246,0.25)' }
                        : { color: 'var(--gray-500)' }
                    }
                  >
                    {mode === 'existing'
                      ? <><FolderOpen className="w-3.5 h-3.5" /> Use Existing Category</>
                      : <><Plus className="w-3.5 h-3.5" /> Create New Category</>}
                  </button>
                ))}
              </div>

              {categoryMode === 'existing' ? (
                <div>
                  <Lbl required>Select Category</Lbl>
                  <div className="relative">
                    {catLoading ? (
                      <div
                        className="w-full px-4 py-2.5 border rounded-xl text-sm flex items-center gap-2"
                        style={{ borderColor: 'var(--gray-200)', color: 'var(--gray-400)' }}
                      >
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading categories...
                      </div>
                    ) : (
                      <>
                        <FolderOpen
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                          style={{ color: 'var(--gray-400)' }}
                        />
                        <ChevronDown
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                          style={{ color: 'var(--gray-400)' }}
                        />
                        <select
                          {...register('existing_category_id')}
                          className={inp + ' pl-10 pr-10 appearance-none'}
                          style={{ borderColor: errors.existing_category_id ? '#ef4444' : 'var(--gray-200)' }}
                        >
                          <option value="">— Select a category —</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={String(cat.id)}>
                              {cat.category_name}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                  <Err msg={errors.existing_category_id?.message} />
                  {!catLoading && categories.length === 0 && (
                    <p className="text-xs mt-1.5" style={{ color: 'var(--gray-400)' }}>
                      No categories found. Switch to "Create New" to add one.
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <Lbl required>New Category Name</Lbl>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                    <input
                      {...register('new_category_name')}
                      placeholder="e.g. Annual Meetup 2025"
                      className={inp + ' pl-10'}
                      style={{ borderColor: errors.new_category_name ? '#ef4444' : 'var(--gray-200)' }}
                    />
                  </div>
                  <Err msg={errors.new_category_name?.message} />
                </div>
              )}
            </Section>

            {/* ── DETAILS ── */}
            <Section title="Details" icon={<Type className="w-3.5 h-3.5" />}>
              {/* Title */}
              <div>
                <Lbl required>Gallery Title</Lbl>
                <div className="relative">
                  <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--gray-400)' }} />
                  <input
                    {...register('title')}
                    placeholder="e.g. Tree Plantation Drive Photos"
                    className={inp + ' pl-10'}
                    style={{ borderColor: errors.title ? '#ef4444' : 'var(--gray-200)' }}
                  />
                </div>
                <Err msg={errors.title?.message} />
              </div>

              {/* Publish status */}
              <div>
                <Lbl required>Visibility</Lbl>
                <div className="flex gap-3">
                  {[
                    { value: true, label: 'Published', icon: <Eye className="w-4 h-4" />, activeStyle: { background: '#dcfce7', borderColor: '#86efac', color: '#16a34a' } },
                    { value: false, label: 'Draft', icon: <EyeOff className="w-4 h-4" />, activeStyle: { background: '#fef9c3', borderColor: '#fbbf24', color: '#a16207' } },
                  ].map(opt => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setValue('is_active', opt.value, { shouldDirty: true })}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all"
                      style={
                        watchedStatus === opt.value
                          ? opt.activeStyle
                          : { background: 'white', borderColor: 'var(--gray-200)', color: 'var(--gray-400)' }
                      }
                    >
                      {opt.icon}{opt.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--gray-400)' }}>
                  {watchedStatus
                    ? '✓ Gallery will be visible on the public website.'
                    : 'Gallery will be hidden from the public website.'}
                </p>
              </div>
            </Section>

            {/* ── IMAGES ── */}
            <Section title="Images" icon={<ImageIcon className="w-3.5 h-3.5" />}>
              {/* Stats bar */}
              <div
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold"
                style={{
                  background: images.length >= MAX_IMAGES ? '#fef3c7' : 'var(--gray-50)',
                  border: '1px solid ' + (images.length >= MAX_IMAGES ? '#fbbf24' : 'var(--gray-100)'),
                  color: images.length >= MAX_IMAGES ? '#92400e' : 'var(--gray-600)',
                }}
              >
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5" />
                  {images.length} / {MAX_IMAGES} images
                  {isEdit && newImageCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-white font-bold" style={{ background: 'var(--blue)', fontSize: 10 }}>
                      +{newImageCount} new
                    </span>
                  )}
                </span>
                {images.length >= MAX_IMAGES
                  ? <span>Maximum reached</span>
                  : <span>{MAX_IMAGES - images.length} remaining</span>}
              </div>

              {/* Drop zone */}
              {canAddMore && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className="cursor-pointer rounded-xl border-2 border-dashed transition-all"
                  style={{
                    borderColor: isDragging ? 'var(--blue)' : imageError ? '#ef4444' : 'var(--gray-200)',
                    background: isDragging ? 'rgba(59,130,246,0.04)' : 'var(--gray-50)',
                    padding: '28px 20px',
                  }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: isDragging ? 'rgba(59,130,246,0.1)' : 'var(--gray-100)' }}
                    >
                      <Upload className="w-5 h-5" style={{ color: isDragging ? 'var(--blue)' : 'var(--gray-400)' }} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold" style={{ color: 'var(--gray-700)' }}>
                        {isDragging ? 'Drop images here' : 'Click to upload or drag & drop'}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--gray-400)' }}>
                        PNG, JPG, WEBP · Max 10 MB each · Up to {MAX_IMAGES - images.length} more
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-5 py-2 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-md"
                      style={{ background: 'var(--blue)', color: 'white' }}
                      onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    >
                      <Plus className="w-3.5 h-3.5 inline mr-1" />
                      Browse Files
                    </button>
                  </div>
                </div>
              )}
              {imageError && <Err msg={imageError} />}

              {/* Image grid */}
              {images.length > 0 && (
                <div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {images.map((img, i) => (
                      <ImageCard
                        key={img.id}
                        src={img.preview}
                        name={img.name}
                        index={i}
                        onRemove={() => removeImage(img.id)}
                      />
                    ))}
                    {/* Add more tile */}
                    {canAddMore && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all hover:border-blue-400 hover:bg-blue-50"
                        style={{ borderColor: 'var(--gray-200)' }}
                      >
                        <Plus className="w-5 h-5" style={{ color: 'var(--gray-400)' }} />
                        <span className="text-xs font-semibold" style={{ color: 'var(--gray-400)' }}>Add more</span>
                      </button>
                    )}
                  </div>
                  {isEdit && (
                    <p className="text-xs mt-2" style={{ color: 'var(--gray-400)' }}>
                      💡 Removing an existing image will delete it from the server on save.
                    </p>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }}
              />
            </Section>
          </div>

          {/* ── FOOTER ── */}
          <div
            className="px-7 py-4 border-t flex items-center justify-between gap-3 shrink-0"
            style={{ borderColor: 'var(--gray-100)', background: 'var(--gray-50)', borderRadius: '0 0 1rem 1rem' }}
          >
            <p className="text-xs" style={{ color: 'var(--gray-400)' }}>
              {isEdit
                ? 'Only changed fields will be sent to the server.'
                : `${images.length} image${images.length !== 1 ? 's' : ''} ready to upload.`}
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
                  <><Loader2 className="w-4 h-4 animate-spin" />{isEdit ? 'Saving...' : 'Uploading...'}</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" />{isEdit ? 'Save Changes' : 'Upload Gallery'}</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
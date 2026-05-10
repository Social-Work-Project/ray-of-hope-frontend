"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  CalendarDays,
  ImageIcon,
  Upload,
  UserCog,
  User2Icon,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import type { TeamResponse } from "@/types";
import { Lbl, Err, inp, Section } from "./common/UiHelpers";

// ── Schema ────────────────────────────────────────────────────────────────────
const teamSchema = z.object({
  name:        z.string().min(3, "Name must be at least 3 characters"),
  designation: z.string().min(2, "Designation is required"),
  bio:         z.string().min(10, "Bio must be at least 10 characters"),
  joined_date: z.string().min(10, "Joined date is required in YYYY-MM-DD format"),
  image:       z.instanceof(File).optional(),
  is_active:   z.boolean().default(false).optional(),
});

type TeamFormData = z.infer<typeof teamSchema>;

// ── Helpers ───────────────────────────────────────────────────────────────────
function toInputDate(dateStr: string): string {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ── Image Upload ──────────────────────────────────────────────────────────────
function ImageUpload({
  existingImageUrl,
  onFileChange,
  error,
}: {
  existingImageUrl?: string;
  onFileChange: (file: File | null) => void;
  error?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview]     = useState<string>(existingImageUrl ?? "");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => { setPreview(existingImageUrl ?? ""); }, [existingImageUrl]);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select a valid image file."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be smaller than 5 MB."); return; }
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    onFileChange(file);
  };

  const clearImage = () => {
    setPreview("");
    onFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <Lbl>Photo</Lbl>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files?.[0] ?? null); }}
        className="relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden"
        style={{
          borderColor: isDragging ? "var(--blue)" : error ? "#ef4444" : "var(--gray-200)",
          background: isDragging ? "rgba(59,130,246,0.04)" : "var(--gray-50)",
          minHeight: preview ? 160 : 96,
        }}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full object-cover" style={{ height: 160 }} />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.45)" }}
            >
              <Upload className="w-5 h-5 text-white" />
              <span className="text-white text-xs font-semibold">Replace image</span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clearImage(); }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
              style={{ background: "rgba(0,0,0,0.55)" }}
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-7">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gray-100)" }}>
              <ImageIcon className="w-5 h-5" style={{ color: "var(--gray-400)" }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: "var(--gray-600)" }}>Click to upload or drag & drop</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--gray-400)" }}>PNG, JPG, WEBP — max 5 MB</p>
            </div>
          </div>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
      {error && <Err msg={error} />}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export interface TeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams?: TeamResponse | null;
  onSave: (formData: FormData) => void;
}

export function TeamMembersModal({ isOpen, onClose, teams, onSave }: TeamMembersModalProps) {
  const isEdit = Boolean(teams);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving]     = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: { name: "", designation: "", bio: "", joined_date: "", is_active: false },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (teams) {
      reset({
        name:        (teams as any).name ?? "",
        designation: (teams as any).designation ?? "",
        bio:         (teams as any).bio ?? "",
        joined_date: toInputDate((teams as any).joined_date ?? ""),
        is_active:   (teams as any).is_active ?? false,
      });
    } else {
      reset({ name: "", designation: "", bio: "", joined_date: "", is_active: false });
    }
    setImageFile(null);
  }, [isOpen, teams, reset]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isDirty && !confirm("You have unsaved changes. Close anyway?")) return;
      onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, isDirty, onClose]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target !== overlayRef.current) return;
    if (isDirty && !confirm("You have unsaved changes. Close anyway?")) return;
    onClose();
  };

  const onSubmit = (data: TeamFormData) => {
    setSaving(true);
    try {
      const fd = new FormData();
      if (isEdit) {
        const dirty = dirtyFields as Partial<Record<keyof TeamFormData, boolean>>;
        if (dirty.name)        fd.append("name", data.name);
        if (dirty.designation) { fd.append("role", data.designation); fd.append("designation", data.designation); }
        if (dirty.bio)         fd.append("bio", data.bio);
        if (dirty.joined_date) fd.append("joined_date", data.joined_date);
        if (dirty.is_active)   fd.append("is_active", String(data.is_active));
        if (imageFile)         fd.append("image", imageFile, imageFile.name);
      } else {
        fd.append("name",        data.name);
        fd.append("role",        data.designation);
        fd.append("designation", data.designation);
        fd.append("bio",         data.bio);
        fd.append("joined_date", data.joined_date);
        fd.append("is_active",   String(data.is_active));
        if (imageFile) fd.append("image", imageFile, imageFile.name);
      }
      onSave(fd);
      onClose();
    } catch {
      toast.error("An error occurred while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(11,31,58,0.6)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl bg-white flex flex-col"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b shrink-0"
          style={{ borderColor: "var(--gray-100)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: isEdit ? "#FFF3DC" : "#EEF2F7" }}
            >
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: isEdit ? "#b87a10" : "var(--blue)" }} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black truncate" style={{ color: "var(--navy)" }}>
                {isEdit ? "Edit Team Member" : "Add Team Member"}
              </h2>
              <p className="text-xs hidden sm:block" style={{ color: "var(--gray-400)" }}>
                {isEdit
                  ? `Editing: ${(teams as any)?.name ?? ""}`
                  : "Fill in the details to add a new member"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100 shrink-0 ml-2"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "var(--gray-600)" }} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="px-5 sm:px-7 py-5 sm:py-6 space-y-6 sm:space-y-7 overflow-y-auto flex-1">

            {/* Basic Info */}
            <Section title="Basic Information">
              {/* Name + Designation — stacked on mobile, side-by-side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Lbl required>Full Name</Lbl>
                  <div className="relative">
                    <User2Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--gray-400)" }} />
                    <input
                      {...register("name")}
                      placeholder="e.g. John Doe"
                      className={inp + " pl-10"}
                      style={{ borderColor: errors.name ? "#ef4444" : "var(--gray-200)" }}
                    />
                  </div>
                  <Err msg={errors.name?.message} />
                </div>
                <div>
                  <Lbl required>Designation</Lbl>
                  <div className="relative">
                    <UserCog className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--gray-400)" }} />
                    <input
                      {...register("designation")}
                      placeholder="e.g. President"
                      className={inp + " pl-10"}
                      style={{ borderColor: errors.designation ? "#ef4444" : "var(--gray-200)" }}
                    />
                  </div>
                  <Err msg={errors.designation?.message} />
                </div>
              </div>

              {/* Bio */}
              <div>
                <Lbl required>Bio</Lbl>
                <textarea
                  {...register("bio")}
                  rows={3}
                  placeholder="Enter a brief bio for the team member"
                  className={inp}
                  style={{ borderColor: errors.bio ? "#ef4444" : "var(--gray-200)", resize: "vertical" }}
                />
                <Err msg={errors.bio?.message} />
              </div>

              {/* Joined date */}
              <div>
                <Lbl required>Joined Date</Lbl>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--gray-400)" }} />
                  <input
                    {...register("joined_date")}
                    type="date"
                    className={inp + " pl-10"}
                    style={{ borderColor: errors.joined_date ? "#ef4444" : "var(--gray-200)" }}
                  />
                </div>
                <Err msg={errors.joined_date?.message} />
              </div>
            </Section>

            {/* Photo & Status */}
            <Section title="Photo & Status">
              <ImageUpload
                existingImageUrl={isEdit ? (teams as any)?.image : undefined}
                onFileChange={setImageFile}
              />
              <div>
                <Lbl>Publish Status</Lbl>
                <label className="inline-flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("is_active")}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm" style={{ color: "var(--gray-600)" }}>Mark as Active</span>
                </label>
              </div>
            </Section>
          </div>

          {/* Footer */}
          <div
            className="px-5 sm:px-7 py-4 border-t flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0"
            style={{ borderColor: "var(--gray-100)", background: "var(--gray-50)", borderRadius: "0 0 1rem 1rem" }}
          >
            <p className="text-xs hidden sm:block" style={{ color: "var(--gray-400)" }}>
              {isEdit ? "Changes update immediately." : "New member saved as draft by default."}
            </p>
            <div className="flex gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-gray-100 cursor-pointer"
                style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                style={{ background: isEdit ? "var(--accent)" : "var(--blue)", color: isEdit ? "var(--navy)" : "white" }}
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    {isEdit ? "Saving..." : "Creating..."}
                  </>
                ) : isEdit ? "✓ Save Changes" : "+ Add Member"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
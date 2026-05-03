"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  Plus,
  Trash2,
  CalendarDays,
  MapPin,
  Clock,
  Users,
  User,
  FileText,
  Upload,
  ImageIcon,
  Eye,
  EyeOff,
  Tag,
  Phone,
  Mail,
  Calendar,
  UserCog,
  User2Icon,
} from "lucide-react";
import { toast } from "sonner";
import type { TeamResponse } from "@/types";
import { Lbl, Err, inp, Section } from "./common/UiHelpers";

// ── ZOD SCHEMA ───────────────────────────────────────────────────

const teamSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  role: z.string().min(2, "Role is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  joined_date: z
    .string()
    .min(10, "Joined date is required in YYYY-MM-DD format"),
  image: z.instanceof(File).optional(),
  is_active: z.boolean().default(false).optional(),
});

type TeamFormData = z.infer<typeof teamSchema>;

// ── HELPERS ──────────────────────────────────────────────────────
function toInputDate(dateStr: string): string {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Strip seconds for <input type="time"> which expects HH:MM
function toInputTime(t: string): string {
  if (!t) return "";
  if (/^\d{2}:\d{2}$/.test(t)) return t;
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t.slice(0, 5);
  return t;
}

// Convert HH:MM (from <input type="time">) → HH:MM:SS for start_time / end_time
function toTimeSeconds(t: string): string {
  return t ? `${t}:00` : "";
}

// Normalise any time string → HH:MM:SS for schedule slot times
// Handles: "10:00 AM", "4:30PM", "14:00", "14:00:00"
function normaliseTime(t: string): string {
  if (!t) return "";
  t = t.trim();
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t; // already HH:MM:SS
  if (/^\d{1,2}:\d{2}$/.test(t)) return `${t.padStart(5, "0")}:00`; // HH:MM → HH:MM:SS
  const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = match[2];
    if (match[3].toUpperCase() === "AM" && h === 12) h = 0;
    if (match[3].toUpperCase() === "PM" && h !== 12) h += 12;
    return `${String(h).padStart(2, "0")}:${m}:00`;
  }
  return t; // fallback
}

// ── IMAGE UPLOAD ──────────────────────────────────────────────────
interface ImageUploadProps {
  existingImageUrl?: string;
  onFileChange: (file: File | null) => void;
  error?: string;
}

function ImageUpload({
  existingImageUrl,
  onFileChange,
  error,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(existingImageUrl ?? "");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPreview(existingImageUrl ?? "");
  }, [existingImageUrl]);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    onFileChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  };

  const clearImage = () => {
    setPreview("");
    onFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <Lbl>Cover Image</Lbl>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className="relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden"
        style={{
          borderColor: isDragging
            ? "var(--blue)"
            : error
              ? "#ef4444"
              : "var(--gray-200)",
          background: isDragging ? "rgba(59,130,246,0.04)" : "var(--gray-50)",
          minHeight: preview ? 160 : 96,
        }}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Logo preview"
              className="w-full object-cover"
              style={{ height: 160 }}
            />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.45)" }}
            >
              <Upload className="w-5 h-5 text-white" />
              <span className="text-white text-xs font-semibold">
                Replace image
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
              style={{ background: "rgba(0,0,0,0.55)" }}
              aria-label="Remove image"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-7">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--gray-100)" }}
            >
              <ImageIcon
                className="w-5 h-5"
                style={{ color: "var(--gray-400)" }}
              />
            </div>
            <div className="text-center">
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--gray-600)" }}
              >
                Click to upload or drag & drop
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--gray-400)" }}
              >
                PNG, JPG, WEBP — max 5 MB
              </p>
            </div>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {error && <Err msg={error} />}
    </div>
  );
}

// ── MAIN MODAL ────────────────────────────────────────────────────
export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams?: TeamResponse | null;
  /** Receives FormData ready to POST as multipart/form-data */
  onSave: (formData: FormData) => void;
}

export function TeamMembersModal({
  isOpen,
  onClose,
  teams,
  onSave,
}: EventModalProps) {
  const isEdit = Boolean(teams);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      role: "",
      bio: "",

      joined_date: "",

      image: undefined,
      is_active: false,
    },
  });

  //   const { fields, append, remove, move } = useFieldArray({ control, name: 'schedules' });
  //   const watchedStatus = watch('status');

  // Populate / reset on open
  useEffect(() => {
    if (!isOpen) return;
    if (teams) {
      const ev = teams as any;
      reset({
        name: ev.name ?? ev.title ?? "",
        role: ev.role ?? "",
        bio: ev.bio ?? "",

        joined_date: toInputDate(ev.joined_date ?? ""),

        is_active: ev.is_active ?? false,
      });
    } else {
      reset({
        name: "",
        role: "",
        bio: "",
        joined_date: "",

        is_active: false,
      });
    }
    setImageFile(null);
  }, [isOpen, teams, reset]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target !== overlayRef.current) return;
    if (isDirty && !confirm("You have unsaved changes. Close anyway?")) return;
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isDirty && !confirm("You have unsaved changes. Close anyway?"))
        return;
      onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, isDirty, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ── SUBMIT ───────────────────────────────────────────────────
  const onSubmit = (data: TeamFormData) => {
    setSaving(true);
    try {
      const fd = new FormData();

      if (isEdit) {
        // ── PATCH: only append fields that were actually changed ──
        const dirty = dirtyFields as Partial<
          Record<keyof TeamFormData, boolean | object[]>
        >;

        if (dirty.name) fd.append("name", data.name);
        if (dirty.role) fd.append("role", data.role);
        if (dirty.bio) fd.append("bio", data.bio);

        if (dirty.joined_date) fd.append("joined_date", data.joined_date);

        if (dirty.is_active) fd.append("is_active", String(data.is_active));

        // image: only send if user picked a new file
        if (imageFile) {
          fd.append("image", imageFile, imageFile.name);
        }
      } else {
        // ── POST: send everything ──
        fd.append("name", data.name);
        fd.append("role", data.role);
        fd.append("bio", data.bio);

        fd.append("joined_date", data.joined_date);

        fd.append("is_active", String(data.is_active));
        if (imageFile) fd.append("image", imageFile, imageFile.name);
      }

      onSave(fd);
      onClose();
    } catch (err) {
      toast.error(
        "An error occurred while saving the event. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(11,31,58,0.6)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl shadow-2xl bg-white animate-fade-up my-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "92vh", display: "flex", flexDirection: "column" }}
      >
        {/* ── HEADER ── */}
        <div
          className="flex items-center justify-between px-7 py-5 border-b shrink-0"
          style={{ borderColor: "var(--gray-100)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: isEdit ? "#FFF3DC" : "#EEF2F7" }}
            >
              <CalendarDays
                className="w-5 h-5"
                style={{ color: isEdit ? "#b87a10" : "var(--blue)" }}
              />
            </div>
            <div>
              <h2
                className="text-lg font-black"
                style={{ color: "var(--navy)" }}
              >
                {isEdit ? "Edit Team Member" : "Create New Team Member"}
              </h2>
              <p className="text-xs" style={{ color: "var(--gray-400)" }}>
                {isEdit
                  ? `Editing: ${(teams as any)?.name ?? teams?.name}`
                  : "Fill in the details below to add a new team member"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100"
            aria-label="Close"
          >
            <X
              className="w-5 h-5 cursor-pointer"
              style={{ color: "var(--gray-600)" }}
            />
          </button>
        </div>

        {/* ── FORM ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          <div className="px-7 py-6 space-y-7 overflow-y-auto flex-1">
            {/* ── BASIC INFO ── */}
            <Section title="Basic Information">
              {/* Name — full width single row */}

              {/* Name + Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Lbl required>Team Member Name</Lbl>
                  <div className="relative">
                    <User2Icon
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "var(--gray-400)" }}
                    />
                    <input
                      {...register("name")}
                      placeholder="e.g. John Doe"
                      className={inp + " pl-10"}
                      style={{
                        borderColor: errors.name
                          ? "#ef4444"
                          : "var(--gray-200)",
                      }}
                    />
                  </div>
                  <Err msg={errors.name?.message} />
                </div>
                <div>
                  <Lbl required>Role</Lbl>
                  <div className="relative">
                    <UserCog
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "var(--gray-400)" }}
                    />
                    <input
                      {...register("role")}
                      placeholder="e.g. technology"
                      className={inp + " pl-10"}
                      style={{
                        borderColor: errors.role
                          ? "#ef4444"
                          : "var(--gray-200)",
                      }}
                    />
                  </div>
                  <Err msg={errors.role?.message} />
                </div>
              </div>

              {/* Bio */}
              <div>
                <Lbl required>Bio</Lbl>
                <div className="relative">
                  <textarea
                    {...register("bio")}
                    placeholder="Enter a brief bio for the team member"
                    className={inp + " "}
                    style={{
                      borderColor: errors.bio ? "#ef4444" : "var(--gray-200)",
                    }}
                  />
                </div>
                <Err msg={errors.bio?.message} />
              </div>

              <div>
                <Lbl required>Joined Date</Lbl>
                <div className="relative">
                  <Calendar
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: "var(--gray-400)" }}
                  />
                  <input
                    {...register("joined_date")}
                    type="date"
                    className={inp + " pl-10"}
                    style={{
                      borderColor: errors.joined_date
                        ? "#ef4444"
                        : "var(--gray-200)",
                    }}
                  />
                </div>
                <Err msg={errors.joined_date?.message} />
              </div>
            </Section>

            {/* ── MEDIA & STATUS ── */}
            <Section title="Photo & Status">
              <ImageUpload
                existingImageUrl={isEdit ? (teams as any)?.logo : undefined}
                onFileChange={setImageFile}
              />
              <div>
                <Lbl required>Publish Status</Lbl>
                <div className="flex items-center gap-6 mt-2">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register("is_active")}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--gray-600)" }}
                    >
                      Active
                    </span>
                  </label>
                </div>
              </div>
            </Section>
          </div>

          {/* ── FOOTER ── */}
          <div
            className="px-7 py-4 border-t flex items-center justify-between gap-3 shrink-0"
            style={{
              borderColor: "var(--gray-100)",
              background: "var(--gray-50)",
              borderRadius: "0 0 1rem 1rem",
            }}
          >
            <p className="text-xs" style={{ color: "var(--gray-400)" }}>
              {isEdit
                ? "Changes update the team member immediately."
                : "New team member is saved as draft by default."}
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-gray-100 cursor-pointer"
                style={{
                  borderColor: "var(--gray-200)",
                  color: "var(--gray-600)",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer"
                style={{
                  background: isEdit ? "var(--accent)" : "var(--blue)",
                  color: isEdit ? "var(--navy)" : "white",
                }}
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    {isEdit ? "Saving..." : "Creating..."}
                  </>
                ) : isEdit ? (
                  "✓ Save Changes"
                ) : (
                  "+ Create Team Member"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

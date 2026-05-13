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
} from "lucide-react";
import { toast } from "sonner";
import type { EventResponse } from "@/types";
import { Lbl, Err, inp, Section } from "./common/UiHelpers";

// ── Schema ────────────────────────────────────────────────────────────────────
const scheduleItemSchema = z.object({
  time: z.string().min(1, "Time is required"),
  title: z.string().min(1, "Activity description is required"),
});

const eventSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(2, "Category is required"),
  event_date: z.string().min(1, "Date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  organizer_name: z.string().min(2, "Organizer name is required"),
  phone_number: z.string().min(7, "Phone number is required"),
  email: z.string().email("Enter a valid email"),
  volunteers_needed: z
    .number()
    .min(1, "At least 1 volunteer required")
    .max(2000, "Cannot exceed 2000"),
  status: z.enum(["published", "draft"]),
  schedules: z
    .array(scheduleItemSchema)
    .min(1, "At least one schedule item is required"),
});

type EventFormData = z.infer<typeof eventSchema>;

// ── Helpers ───────────────────────────────────────────────────────────────────
function toInputDate(dateStr: string): string {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toInputTime(t: string): string {
  if (!t) return "";
  if (/^\d{2}:\d{2}$/.test(t)) return t;
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t.slice(0, 5);
  return t;
}

function toTimeSeconds(t: string): string {
  return t ? `${t}:00` : "";
}

function normaliseTime(t: string): string {
  if (!t) return "";
  t = t.trim();
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;
  if (/^\d{1,2}:\d{2}$/.test(t)) return `${t.padStart(5, "0")}:00`;
  const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = match[2];
    if (match[3].toUpperCase() === "AM" && h === 12) h = 0;
    if (match[3].toUpperCase() === "PM" && h !== 12) h += 12;
    return `${String(h).padStart(2, "0")}:${m}:00`;
  }
  return t;
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

  const clearImage = () => {
    setPreview("");
    onFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <Lbl>Logo / Cover Image</Lbl>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files?.[0] ?? null);
        }}
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

// ── Modal ─────────────────────────────────────────────────────────────────────
export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: EventResponse | null;
  onSave: (formData: FormData) => void;
}

export function EventModal({
  isOpen,
  onClose,
  event,
  onSave,
}: EventModalProps) {
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
    formState: { errors, isDirty, dirtyFields },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      event_date: "",
      start_time: "",
      end_time: "",
      location: "",
      organizer_name: "",
      phone_number: "",
      email: "",
      volunteers_needed: 10,
      status: "draft",
      schedules: [{ time: "", title: "" }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "schedules",
  });
  const watchedStatus = watch("status");

  // Populate / reset on open
  useEffect(() => {
    if (!isOpen) return;
    if (event) {
      const ev = event as any;
      reset({
        name: ev.name ?? ev.title ?? "",
        description: ev.description ?? "",
        category: ev.category ?? "",
        event_date: toInputDate(ev.event_date ?? ev.date ?? ""),
        start_time: toInputTime(ev.start_time ?? ""),
        end_time: toInputTime(ev.end_time ?? ""),
        location: ev.location ?? "",
        organizer_name: ev.organizer_name ?? ev.organizer ?? "",
        phone_number: ev.phone_number ?? "",
        email: ev.email ?? "",
        volunteers_needed: ev.volunteers_needed ?? 10,
        status: ev.status ?? "draft",
        schedules: ev.schedules?.length
          ? ev.schedules
          : ev.schedule?.length
            ? ev.schedule
            : [{ time: "", title: "" }],
      });
    } else {
      reset({
        name: "",
        description: "",
        category: "",
        event_date: "",
        start_time: "",
        end_time: "",
        location: "",
        organizer_name: "",
        phone_number: "",
        email: "",
        volunteers_needed: 10,
        status: "draft",
        schedules: [{ time: "", title: "" }],
      });
    }
    setLogoFile(null);
  }, [isOpen, event, reset]);

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

  const onSubmit = (data: EventFormData) => {
    setSaving(true);
    try {
      const fd = new FormData();
      if (isEdit) {
        const dirty = dirtyFields as Partial<
          Record<keyof EventFormData, boolean | object[]>
        >;
        if (dirty.name) fd.append("name", data.name);
        if (dirty.description) fd.append("description", data.description);
        if (dirty.category) fd.append("category", data.category);
        if (dirty.event_date) fd.append("event_date", data.event_date);
        if (dirty.start_time)
          fd.append("start_time", toTimeSeconds(data.start_time));
        if (dirty.end_time) fd.append("end_time", toTimeSeconds(data.end_time));
        if (dirty.location) fd.append("location", data.location);
        if (dirty.organizer_name)
          fd.append("organizer_name", data.organizer_name);
        if (dirty.phone_number) fd.append("phone_number", data.phone_number);
        if (dirty.email) fd.append("email", data.email);
        if (dirty.volunteers_needed)
          fd.append("volunteers_needed", String(data.volunteers_needed));
        if (dirty.status) fd.append("status", data.status);
        if (dirty.schedules)
          fd.append(
            "schedules",
            JSON.stringify(
              data.schedules.map((s) => ({
                ...s,
                time: normaliseTime(s.time),
              })),
            ),
          );
        if (logoFile) fd.append("logo", logoFile, logoFile.name);
      } else {
        fd.append("name", data.name);
        fd.append("description", data.description);
        fd.append("category", data.category);
        fd.append("event_date", data.event_date);
        fd.append("start_time", toTimeSeconds(data.start_time));
        fd.append("end_time", toTimeSeconds(data.end_time));
        fd.append("location", data.location);
        fd.append("organizer_name", data.organizer_name);
        fd.append("phone_number", data.phone_number);
        fd.append("email", data.email);
        fd.append("volunteers_needed", String(data.volunteers_needed));
        fd.append("status", data.status);
        fd.append(
          "schedules",
          JSON.stringify(
            data.schedules.map((s) => ({ ...s, time: normaliseTime(s.time) })),
          ),
        );
        if (logoFile) fd.append("logo", logoFile, logoFile.name);
      }
      onSave(fd);
      onClose();
    } catch {
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
      /* Sheet on mobile, centered on sm+ */
      className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center p-0 sm:p-4"
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
              <CalendarDays
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: isEdit ? "#b87a10" : "var(--blue)" }}
              />
            </div>
            <div className="min-w-0">
              <h2
                className="text-base sm:text-lg font-black truncate"
                style={{ color: "var(--navy)" }}
              >
                {isEdit ? "Edit Event" : "Create New Event"}
              </h2>
              <p
                className="text-xs hidden sm:block"
                style={{ color: "var(--gray-400)" }}
              >
                {isEdit
                  ? `Editing: ${(event as any)?.name ?? event?.name}`
                  : "Fill in the details below to add a new event"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all hover:bg-red-100 hover:text-red-600 shrink-0 ml-2"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
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
              {/* Event Name — full width */}
              <div>
                <Lbl required>Event Name</Lbl>
                <div className="relative">
                  <FileText
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: "var(--gray-400)" }}
                  />
                  <input
                    {...register("name")}
                    placeholder="e.g. Annual Health Awareness Camp"
                    className={inp + " pl-10"}
                    style={{
                      borderColor: errors.name ? "#ef4444" : "var(--gray-200)",
                    }}
                  />
                </div>
                <Err msg={errors.name?.message} />
              </div>

              {/* Category + Date — stacked on mobile, side-by-side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Lbl required>Category</Lbl>
                  <div className="relative">
                    <Tag
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "var(--gray-400)" }}
                    />
                    <input
                      {...register("category")}
                      placeholder="e.g. medical"
                      className={inp + " pl-10"}
                      style={{
                        borderColor: errors.category
                          ? "#ef4444"
                          : "var(--gray-200)",
                      }}
                    />
                  </div>
                  <Err msg={errors.category?.message} />
                </div>
                <div>
                  <Lbl required>Event Date</Lbl>
                  <div className="relative">
                    <CalendarDays
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "var(--gray-400)" }}
                    />
                    <input
                      {...register("event_date")}
                      type="date"
                      className={inp + " pl-10"}
                      style={{
                        borderColor: errors.event_date
                          ? "#ef4444"
                          : "var(--gray-200)",
                      }}
                    />
                  </div>
                  <Err msg={errors.event_date?.message} />
                </div>
              </div>

              {/* Start + End time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Lbl required>Start Time</Lbl>
                  <div className="relative">
                    <Clock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "var(--gray-400)" }}
                    />
                    <input
                      {...register("start_time")}
                      type="time"
                      className={inp + " pl-10"}
                      style={{
                        borderColor: errors.start_time
                          ? "#ef4444"
                          : "var(--gray-200)",
                      }}
                    />
                  </div>
                  <Err msg={errors.start_time?.message} />
                </div>
                <div>
                  <Lbl required>End Time</Lbl>
                  <div className="relative">
                    <Clock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "var(--gray-400)" }}
                    />
                    <input
                      {...register("end_time")}
                      type="time"
                      className={inp + " pl-10"}
                      style={{
                        borderColor: errors.end_time
                          ? "#ef4444"
                          : "var(--gray-200)",
                      }}
                    />
                  </div>
                  <Err msg={errors.end_time?.message} />
                </div>
              </div>

              {/* Location */}
              <div>
                <Lbl required>Location / Venue</Lbl>
                <div className="relative">
                  <MapPin
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: "var(--gray-400)" }}
                  />
                  <input
                    {...register("location")}
                    placeholder="e.g. Nagrakata Tea Garden Area, Jalpaiguri"
                    className={inp + " pl-10"}
                    style={{
                      borderColor: errors.location
                        ? "#ef4444"
                        : "var(--gray-200)",
                    }}
                  />
                </div>
                <Err msg={errors.location?.message} />
              </div>
            </Section>

            {/* Organizer Details */}
            <Section title="Organizer Details">
              {/* Organizer + Volunteers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Lbl required>Organizer Name</Lbl>
                  <div className="relative">
                    <User
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "var(--gray-400)" }}
                    />
                    <input
                      {...register("organizer_name")}
                      placeholder="e.g. Arjun Biswakarma"
                      className={inp + " pl-10"}
                      style={{
                        borderColor: errors.organizer_name
                          ? "#ef4444"
                          : "var(--gray-200)",
                      }}
                    />
                  </div>
                  <Err msg={errors.organizer_name?.message} />
                </div>
                <div>
                  <Lbl required>Volunteers Needed</Lbl>
                  <div className="relative">
                    <Users
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "var(--gray-400)" }}
                    />
                    <input
                      {...register("volunteers_needed", {
                        valueAsNumber: true,
                      })}
                      type="number"
                      min={1}
                      max={2000}
                      placeholder="20"
                      className={inp + " pl-10"}
                      style={{
                        borderColor: errors.volunteers_needed
                          ? "#ef4444"
                          : "var(--gray-200)",
                      }}
                    />
                  </div>
                  <Err msg={errors.volunteers_needed?.message} />
                </div>
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Lbl required>Phone Number</Lbl>
                  <div className="relative">
                    <Phone
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "var(--gray-400)" }}
                    />
                    <input
                      {...register("phone_number")}
                      type="tel"
                      placeholder="9800000000"
                      className={inp + " pl-10"}
                      style={{
                        borderColor: errors.phone_number
                          ? "#ef4444"
                          : "var(--gray-200)",
                      }}
                    />
                  </div>
                  <Err msg={errors.phone_number?.message} />
                </div>
                <div>
                  <Lbl required>Email</Lbl>
                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "var(--gray-400)" }}
                    />
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="nagarkatarayofhopesociety@gmail.com"
                      className={inp + " pl-10"}
                      style={{
                        borderColor: errors.email
                          ? "#ef4444"
                          : "var(--gray-200)",
                      }}
                    />
                  </div>
                  <Err msg={errors.email?.message} />
                </div>
              </div>
            </Section>

            {/* Content */}
            <Section title="Content">
              <div>
                <Lbl required>Description</Lbl>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Our annual health camp brings together volunteers, medical professionals..."
                  className={inp}
                  style={{
                    borderColor: errors.description
                      ? "#ef4444"
                      : "var(--gray-200)",
                    resize: "vertical",
                  }}
                />
                <Err msg={errors.description?.message} />
              </div>
            </Section>

            {/* Media & Status */}
            <Section title="Media & Status">
              <ImageUpload
                existingImageUrl={isEdit ? (event as any)?.logo : undefined}
                onFileChange={setLogoFile}
              />
              <div>
                <Lbl required>Publish Status</Lbl>
                <div className="flex gap-3">
                  {(["draft", "published"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        setValue("status", s, { shouldDirty: true })
                      }
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all"
                      style={
                        watchedStatus === s
                          ? s === "published"
                            ? {
                                background: "#dcfce7",
                                borderColor: "#86efac",
                                color: "#16a34a",
                              }
                            : {
                                background: "#fef9c3",
                                borderColor: "#fbbf24",
                                color: "#a16207",
                              }
                          : {
                              background: "white",
                              borderColor: "var(--gray-200)",
                              color: "var(--gray-400)",
                            }
                      }
                    >
                      {s === "published" ? (
                        <>
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">Published</span>
                          <span className="sm:hidden">Publish</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span className="hidden sm:inline">Draft</span>
                          <span className="sm:hidden">Draft</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
                <p
                  className="text-xs mt-2"
                  style={{ color: "var(--gray-400)" }}
                >
                  {watchedStatus === "published"
                    ? "✓ This event will be visible on the public website."
                    : "This event will be hidden from the public website."}
                </p>
              </div>
            </Section>

            {/* Schedule Builder */}
            <Section title="Event Schedule">
              <div>
                <div className="flex items-center justify-between mb-3 gap-2">
                  <div className="min-w-0">
                    <p className="text-xs" style={{ color: "var(--gray-600)" }}>
                      Add time-slots in chronological order.
                    </p>
                    {typeof errors.schedules?.message === "string" && (
                      <p className="text-xs text-red-500 font-medium mt-0.5">
                        {errors.schedules.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => append({ time: "", title: "" })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-md shrink-0"
                    style={{ background: "var(--blue)", color: "white" }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Slot
                  </button>
                </div>

                <div className="space-y-2.5">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex gap-2 items-start p-3 sm:p-3.5 rounded-xl border"
                      style={{
                        background: "var(--gray-50)",
                        borderColor: "var(--gray-100)",
                      }}
                    >
                      {/* Index badge */}
                      <div
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-2"
                        style={{
                          background: "var(--blue)",
                          color: "white",
                          fontSize: 10,
                        }}
                      >
                        {index + 1}
                      </div>

                      {/* Time input — narrower on mobile */}
                      <div
                        style={{
                          width: "clamp(90px, 30%, 140px)",
                          flexShrink: 0,
                        }}
                      >
                        <input
                          {...register(`schedules.${index}.time`)}
                          placeholder="10:00 AM"
                          className="w-full px-2.5 sm:px-3 py-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-200 bg-white transition-all"
                          style={{
                            borderColor: errors.schedules?.[index]?.time
                              ? "#ef4444"
                              : "var(--gray-200)",
                          }}
                        />
                        <Err msg={errors.schedules?.[index]?.time?.message} />
                      </div>

                      {/* Title input */}
                      <div className="flex-1 min-w-0">
                        <input
                          {...register(`schedules.${index}.title`)}
                          placeholder="e.g. Registration"
                          className="w-full px-2.5 sm:px-3 py-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-200 bg-white transition-all"
                          style={{
                            borderColor: errors.schedules?.[index]?.title
                              ? "#ef4444"
                              : "var(--gray-200)",
                          }}
                        />
                        <Err msg={errors.schedules?.[index]?.title?.message} />
                      </div>

                      {/* Move + Remove controls */}
                      <div className="flex flex-col gap-1 shrink-0 mt-1">
                        <button
                          type="button"
                          onClick={() => index > 0 && move(index, index - 1)}
                          disabled={index === 0}
                          className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded text-xs transition-all"
                          style={{
                            color:
                              index === 0
                                ? "var(--gray-300)"
                                : "var(--gray-600)",
                            background: "white",
                            border: "1px solid var(--gray-200)",
                            cursor: index === 0 ? "not-allowed" : "pointer",
                          }}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            index < fields.length - 1 && move(index, index + 1)
                          }
                          disabled={index === fields.length - 1}
                          className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded text-xs transition-all"
                          style={{
                            color:
                              index === fields.length - 1
                                ? "var(--gray-300)"
                                : "var(--gray-600)",
                            background: "white",
                            border: "1px solid var(--gray-200)",
                            cursor:
                              index === fields.length - 1
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => fields.length > 1 && remove(index)}
                          disabled={fields.length === 1}
                          className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded transition-all"
                          style={{
                            background:
                              fields.length === 1
                                ? "var(--gray-50)"
                                : "#fee2e2",
                            color:
                              fields.length === 1
                                ? "var(--gray-300)"
                                : "#dc2626",
                            border:
                              "1px solid " +
                              (fields.length === 1
                                ? "var(--gray-200)"
                                : "#fca5a5"),
                            cursor:
                              fields.length === 1 ? "not-allowed" : "pointer",
                          }}
                        >
                          <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          </div>

          {/* Footer */}
          <div
            className="px-5 sm:px-7 py-4 border-t flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0"
            style={{
              borderColor: "var(--gray-100)",
              background: "var(--gray-50)",
              borderRadius: "0 0 1rem 1rem",
            }}
          >
            <p
              className="text-xs hidden sm:block"
              style={{ color: "var(--gray-400)" }}
            >
              {isEdit
                ? "Changes update the event immediately."
                : "New event is saved as draft by default."}
            </p>
            <div className="flex gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-gray-100 cursor-pointer"
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
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
                  "+ Create Event"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

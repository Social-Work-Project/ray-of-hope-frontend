"use client";
import { TestimonialResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, CalendarDays, FileText, Map, MapPin, MessageCirclePlus, Pointer, Tag, User, UserCog, X } from "lucide-react";
import { Lbl, Err, inp } from "./common/UiHelpers";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial?: TestimonialResponse | null;
  /** Receives FormData ready to POST as multipart/form-data */
  onSave: (formData: FormData) => void;
}


const testimonalSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  role: z.string().min(2, "Role is required"),
  location: z.string().optional(),
  is_active: z.boolean().default(false).optional(),
});

type TestimonialFormData = z.infer<typeof testimonalSchema>;

const TestimonialModal: React.FC<TestimonialModalProps> = ({
  isOpen,
  onClose,
  testimonial,
  onSave,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const isEdit = Boolean(testimonial);

const {
  register,
  handleSubmit,
  control,
  reset,
  watch,
  setValue,
  formState: { errors, isDirty, dirtyFields },
} = useForm<TestimonialFormData>({
  resolver: zodResolver(testimonalSchema),
  defaultValues: {
    name: '',
    message: '',
    role: '',
    location: '',
    is_active: false,
  },
});

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target !== overlayRef.current) return;
    if (isDirty && !confirm('You have unsaved changes. Close anyway?')) return;
    onClose();
  };

  const onSubmit = (data: TestimonialFormData) => {
   console.log("Form submitted with data:", data);
  };
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
        <div
          className="flex items-center justify-between px-7 py-5 border-b shrink-0"
          style={{ borderColor: "var(--gray-100)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: isEdit ? "#FFF3DC" : "#EEF2F7" }}
            >
              <MessageCirclePlus
                className="w-5 h-5"
                style={{ color: isEdit ? "#b87a10" : "var(--blue)" }}
              />
            </div>
            <div>
              <h2
                className="text-lg font-black"
                style={{ color: "var(--navy)" }}
              >
                {isEdit ? "Edit Testimonial" : "Add New Testimonial"}
              </h2>
              <p className="text-xs" style={{ color: "var(--gray-400)" }}>
                {/* {isEdit ? `Editing: ${(event as any)?.name ?? event?.name}` : 'Fill in the details below to add a new event'} */}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-(gray-600) cursor-pointer" />
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
      
              <div className="">
                <Lbl required>Name</Lbl>
                <div className="relative">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: "var(--gray-400)" }}
                  />
                  <input
                    {...register("name")}
                    placeholder="e.g. John Doe"
                    className={inp + " pl-10"}
                    style={{
                      borderColor: errors.name ? "#ef4444" : "var(--gray-200)",
                    }}
                  />
                </div>
                <Err msg={errors.name?.message} />
              </div>

              <div>
                <Lbl required>Role / Relation</Lbl>
                <div className="relative">
                  <UserCog
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: "var(--gray-400)" }}
                  />
                  <input
                    {...register("role")}
                    placeholder="e.g. Youth Volunteer"
                    className={inp + " pl-10"}
                    style={{
                      borderColor: errors.role ? "#ef4444" : "var(--gray-200)",
                    }}
                  />
                </div>
                <Err msg={errors.role?.message} />
              </div>

              <div>
                <Lbl>Location</Lbl>
                <div className="relative">
                    <MapPin
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: "var(--gray-400)" }}
                    />
                    <input
                        {...register("location")} 
                        placeholder="e.g. Siliguri"
                        className={inp + " pl-10"}
                        style={{
                            borderColor: errors.location ? "#ef4444" : "var(--gray-200)",
                        }}
                    />
                </div>
                <Err msg={errors.location?.message} />
              </div>

              <div>
                <Lbl required>Message</Lbl>
                <div className="relative">
                    <FileText
                        className="absolute left-3.5 top-3.5 w-4 h-4 pointer-events-none"
                        style={{ color: "var(--gray-400)" }}
                    />
                    <textarea 
                        {...register("message")}
                        placeholder="Share your experience..."
                        className={inp + " pl-10 resize-none h-24"}
                        style={{
                            borderColor: errors.message ? "#ef4444" : "var(--gray-200)",
                        }}
                    />
                </div>
                <Err msg={errors.message?.message} />
              </div>

              <div>
                <Lbl>Active</Lbl>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("is_active")}
                    className="form-checkbox"
                  />
                  <span>Mark as active</span>
                </label>
              </div>
   
          </div>

          <div className="flex gap-2 px-8 py-2">
            <button type="button" onClick={onClose} className="w-full px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-gray-100 cursor-pointer" style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)" }}>
                Cancel
            </button>
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
              style={{ background: "var(--blue)", color: "white" }}
            >
              <MessageCirclePlus className="w-4 h-4" /> {isEdit ? "Save Changes" : "Add Testimonial"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialModal;

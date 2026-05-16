"use client";
import { WebsiteService } from "@/services/websiteService";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = {
  name: string;
  email: string;
  phone_number?: string;
  subject: string;
  message: string;
};

const inputCls =
  "w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200";
const labelCls = "block text-sm font-semibold mb-1.5";

const SUBJECTS = [
  "General Enquiry",
  "Donation",
  "Volunteering",
  "Partnership",
  "Media",
];

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      // Ensures subject always has a value even if user never touches the dropdown
      subject: SUBJECTS[0],
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await WebsiteService.sendMessage(data);
      toast.success("Message sent! We will respond soon.");
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls} style={{ color: "var(--gray-800)" }}>
            Your Name *
          </label>
          <input
            {...register("name", {
              required: "Name is required",
            })}
            placeholder="Full name"
            className={inputCls}
            style={{ borderColor: errors.name ? "#ef4444" : "var(--gray-200)" }}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className={labelCls} style={{ color: "var(--gray-800)" }}>
            Email *
          </label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            type="email"
            placeholder="Email address"
            className={inputCls}
            style={{ borderColor: errors.email ? "#ef4444" : "var(--gray-200)" }}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className={labelCls} style={{ color: "var(--gray-800)" }}>
            Phone
          </label>
          <input
            {...register("phone_number")}
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            className={inputCls}
            style={{ borderColor: "var(--gray-200)" }}
          />
        </div>

        <div>
          <label className={labelCls} style={{ color: "var(--gray-800)" }}>
            Subject
          </label>
          <select
            {...register("subject")}
            className={inputCls}
            style={{ borderColor: "var(--gray-200)" }}
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls} style={{ color: "var(--gray-800)" }}>
          Message *
        </label>
        <textarea
          {...register("message", {
            required: "Message is required",
          })}
          rows={5}
          placeholder="Your message..."
          className={inputCls}
          style={{
            borderColor: errors.message ? "#ef4444" : "var(--gray-200)",
            resize: "vertical",
          }}
        />
        {errors.message && (
          <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-8 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 cursor-pointer"
        style={{ background: "var(--blue)", color: "white" }}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
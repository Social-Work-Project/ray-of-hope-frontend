'use client';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { submitVolunteerForm } from '@/lib/data';

type FormData = {
  name: string; email: string; phone: string; city: string;
  skills: string; availability: string; interest: string; reason: string;
};

const inputCls = "w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200";
const labelCls = "block text-sm font-semibold mb-1.5";

export function VolunteerForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const result = await submitVolunteerForm({ ...data, eventId: undefined });
    if (result.success) {
      toast.success('Application submitted! We will contact you within 3–5 working days.');
      reset();
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Full Name *</label>
          <input {...register('name', { required: true })} placeholder="Your full name"
            className={inputCls} style={{ borderColor: errors.name ? '#ef4444' : 'var(--gray-200)' }} />
        </div>
        <div>
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Email Address *</label>
          <input {...register('email', { required: true })} type="email" placeholder="your@email.com"
            className={inputCls} style={{ borderColor: errors.email ? '#ef4444' : 'var(--gray-200)' }} />
        </div>
        <div>
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Phone Number *</label>
          <input {...register('phone', { required: true })} type="tel" placeholder="+91 XXXXX XXXXX"
            className={inputCls} style={{ borderColor: errors.phone ? '#ef4444' : 'var(--gray-200)' }} />
        </div>
        <div>
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>City / Location *</label>
          <input {...register('city', { required: true })} placeholder="Your city"
            className={inputCls} style={{ borderColor: errors.city ? '#ef4444' : 'var(--gray-200)' }} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Your Skills</label>
          <input {...register('skills')} placeholder="e.g. Teaching, Medical, Sports, Social Media..."
            className={inputCls} style={{ borderColor: 'var(--gray-200)' }} />
        </div>
        <div>
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Availability</label>
          <select {...register('availability')} className={inputCls} style={{ borderColor: 'var(--gray-200)' }}>
            <option value="">Select availability</option>
            <option>Weekends only</option>
            <option>Weekdays</option>
            <option>Full-time</option>
            <option>Event-based</option>
            <option>Remote / Online</option>
          </select>
        </div>
        <div>
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Area of Interest</label>
          <select {...register('interest')} className={inputCls} style={{ borderColor: 'var(--gray-200)' }}>
            <option value="">Select area</option>
            <option>Education & Tutoring</option>
            <option>Health Camps</option>
            <option>Sports Coaching</option>
            <option>Social Awareness</option>
            <option>Administrative Support</option>
            <option>Fundraising</option>
            <option>Any / Wherever Needed</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Why Do You Want to Volunteer?</label>
          <textarea {...register('reason')} rows={4} placeholder="Tell us about your motivation..."
            className={inputCls} style={{ borderColor: 'var(--gray-200)', resize: 'vertical' }} />
        </div>
      </div>
      <button type="submit" disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: 'var(--blue)', color: 'white' }}>
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
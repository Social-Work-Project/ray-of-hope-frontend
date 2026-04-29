'use client';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { submitContactForm } from '@/lib/data';

type FormData = { name: string; email: string; phone?: string; subject: string; message: string; };
const inputCls = "w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200";
const labelCls = "block text-sm font-semibold mb-1.5";

export function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const result = await submitContactForm(data);
    if (result.success) { toast.success('Message sent! We will respond soon.'); reset(); }
    else toast.error('Something went wrong. Please try again.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Your Name *</label>
          <input {...register('name', { required: true })} placeholder="Full name"
            className={inputCls} style={{ borderColor: errors.name ? '#ef4444' : 'var(--gray-200)' }} />
        </div>
        <div>
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Email *</label>
          <input {...register('email', { required: true })} type="email" placeholder="Email address"
            className={inputCls} style={{ borderColor: errors.email ? '#ef4444' : 'var(--gray-200)' }} />
        </div>
        <div>
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Phone</label>
          <input {...register('phone')} type="tel" placeholder="+91 XXXXX XXXXX"
            className={inputCls} style={{ borderColor: 'var(--gray-200)' }} />
        </div>
        <div>
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Subject</label>
          <select {...register('subject')} className={inputCls} style={{ borderColor: 'var(--gray-200)' }}>
            <option>General Enquiry</option>
            <option>Donation</option>
            <option>Volunteering</option>
            <option>Partnership</option>
            <option>Media</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Message *</label>
        <textarea {...register('message', { required: true })} rows={5} placeholder="Your message..."
          className={inputCls} style={{ borderColor: errors.message ? '#ef4444' : 'var(--gray-200)', resize: 'vertical' }} />
      </div>
      <button type="submit" disabled={isSubmitting}
        className="px-8 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
        style={{ background: 'var(--blue)', color: 'white' }}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
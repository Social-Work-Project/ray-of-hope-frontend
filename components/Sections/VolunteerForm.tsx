'use client';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormData = {
  full_name: string; email: string; phone_number: string; city: string;
  skills: string; availability: string; area_of_interest: string[]; purpose: string;
};

const inputCls = "w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200";
const labelCls = "block text-sm font-semibold mb-1.5";

const AREAS_OF_INTEREST = [
  'Education & Tutoring',
  'Health Camps',
  'Sports Coaching',
  'Social Awareness',
  'Administrative Support',
  'Fundraising',
  'Any / Wherever Needed',
];

export function VolunteerForm({ onSave }: { onSave: (data: any) => Promise<void> }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: { area_of_interest: [] },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await onSave(data); // data.area_of_interest is string[]
      reset();
    } catch (error) {
      console.error("Error in VolunteerForm onSubmit:", error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Full Name *</label>
          <input {...register('full_name', { required: true })} placeholder="Your full name"
            className={inputCls} style={{ borderColor: errors.full_name ? '#ef4444' : 'var(--gray-200)' }} />
        </div>
        <div>
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Email Address *</label>
          <input {...register('email', { required: true })} type="email" placeholder="your@email.com"
            className={inputCls} style={{ borderColor: errors.email ? '#ef4444' : 'var(--gray-200)' }} />
        </div>
        <div>
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Phone Number *</label>
          <input {...register('phone_number', { required: true })} type="tel" placeholder="+91 XXXXX XXXXX"
            className={inputCls} style={{ borderColor: errors.phone_number ? '#ef4444' : 'var(--gray-200)' }} />
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

        {/* Multi-select Area of Interest as checkboxes */}
        <div className="sm:col-span-2">
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>
            Area of Interest
            {errors.area_of_interest && (
              <span className="ml-2 text-xs font-normal text-red-500">Please select at least one</span>
            )}
          </label>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 border rounded-xl"
            style={{ borderColor: errors.area_of_interest ? '#ef4444' : 'var(--gray-200)' }}
          >
            {AREAS_OF_INTEREST.map((area) => (
              <label
                key={area}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors text-sm"
              >
                <input
                  type="checkbox"
                  value={area}
                  {...register('area_of_interest')}
                  className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                />
                <span style={{ color: 'var(--gray-800)' }}>{area}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Why Do You Want to Volunteer?</label>
          <textarea {...register('purpose')} rows={4} placeholder="Tell us about your motivation..."
            className={inputCls} style={{ borderColor: 'var(--gray-200)', resize: 'vertical' }} />
        </div>
      </div>
      <button type="submit" disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
        style={{ background: 'var(--blue)', color: 'white' }}>
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
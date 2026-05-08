'use client';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { WebsiteService } from '@/services/websiteService';
import { useState } from 'react';

type FormData = { name: string; email: string; phone: string; skills: string; notes: string; };
const inputCls = "w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200";
const labelCls = "block text-sm font-semibold mb-1.5";

export function EventVolunteerForm({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>();


  const onSubmit = async (data: FormData) => {
    const payload = {
      full_name: data.name,
      email: data.email,
      phone: data.phone,
      skills: data.skills,
      message: data.notes
    }

    try {
      await WebsiteService.createEventVolunteer(eventId, payload)
      
      toast.success("Application submitted successfully!")
      reset()

    } catch(err) {
      console.log(err)
      toast.error("Unable to submit application. Try Again!")
    }
   
  
  };

  return (
    <div className="bg-white rounded-2xl p-8 border shadow-sm" style={{ borderColor: 'var(--gray-100)' }}>
      <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--navy)' }}>Volunteer for This Event</h3>
      <p className="text-xs mb-6" style={{ color: 'var(--gray-400)' }}>{eventTitle}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Full Name *</label>
            <input {...register('name', { required: true })} placeholder="Your name" className={inputCls} style={{ borderColor: 'var(--gray-200)' }} />
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Email *</label>
            <input {...register('email', { required: true })} type="email" placeholder="your@email.com" className={inputCls} style={{ borderColor: 'var(--gray-200)' }} />
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Phone</label>
            <input {...register('phone')} type="tel" placeholder="+91 XXXXX XXXXX" className={inputCls} style={{ borderColor: 'var(--gray-200)' }} />
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Skills</label>
            <input {...register('skills')} placeholder="Medical, Language, etc." className={inputCls} style={{ borderColor: 'var(--gray-200)' }} />
          </div>
        </div>
        <div>
          <label className={labelCls} style={{ color: 'var(--gray-800)' }}>Notes</label>
          <textarea {...register('notes')} rows={3} placeholder="Any additional information" className={inputCls} style={{ borderColor: 'var(--gray-200)', resize: 'vertical' }} />
        </div>
        <button type="submit" disabled={isSubmitting}
          className="px-8 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 cursor-pointer"
          style={{ background: 'var(--blue)', color: 'white' }}>
          {isSubmitting ? 'Registering...' : 'Register as Volunteer'}
        </button>
      </form>
    </div>
  );
}
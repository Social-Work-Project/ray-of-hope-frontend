"use client"
import Image from 'next/image';
import { PageHero, Card } from '@/components/ui';
import { useEffect, useState } from 'react';
import { TestimonialsResponse } from '@/types';
import { WebsiteService } from '@/services/websiteService';

export default  function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialsResponse[]>([]);

  useEffect(() => {
    async function fetchTestimonials(){
      const res = await WebsiteService.getTestimonials()
      setTestimonials(res.data.results || [])
    } 
    fetchTestimonials()
  }, [])

  return (
    <div className='pt-18.25'>
      <PageHero breadcrumb="Testimonials" title="Voices from the Community"
        subtitle="Real stories from the people whose lives have been touched by Nagarkata Ray of Hope Society." />
      {testimonials.length > 0 ? <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <Card key={t.reference_id} className="p-8 relative">
                <div className="absolute top-6 left-6 text-6xl leading-none font-black opacity-20"
                  style={{ fontFamily: "'Playfair Display',serif", color: "var(--accent)" }}>&ldquo;</div>
                <p className="text-sm leading-loose mb-6 mt-4" style={{ color: "var(--gray-600)" }}>{t.message}</p>
                <div className="flex items-center gap-3">
                  <Image src="/images/user.png" alt={t.name} width={44} height={44} className="rounded-full object-cover shrink-0" />
                  <div>
                    <div className="font-bold text-sm" style={{ color: "var(--navy)" }}>{t.name}</div>
                    <div className="text-xs" style={{ color: "var(--gray-400)" }}>{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section> : 
      <div className="w-full flex items-center justify-center py-20 px-6">
  <div className="max-w-md w-full rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
    
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-8 w-8 text-gray-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 8.25h9m-9 3h5.25M6.75 3.75h10.5A2.25 2.25 0 0119.5 6v12a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18V6a2.25 2.25 0 012.25-2.25z"
        />
      </svg>
    </div>

    <h3 className="text-2xl font-semibold text-gray-900">
      No Testimonials Yet
    </h3>

    <p className="mt-3 text-sm leading-6 text-gray-500">
      There are currently no testimonials to display right now.
      Please check back later.
    </p>
  </div>
</div>
      }
    </div>
  );
}
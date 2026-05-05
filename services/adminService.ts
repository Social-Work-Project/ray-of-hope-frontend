import { get } from "http";
import { api } from "./apiClient";


export const AdminService = {
    // Events
    getEvents: async () => api.get("/events/list/"),
    createEvent: async (data: FormData) => api.post("/events/create/", data, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
    updateEvent: async (id: string, data: FormData) => api.put(`/events/${id}/update/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
       patchEvent: async (id: string, data: FormData) => api.patch(`/events/${id}/update/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
    deleteEvent: async (id: string) => api.delete(`/events/${id}/delete/`),


    //Volunteers
    getVolunteers: async () => api.get("/volunteers/applications/"),
    updateVolunteerStatus: async (id: string, status: 'accepted' | 'rejected') => api.patch(`/volunteers/application/${id}/status/update/`, { status }),
    deleteVolunteer: async (id: string) => api.delete(`/volunteers/${id}/delete/`),


    //Gallery
    getGalleryCategories: async () => api.get("/events/gallery-category/list/"),
    getGalleryItems: async () => api.get("/events/gallery/list/"),
    createGallery: async (data: FormData) => api.post("/events/gallery/create/", data, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
    updateGallery: async (id: string, data: { category_name: string }) => api.put(`/gallery/categories/${id}/update/`, data),
    deleteGalleryCategory: async (id: string) => api.delete(`/events/gallery-category/${id}/delete/`),
    deleteSinglePhoto: async (id: string) => api.delete(`/events/gallery/${id}/delete/`),


    //Testimonials
    getAllTestimonials: async () => api.get("/events/testimonial/list/"),
    createTestimonial: async (data: any) => api.post("/events/testimonial/create/", data),
    patchTestimonial: async (id: string, data: any) => api.patch(`/events/testimonial/${id}/update/`, data),
    deleteTestimonial: async (id: string) => api.delete(`/events/testimonial/${id}/delete/`),


    //Users
    getAllUsers: async () => api.get("/controlpanel/users/"),
    banUser: async (id: string) => api.post(`/users/${id}/ban/`),
    unbanUser: async (id: string) => api.post(`/users/${id}/unban/`),

    
}
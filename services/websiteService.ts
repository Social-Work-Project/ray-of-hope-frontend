import { api } from "./apiClient";


export const WebsiteService = {
    // Volunteer
    submitVolunteerForm: async (data: any) => api.post("/volunteers/application/create/", data),

    //events
    getEventFromId: async (id: string) => api.get(`/events/${id}/`),
    getAllEvents: async () => api.get("/events/published-events/list/"),

    //gallery
    getGalleryCategory: async () => api.get("/events/gallery-category/list/"),
    getAllGallery: async () => api.get("/events/gallery/list/"),
    getGalleryByCategories: async (id: string) => api.get(`/events/gallery/category/${id}/`)
}
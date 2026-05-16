import { api } from "./apiClient";


export const WebsiteService = {
    // Volunteer
    submitVolunteerForm: async (data: any) => api.post("/volunteers/application/create/", data),

    //events
    getEventFromId: async (id: string) => api.get(`/events/${id}/`),
    getAllEvents: async () => api.get("/events/published-events/list/"),
    createEventVolunteer: async (id: string, data: any) => api.post(`events/event-application/${id}/apply/`, data),

    //gallery
    getGalleryCategory: async () => api.get("/events/gallery-category/list/"),
    getAllGallery: async () => api.get("/events/gallery/list/"),
    getGalleryByCategories: async (id: string) => api.get(`/events/gallery/category/${id}/`),


    //website contents
    getAboutPageContent: async () => api.get("/cms/aboutpage-content/"),
    getHomePageContent: async () => api.get("/cms/homepage-content/"),
    getContantDetails: async () => api.get("/cms/contact-details/"),
    getUPIDetails: async () => api.get("/cms/upi-payments/"),
    getBankAccountDetails: async () => api.get("/cms/bank-account-details/"),
    getTestimonials: async () => api.get("/events/testimonial/list/?is_active=true"),
    getTeamMembers: async () => api.get("/events/team/list/?is_active=true"),
    getImages: async () => api.get("/cms/image-content/"),

    //Contact
    sendMessage: async (data: any) => api.post("/cms/contact-message/", data),


}
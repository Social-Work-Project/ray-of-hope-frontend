import { api } from "./apiClient";


export const WebsiteService = {
    // Volunteer
    submitVolunteerForm: async (data: any) => api.post("/volunteers/application/create/", data),

    //events
    getEventFromId: async (id: string) => api.get(`/events/${id}/`),
    getAllEvents: async () => api.get("/events/published-events/list/"),
}
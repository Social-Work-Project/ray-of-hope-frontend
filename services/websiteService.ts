import { api } from "./apiClient";


export const WebsiteService = {
    // Volunteer
    submitVolunteerForm: async (data: any) => api.post("/volunteers/application/create/", data),

    //events
    getEventFromId: async (id: string) => api.get(`/events/${id}/`),
}
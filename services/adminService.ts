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
    deleteEvent: async (id: string) => api.delete(`/events/${id}/delete/`),
}
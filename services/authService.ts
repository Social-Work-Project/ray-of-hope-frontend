import { api } from "./apiClient";


export const AuthService = {
    checkAuth: async ()=> api.get("/auth/me/"),
    login: async (data: any) => api.post("/auth/login/", data),
    register: async (data: any) => api.post("/auth/register/", data),
    logout: async () => api.post("/auth/logout/"),

}
import { api } from "./apiClient";


export const AuthService = {
    checkAuth: async ()=> api.get("/auth/me/"),
    login: async (data: any) => api.post("/auth/login/", data),
    register: async (data: any) => api.post("/auth/register/", data),
    logout: async () => api.post("/auth/logout/"),

    //profile
    getProfile: async () => api.get("/auth/profile/"),
    changeUserPassword: async (data: { old_password: string, new_password: string, confirm_password: string }) => api.post("/auth/change-password/", data),
    changeProfile: async (data: any) => api.patch("/auth/profile/update/", data)

}
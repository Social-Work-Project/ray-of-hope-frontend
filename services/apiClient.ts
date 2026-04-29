import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    timeout: 15000,
})

//Request interceptors
apiClient.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => Promise.reject(error)
)

//Response interceptors
apiClient.interceptors.response.use(
    (response:AxiosResponse) => response,
    async (error: AxiosError<any>) => {
        const status = error.response?.status;

        if (status === 401) {
            console.warn("Unauthorized - login required")
        } 

        if (status === 403) {
            console.warn("Forbidden - insufficient permissions")
        }

        if (status && status >= 500) {
            console.error("Server error - try again later")
        }
        
        return Promise.reject(error)
    }
)


//Generic Methos

export const api = {
    get: <T = any>(url: string, config?: AxiosRequestConfig) => apiClient.get<T>(url, config),
    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.post<T>(url, data, config),
    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.put<T>(url, data, config),
    delete: <T = any>(url: string, config?: AxiosRequestConfig) => apiClient.delete<T>(url, config),
}

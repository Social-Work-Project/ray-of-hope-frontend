import { api } from "./apiClient";
import { AboutData, BankData, ContactData, HomeData, UpiData } from "@/types";

export const AdminService = {
  // Events
  getEvents: async () => api.get("/events/list/"),
  createEvent: async (data: FormData) =>
    api.post("/events/create/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateEvent: async (id: string, data: FormData) =>
    api.put(`/events/${id}/update/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  patchEvent: async (id: string, data: FormData) =>
    api.patch(`/events/${id}/update/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteEvent: async (id: string) => api.delete(`/events/${id}/delete/`),

  //Volunteers
  getVolunteers: async () => api.get("/volunteers/applications/"),
  updateVolunteerStatus: async (id: string, status: "accepted" | "rejected") =>
    api.patch(`/volunteers/application/${id}/status/update/`, { status }),
  deleteVolunteer: async (id: string) =>
    api.delete(`/volunteers/${id}/delete/`),

  //Team Members
  getAllTeams: async () => api.get("/events/team/list/"),
  createTeam: async (data: FormData) =>
    api.post("/events/team/create/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateTeam: async (id: string, data: FormData) =>
    api.patch(`/events/team/${id}/update/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteTeam: async (id: string) => api.delete(`/events/team/${id}/delete/`),

  //Gallery
  getGalleryCategories: async () => api.get("/events/gallery-category/list/"),
  getGalleryItems: async () => api.get("/events/gallery/list/"),
  createGallery: async (data: FormData) =>
    api.post("/events/gallery/create/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateGallery: async (id: string, data: { category_name: string }) =>
    api.put(`/gallery/categories/${id}/update/`, data),
  deleteGalleryCategory: async (id: string) =>
    api.delete(`/events/gallery-category/${id}/delete/`),
  deleteSinglePhoto: async (id: string) =>
    api.delete(`/events/gallery/${id}/delete/`),

  //Testimonials
  getAllTestimonials: async () => api.get("/events/testimonial/list/"),
  createTestimonial: async (data: any) =>
    api.post("/events/testimonial/create/", data),
  patchTestimonial: async (id: string, data: any) =>
    api.patch(`/events/testimonial/${id}/update/`, data),
  deleteTestimonial: async (id: string) =>
    api.delete(`/events/testimonial/${id}/delete/`),

  //Users
  getAllUsers: async () => api.get("/controlpanel/users/"),
  createUser: async (data: any) => api.post("/controlpanel/users/create/", data),
  banUser: async (id: string) => api.post(`/users/${id}/ban/`),
  unbanUser: async (id: string) => api.post(`/users/${id}/unban/`),

  //Cms
  getHomePageContent: async () => api.get("/cms/homepage-content/"),
  createHomePageContent: async (data: HomeData) =>
    api.post("/cms/homepage-content/", data),

  getAboutPageContent: async () => api.get("/cms/aboutpage-content/"),
  createAboutPageContent: async (data: AboutData) =>
    api.post("/cms/aboutpage-content/", data),

  getContactContent: async () => {
    const res = await api.get("/cms/contact-details/");

    if (!res.data.results) return { data: null };
    return {
      data: {
        results: {
          address: res.data.results.address ?? "",
          // Flatten nested objects → plain string arrays
          phones:
            res.data.results.phone_numbers?.map((p: any) => p.phone_number) ??
            [],
          emails: res.data.results.emails?.map((e: any) => e.email) ?? [],
        },
      },
    };
  },
  createContactContent: async (data: ContactData) => {
    const payload = {
      address: data.address,
      // Re-wrap strings back into the nested shape your API expects
      phone_numbers: data.phones,
      emails: data.emails,
    };
    await api.post("/cms/contact-details/", payload);
  },

  getUpiContent: async () => {
    const res = await api.get("/cms/upi-payments/");
    if (!res.data.results) return { data: null };
    return {
      data: {
        results: {
          qr_code: res.data.results.qr_code ?? "",
          upi_ids: res.data.results.upi_ids?.map((u: any) => u.upi_id) ?? [],
        },
      },
    };
  },
  createUpiContent: async (data: UpiData, qrFile: File | null) => {
    if (!qrFile) return api.post("/cms/upi-payments/", data);
    const form = new FormData();
    form.append("qr_code", qrFile);
    data.upi_ids.forEach((id) => form.append("upi_ids", id));
    return api.post("/cms/upi-payments/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getBankContent: async () => api.get("/cms/bank-account-details/"),
  createBankContent: async (data: BankData, qrFile: File | null) => {
    if (!qrFile) return api.post("/cms/bank-account-details/", data);
    const form = new FormData();
    form.append("qr_code", qrFile);
    Object.entries(data).forEach(([k, v]) => {
      if (k !== "qr_code" && v !== null) form.append(k, v as string);
    });
    return api.post("/cms/bank-account-details/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateHomePageContent: async (data: HomeData) =>
    api.patch("/cms/homepage-content/", data),
  updateAboutPageContent: async (data: AboutData) =>
    api.patch("/cms/aboutpage-content/", data),
  updateContactContent: async (data: ContactData) => {
    const payload = {
      address: data.address,
      // Re-wrap strings back into the nested shape your API expects
      phone_numbers: data.phones,
      emails: data.emails,
    };
    await api.patch("/cms/contact-details/", payload);
  },

  updateUpiContent: (data: UpiData, qrFile: File | null) => {

    const form = new FormData();

    // Make sure you're reading the right key from data
    // If your hook stores it as upiIds, map it here
    const ids = data.upi_ids ?? [];
    ids.forEach((id: string) => form.append("upi_ids", id));

    if (qrFile) {
      form.append("qr_code", qrFile);
    } else {
        form.append("qr_code", "")
    }

    // Always FormData — consistent for both file and no-file cases
    return api.patch("/cms/upi-payments/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateBankContent: (data: BankData, qrFile: File | null) => {
 
    const form = new FormData();
  
    Object.entries(data).forEach(([k, v]) => {
      if (k !== "qr_code" && v !== null && k!== "reference_id") form.append(k, v as string);
    });

    if(qrFile){
        form.append("qr_code", qrFile)
    } else {
        form.append("qr_code", "")
    }
    return api.patch("/cms/bank-account-details/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },



  //User Management

};

import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      const pathname = window.location.pathname;
      if (
        pathname.startsWith("/vendor") &&
        pathname !== "/vendor/login" &&
        pathname !== "/vendor/signup"
      ) {
        window.location.href = "/vendor/login";
      } else if (
        pathname.startsWith("/admin") &&
        pathname !== "/admin/login" &&
        pathname !== "/admin/signup"
      ) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export const marketplaceApi = {
  // Auth
  login: async (payload: {
    email: string;
    password: string;
    requiredRole?: "vendor" | "superadmin" | "admin" | "user";
  }) => {
    const { data } = await api.post("/auth/login", payload);
    return data.data;
  },
  register: async (payload: any) => {
    const { data } = await api.post("/auth/register", payload);
    return data.data;
  },
  me: async () => {
    const { data } = await api.get("/auth/me");
    return data.data;
  },
  logout: async () => {
    const { data } = await api.post("/auth/logout");
    return data;
  },

  // Media
  getSignSignature: async (folder?: string) => {
    const { data } = await api.post("/media/sign", { folder });
    return data.data;
  },
  getMediaGallery: async (uploadedByMe = true) => {
    const { data } = await api.get(`/media${uploadedByMe ? "?uploadedBy=me" : ""}`);
    return data.data;
  },
  registerMedia: async (payload: {
    cloudinaryPublicId: string;
    secureUrl: string;
    width?: number;
    height?: number;
    format?: string;
  }) => {
    const { data } = await api.post("/media", payload);
    return data.data;
  },

  // Taxonomy (Public)
  getCategories: async () => {
    const { data } = await api.get("/categories");
    return data.data;
  },
  getAmenities: async () => {
    const { data } = await api.get("/amenities");
    return data.data;
  },

  // Admin Amenities CRUD
  getAdminAmenities: async () => {
    const { data } = await api.get("/admin/amenities");
    return data.data;
  },
  createAdminAmenity: async (payload: { name: string; icon?: string; isActive?: boolean }) => {
    const { data } = await api.post("/admin/amenities", payload);
    return data.data;
  },
  updateAdminAmenity: async (
    id: string,
    payload: { name?: string; icon?: string; isActive?: boolean }
  ) => {
    const { data } = await api.patch(`/admin/amenities/${id}`, payload);
    return data.data;
  },
  deleteAdminAmenity: async (id: string) => {
    const { data } = await api.delete(`/admin/amenities/${id}`);
    return data;
  },

  // Vendor Listings
  getVendorListings: async () => {
    const { data } = await api.get("/vendor/listings");
    return data.data;
  },
  getVendorListingById: async (id: string) => {
    const { data } = await api.get(`/vendor/listings/${id}`);
    return data.data;
  },
  createVendorListing: async (payload: any) => {
    const { data } = await api.post("/vendor/listings", payload);
    return data.data;
  },
  updateVendorListing: async (id: string, payload: any) => {
    const { data } = await api.patch(`/vendor/listings/${id}`, payload);
    return data.data;
  },

  // Vendor Services
  getVendorServices: async () => {
    const { data } = await api.get("/vendor/services");
    return data.data;
  },
  createVendorService: async (payload: {
    name: string;
    size: string;
    price: number;
    description?: string;
  }) => {
    const { data } = await api.post("/vendor/services", payload);
    return data.data;
  },
  updateVendorService: async (id: string, payload: any) => {
    const { data } = await api.patch(`/vendor/services/${id}`, payload);
    return data.data;
  },
  deleteVendorService: async (id: string) => {
    const { data } = await api.delete(`/vendor/services/${id}`);
    return data;
  },

  // Vendor Leads & Analytics
  getVendorLeads: async () => {
    const { data } = await api.get("/vendor/leads");
    return data.data;
  },
  updateVendorLead: async (id: string, payload: { status?: string; noteText?: string }) => {
    const { data } = await api.patch(`/vendor/leads/${id}`, payload);
    return data.data;
  },
  getVendorAnalytics: async () => {
    const { data } = await api.get("/vendor/analytics");
    return data.data;
  },

  // SuperAdmin Listings & Approvals
  getAdminListings: async (params?: { status?: string; isLive?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.isLive !== undefined) query.set("isLive", String(params.isLive));
    const { data } = await api.get(`/admin/listings?${query.toString()}`);
    return data.data;
  },
  approveListing: async (
    id: string,
    payload: { status: "approved" | "rejected" | "pending_review"; rejectionReason?: string }
  ) => {
    const { data } = await api.patch(`/admin/listings/${id}/approve`, payload);
    return data.data;
  },
  toggleLiveListing: async (id: string, isLive: boolean) => {
    const { data } = await api.patch(`/admin/listings/${id}/live`, { isLive });
    return data.data;
  },
  updateAdminListing: async (id: string, payload: any) => {
    const { data } = await api.patch(`/admin/listings/${id}`, payload);
    return data.data;
  },
  deleteAdminListing: async (id: string) => {
    const { data } = await api.delete(`/admin/listings/${id}`);
    return data;
  },
  createAdminListing: async (payload: any) => {
    const { data } = await api.post("/admin/listings", payload);
    return data.data;
  },

  // SuperAdmin Services
  getAdminServices: async () => {
    const { data } = await api.get("/admin/services");
    return data.data;
  },
  createAdminService: async (payload: any) => {
    const { data } = await api.post("/admin/services", payload);
    return data.data;
  },
  updateAdminService: async (id: string, payload: any) => {
    const { data } = await api.patch(`/admin/services/${id}`, payload);
    return data.data;
  },
  deleteAdminService: async (id: string) => {
    const { data } = await api.delete(`/admin/services/${id}`);
    return data;
  },

  // SuperAdmin Vendors, Leads & Analytics
  getAdminVendors: async () => {
    const { data } = await api.get("/admin/vendors");
    return data.data;
  },
  updateVendorStatus: async (id: string, status: "active" | "suspended") => {
    const { data } = await api.patch(`/admin/vendors/${id}/status`, { status });
    return data.data;
  },
  getAdminLeads: async (params?: { vendorId?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.vendorId) query.set("vendorId", params.vendorId);
    if (params?.status) query.set("status", params.status);
    const { data } = await api.get(`/admin/leads?${query.toString()}`);
    return data.data;
  },
  getAdminAnalytics: async () => {
    const { data } = await api.get("/admin/analytics");
    return data.data;
  },

  // Public Marketplace Browse
  getPublicListings: async (params?: Record<string, string>) => {
    const query = new URLSearchParams(params || {});
    const { data } = await api.get(`/listings?${query.toString()}`);
    return data.data;
  },
  getPublicListingBySlug: async (slug: string) => {
    const { data } = await api.get(`/listings/${slug}`);
    return data.data;
  },
  submitLead: async (payload: {
    listingId?: string;
    name: string;
    phone: string;
    email?: string;
    message?: string;
    source?: string;
  }) => {
    const { data } = await api.post("/leads", payload);
    return data.data;
  },
};

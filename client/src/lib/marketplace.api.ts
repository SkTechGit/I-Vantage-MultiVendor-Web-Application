import axiosInstance from "@/lib/axios";

const api = axiosInstance;


export const marketplaceApi = {
  // Auth
  login: async (payload: {
    email: string;
    password: string;
    requiredRole?: "vendor" | "superadmin" | "user";
  }) => {
    const { data } = await api.post("/auth/login", payload);
    return data.data;
  },
  register: async (payload: any) => {
    const { data } = await api.post("/auth/register", payload);
    return data.data;
  },
  me: async (portal?: string) => {
    let resolvedPortal = portal;
    if (!resolvedPortal && typeof window !== "undefined") {
      if (window.location.pathname.startsWith("/admin")) resolvedPortal = "admin";
      else if (window.location.pathname.startsWith("/vendor")) resolvedPortal = "vendor";
    }
    const query = resolvedPortal ? `?portal=${encodeURIComponent(resolvedPortal)}` : "";
    const { data } = await api.get(`/auth/me${query}`, {
      headers: resolvedPortal ? { "x-portal": resolvedPortal } : undefined,
    });
    return data.data;
  },
  logout: async (portal?: string) => {
    let resolvedPortal = portal;
    if (!resolvedPortal && typeof window !== "undefined") {
      if (window.location.pathname.startsWith("/admin")) resolvedPortal = "admin";
      else if (window.location.pathname.startsWith("/vendor")) resolvedPortal = "vendor";
    }
    const query = resolvedPortal ? `?portal=${encodeURIComponent(resolvedPortal)}` : "";
    const { data } = await api.post(`/auth/logout${query}`, { portal: resolvedPortal });
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
    const { data } = await api.get("/marketplace-categories");
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
  updateAdminLead: async (id: string, payload: { status?: string; note?: string }) => {
    const { data } = await api.patch(`/admin/leads/${id}`, payload);
    return data.data;
  },
  deleteAdminLead: async (id: string) => {
    const { data } = await api.delete(`/admin/leads/${id}`);
    return data;
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
    listingTitle?: string;
    spaceTitle?: string;
    spaceLocation?: string;
    name: string;
    phone: string;
    email?: string;
    message?: string;
    source?: string;
  }) => {
    const { data } = await api.post("/marketplace-leads", payload);
    return data.data;
  },
};

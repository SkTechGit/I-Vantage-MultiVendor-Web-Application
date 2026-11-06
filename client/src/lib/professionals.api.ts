import axiosInstance from "@/lib/axios";

const api = axiosInstance;

export interface ProfessionalCategoryItem {
  _id: string;
  slug: string;
  name: string;
  label: string;
  description?: string;
  iconKey?: string;
  sortOrder?: number;
  count?: number;
}

export interface ServiceItem {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  mode: "ONLINE" | "IN_PERSON" | "ONLINE_IN_PERSON";
  priceType: "FROM" | "QUOTE";
  priceInr?: number | null;
  sortOrder?: number;
  isActive: boolean;
}

export interface ExpertiseItem {
  _id: string;
  title: string;
  description?: string;
  sortOrder?: number;
}

export interface VideoItem {
  _id: string;
  platform: "YOUTUBE" | "INSTAGRAM" | "OTHER";
  url: string;
  externalId?: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  sortOrder?: number;
}

export interface ExperienceItem {
  _id: string;
  kind: "WORK" | "EDUCATION" | "CERTIFICATION";
  title: string;
  organization?: string;
  location?: string;
  startYear: number;
  endYear?: number | null;
  description?: string;
  sortOrder?: number;
}

export interface ProcessStepItem {
  stepNumber: number;
  title: string;
  description: string;
}

export interface ProfileDocumentItem {
  _id: string;
  title: string;
  kind: "COP_CERTIFICATE" | "MEMBERSHIP_CARD" | "GST_CERTIFICATE" | "PAN_CARD" | "UDYAM_CERTIFICATE" | "OTHER";
  fileUrl: string;
  publicId?: string;
  verifiedStatus: "PENDING" | "VERIFIED" | "REJECTED";
  expiryDate?: string;
  uploadedAt: string;
}

export interface ProfessionalProfileItem {
  _id: string;
  userId?: any;
  categoryId: ProfessionalCategoryItem;
  slug: string;
  fullName: string;
  headline: string;
  summary: string;
  aboutMd: string;
  city: string;
  state: string;
  country: string;
  languages: string[];
  yearsExperience: number;
  qualification: string;
  registrationBody: string;
  registrationNumber: string;
  photoUrl: string;
  photoAlt?: string;
  coverUrl?: string;
  coverAlt?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  contactMode: "hub" | "direct";
  contactPhone?: string;
  contactWhatsapp?: string;
  contactEmail?: string;
  consultationFeeInr?: number;
  consultationHours?: string;
  responseTimeText?: string;
  consultationModes: string[];
  servesAreas: string[];
  specializations: string[];
  industries: string[];
  clientTypes: string[];
  processSteps: ProcessStepItem[];
  services: ServiceItem[];
  expertise: ExpertiseItem[];
  videos: VideoItem[];
  experience: ExperienceItem[];
  documents?: ProfileDocumentItem[];

  /* Credentials & Practice */
  designation?: string;
  enrollmentDate?: string;
  copNumber?: string;
  copValidity?: string;
  firmRegistrationNumber?: string;
  regionalCouncil?: string;
  officeAddress?: string;
  pincode?: string;
  isRemoteFriendly?: boolean;
  willingToTravel?: boolean;
  bookingUrl?: string;
  caConnectUrl?: string;
  signatureUrl?: string;

  /* Fees */
  feeModel?: string;
  consultationFeeMaxInr?: number;
  consultationDurationMinutes?: number;
  freeFirstConsultation?: boolean;
  gstApplicable?: boolean;
  retainerScopeText?: string;
  acceptedPaymentMethods?: string[];
  cancellationPolicyText?: string;

  /* Statutory */
  gstin?: string;
  gstinStatus?: string;
  panMasked?: string;
  citrNumber?: string;
  udinEnabled?: boolean;
  aadhaarSeeded?: boolean;
  pfEsicRegistration?: string;
  shopEstLicense?: string;
  udyamNumber?: string;
  empanelments?: string[];

  /* Portfolio & Practice Brochure (Optional) */
  portfolioFileUrl?: string;
  portfolioFileName?: string;
  portfolioFileSize?: number;
  portfolioTitle?: string;
  portfolioDescription?: string;
  portfolioExternalUrl?: string;
  portfolioUploadedAt?: string;

  status: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "SUSPENDED" | "ARCHIVED";
  verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  verifiedAt?: string;
  isFeatured: boolean;
  featuredRank?: number;
  completeness: number;
  createdAt: string;
  publishedAt?: string;
}

export const professionalsApi = {
  // Public directory
  list: async (params: {
    q?: string;
    category?: string;
    city?: string;
    mode?: string;
    language?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await api.get("/professionals", { params });
    return data;
  },

  getFacets: async () => {
    const { data } = await api.get("/professionals/facets");
    return data.data;
  },

  getCategories: async () => {
    const { data } = await api.get("/professionals/categories");
    return data.data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get(`/professionals/${slug}`);
    return data.data as ProfessionalProfileItem;
  },

  getRelated: async (slug: string) => {
    const { data } = await api.get(`/professionals/${slug}/related`);
    return data.data as ProfessionalProfileItem[];
  },

  getArticles: async (slug: string) => {
    const { data } = await api.get(`/professionals/${slug}/articles`);
    return data.data;
  },

  getArticleBySlug: async (slug: string, articleSlug: string) => {
    const { data } = await api.get(`/professionals/${slug}/articles/${articleSlug}`);
    return data.data;
  },

  submitEnquiry: async (slug: string, payload: any) => {
    const { data } = await api.post(`/professionals/${slug}/enquiries`, payload);
    return data.data;
  },

  // Professional self-service (/me)
  getMyProfile: async () => {
    const { data } = await api.get("/professionals/me/profile");
    return data.data;
  },

  uploadPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append("photo", file);
    const { data } = await api.post("/professionals/me/profile/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  removePhoto: async () => {
    const { data } = await api.delete("/professionals/me/profile/photo");
    return data;
  },

  uploadCover: async (file: File) => {
    const formData = new FormData();
    formData.append("cover", file);
    const { data } = await api.post("/professionals/me/profile/cover", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  removeCover: async () => {
    const { data } = await api.delete("/professionals/me/profile/cover");
    return data;
  },

  uploadDocument: async (file: File, meta: { title: string; kind: string; expiryDate?: string }) => {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("title", meta.title);
    formData.append("kind", meta.kind);
    if (meta.expiryDate) formData.append("expiryDate", meta.expiryDate);
    const { data } = await api.post("/professionals/me/profile/document", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  deleteDocument: async (docId: string) => {
    const { data } = await api.delete(`/professionals/me/profile/document/${docId}`);
    return data;
  },

  uploadPortfolio: async (file: File, meta?: { title?: string; description?: string; externalUrl?: string }) => {
    const formData = new FormData();
    formData.append("portfolio", file);
    if (meta?.title) formData.append("title", meta.title);
    if (meta?.description) formData.append("description", meta.description);
    if (meta?.externalUrl) formData.append("externalUrl", meta.externalUrl);
    const { data } = await api.post("/professionals/me/profile/portfolio", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  removePortfolio: async () => {
    const { data } = await api.delete("/professionals/me/profile/portfolio");
    return data;
  },

  updateMyContent: async (payload: any) => {
    const { data } = await api.patch("/professionals/me/profile/content", payload);
    return data.data;
  },

  requestIdentityChange: async (payload: any) => {
    const { data } = await api.post("/professionals/me/profile/identity", payload);
    return data.data;
  },

  submitForReview: async () => {
    const { data } = await api.post("/professionals/me/profile/submit");
    return data.data;
  },

  getMyEnquiries: async (status?: string) => {
    const { data } = await api.get("/professionals/me/enquiries", { params: { status } });
    return data.data;
  },

  updateMyEnquiry: async (id: string, payload: { status: string; note?: string }) => {
    const { data } = await api.patch(`/professionals/me/enquiries/${id}`, payload);
    return data.data;
  },
};

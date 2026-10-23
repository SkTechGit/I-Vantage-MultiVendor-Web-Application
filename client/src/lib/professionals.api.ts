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

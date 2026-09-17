export type BlogStatus = "draft" | "published" | "scheduled" | "archived";

export interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  sortOrder: number;
  isActive: boolean;
  postCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogAuthor {
  _id: string;
  fullName: string;
  email: string;
}

export interface BlogCoverImage {
  url: string;
  publicId?: string;
  alt?: string;
  caption?: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: BlogCoverImage;
  status: BlogStatus;
  featured: boolean;
  author: BlogAuthor;
  category: BlogCategory;
  tags: string[];
  readingTimeMinutes: number;
  publishedAt: string | null;
  scheduledAt: string | null;
  viewsCount: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: {
    url: string;
    publicId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BlogListResponse {
  blogs: Blog[];
  total: number;
  page: number;
  totalPages: number;
}

export interface BlogStats {
  total: number;
  published: number;
  drafts: number;
  scheduled: number;
  archived: number;
  totalViews: number;
  categoriesCount: number;
}

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  sort?: "newest" | "popular" | "featured";
}

export interface AdminBlogQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
}

export interface CreateBlogPayload {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage: BlogCoverImage;
  status?: BlogStatus;
  featured?: boolean;
  category: string;
  tags?: string[];
  author?: string;
  scheduledAt?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: {
    url: string;
    publicId?: string;
  };
}

export type UpdateBlogPayload = Partial<CreateBlogPayload>;

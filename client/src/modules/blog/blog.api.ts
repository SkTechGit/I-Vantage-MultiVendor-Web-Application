import axiosInstance from "@/lib/axios";
import {
  Blog,
  BlogCategory,
  BlogListResponse,
  BlogQueryParams,
  AdminBlogQueryParams,
  CreateBlogPayload,
  UpdateBlogPayload,
  BlogStats,
  BlogStatus,
} from "./blog.types";

/* -------------------------------------------------------------------------- */
/*                                Public APIs                                 */
/* -------------------------------------------------------------------------- */

export const getPublicBlogs = async (
  params?: BlogQueryParams
): Promise<BlogListResponse> => {
  const { data } = await axiosInstance.get("/blogs", { params });
  return data.data;
};

export const getFeaturedBlog = async (): Promise<Blog | null> => {
  const { data } = await axiosInstance.get("/blogs/featured");
  return data.data;
};

export const getPublicBlogBySlug = async (
  slug: string
): Promise<{ blog: Blog; redirected: boolean; newSlug?: string }> => {
  const { data } = await axiosInstance.get(`/blogs/article/${slug}`);
  return data.data;
};

export const getRelatedBlogs = async (
  blogId: string,
  categoryId: string,
  tags?: string[]
): Promise<Blog[]> => {
  const { data } = await axiosInstance.get("/blogs/related", {
    params: {
      blogId,
      categoryId,
      tags: tags?.join(","),
    },
  });
  return data.data;
};

export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  const { data } = await axiosInstance.get("/blogs/categories");
  return data.data;
};

export const getBlogTags = async (): Promise<string[]> => {
  const { data } = await axiosInstance.get("/blogs/tags");
  return data.data;
};

/* -------------------------------------------------------------------------- */
/*                                 Admin APIs                                 */
/* -------------------------------------------------------------------------- */

export const getAdminBlogs = async (
  params?: AdminBlogQueryParams
): Promise<BlogListResponse> => {
  const { data } = await axiosInstance.get("/blogs/admin/list", { params });
  return data.data;
};

export const getAdminBlogById = async (id: string): Promise<Blog> => {
  const { data } = await axiosInstance.get(`/blogs/admin/detail/${id}`);
  return data.data;
};

export const createBlog = async (
  payload: CreateBlogPayload
): Promise<Blog> => {
  const { data } = await axiosInstance.post("/blogs/admin/create", payload);
  return data.data;
};

export const updateBlog = async (
  id: string,
  payload: UpdateBlogPayload
): Promise<Blog> => {
  const { data } = await axiosInstance.put(`/blogs/admin/update/${id}`, payload);
  return data.data;
};

export const updateBlogStatus = async (
  id: string,
  status: BlogStatus,
  scheduledAt?: string | null
): Promise<Blog> => {
  const { data } = await axiosInstance.patch(`/blogs/admin/status/${id}`, {
    status,
    scheduledAt,
  });
  return data.data;
};

export const deleteBlog = async (
  id: string,
  permanent = false
): Promise<{ message: string }> => {
  const { data } = await axiosInstance.delete(`/blogs/admin/delete/${id}`, {
    params: { permanent },
  });
  return data;
};

export const getBlogDashboardStats = async (): Promise<BlogStats> => {
  const { data } = await axiosInstance.get("/blogs/admin/stats");
  return data.data;
};

export const createBlogCategory = async (payload: {
  name: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  sortOrder?: number;
}): Promise<BlogCategory> => {
  const { data } = await axiosInstance.post("/blogs/admin/categories", payload);
  return data.data;
};

export const deleteBlogCategory = async (
  id: string
): Promise<{ message: string }> => {
  const { data } = await axiosInstance.delete(`/blogs/admin/categories/${id}`);
  return data;
};

export const uploadBlogMedia = async (
  file: File
): Promise<{
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}> => {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await axiosInstance.post("/blogs/admin/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data;
};

export const trackBlogView = async (
  slug: string
): Promise<{ viewsCount: number; incremented: boolean }> => {
  const { data } = await axiosInstance.post(`/blogs/article/${slug}/view`);
  return data.data;
};

export const resetBlogViews = async (id: string): Promise<Blog> => {
  const { data } = await axiosInstance.post(`/blogs/admin/reset-views/${id}`);
  return data.data;
};

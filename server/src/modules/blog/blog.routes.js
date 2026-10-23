import { Router } from "express";
import {
  getPublicBlogs,
  getFeaturedBlog,
  getPublicBlogBySlug,
  getRelatedBlogs,
  getBlogCategories,
  getBlogTags,
  getAdminBlogs,
  getAdminBlogById,
  createBlog,
  updateBlog,
  updateBlogStatus,
  deleteBlog,
  getBlogDashboardStats,
  createBlogCategory,
  deleteBlogCategory,
  uploadBlogMedia,
  trackView,
  resetViews,
} from "./blog.controller.js";
import { authenticate, authorize } from "../auth/auth.middleware.js";
import upload from "../../middlewares/upload.middleware.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                Public Routes                               */
/* -------------------------------------------------------------------------- */

router.get("/", getPublicBlogs);
router.get("/featured", getFeaturedBlog);
router.get("/categories", getBlogCategories);
router.get("/tags", getBlogTags);
router.get("/related", getRelatedBlogs);
router.get("/article/:slug", getPublicBlogBySlug);
router.post("/article/:slug/view", trackView);

/* -------------------------------------------------------------------------- */
/*                           CMS Protected Routes                             */
/* -------------------------------------------------------------------------- */

// Allows both super_admin and professional; strict data isolation is enforced in service layer
const cmsAuth = [authenticate, authorize(["super_admin", "professional", "admin"])];
const superAdminOnly = [authenticate, authorize(["super_admin"])];

// CMS Endpoints (Accessible to Super Admin and Professional authors)
router.get(["/admin/list", "/cms/list"], ...cmsAuth, getAdminBlogs);
router.get(["/admin/stats", "/cms/stats"], ...cmsAuth, getBlogDashboardStats);
router.post(["/admin/create", "/cms/create"], ...cmsAuth, createBlog);
router.get(["/admin/detail/:id", "/cms/detail/:id"], ...cmsAuth, getAdminBlogById);
router.put(["/admin/update/:id", "/cms/update/:id"], ...cmsAuth, updateBlog);
router.patch(["/admin/status/:id", "/cms/status/:id"], ...cmsAuth, updateBlogStatus);
router.delete(["/admin/delete/:id", "/cms/delete/:id"], ...cmsAuth, deleteBlog);

// Category & Media Upload (shared for CMS editors)
router.post(["/admin/categories", "/cms/categories"], ...cmsAuth, createBlogCategory);
router.post(
  ["/admin/media/upload", "/cms/media/upload"],
  ...cmsAuth,
  upload.single("image"),
  uploadBlogMedia
);

// Admin-Only Governance
router.delete(["/admin/categories/:id", "/cms/categories/:id"], ...superAdminOnly, deleteBlogCategory);
router.post(["/admin/reset-views/:id", "/cms/reset-views/:id"], ...superAdminOnly, resetViews);

export default router;

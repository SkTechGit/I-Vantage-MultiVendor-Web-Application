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
/*                           Admin Protected Routes                           */
/* -------------------------------------------------------------------------- */

const adminAuth = [authenticate, authorize(["super_admin"])];

router.get("/admin/list", ...adminAuth, getAdminBlogs);
router.get("/admin/stats", ...adminAuth, getBlogDashboardStats);
router.post("/admin/create", ...adminAuth, createBlog);
router.get("/admin/detail/:id", ...adminAuth, getAdminBlogById);
router.put("/admin/update/:id", ...adminAuth, updateBlog);
router.patch("/admin/status/:id", ...adminAuth, updateBlogStatus);
router.delete("/admin/delete/:id", ...adminAuth, deleteBlog);

// Admin Category Management
router.post("/admin/categories", ...adminAuth, createBlogCategory);
router.delete("/admin/categories/:id", ...adminAuth, deleteBlogCategory);

// Admin Media Upload
router.post(
  "/admin/media/upload",
  ...adminAuth,
  upload.single("image"),
  uploadBlogMedia
);

// Admin Reset Views (for testing & analytics recalibration)
router.post("/admin/reset-views/:id", ...adminAuth, resetViews);

export default router;

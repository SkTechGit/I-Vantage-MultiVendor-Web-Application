import slugify from "slugify";
import Blog from "./blog.model.js";
import BlogCategory from "./blog-category.model.js";
import BlogSlugRedirect from "./blog-slug-redirect.model.js";
import BlogAuditLog from "./blog-audit-log.model.js";
import ApiError from "../../utils/ApiError.js";
import { uploadImage, deleteImage } from "../../utils/cloudinary.js";

// Helper to generate a unique slug
export const generateUniqueSlug = async (baseText, excludeBlogId = null) => {
  const baseSlug = slugify(baseText, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let count = 1;

  while (true) {
    const query = { slug };
    if (excludeBlogId) {
      query._id = { $ne: excludeBlogId };
    }

    const [existingBlog, existingRedirect] = await Promise.all([
      Blog.findOne(query).select("_id").lean(),
      BlogSlugRedirect.findOne({ oldSlug: slug }).select("_id").lean(),
    ]);

    if (!existingBlog && !existingRedirect) {
      return slug;
    }

    slug = `${baseSlug}-${count}`;
    count++;
  }
};

// Seed default categories if collection is empty
export const seedDefaultCategoriesIfEmpty = async () => {
  const count = await BlogCategory.countDocuments();
  if (count === 0) {
    const defaultCategories = [
      {
        name: "Virtual Office",
        description: "Insights, guides, and compliance for virtual office setups in India.",
        sortOrder: 1,
      },
      {
        name: "Business Setup",
        description: "Company registration, legal structures, and scaling strategies for founders.",
        sortOrder: 2,
      },
      {
        name: "Coworking & Workspace",
        description: "Workspace flexibility, community productivity, and office trends.",
        sortOrder: 3,
      },
      {
        name: "Compliance & Tax",
        description: "GST registration, corporate filings, regulatory updates, and audits.",
        sortOrder: 4,
      },
      {
        name: "Workspace Strategy",
        description: "Optimizing overheads, hybrid office models, and enterprise hubs.",
        sortOrder: 5,
      },
      {
        name: "Entrepreneurship",
        description: "Founder stories, growth playbooks, and startup scaling tips.",
        sortOrder: 6,
      },
    ];

    for (const cat of defaultCategories) {
      const slug = slugify(cat.name, { lower: true, strict: true, trim: true });
      await BlogCategory.create({ ...cat, slug });
    }
    console.log("Seeded default blog categories.");
  }
};

// Public: Get published blogs with filters, search, and pagination
export const getPublicBlogs = async ({
  page = 1,
  limit = 9,
  category = null,
  tag = null,
  search = null,
  sort = "newest",
}) => {
  await seedDefaultCategoriesIfEmpty();

  const now = new Date();
  const query = {
    isDeleted: false,
    status: "published",
    publishedAt: { $lte: now },
  };

  // Category filter by slug or ID
  if (category && category !== "all") {
    const foundCat = await BlogCategory.findOne({
      $or: [{ slug: category }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }],
    }).lean();

    if (foundCat) {
      query.category = foundCat._id;
    }
  }

  // Tag filter
  if (tag) {
    query.tags = tag.toLowerCase().trim();
  }

  // Search filter
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    query.$or = [
      { title: searchRegex },
      { excerpt: searchRegex },
      { tags: searchRegex },
    ];
  }

  // Sorting
  let sortOption = { publishedAt: -1 };
  if (sort === "popular") {
    sortOption = { viewsCount: -1, publishedAt: -1 };
  } else if (sort === "featured") {
    sortOption = { featured: -1, publishedAt: -1 };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .select("-content -seoKeywords -isDeleted -deletedAt")
      .populate("author", "fullName email")
      .populate("category", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Blog.countDocuments(query),
  ]);

  return {
    blogs,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)) || 1,
  };
};

// Public: Get current featured article
export const getFeaturedBlog = async () => {
  const now = new Date();
  const baseQuery = {
    isDeleted: false,
    status: "published",
    publishedAt: { $lte: now },
  };

  let featured = await Blog.findOne({ ...baseQuery, featured: true })
    .select("-content -isDeleted -deletedAt")
    .populate("author", "fullName email")
    .populate("category", "name slug")
    .sort({ publishedAt: -1 })
    .lean();

  // If no blog explicitly marked featured, fallback to latest published
  if (!featured) {
    featured = await Blog.findOne(baseQuery)
      .select("-content -isDeleted -deletedAt")
      .populate("author", "fullName email")
      .populate("category", "name slug")
      .sort({ publishedAt: -1 })
      .lean();
  }

  return featured;
};

// Public: Get published blog by slug (with redirect handling)
export const getPublicBlogBySlug = async (slug) => {
  const now = new Date();
  const cleanSlug = slug.toLowerCase().trim();

  // 1. Direct match
  const blog = await Blog.findOne({
    slug: cleanSlug,
    isDeleted: false,
    status: "published",
    publishedAt: { $lte: now },
  })
    .populate("author", "fullName email")
    .populate("category", "name slug description")
    .lean();

  if (blog) {
    // Atomically increment views count in background
    Blog.updateOne({ _id: blog._id }, { $inc: { viewsCount: 1 } }).exec();
    return { blog, redirected: false };
  }

  // 2. Check slug redirect history
  const redirect = await BlogSlugRedirect.findOne({ oldSlug: cleanSlug }).lean();
  if (redirect) {
    const redirectedBlog = await Blog.findOne({
      _id: redirect.blogId,
      isDeleted: false,
      status: "published",
      publishedAt: { $lte: now },
    })
      .populate("author", "fullName email")
      .populate("category", "name slug")
      .lean();

    if (redirectedBlog) {
      return {
        redirected: true,
        newSlug: redirectedBlog.slug,
        blog: redirectedBlog,
      };
    }
  }

  throw new ApiError(404, "Blog article not found or is not currently published.");
};

// Public: Get related blogs
export const getRelatedBlogs = async (blogId, categoryId, tags = []) => {
  const now = new Date();
  const query = {
    _id: { $ne: blogId },
    isDeleted: false,
    status: "published",
    publishedAt: { $lte: now },
    $or: [
      { category: categoryId },
      ...(tags.length ? [{ tags: { $in: tags } }] : []),
    ],
  };

  const related = await Blog.find(query)
    .select("title slug excerpt coverImage readingTimeMinutes publishedAt category")
    .populate("category", "name slug")
    .sort({ publishedAt: -1 })
    .limit(4)
    .lean();

  // If fewer than 3 related, fill with other recent published posts
  if (related.length < 3) {
    const existingIds = [blogId, ...related.map((r) => r._id)];
    const fillers = await Blog.find({
      _id: { $nin: existingIds },
      isDeleted: false,
      status: "published",
      publishedAt: { $lte: now },
    })
      .select("title slug excerpt coverImage readingTimeMinutes publishedAt category")
      .populate("category", "name slug")
      .sort({ publishedAt: -1 })
      .limit(3 - related.length)
      .lean();

    return [...related, ...fillers];
  }

  return related;
};

// Public & Admin: Get categories with published post counts
export const getBlogCategories = async () => {
  await seedDefaultCategoriesIfEmpty();

  const categories = await BlogCategory.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .lean();

  const now = new Date();
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const count = await Blog.countDocuments({
        category: cat._id,
        isDeleted: false,
        status: "published",
        publishedAt: { $lte: now },
      });
      return { ...cat, postCount: count };
    })
  );

  return categoriesWithCounts;
};

// Public: Get distinct published tags
export const getBlogTags = async () => {
  const now = new Date();
  const tags = await Blog.distinct("tags", {
    isDeleted: false,
    status: "published",
    publishedAt: { $lte: now },
  });
  return tags.filter(Boolean);
};

// Admin: Get all blogs with pagination, status, and category filters
export const getAdminBlogs = async ({
  page = 1,
  limit = 10,
  status = "all",
  category = null,
  search = null,
}) => {
  const query = { isDeleted: false };

  if (status && status !== "all") {
    query.status = status;
  }

  if (category && category !== "all") {
    query.category = category;
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    query.$or = [{ title: searchRegex }, { slug: searchRegex }];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .populate("author", "fullName email")
      .populate("category", "name slug")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Blog.countDocuments(query),
  ]);

  return {
    blogs,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)) || 1,
  };
};

// Admin: Get blog by ID for editing/preview
export const getAdminBlogById = async (id) => {
  const blog = await Blog.findOne({ _id: id, isDeleted: false })
    .populate("author", "fullName email")
    .populate("category", "name slug")
    .lean();

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return blog;
};

// Admin: Create Blog
export const createBlog = async (payload, userId) => {
  const slug = await generateUniqueSlug(payload.slug || payload.title);
  const author = payload.author || userId;

  let publishedAt = null;
  if (payload.status === "published") {
    publishedAt = new Date();
  }

  const blog = await Blog.create({
    ...payload,
    slug,
    author,
    publishedAt,
  });

  await BlogAuditLog.create({
    blogId: blog._id,
    userId,
    action: "created",
    metadata: { title: blog.title, status: blog.status },
  });

  return blog;
};

// Admin: Update Blog (handles slug changes & redirects)
export const updateBlog = async (id, payload, userId) => {
  const blog = await Blog.findOne({ _id: id, isDeleted: false });
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const previousSlug = blog.slug;
  let newSlug = blog.slug;

  // Check if title or custom slug is updated to something different
  if (payload.slug && payload.slug !== blog.slug) {
    newSlug = await generateUniqueSlug(payload.slug, blog._id);
  } else if (!payload.slug && payload.title && payload.title !== blog.title && blog.status === "draft") {
    // Only auto-update slug from title if blog is still a draft
    newSlug = await generateUniqueSlug(payload.title, blog._id);
  }

  // If published post slug changes, record redirect
  if (newSlug !== previousSlug && blog.status === "published") {
    await BlogSlugRedirect.create({
      oldSlug: previousSlug,
      newSlug,
      blogId: blog._id,
    });
  }

  // Handle publishing timestamp
  if (payload.status === "published" && !blog.publishedAt) {
    payload.publishedAt = new Date();
  }

  Object.assign(blog, payload);
  blog.slug = newSlug;
  await blog.save();

  await BlogAuditLog.create({
    blogId: blog._id,
    userId,
    action: payload.status === "published" && blog.status !== "published" ? "published" : "updated",
    metadata: { title: blog.title, status: blog.status, slug: blog.slug },
  });

  return blog;
};

// Admin: Quick Status Change
export const updateBlogStatus = async (id, status, scheduledAt = null, userId) => {
  const blog = await Blog.findOne({ _id: id, isDeleted: false });
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const previousStatus = blog.status;
  blog.status = status;

  if (status === "published" && !blog.publishedAt) {
    blog.publishedAt = new Date();
  }

  if (status === "scheduled") {
    blog.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
  }

  await blog.save();

  await BlogAuditLog.create({
    blogId: blog._id,
    userId,
    action: status === "published" ? "published" : status === "draft" ? "unpublished" : "updated",
    metadata: { previousStatus, newStatus: status },
  });

  return blog;
};

// Admin: Delete Blog (Soft delete by default)
export const deleteBlog = async (id, userId, permanent = false) => {
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (permanent) {
    // Clean up cover image in Cloudinary if present
    if (blog.coverImage?.publicId) {
      deleteImage(blog.coverImage.publicId).catch((err) =>
        console.error("Error deleting image from Cloudinary:", err)
      );
    }
    await BlogSlugRedirect.deleteMany({ blogId: blog._id });
    await Blog.deleteOne({ _id: blog._id });
  } else {
    blog.isDeleted = true;
    blog.deletedAt = new Date();
    await blog.save();
  }

  await BlogAuditLog.create({
    blogId: blog._id,
    userId,
    action: "deleted",
    metadata: { title: blog.title, permanent },
  });

  return { message: "Blog deleted successfully" };
};

// Admin: Dashboard Overview Stats
export const getBlogDashboardStats = async () => {
  const [total, published, drafts, scheduled, archived, totalViewsResult, categoriesCount] =
    await Promise.all([
      Blog.countDocuments({ isDeleted: false }),
      Blog.countDocuments({ isDeleted: false, status: "published" }),
      Blog.countDocuments({ isDeleted: false, status: "draft" }),
      Blog.countDocuments({ isDeleted: false, status: "scheduled" }),
      Blog.countDocuments({ isDeleted: false, status: "archived" }),
      Blog.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: null, totalViews: { $sum: "$viewsCount" } } },
      ]),
      BlogCategory.countDocuments({ isActive: true }),
    ]);

  const totalViews = totalViewsResult[0]?.totalViews || 0;

  return {
    total,
    published,
    drafts,
    scheduled,
    archived,
    totalViews,
    categoriesCount,
  };
};

// Admin: Create Category
export const createBlogCategory = async (payload) => {
  const slug = slugify(payload.name, { lower: true, strict: true, trim: true });
  const existing = await BlogCategory.findOne({
    $or: [{ name: new RegExp(`^${payload.name}$`, "i") }, { slug }],
  });

  if (existing) {
    throw new ApiError(409, "A category with this name or slug already exists");
  }

  return BlogCategory.create({ ...payload, slug });
};

// Admin: Delete Category (Verifies no active blogs depend on it)
export const deleteBlogCategory = async (id) => {
  const blogsCount = await Blog.countDocuments({
    category: id,
    isDeleted: false,
  });

  if (blogsCount > 0) {
    throw new ApiError(
      400,
      `Cannot delete category. There are ${blogsCount} blogs assigned to this category. Please reassign them first.`
    );
  }

  const category = await BlogCategory.findByIdAndDelete(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return { message: "Category deleted successfully" };
};

// Admin: Upload Media
export const uploadBlogMedia = async (file) => {
  if (!file) {
    throw new ApiError(400, "No file provided for upload");
  }

  const result = await uploadImage(file, "ivantage/blogs");
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
};

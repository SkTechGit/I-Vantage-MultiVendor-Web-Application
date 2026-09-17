import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },

    content: {
      type: String,
      required: [true, "Content is required"],
    },

    coverImage: {
      url: {
        type: String,
        required: [true, "Cover image URL is required"],
      },
      publicId: {
        type: String,
        default: "",
      },
      alt: {
        type: String,
        default: "",
      },
      caption: {
        type: String,
        default: "",
      },
    },

    status: {
      type: String,
      enum: ["draft", "published", "scheduled", "archived"],
      default: "draft",
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: [true, "Author is required"],
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: [true, "Category is required"],
      index: true,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    readingTimeMinutes: {
      type: Number,
      default: 1,
    },

    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },

    scheduledAt: {
      type: Date,
      default: null,
      index: true,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    seoTitle: {
      type: String,
      trim: true,
      default: "",
      maxlength: [100, "SEO title cannot exceed 100 characters"],
    },

    seoDescription: {
      type: String,
      trim: true,
      default: "",
      maxlength: [200, "SEO description cannot exceed 200 characters"],
    },

    seoKeywords: {
      type: [String],
      default: [],
    },

    canonicalUrl: {
      type: String,
      trim: true,
      default: "",
    },

    ogTitle: {
      type: String,
      trim: true,
      default: "",
    },

    ogDescription: {
      type: String,
      trim: true,
      default: "",
    },

    ogImage: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate reading time and timestamps
blogSchema.pre("save", function () {
  if (this.isModified("content")) {
    const textOnly = this.content.replace(/<[^>]*>/g, " ");
    const words = textOnly.trim().split(/\s+/).filter(Boolean).length;
    this.readingTimeMinutes = Math.max(1, Math.ceil(words / 200));
  }

  if (this.isModified("status")) {
    if (this.status === "published" && !this.publishedAt) {
      this.publishedAt = new Date();
    }
  }

  if (this.isModified("title") && !this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
});

blogSchema.index({ status: 1, isDeleted: 1, publishedAt: -1 });
blogSchema.index({ featured: 1, status: 1, isDeleted: 1, publishedAt: -1 });
blogSchema.index(
  {
    title: "text",
    excerpt: "text",
    content: "text",
    tags: "text",
  },
  {
    weights: {
      title: 10,
      tags: 5,
      excerpt: 3,
      content: 1,
    },
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;

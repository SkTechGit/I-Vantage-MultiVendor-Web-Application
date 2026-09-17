import mongoose from "mongoose";

const blogSlugRedirectSchema = new mongoose.Schema(
  {
    oldSlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    newSlug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const BlogSlugRedirect = mongoose.model(
  "BlogSlugRedirect",
  blogSlugRedirectSchema
);

export default BlogSlugRedirect;

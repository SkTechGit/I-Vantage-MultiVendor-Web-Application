import mongoose from "mongoose";
import { ARTICLE_STATUS } from "./professionals.constants.js";

const professionalArticleSchema = new mongoose.Schema(
  {
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProfessionalProfile",
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    bodyMd: {
      type: String,
      required: true,
    },
    coverUrl: {
      type: String,
      trim: true,
      default: "",
    },
    coverAlt: {
      type: String,
      trim: true,
      default: "",
    },
    topic: {
      type: String,
      trim: true,
      default: "General",
    },
    readMinutes: {
      type: Number,
      default: 5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(ARTICLE_STATUS),
      default: ARTICLE_STATUS.DRAFT,
      index: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

professionalArticleSchema.index({ professionalId: 1, slug: 1 }, { unique: true });
professionalArticleSchema.index({ status: 1, publishedAt: -1 });

const ProfessionalArticle =
  mongoose.models.ProfessionalArticle ||
  mongoose.model("ProfessionalArticle", professionalArticleSchema);

export default ProfessionalArticle;

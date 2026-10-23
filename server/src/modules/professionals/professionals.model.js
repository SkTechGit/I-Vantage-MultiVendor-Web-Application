import mongoose from "mongoose";
import {
  PROFILE_STATUS,
  VERIFICATION_STATUS,
  CONTACT_MODE,
  CONSULTATION_MODE,
  SERVICE_MODE,
  PRICE_TYPE,
  VIDEO_PLATFORM,
  EXPERIENCE_KIND,
} from "./professionals.constants.js";

/* -------------------------------------------------------------------------- */
/*                            Subdocument Schemas                             */
/* -------------------------------------------------------------------------- */

const serviceSubSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    mode: {
      type: String,
      enum: Object.values(SERVICE_MODE),
      default: SERVICE_MODE.ONLINE,
    },
    priceType: {
      type: String,
      enum: Object.values(PRICE_TYPE),
      default: PRICE_TYPE.QUOTE,
    },
    priceInr: {
      type: Number,
      default: null,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true, timestamps: true }
);

const expertiseSubSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: true, timestamps: true }
);

const videoSubSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: Object.values(VIDEO_PLATFORM),
      default: VIDEO_PLATFORM.YOUTUBE,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    externalId: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true, timestamps: true }
);

const experienceSubSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: Object.values(EXPERIENCE_KIND),
      default: EXPERIENCE_KIND.WORK,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    startYear: {
      type: Number,
    },
    endYear: {
      type: Number,
      default: null, // null indicates "Present"
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: true, timestamps: true }
);

const processStepSubSchema = new mongoose.Schema(
  {
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);

/* -------------------------------------------------------------------------- */
/*                         Main Professional Profile                          */
/* -------------------------------------------------------------------------- */

const professionalProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
      sparse: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProfessionalCategory",
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    headline: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
      maxlength: 400,
      default: "",
    },
    aboutMd: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      trim: true,
      default: "Haryana",
    },
    country: {
      type: String,
      trim: true,
      default: "India",
    },
    languages: {
      type: [String],
      default: ["English", "Hindi"],
    },
    yearsExperience: {
      type: Number,
      default: 0,
      min: 0,
      max: 60,
    },
    qualification: {
      type: String,
      trim: true,
      default: "",
    },
    registrationBody: {
      type: String,
      trim: true,
      default: "",
    },
    registrationNumber: {
      type: String,
      trim: true,
      default: "",
    },
    photoUrl: {
      type: String,
      trim: true,
      default: "",
    },
    photoAlt: {
      type: String,
      trim: true,
      default: "",
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: null,
    },
    websiteUrl: {
      type: String,
      trim: true,
      default: null,
    },
    contactMode: {
      type: String,
      enum: Object.values(CONTACT_MODE),
      default: CONTACT_MODE.HUB,
    },
    contactPhone: {
      type: String,
      trim: true,
      default: null,
    },
    contactWhatsapp: {
      type: String,
      trim: true,
      default: null,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    consultationFeeInr: {
      type: Number,
      default: 1500,
      min: 0,
    },
    consultationHours: {
      type: String,
      trim: true,
      default: "Mon - Sat, 10:00 AM - 7:00 PM",
    },
    responseTimeText: {
      type: String,
      trim: true,
      default: "Usually responds within one business day",
    },
    consultationModes: {
      type: [String],
      enum: Object.values(CONSULTATION_MODE),
      default: [CONSULTATION_MODE.ONLINE, CONSULTATION_MODE.IN_PERSON],
    },
    servesAreas: {
      type: [String],
      default: ["Gurugram", "Delhi", "Noida", "Pan-India"],
    },
    specializations: {
      type: [String],
      default: [],
    },
    industries: {
      type: [String],
      default: [],
    },
    clientTypes: {
      type: [String],
      default: [],
    },
    processSteps: {
      type: [processStepSubSchema],
      default: [],
    },

    /* Embedded child collections */
    services: [serviceSubSchema],
    expertise: [expertiseSubSchema],
    videos: [videoSubSchema],
    experience: [experienceSubSchema],

    /* Lifecycle & Governance */
    status: {
      type: String,
      enum: Object.values(PROFILE_STATUS),
      default: PROFILE_STATUS.DRAFT,
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.UNVERIFIED,
      index: true,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    featuredRank: {
      type: Number,
      default: null,
    },
    completeness: {
      type: Number,
      default: 0,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },
    internalNotes: {
      type: String,
      trim: true,
      default: null,
    },
    version: {
      type: Number,
      default: 1,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* -------------------------------------------------------------------------- */
/*                                   Indexes                                  */
/* -------------------------------------------------------------------------- */

// Compound index for public discovery query
professionalProfileSchema.index({
  status: 1,
  categoryId: 1,
  isFeatured: -1,
  featuredRank: 1,
  deletedAt: 1,
});

// Full-text search index
professionalProfileSchema.index(
  {
    fullName: "text",
    headline: "text",
    specializations: "text",
    city: "text",
    summary: "text",
  },
  {
    weights: {
      fullName: 10,
      headline: 5,
      specializations: 3,
      city: 2,
      summary: 1,
    },
    name: "ProfessionalsSearchTextIndex",
  }
);

const ProfessionalProfile =
  mongoose.models.ProfessionalProfile ||
  mongoose.model("ProfessionalProfile", professionalProfileSchema);

export default ProfessionalProfile;

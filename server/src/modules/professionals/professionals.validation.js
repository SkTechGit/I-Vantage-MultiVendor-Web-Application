import { z } from "zod";
import {
  CONSULTATION_MODE,
  SERVICE_MODE,
  PRICE_TYPE,
  VIDEO_PLATFORM,
  EXPERIENCE_KIND,
} from "./professionals.constants.js";

/* -------------------------------------------------------------------------- */
/*                              Helpers & RegEx                               */
/* -------------------------------------------------------------------------- */

export const phoneIN = z
  .string()
  .trim()
  .regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number")
  .transform((v) => {
    const digits = v.replace(/\D/g, "").slice(-10);
    return `+91${digits}`;
  });

/* -------------------------------------------------------------------------- */
/*                            Enquiry Lead Schema                             */
/* -------------------------------------------------------------------------- */

export const createEnquirySchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
    phone: phoneIN,
    email: z.string().trim().toLowerCase().email("Please enter a valid email address").max(254),
    serviceId: z.string().optional().nullable(),
    mode: z.enum([CONSULTATION_MODE.ONLINE, CONSULTATION_MODE.IN_PERSON, CONSULTATION_MODE.PHONE]).optional(),
    preferredDate: z.string().optional().nullable(),
    message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
    consent: z.literal(true, {
      errorMap: () => ({ message: "You must accept the privacy policy to proceed" }),
    }),
    website: z.string().max(0, "Bot detected").optional().nullable(), // Honeypot field
    sourcePath: z.string().max(200).optional(),
  });

/* -------------------------------------------------------------------------- */
/*                            Child Entity Schemas                            */
/* -------------------------------------------------------------------------- */

export const serviceSchema = z.object({
  title: z.string().trim().min(3).max(80),
  description: z.string().max(300).optional().default(""),
  mode: z.enum([SERVICE_MODE.ONLINE, SERVICE_MODE.IN_PERSON, SERVICE_MODE.ONLINE_IN_PERSON]).default(SERVICE_MODE.ONLINE),
  priceType: z.enum([PRICE_TYPE.FROM, PRICE_TYPE.QUOTE]).default(PRICE_TYPE.QUOTE),
  priceInr: z.number().int().min(0).max(10000000).optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().optional().default(0),
});

export const expertiseSchema = z.object({
  title: z.string().trim().min(2).max(80),
  description: z.string().max(250).optional().default(""),
  sortOrder: z.number().optional().default(0),
});

export const videoSchema = z.object({
  platform: z.enum([VIDEO_PLATFORM.YOUTUBE, VIDEO_PLATFORM.INSTAGRAM, VIDEO_PLATFORM.OTHER]).default(VIDEO_PLATFORM.YOUTUBE),
  url: z.string().url(),
  title: z.string().trim().min(3).max(120),
  description: z.string().max(300).optional().default(""),
  thumbnailUrl: z.string().optional().default(""),
  sortOrder: z.number().optional().default(0),
});

export const experienceSchema = z.object({
  kind: z.enum([EXPERIENCE_KIND.WORK, EXPERIENCE_KIND.EDUCATION, EXPERIENCE_KIND.CERTIFICATION]),
  title: z.string().trim().min(2).max(120),
  organization: z.string().max(120).optional().default(""),
  location: z.string().max(100).optional().default(""),
  startYear: z.number().int().min(1960).max(new Date().getFullYear()),
  endYear: z.number().int().min(1960).max(new Date().getFullYear() + 10).optional().nullable(),
  description: z.string().max(400).optional().default(""),
  sortOrder: z.number().optional().default(0),
});

/* -------------------------------------------------------------------------- */
/*                           Profile Update Schemas                           */
/* -------------------------------------------------------------------------- */

export const contentUpdateSchema = z
  .object({
    headline: z.string().trim().min(2).max(150).optional(),
    summary: z.string().max(400).optional(),
    aboutMd: z.string().max(3000).optional(),
    city: z.string().max(60).optional(),
    state: z.string().max(60).optional(),
    photoUrl: z.string().url().or(z.literal("")).optional(),
    photoAlt: z.string().max(100).optional(),
    coverUrl: z.string().url().or(z.literal("")).optional(),
    coverAlt: z.string().max(100).optional(),
    languages: z.array(z.string().max(30)).max(8).optional(),
    yearsExperience: z.number().int().min(0).max(60).optional(),
    consultationModes: z
      .array(z.enum([CONSULTATION_MODE.ONLINE, CONSULTATION_MODE.IN_PERSON, CONSULTATION_MODE.PHONE]))
      .min(1)
      .optional(),
    consultationHours: z.string().max(80).optional(),
    responseTimeText: z.string().max(80).optional(),
    consultationFeeInr: z.number().int().min(0).max(1000000).optional().nullable(),
    servesAreas: z.array(z.string().max(40)).max(12).optional(),
    specializations: z.array(z.string().max(40)).max(12).optional(),
    industries: z.array(z.string().max(40)).max(12).optional(),
    clientTypes: z.array(z.string().max(40)).max(12).optional(),
    processSteps: z
      .array(
        z.object({
          stepNumber: z.number(),
          title: z.string().max(40),
          description: z.string().max(200),
        })
      )
      .max(4)
      .optional(),
    services: z.array(serviceSchema).max(30).optional(),
    expertise: z.array(expertiseSchema).max(30).optional(),
    videos: z.array(videoSchema).max(10).optional(),
    experience: z.array(experienceSchema).max(20).optional(),
    linkedinUrl: z.string().url().optional().nullable(),
    websiteUrl: z.string().url().optional().nullable(),
    contactPhone: z.string().optional().nullable(),
    contactWhatsapp: z.string().optional().nullable(),
    contactEmail: z.string().email().optional().nullable(),
    designation: z.string().max(100).optional(),
    enrollmentDate: z.string().max(50).optional(),
    copNumber: z.string().max(60).optional(),
    copValidity: z.string().max(50).optional(),
    firmRegistrationNumber: z.string().max(60).optional(),
    regionalCouncil: z.string().max(100).optional(),
    officeAddress: z.string().max(250).optional(),
    pincode: z.string().max(10).optional(),
    isRemoteFriendly: z.boolean().optional(),
    willingToTravel: z.boolean().optional(),
    bookingUrl: z.string().url().or(z.literal("")).optional().nullable(),
    caConnectUrl: z.string().url().or(z.literal("")).optional().nullable(),
    signatureUrl: z.string().optional().nullable(),
    feeModel: z.string().max(50).optional(),
    consultationFeeMaxInr: z.number().int().min(0).max(1000000).optional().nullable(),
    consultationDurationMinutes: z.number().int().min(10).max(180).optional(),
    freeFirstConsultation: z.boolean().optional(),
    gstApplicable: z.boolean().optional(),
    retainerScopeText: z.string().max(1000).optional(),
    acceptedPaymentMethods: z.array(z.string().max(40)).optional(),
    cancellationPolicyText: z.string().max(500).optional(),
    gstin: z.string().max(20).optional(),
    gstinStatus: z.string().max(20).optional(),
    panMasked: z.string().max(20).optional(),
    citrNumber: z.string().max(60).optional(),
    udinEnabled: z.boolean().optional(),
    aadhaarSeeded: z.boolean().optional(),
    pfEsicRegistration: z.string().max(60).optional(),
    shopEstLicense: z.string().max(60).optional(),
    udyamNumber: z.string().max(60).optional(),
    empanelments: z.array(z.string().max(100)).optional(),
    documents: z.array(z.any()).optional(),
    version: z.number().int().optional(),
  });

export const identityUpdateSchema = z.object({
  fullName: z.string().trim().min(2).max(100).optional(),
  categoryId: z.string().optional(),
  headline: z.string().trim().min(5).max(150).optional(),
  photoUrl: z.string().url().optional(),
  photoAlt: z.string().max(100).optional(),
  qualification: z.string().max(120).optional(),
  registrationBody: z.string().max(100).optional(),
  registrationNumber: z.string().max(100).optional(),
});

export const articleSchema = z.object({
  title: z.string().trim().min(5).max(160),
  topic: z.string().trim().max(50).default("General"),
  excerpt: z.string().max(300).optional().default(""),
  bodyMd: z.string().min(50),
  coverUrl: z.string().optional().default(""),
  coverAlt: z.string().max(100).optional().default(""),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  label: z.string().trim().min(2).max(60),
  description: z.string().max(200).optional().default(""),
  iconKey: z.string().max(40).optional().default("Briefcase"),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

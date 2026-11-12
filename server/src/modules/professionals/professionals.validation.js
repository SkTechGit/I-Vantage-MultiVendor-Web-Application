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
    fullName: z.string().trim().max(100).optional(),
    qualification: z.string().max(120).optional().default(""),
    registrationBody: z.string().max(120).optional().default(""),
    registrationNumber: z.string().max(100).optional().default(""),
    headline: z.string().trim().max(150).optional().default(""),
    summary: z.string().max(600).optional().default(""),
    aboutMd: z.string().max(10000).optional().default(""),
    city: z.string().max(80).optional().default(""),
    state: z.string().max(80).optional().default(""),
    photoUrl: z.string().optional().nullable(),
    photoAlt: z.string().max(150).optional().nullable(),
    coverUrl: z.string().optional().nullable(),
    coverAlt: z.string().max(150).optional().nullable(),
    languages: z.array(z.string().max(40)).optional().default([]),
    yearsExperience: z.number().int().min(0).max(60).optional().nullable(),
    consultationModes: z.array(z.string()).optional().default([]),
    consultationHours: z.string().max(120).optional().default(""),
    responseTimeText: z.string().max(120).optional().default(""),
    consultationFeeInr: z.number().min(0).max(10000000).optional().nullable(),
    servesAreas: z.array(z.string().max(60)).optional().default([]),
    specializations: z.array(z.string().max(80)).optional().default([]),
    industries: z.array(z.string().max(80)).optional().default([]),
    clientTypes: z.array(z.string().max(80)).optional().default([]),
    processSteps: z
      .array(
        z.object({
          stepNumber: z.number(),
          title: z.string().max(60),
          description: z.string().max(300),
        })
      )
      .max(10)
      .optional(),
    services: z.array(serviceSchema).max(50).optional(),
    expertise: z.array(expertiseSchema).max(50).optional(),
    videos: z.array(videoSchema).max(20).optional(),
    experience: z.array(experienceSchema).max(30).optional(),
    linkedinUrl: z.string().optional().nullable(),
    websiteUrl: z.string().optional().nullable(),
    contactPhone: z.string().optional().nullable(),
    contactWhatsapp: z.string().optional().nullable(),
    contactEmail: z.string().optional().nullable(),
    firmName: z.string().max(160).optional().default(""),
    designation: z.string().max(120).optional().default(""),
    enrollmentDate: z.string().max(60).optional().default(""),
    copNumber: z.string().max(80).optional().default(""),
    copValidity: z.string().max(60).optional().default(""),
    firmRegistrationNumber: z.string().max(80).optional().default(""),
    regionalCouncil: z.string().max(120).optional().default(""),
    officeAddress: z.string().max(300).optional().default(""),
    pincode: z.string().max(20).optional().default(""),
    isRemoteFriendly: z.boolean().optional(),
    willingToTravel: z.boolean().optional(),
    bookingUrl: z.string().optional().nullable(),
    caConnectUrl: z.string().optional().nullable(),
    signatureUrl: z.string().optional().nullable(),
    feeModel: z.string().max(60).optional(),
    consultationFeeMaxInr: z.number().min(0).max(10000000).optional().nullable(),
    consultationDurationMinutes: z.number().int().min(5).max(300).optional(),
    freeFirstConsultation: z.boolean().optional(),
    gstApplicable: z.boolean().optional(),
    retainerScopeText: z.string().max(2000).optional().default(""),
    acceptedPaymentMethods: z.array(z.string().max(50)).optional(),
    cancellationPolicyText: z.string().max(1000).optional().default(""),
    gstin: z.string().max(30).optional().default(""),
    gstinStatus: z.string().max(30).optional().default(""),
    panMasked: z.string().max(30).optional().default(""),
    citrNumber: z.string().max(80).optional().default(""),
    udinEnabled: z.boolean().optional(),
    aadhaarSeeded: z.boolean().optional(),
    pfEsicRegistration: z.string().max(80).optional().default(""),
    shopEstLicense: z.string().max(80).optional().default(""),
    udyamNumber: z.string().max(80).optional().default(""),
    empanelments: z.array(z.string().max(120)).optional().default([]),
    documents: z.array(z.any()).optional(),
    categoryId: z.string().optional(),
    portfolioFileUrl: z.string().optional().nullable(),
    portfolioFileName: z.string().max(250).optional().nullable(),
    portfolioFileSize: z.number().optional().nullable(),
    portfolioTitle: z.string().max(250).optional().nullable(),
    portfolioDescription: z.string().max(2000).optional().nullable(),
    portfolioExternalUrl: z.string().optional().nullable(),
    portfolioUploadedAt: z.any().optional().nullable(),
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

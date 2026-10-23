/* -------------------------------------------------------------------------- */
/*             i-VANTAGE Professionals Network: Domain Constants              */
/* -------------------------------------------------------------------------- */

export const PROFILE_STATUS = {
  DRAFT: "DRAFT",
  PENDING_REVIEW: "PENDING_REVIEW",
  PUBLISHED: "PUBLISHED",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
  ARCHIVED: "ARCHIVED",
};

export const VERIFICATION_STATUS = {
  UNVERIFIED: "UNVERIFIED",
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
};

export const CONTACT_MODE = {
  HUB: "hub",
  DIRECT: "direct",
};

export const CONSULTATION_MODE = {
  ONLINE: "ONLINE",
  IN_PERSON: "IN_PERSON",
  PHONE: "PHONE",
};

export const SERVICE_MODE = {
  ONLINE: "ONLINE",
  IN_PERSON: "IN_PERSON",
  ONLINE_IN_PERSON: "ONLINE_IN_PERSON",
};

export const PRICE_TYPE = {
  FROM: "FROM",
  QUOTE: "QUOTE",
};

export const ARTICLE_STATUS = {
  DRAFT: "DRAFT",
  PENDING_REVIEW: "PENDING_REVIEW",
  PUBLISHED: "PUBLISHED",
  REJECTED: "REJECTED",
  UNPUBLISHED: "UNPUBLISHED",
};

export const VIDEO_PLATFORM = {
  YOUTUBE: "YOUTUBE",
  INSTAGRAM: "INSTAGRAM",
  OTHER: "OTHER",
};

export const EXPERIENCE_KIND = {
  WORK: "WORK",
  EDUCATION: "EDUCATION",
  CERTIFICATION: "CERTIFICATION",
};

export const REVISION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SUPERSEDED: "SUPERSEDED",
};

export const ENQUIRY_STATUS = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  IN_PROGRESS: "IN_PROGRESS",
  CONVERTED: "CONVERTED",
  CLOSED: "CLOSED",
  SPAM: "SPAM",
};

export const INVITE_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REVOKED: "REVOKED",
  EXPIRED: "EXPIRED",
};

export const APPLICATION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

/* -------------------------------------------------------------------------- */
/*                               Domain Limits                                */
/* -------------------------------------------------------------------------- */

export const LIMITS = {
  MAX_SERVICES: 20,
  MAX_EXPERTISE: 12,
  MAX_VIDEOS: 8,
  MAX_EXPERIENCE: 20,
  MAX_ARTICLES: 100,
  MAX_ABOUT_CHARS: 3000,
  MAX_SUMMARY_CHARS: 400,
  MAX_SPECIALIZATIONS: 12,
  MAX_LANGUAGES: 8,
  MAX_PROCESS_STEPS: 4,
};

/* -------------------------------------------------------------------------- */
/*                          Seed Categories (Default)                         */
/* -------------------------------------------------------------------------- */

export const DEFAULT_PROFESSIONAL_CATEGORIES = [
  {
    slug: "chartered-accountant",
    name: "Chartered Accountants",
    label: "Chartered Accountant",
    description: "Verified CAs for audits, startup taxation, regulatory filings, and virtual CFO.",
    iconKey: "Calculator",
    sortOrder: 1,
    isActive: true,
  },
  {
    slug: "tax-gst-consultant",
    name: "Tax & GST Consultants",
    label: "Tax & GST Consultant",
    description: "Specialists in direct tax, GST registrations, monthly returns, and notices.",
    iconKey: "Receipt",
    sortOrder: 2,
    isActive: true,
  },
  {
    slug: "legal-consultant",
    name: "Legal Consultants",
    label: "Legal Consultant",
    description: "Corporate advocates for agreements, intellectual property, contracts, and ROC.",
    iconKey: "Scale",
    sortOrder: 3,
    isActive: true,
  },
];

/* -------------------------------------------------------------------------- */
/*                         Default Process Steps (F4)                         */
/* -------------------------------------------------------------------------- */

export const DEFAULT_PROCESS_STEPS = [
  {
    stepNumber: 1,
    title: "Understand",
    description: "A focused discovery call to understand your business model, current filings, and immediate deadlines.",
  },
  {
    stepNumber: 2,
    title: "Plan",
    description: "A written scope with timelines, document checklist, and transparent fees — before any work begins.",
  },
  {
    stepNumber: 3,
    title: "Execute",
    description: "Filings and reconciliations handled end-to-end, with clear status updates at each step.",
  },
  {
    stepNumber: 4,
    title: "Review",
    description: "Periodic check-ins so compliance stays ahead of deadlines as your business grows.",
  },
];

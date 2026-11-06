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
    description: "Verified CAs for audits, direct taxation, regulatory filings, and virtual CFO.",
    iconKey: "Calculator",
    sortOrder: 1,
    isActive: true,
  },
  {
    slug: "tax-gst-consultant",
    name: "Tax & GST Consultants",
    label: "Tax & GST Consultant",
    description: "Specialists in direct tax, GST registrations, monthly returns, appeals, and notice management.",
    iconKey: "Receipt",
    sortOrder: 2,
    isActive: true,
  },
  {
    slug: "legal-consultant",
    name: "Legal Consultants & Advocates",
    label: "Legal Consultant",
    description: "Corporate advocates for agreements, intellectual property, contracts, litigation, and ROC.",
    iconKey: "Scale",
    sortOrder: 3,
    isActive: true,
  },
  {
    slug: "hr-professional",
    name: "HR Professionals & Advisors",
    label: "HR Professional",
    description: "Specialists in talent strategy, payroll compliance, labor laws, POSH policies, and HR systems.",
    iconKey: "Users",
    sortOrder: 4,
    isActive: true,
  },
  {
    slug: "company-secretary",
    name: "Company Secretaries (CS)",
    label: "Company Secretary (CS)",
    description: "ROC filings, secretarial audits, MCA compliance, board governance, and SEBI regulations.",
    iconKey: "Building",
    sortOrder: 5,
    isActive: true,
  },
  {
    slug: "cost-management-accountant",
    name: "Cost & Management Accountants (CMA)",
    label: "Cost & Management Accountant (CMA)",
    description: "Cost audit, pricing strategy, inventory valuation, operational efficiency, and internal financial controls.",
    iconKey: "BarChart3",
    sortOrder: 6,
    isActive: true,
  },
  {
    slug: "virtual-cfo-advisor",
    name: "Virtual CFOs & Financial Advisors",
    label: "Virtual CFO & Financial Advisor",
    description: "Strategic financial planning, startup fundraising modeling, treasury management, and MIS reporting.",
    iconKey: "Briefcase",
    sortOrder: 7,
    isActive: true,
  },
  {
    slug: "ip-trademark-attorney",
    name: "IP & Trademark Attorneys",
    label: "IP & Trademark Attorney",
    description: "Brand trademark registration, patent prosecution, copyright protection, and IP portfolio defense.",
    iconKey: "ShieldAlert",
    sortOrder: 8,
    isActive: true,
  },
  {
    slug: "startup-valuation-expert",
    name: "Startup Valuation & M&A Specialists",
    label: "Startup Valuation & M&A Specialist",
    description: "IBBI registered valuations, 409A / FEMA / DCF modeling, due diligence, and term sheet structuring.",
    iconKey: "Sparkles",
    sortOrder: 9,
    isActive: true,
  },
  {
    slug: "insolvency-professional",
    name: "Insolvency Professionals (IBBI)",
    label: "Insolvency Professional (IBBI)",
    description: "Insolvency resolution (IBC), CIRP liquidation proceedings, debt restructuring, and NCLT representation.",
    iconKey: "Landmark",
    sortOrder: 10,
    isActive: true,
  },
  {
    slug: "labor-law-posh-consultant",
    name: "Labor Law & POSH Consultants",
    label: "Labor Law & POSH Consultant",
    description: "Factory Act statutory filings, PF/ESIC compliance audits, POSH committee formulation, and workplace policies.",
    iconKey: "ShieldCheck",
    sortOrder: 11,
    isActive: true,
  },
  {
    slug: "fema-foreign-trade-consultant",
    name: "FEMA & Foreign Trade Consultants",
    label: "FEMA & Foreign Trade Consultant",
    description: "Cross-border transaction structuring, RBI FEMA filings, FDI/ODI compliances, and import-export advisory.",
    iconKey: "Globe",
    sortOrder: 12,
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

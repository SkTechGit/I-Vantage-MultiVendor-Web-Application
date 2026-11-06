import ProfessionalCategory from "./professionals.category.model.js";
import ProfessionalProfile from "./professionals.model.js";
import ProfessionalArticle from "./professionals.article.model.js";
import {
  PROFILE_STATUS,
  VERIFICATION_STATUS,
  CONTACT_MODE,
  CONSULTATION_MODE,
  SERVICE_MODE,
  PRICE_TYPE,
  VIDEO_PLATFORM,
  EXPERIENCE_KIND,
  ARTICLE_STATUS,
  DEFAULT_PROFESSIONAL_CATEGORIES,
  DEFAULT_PROCESS_STEPS,
} from "./professionals.constants.js";

export const seedProfessionals = async () => {
  try {
    // 1. Seed / Upsert Categories
    const categoryMap = {};
    for (const catData of DEFAULT_PROFESSIONAL_CATEGORIES) {
      let cat = await ProfessionalCategory.findOne({ slug: catData.slug });
      if (!cat) {
        cat = await ProfessionalCategory.create(catData);
      } else {
        await ProfessionalCategory.updateOne(
          { _id: cat._id },
          {
            $set: {
              name: catData.name,
              label: catData.label,
              description: catData.description,
              iconKey: catData.iconKey,
              sortOrder: catData.sortOrder,
              isActive: catData.isActive,
            },
          }
        );
      }
      categoryMap[catData.slug] = cat._id;
    }

    // 2. Check if Rahul Sharma already exists
    const existingRahul = await ProfessionalProfile.findOne({ slug: "rahul-sharma-ca" });
    if (existingRahul) {
      return; // Already seeded
    }

    const caCatId = categoryMap["chartered-accountant"];
    const taxCatId = categoryMap["tax-gst-consultant"];
    const legalCatId = categoryMap["legal-consultant"];

    // 3. Create Rahul Sharma Profile
    const rahul = await ProfessionalProfile.create({
      slug: "rahul-sharma-ca",
      categoryId: caCatId,
      status: PROFILE_STATUS.PUBLISHED,
      verificationStatus: VERIFICATION_STATUS.VERIFIED,
      verifiedAt: new Date("2026-08-15"),
      isFeatured: true,
      featuredRank: 1,
      fullName: "Rahul Sharma",
      headline: "Chartered Accountant | Tax & Business Advisory",
      summary:
        "Helping startups, founders, and growing businesses manage taxation, compliance, financial reporting, and business registrations.",
      aboutMd:
        "Rahul is a Chartered Accountant who works with early-stage startups, founder-led companies, and growing SMEs across the NCR. His practice focuses on getting the financial foundations right — clean books, timely compliance, and tax structures that scale with the business.\n\nBefore starting his independent practice at i-VANTAGE Business Hub, he spent several years in the audit and tax teams of mid-sized advisory firms, working with clients in technology, D2C retail, and professional services.",
      city: "Gurugram",
      state: "Haryana",
      country: "India",
      languages: ["English", "Hindi"],
      yearsExperience: 8,
      qualification: "Chartered Accountant (ICAI), B.Com (Hons)",
      registrationBody: "Institute of Chartered Accountants of India (ICAI)",
      registrationNumber: "ICAI-409812",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      photoAlt: "Rahul Sharma - Chartered Accountant",
      contactMode: CONTACT_MODE.HUB,
      consultationFeeInr: 1500,
      consultationHours: "Mon - Sat, 10:00 AM - 7:00 PM",
      responseTimeText: "Usually responds within one business day",
      consultationModes: [CONSULTATION_MODE.ONLINE, CONSULTATION_MODE.IN_PERSON, CONSULTATION_MODE.PHONE],
      servesAreas: ["Gurugram", "Delhi", "Noida", "Faridabad", "Pan-India (online)"],
      specializations: [
        "Startup taxation",
        "GST compliance",
        "Company incorporation",
        "Virtual CFO support",
        "Statutory Audit",
        "Direct Tax",
      ],
      industries: ["SaaS & Technology", "D2C & E-commerce", "Professional Services", "Manufacturing SMEs"],
      clientTypes: ["Early-stage startups", "Founders & Freelancers", "Growing SMEs", "NRIs with India income"],
      processSteps: DEFAULT_PROCESS_STEPS,
      completeness: 95,
      version: 1,
      publishedAt: new Date("2026-09-01"),

      // Services
      services: [
        {
          title: "GST Registration and Compliance",
          slug: "gst-registration-and-compliance",
          description: "New GST registration, monthly and quarterly return filing, and input tax credit reconciliation.",
          mode: SERVICE_MODE.ONLINE,
          priceType: PRICE_TYPE.FROM,
          priceInr: 2499,
          sortOrder: 1,
          isActive: true,
        },
        {
          title: "Income Tax Return Filing",
          slug: "income-tax-return-filing",
          description: "ITR filing for individuals, professionals, and companies with advance tax planning.",
          mode: SERVICE_MODE.ONLINE,
          priceType: PRICE_TYPE.FROM,
          priceInr: 1999,
          sortOrder: 2,
          isActive: true,
        },
        {
          title: "Company Registration Assistance",
          slug: "company-registration-assistance",
          description: "End-to-end incorporation for Private Limited, LLP, and OPC including name approval and SPICe+ filing.",
          mode: SERVICE_MODE.ONLINE_IN_PERSON,
          priceType: PRICE_TYPE.FROM,
          priceInr: 7999,
          sortOrder: 3,
          isActive: true,
        },
        {
          title: "Accounting and Bookkeeping",
          slug: "accounting-and-bookkeeping",
          description: "Monthly ledger maintenance, balance sheet preparation, and MIS reporting on Tally and Zoho Books.",
          mode: SERVICE_MODE.ONLINE,
          priceType: PRICE_TYPE.QUOTE,
          priceInr: null,
          sortOrder: 4,
          isActive: true,
        },
        {
          title: "Tax Planning and Advisory",
          slug: "tax-planning-and-advisory",
          description: "Strategic corporate tax planning, transfer pricing advice, and capital gains advisory.",
          mode: SERVICE_MODE.ONLINE_IN_PERSON,
          priceType: PRICE_TYPE.QUOTE,
          priceInr: null,
          sortOrder: 5,
          isActive: true,
        },
        {
          title: "Startup Compliance Support",
          slug: "startup-compliance-support",
          description: "Annual statutory filings, ROC returns, DPIIT recognition support, and board resolution records.",
          mode: SERVICE_MODE.ONLINE_IN_PERSON,
          priceType: PRICE_TYPE.FROM,
          priceInr: 4999,
          sortOrder: 6,
          isActive: true,
        },
      ],

      // Expertise
      expertise: [
        {
          title: "GST and Indirect Taxation",
          description: "Registrations, returns, ITC, and response to department notices.",
          sortOrder: 1,
        },
        {
          title: "Startup Compliance",
          description: "ROC, statutory registers, and annual filings for Pvt Ltd and LLP.",
          sortOrder: 2,
        },
        {
          title: "Financial Reporting",
          description: "Monthly MIS, cash-flow forecasting, and year-end financials.",
          sortOrder: 3,
        },
        {
          title: "Income Tax",
          description: "Returns, advance tax calculations, and scrutiny assessments.",
          sortOrder: 4,
        },
        {
          title: "Business Registration",
          description: "Pvt Ltd, LLP, OPC, and partnership formations.",
          sortOrder: 5,
        },
        {
          title: "Accounting Systems",
          description: "Tally, Zoho Books, QuickBooks migration, and process setup.",
          sortOrder: 6,
        },
      ],

      // Videos
      videos: [
        {
          platform: VIDEO_PLATFORM.YOUTUBE,
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          externalId: "dQw4w9WgXcQ",
          title: "GST Registration Explained Step by Step",
          description: "A complete walkthrough of the documentation and portal process for new GST registrants.",
          thumbnailUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
          sortOrder: 1,
          isActive: true,
        },
        {
          platform: VIDEO_PLATFORM.INSTAGRAM,
          url: "https://www.instagram.com/reel/example",
          externalId: "",
          title: "3 GST Mistakes Startups Make",
          description: "Key pitfalls in input tax credit claiming that trigger automatic audit notices.",
          thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
          sortOrder: 2,
          isActive: true,
        },
        {
          platform: VIDEO_PLATFORM.YOUTUBE,
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          externalId: "dQw4w9WgXcQ",
          title: "Common Tax Filing Mistakes and How to Avoid Them",
          description: "How early-stage founders can save thousands by planning advance tax and expense deductions properly.",
          thumbnailUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80",
          sortOrder: 3,
          isActive: true,
        },
      ],

      // Experience & Education
      experience: [
        {
          kind: EXPERIENCE_KIND.WORK,
          title: "Independent Practice",
          organization: "i-VANTAGE Business Hub, Gurugram",
          location: "Gurugram, Haryana",
          startYear: 2022,
          endYear: null, // Present
          description: "Advising startups, SMEs, and digital entrepreneurs on direct and indirect taxation.",
          sortOrder: 1,
        },
        {
          kind: EXPERIENCE_KIND.WORK,
          title: "Tax Manager",
          organization: "Mid-sized advisory firm",
          location: "New Delhi",
          startYear: 2019,
          endYear: 2022,
          description: "Led corporate tax audit and compliance for mid-cap manufacturing and technology clients.",
          sortOrder: 2,
        },
        {
          kind: EXPERIENCE_KIND.WORK,
          title: "Audit Associate",
          organization: "Chartered accountancy firm",
          location: "New Delhi",
          startYear: 2016,
          endYear: 2019,
          description: "Handled statutory audits, bank audits, and internal controls testing.",
          sortOrder: 3,
        },
        {
          kind: EXPERIENCE_KIND.EDUCATION,
          title: "Chartered Accountant",
          organization: "Institute of Chartered Accountants of India (ICAI)",
          location: "India",
          startYear: 2018,
          endYear: 2018,
          description: "Qualified Chartered Accountant.",
          sortOrder: 4,
        },
        {
          kind: EXPERIENCE_KIND.EDUCATION,
          title: "B.Com (Honours)",
          organization: "University of Delhi",
          location: "New Delhi",
          startYear: 2011,
          endYear: 2014,
          description: "Graduated with First Class Honours in Commerce and Finance.",
          sortOrder: 5,
        },
        {
          kind: EXPERIENCE_KIND.CERTIFICATION,
          title: "Certificate Course on GST",
          organization: "Professional development programme",
          location: "India",
          startYear: 2019,
          endYear: 2019,
          description: "Specialized certification in GST appeals, assessments, and ITC reconciliations.",
          sortOrder: 6,
        },
      ],
    });

    // Seed Rahul Sharma's Articles
    await ProfessionalArticle.create([
      {
        professionalId: rahul._id,
        slug: "common-tax-filing-mistakes-small-businesses-should-avoid",
        title: "Common Tax Filing Mistakes Small Businesses Should Avoid",
        topic: "Income Tax",
        readMinutes: 6,
        excerpt:
          "Many small business owners inadvertently pay excess taxes or trigger notices by misclassifying capital expenses.",
        bodyMd: `## Introduction

Filing corporate and individual taxes in India is increasingly automated, but common errors in expense reporting and reconciliation can cause significant headaches.

### 1. Incomplete GST Reconciliation
Under current tax rules, input tax credit must match with GSTR-2B. Never claim unreflected credits without supporting documentation.

### 2. Disregarding Advance Tax Installments
Penal interest under sections 234B and 234C accumulates rapidly if advance tax is not paid in accordance with the quarterly calendar.

### 3. Personal and Business Expense Mixing
Always maintain a strictly separate corporate current account for business operations.`,
        coverUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
        coverAlt: "Tax filing calculations",
        status: ARTICLE_STATUS.PUBLISHED,
        publishedAt: new Date("2026-08-27"),
      },
      {
        professionalId: rahul._id,
        slug: "essential-financial-records-every-founder-should-maintain",
        title: "Essential Financial Records Every Founder Should Maintain",
        topic: "Accounting",
        readMinutes: 5,
        excerpt:
          "From vendor invoices to statutory registers, here is the essential documentation roadmap for growing startups.",
        bodyMd: `## Why Documentation Matters

When you prepare for due diligence or external debt funding, clean books and verifiable records save weeks of back-and-forth.

### Core Documentation Checklist
- Board resolutions and minutes binder
- Vendor purchase orders and signed receipts
- Monthly bank reconciliation statements
- Statutory compliance challans (PF, ESIC, TDS, GST)`,
        coverUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
        coverAlt: "Financial documents",
        status: ARTICLE_STATUS.PUBLISHED,
        publishedAt: new Date("2026-07-14"),
      },
      {
        professionalId: rahul._id,
        slug: "gst-compliance-checklist-for-indian-startups",
        title: "GST Compliance Checklist for Indian Startups",
        topic: "GST",
        readMinutes: 7,
        isFeatured: true,
        excerpt:
          "A comprehensive month-by-month compliance handbook for online and physical businesses operating in India.",
        bodyMd: `## Monthly GST Routine

Navigating the GST regime requires consistent monthly discipline. Here is how founders can structure their accounts to never miss a filing deadline.

### Key Deadlines
- **GSTR-1:** 11th of every month (outward supplies)
- **GSTR-3B:** 20th of every month (tax payment & summary)
- **Annual Return (GSTR-9):** 31st December following financial year`,
        coverUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        coverAlt: "GST compliance handbook",
        status: ARTICLE_STATUS.PUBLISHED,
        publishedAt: new Date("2026-09-18"),
      },
      {
        professionalId: rahul._id,
        slug: "company-registration-documents-and-steps-to-know",
        title: "Company Registration: Documents and Steps to Know",
        topic: "Business Setup",
        readMinutes: 8,
        excerpt:
          "Everything you need to know about registering a Private Limited company or LLP under the Ministry of Corporate Affairs.",
        bodyMd: `## Getting Incorporated

Choosing the right business structure is the first vital decision for every founding team.

### Steps to Incorporate
1. Digital Signature Certificate (DSC) application
2. RUN name approval or direct SPICe+ Part A
3. SPICe+ Part B with e-MOA and e-AOA
4. PAN, TAN, and EPFO integration`,
        coverUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        coverAlt: "Company registration skyline",
        status: ARTICLE_STATUS.PUBLISHED,
        publishedAt: new Date("2026-06-02"),
      },
    ]);

    // 4. Seed Ananya Iyer CA
    await ProfessionalProfile.create({
      slug: "ananya-iyer-ca",
      categoryId: caCatId,
      status: PROFILE_STATUS.PUBLISHED,
      verificationStatus: VERIFICATION_STATUS.VERIFIED,
      verifiedAt: new Date("2026-08-20"),
      isFeatured: true,
      featuredRank: 2,
      fullName: "Ananya Iyer",
      headline: "Chartered Accountant | Audit & Assurance",
      summary: "Expert in statutory audit, Ind AS convergence, and corporate financial governance for growing companies.",
      aboutMd:
        "Ananya has over 9 years of experience helping mid-market enterprises and growth-stage companies ensure uncompromising financial integrity. Her core strengths lie in internal audit, internal controls over financial reporting (ICFR), and Ind AS reporting standards.",
      city: "Gurugram",
      state: "Haryana",
      country: "India",
      languages: ["English", "Hindi", "Tamil"],
      yearsExperience: 9,
      qualification: "FCA, DISA (ICAI)",
      registrationBody: "Institute of Chartered Accountants of India (ICAI)",
      registrationNumber: "ICAI-387102",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      photoAlt: "Ananya Iyer - Chartered Accountant",
      contactMode: CONTACT_MODE.HUB,
      consultationFeeInr: 2000,
      consultationHours: "Mon - Fri, 10:00 AM - 6:00 PM",
      responseTimeText: "Responds within 24 hours",
      consultationModes: [CONSULTATION_MODE.ONLINE, CONSULTATION_MODE.IN_PERSON],
      servesAreas: ["Gurugram", "Delhi", "Pan-India"],
      specializations: ["Statutory audit", "Internal controls", "Ind AS reporting", "Risk assessment"],
      industries: ["Fintech", "Manufacturing", "Healthcare"],
      clientTypes: ["Mid-market corporates", "Pre-IPO startups"],
      processSteps: DEFAULT_PROCESS_STEPS,
      completeness: 90,
      version: 1,
      publishedAt: new Date("2026-09-05"),
      services: [
        {
          title: "Statutory & Internal Audit",
          slug: "statutory-and-internal-audit",
          description: "Comprehensive audits compliant with ICAI standards and Companies Act provisions.",
          mode: SERVICE_MODE.ONLINE_IN_PERSON,
          priceType: PRICE_TYPE.QUOTE,
          priceInr: null,
          sortOrder: 1,
          isActive: true,
        },
        {
          title: "Ind AS Advisory & Conversion",
          slug: "ind-as-advisory",
          description: "Assistance in migrating financial statements from Indian GAAP to Ind AS standards.",
          mode: SERVICE_MODE.ONLINE,
          priceType: PRICE_TYPE.FROM,
          priceInr: 15000,
          sortOrder: 2,
          isActive: true,
        },
      ],
    });

    // 5. Seed Karan Malhotra (Tax & GST)
    await ProfessionalProfile.create({
      slug: "karan-malhotra-gst-consultant",
      categoryId: taxCatId,
      status: PROFILE_STATUS.PUBLISHED,
      verificationStatus: VERIFICATION_STATUS.VERIFIED,
      verifiedAt: new Date("2026-08-25"),
      isFeatured: false,
      fullName: "Karan Malhotra",
      headline: "GST & Indirect Tax Consultant",
      summary: "Strategic tax consultant helping e-commerce sellers, retailers, and exporters navigate GST reconciliations and refund claims.",
      aboutMd:
        "Karan has dedicated his career to demystifying the Goods and Services Tax for Indian businesses. Having represented clients across multiple tax appellate forums, he specializes in resolving GST notices and securing export refunds.",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      languages: ["English", "Hindi", "Punjabi"],
      yearsExperience: 7,
      qualification: "M.Com, Certified GST Practitioner",
      registrationBody: "Ministry of Finance - GST Practitioner",
      registrationNumber: "GSTP-07-2018-9182",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      photoAlt: "Karan Malhotra - Tax Consultant",
      contactMode: CONTACT_MODE.HUB,
      consultationFeeInr: 1200,
      consultationHours: "Mon - Sat, 10:30 AM - 6:30 PM",
      responseTimeText: "Usually responds within 4 hours",
      consultationModes: [CONSULTATION_MODE.ONLINE, CONSULTATION_MODE.PHONE],
      servesAreas: ["Delhi", "Noida", "Gurugram", "Pan-India (online)"],
      specializations: ["GST notices", "E-commerce GST", "GST audits", "Export refunds (LUT)"],
      industries: ["E-Commerce & D2C", "Export/Import", "Wholesale & Retail"],
      clientTypes: ["Amazon/Flipkart sellers", "Exporters", "Traders"],
      processSteps: DEFAULT_PROCESS_STEPS,
      completeness: 85,
      version: 1,
      publishedAt: new Date("2026-09-10"),
      services: [
        {
          title: "GST Notice Reply & Representation",
          slug: "gst-notice-reply",
          description: "Drafting detailed legal replies for ASMT-10, DRC-01, and GSTR mismatch notices.",
          mode: SERVICE_MODE.ONLINE,
          priceType: PRICE_TYPE.FROM,
          priceInr: 2999,
          sortOrder: 1,
          isActive: true,
        },
        {
          title: "GST Export Refund Filing",
          slug: "gst-export-refund",
          description: "Processing RFD-01 refund applications for inverted duty structure and unutilized ITC on exports.",
          mode: SERVICE_MODE.ONLINE,
          priceType: PRICE_TYPE.FROM,
          priceInr: 4999,
          sortOrder: 2,
          isActive: true,
        },
      ],
    });

    // 6. Seed Advocate Priya Mehta
    await ProfessionalProfile.create({
      slug: "advocate-priya-mehta",
      categoryId: legalCatId,
      status: PROFILE_STATUS.PUBLISHED,
      verificationStatus: VERIFICATION_STATUS.VERIFIED,
      verifiedAt: new Date("2026-08-30"),
      isFeatured: true,
      featuredRank: 3,
      fullName: "Advocate Priya Mehta",
      headline: "Advocate | Corporate Law & Business Registration",
      summary: "Commercial advocate specializing in contract drafting, founder agreements, trademark protection, and corporate advisory.",
      aboutMd:
        "Priya is an advocate registered with the Bar Council of India, advising tech startups, creative agencies, and founders on corporate legal structuring. Her practice covers commercial contract negotiation, IP trademark filings, and dispute resolution.",
      city: "Gurugram",
      state: "Haryana",
      country: "India",
      languages: ["English", "Hindi"],
      yearsExperience: 10,
      qualification: "LL.B, LL.M (Corporate Law)",
      registrationBody: "Bar Council of India / Punjab & Haryana",
      registrationNumber: "BCI-PH-2016-4491",
      photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
      photoAlt: "Advocate Priya Mehta",
      contactMode: CONTACT_MODE.HUB,
      consultationFeeInr: 2500,
      consultationHours: "Mon - Fri, 11:00 AM - 7:00 PM",
      responseTimeText: "Usually responds within one business day",
      consultationModes: [CONSULTATION_MODE.ONLINE, CONSULTATION_MODE.IN_PERSON],
      servesAreas: ["Gurugram", "Delhi", "Chandigarh"],
      specializations: ["Business registration", "Contract drafting", "Trademark registration", "Founder agreements"],
      industries: ["Technology", "Media & Creative", "Real Estate"],
      clientTypes: ["Founders & Co-founders", "Corporate entities", "Investors"],
      processSteps: DEFAULT_PROCESS_STEPS,
      completeness: 92,
      version: 1,
      publishedAt: new Date("2026-09-12"),
      services: [
        {
          title: "Founder & Shareholder Agreements",
          slug: "founder-and-shareholder-agreements",
          description: "Custom drafting of vesting schedules, IP assignment, dispute escalation, and equity split clauses.",
          mode: SERVICE_MODE.ONLINE_IN_PERSON,
          priceType: PRICE_TYPE.FROM,
          priceInr: 8999,
          sortOrder: 1,
          isActive: true,
        },
        {
          title: "Trademark Filing & IP Protection",
          slug: "trademark-filing",
          description: "Comprehensive trademark search, class identification, application filing, and objection monitoring.",
          mode: SERVICE_MODE.ONLINE,
          priceType: PRICE_TYPE.FROM,
          priceInr: 5999,
          sortOrder: 2,
          isActive: true,
        },
      ],
    });

    console.log("✅ Professionals Network Seed Completed: Categories and 4 Demo Professionals seeded.");
  } catch (error) {
    console.error("❌ Professionals Seed Error:", error);
  }
};

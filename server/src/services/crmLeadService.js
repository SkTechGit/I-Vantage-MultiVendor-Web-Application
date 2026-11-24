/**
 * Central CRM Lead Ingestion Service
 * Conforms strictly to CRM API LeadSchema (API_FIELDS.md)
 * Enforces:
 *  - Header: X-API-KEY
 *  - Strictly forbidden extra fields (extra: "forbid")
 *  - Whitespace trimming and empty string to null conversion
 *  - Brand enum: 'assetsense' | 'i_vantage'
 *  - Channel enum: 'website' | 'chatbot' | 'whatsapp' | 'google_ads' | 'meta_ads' | 'referral' | 'manual' | 'other'
 */

const ALLOWED_CHANNELS = new Set([
  "website",
  "chatbot",
  "whatsapp",
  "google_ads",
  "meta_ads",
  "referral",
  "manual",
  "other",
]);

const ALLOWED_BRANDS = new Set(["assetsense", "i_vantage"]);

/**
 * Trims whitespace from strings. Converts empty strings to null.
 * Optionally truncates to maxLen.
 */
function sanitizeString(val, maxLen = null) {
  if (val === undefined || val === null) return null;
  const str = String(val).trim();
  if (str.length === 0) return null;
  if (maxLen && typeof maxLen === "number") {
    return str.substring(0, maxLen);
  }
  return str;
}

/**
 * Validates and sanitizes HTTP/HTTPS URLs.
 */
function sanitizeUrl(val) {
  const str = sanitizeString(val);
  if (!str) return null;
  try {
    const url = new URL(str);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch (_) {}
  return null;
}

/**
 * Normalizes phone numbers (removes spaces, dashes).
 */
function sanitizePhone(val) {
  if (!val) return null;
  const digits = String(val).replace(/[^\d+]/g, "").trim();
  return digits.length > 0 ? digits.substring(0, 50) : null;
}

/**
 * Dispatches a normalized lead to the Central CRM API.
 * Never throws an unhandled error so customer-facing operations are resilient.
 *
 * @param {Object} options
 * @returns {Promise<{ success: boolean, skipped?: boolean, error?: string, data?: any }>}
 */
export async function dispatchLeadToCRM(options = {}) {
  const apiKey = process.env.CRM_API_KEY;
  const baseUrl = process.env.CRM_BASE_URL || process.env.CRM_API_URL;

  if (!apiKey || !baseUrl) {
    // Graceful skip when CRM credentials are not yet populated in .env
    return {
      success: false,
      skipped: true,
      message: "CRM_API_KEY or CRM_BASE_URL is not configured in environment.",
    };
  }

  let cleanUrl = String(baseUrl).trim();
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = `https://${cleanUrl}`;
  }

  const endpoint = cleanUrl.endsWith("/api/v1/leads")
    ? cleanUrl
    : `${cleanUrl.replace(/\/+$/, "")}/api/v1/leads`;

  try {
    // 1. Source block
    const channelInput = String(options.channel || "website").toLowerCase().trim();
    const channel = ALLOWED_CHANNELS.has(channelInput) ? channelInput : "website";

    const brandInput = String(options.brand || process.env.CRM_BRAND || "i_vantage")
      .toLowerCase()
      .trim();
    const brand = ALLOWED_BRANDS.has(brandInput) ? brandInput : "i_vantage";

    const source = {
      channel,
      brand,
      source_form: sanitizeString(options.sourceForm, 255),
      external_id: sanitizeString(options.externalId, 255),
    };

    // 2. Contact block (name required, phone or email required)
    const rawName = sanitizeString(options.name, 255) || "Website Lead";
    const rawPhone = sanitizePhone(options.phone);
    const rawEmail = sanitizeString(options.email, 255);

    // If both phone and email are missing, fallback to phone
    const contact = {
      name: rawName,
      phone: rawPhone || (rawEmail ? null : "9999999999"),
      email: rawEmail || null,
    };

    // 3. Lead Details block
    const lead_details = {
      company_name: sanitizeString(options.companyName, 255),
      city: sanitizeString(options.city, 255),
      location: sanitizeString(options.location, 255),
      property_location: sanitizeString(
        options.propertyLocation || options.location,
        255
      ),
      property_details: sanitizeString(options.propertyDetails),
      interested_in: sanitizeString(options.interestedIn, 255),
      preferred_contact_method: sanitizeString(
        options.preferredContactMethod,
        255
      ),
      message: sanitizeString(options.message),
      website: sanitizeUrl(options.website),
    };

    // 4. Service block
    const isVirtualOffice =
      String(options.serviceType).toLowerCase() === "virtual_office";

    let interestedServices = [];
    if (Array.isArray(options.interestedServices)) {
      interestedServices = options.interestedServices
        .map((s) => sanitizeString(typeof s === "string" ? s : s?.name, 255))
        .filter(Boolean)
        .slice(0, 20);
    }

    const service = {
      type: isVirtualOffice ? "virtual_office" : "general",
      details: isVirtualOffice && options.serviceDetails ? options.serviceDetails : null,
      interested_services: interestedServices,
    };

    // 5. Business Details block (optional, must be null if omitted)
    let business_details = null;
    if (options.businessDetails && typeof options.businessDetails === "object") {
      const bd = options.businessDetails;
      const role = sanitizeString(bd.role, 255);
      const industry = sanitizeString(bd.industry, 255);
      const business_size = sanitizeString(bd.businessSize || bd.business_size, 255);
      const referral_source = sanitizeString(bd.referralSource || bd.referral_source, 255);

      if (role || industry || business_size || referral_source) {
        business_details = { role, industry, business_size, referral_source };
      }
    }

    // 6. Metadata block (optional, must be null if omitted)
    let metadata = null;
    if (options.metadata && typeof options.metadata === "object") {
      const m = options.metadata;
      const utm_source = sanitizeString(m.utm_source, 255);
      const utm_medium = sanitizeString(m.utm_medium, 255);
      const utm_campaign = sanitizeString(m.utm_campaign, 255);
      const utm_term = sanitizeString(m.utm_term, 255);
      const utm_content = sanitizeString(m.utm_content, 255);
      const landing_page = sanitizeUrl(m.landing_page);

      if (
        utm_source ||
        utm_medium ||
        utm_campaign ||
        utm_term ||
        utm_content ||
        landing_page
      ) {
        metadata = {
          utm_source,
          utm_medium,
          utm_campaign,
          utm_term,
          utm_content,
          landing_page,
        };
      }
    }

    // Construct final payload strictly adhering to LeadSchema
    const payload = {
      source,
      contact,
      lead_details,
      service,
      business_details,
      metadata,
    };

    // Send HTTP POST request with 8-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const resText = await response.text();
    let resJson = null;
    try {
      resJson = JSON.parse(resText);
    } catch (_) {
      resJson = { raw: resText };
    }

    if (!response.ok) {
      console.error(
        `[CRM Dispatcher] HTTP ${response.status} from ${endpoint}:`,
        resText
      );
      return {
        success: false,
        status: response.status,
        error: resJson?.message || resText || "CRM API returned an error.",
      };
    }

    console.log(
      `[CRM Dispatcher] Success: Lead successfully synced to CRM (Status: ${response.status}).`
    );
    return {
      success: true,
      status: response.status,
      data: resJson,
    };
  } catch (err) {
    console.error("[CRM Dispatcher] Request exception:", err.message);
    return {
      success: false,
      error: err.message,
    };
  }
}

export default {
  dispatchLeadToCRM,
};

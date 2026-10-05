/**
 * Standardized Phone and Email Validation Utilities for i-VANTAGE
 * Ensures consistent, enterprise-grade validation across all forms.
 */

// Robust RFC-compliant practical email regex
// Ensures username, domain, dot, and at least 2-letter TLD
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Indian mobile regex supporting optional +91, 91, or 0 prefixes and formatting
export const PHONE_REGEX = /^(?:\+?91[\-\s]?|0)?[6-9]\d{9}$/;

/**
 * Normalizes an Indian phone number string down to standard 10 digits.
 * Handles +91, 91 prefix, 0 prefix, spaces, dashes, parentheses.
 * e.g. "+91 98765 43210" -> "9876543210"
 * e.g. "09876543210" -> "9876543210"
 * e.g. "98765-43210" -> "9876543210"
 */
export function normalizeIndianPhone(phone: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

/**
 * Validates whether an input is a valid 10-digit Indian mobile number.
 * Accepts formatted inputs (+91, 0, spaces, dashes) as long as the normalized
 * core number is a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.
 */
export function isValidIndianPhone(phone: string): boolean {
  if (!phone || typeof phone !== "string" || !phone.trim()) return false;
  const normalized = normalizeIndianPhone(phone);
  return /^[6-9]\d{9}$/.test(normalized);
}

/**
 * Validates whether an email address has a valid format.
 * Rejects spaces, consecutive dots, missing TLD, or malformed domain parts.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string" || !email.trim()) return false;
  const trimmed = email.trim();
  if (trimmed.includes("..")) return false;
  return EMAIL_REGEX.test(trimmed);
}

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: "Email address is required.",
  EMAIL_INVALID: "Please enter a valid email address (e.g. name@company.com).",
  PHONE_REQUIRED: "Phone number is required.",
  PHONE_INVALID: "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).",
} as const;

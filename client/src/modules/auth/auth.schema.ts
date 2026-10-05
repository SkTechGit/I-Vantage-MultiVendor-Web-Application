import { z } from "zod";
import {
  EMAIL_REGEX,
  PHONE_REGEX,
  isValidIndianPhone,
  isValidEmail,
  normalizeIndianPhone,
  VALIDATION_MESSAGES,
} from "@/lib/validation";

export { EMAIL_REGEX, PHONE_REGEX, isValidIndianPhone, isValidEmail, normalizeIndianPhone };
export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])\S{8,}$/;

export const STRONG_PASSWORD_MESSAGE =
  "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).";

export interface PasswordCriteria {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  hasNoSpaces: boolean;
  passedCount: number;
  strengthLabel: "Weak" | "Fair" | "Good" | "Strong";
  strengthColor: string;
  strengthWidth: string;
  isStrong: boolean;
}

export function checkPasswordCriteria(password: string): PasswordCriteria {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);
  const hasNoSpaces = !/\s/.test(password) && password.length > 0;

  const passedCount = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
  ].filter(Boolean).length;

  let strengthLabel: "Weak" | "Fair" | "Good" | "Strong" = "Weak";
  let strengthColor = "bg-rose-500";
  let strengthWidth = "w-1/4";

  if (passedCount === 5 && hasNoSpaces) {
    strengthLabel = "Strong";
    strengthColor = "bg-emerald-500";
    strengthWidth = "w-full";
  } else if (passedCount >= 4) {
    strengthLabel = "Good";
    strengthColor = "bg-blue-500";
    strengthWidth = "w-3/4";
  } else if (passedCount >= 3) {
    strengthLabel = "Fair";
    strengthColor = "bg-amber-500";
    strengthWidth = "w-1/2";
  }

  return {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
    hasNoSpaces,
    passedCount,
    strengthLabel,
    strengthColor,
    strengthWidth,
    isStrong: passedCount === 5 && hasNoSpaces,
  };
}

export const loginSchema = z.object({
  email: z
    .string({ required_error: VALIDATION_MESSAGES.EMAIL_REQUIRED })
    .trim()
    .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .toLowerCase()
    .refine(isValidEmail, {
      message: VALIDATION_MESSAGES.EMAIL_INVALID,
    }),

  password: z
    .string({ required_error: "Password is required." })
    .min(6, "Password must be at least 6 characters."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    fullName: z
      .string({ required_error: "Full name is required." })
      .trim()
      .min(2, "Full name must be at least 2 characters.")
      .max(100, "Full name cannot exceed 100 characters."),

    email: z
      .string({ required_error: VALIDATION_MESSAGES.EMAIL_REQUIRED })
      .trim()
      .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
      .toLowerCase()
      .refine(isValidEmail, {
        message: "Please enter a valid work email address (e.g. name@company.com).",
      }),

    phone: z
      .string({ required_error: VALIDATION_MESSAGES.PHONE_REQUIRED })
      .trim()
      .min(1, VALIDATION_MESSAGES.PHONE_REQUIRED)
      .refine(isValidIndianPhone, {
        message: VALIDATION_MESSAGES.PHONE_INVALID,
      }),

    businessName: z.string().trim().max(120).optional(),

    password: z
      .string({ required_error: "Password is required." })
      .min(8, "Password must be at least 8 characters long.")
      .max(128, "Password cannot exceed 128 characters.")
      .regex(STRONG_PASSWORD_REGEX, STRONG_PASSWORD_MESSAGE),

    confirmPassword: z.string({
      required_error: "Please confirm your password.",
    }),

    inviteToken: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export const vendorSignupSchema = z
  .object({
    name: z
      .string({ required_error: "Your name is required." })
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name cannot exceed 100 characters."),

    businessName: z
      .string({ required_error: "Coworking brand or company name is required." })
      .trim()
      .min(2, "Brand / company name must be at least 2 characters.")
      .max(120, "Brand / company name cannot exceed 120 characters."),

    email: z
      .string({ required_error: VALIDATION_MESSAGES.EMAIL_REQUIRED })
      .trim()
      .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
      .toLowerCase()
      .refine(isValidEmail, {
        message: "Please enter a valid official email address (e.g. partner@brand.com).",
      }),

    phone: z
      .string({ required_error: VALIDATION_MESSAGES.PHONE_REQUIRED })
      .trim()
      .min(1, VALIDATION_MESSAGES.PHONE_REQUIRED)
      .refine(isValidIndianPhone, {
        message: VALIDATION_MESSAGES.PHONE_INVALID,
      }),

    password: z
      .string({ required_error: "Password is required." })
      .min(8, "Password must be at least 8 characters long.")
      .max(128, "Password cannot exceed 128 characters.")
      .regex(STRONG_PASSWORD_REGEX, STRONG_PASSWORD_MESSAGE),

    confirmPassword: z.string({
      required_error: "Please confirm your password.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type VendorSignupFormData = z.infer<typeof vendorSignupSchema>;
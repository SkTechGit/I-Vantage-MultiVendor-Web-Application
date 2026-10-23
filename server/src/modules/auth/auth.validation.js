import { z } from "zod";

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PHONE_REGEX = /^(?:\+?91[\-\s]?|0)?[6-9]\d{9}$/;
export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])\S{8,}$/;

export const STRONG_PASSWORD_MESSAGE =
  "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email address is required.",
    })
    .trim()
    .regex(EMAIL_REGEX, "Please enter a valid email address (e.g. name@company.com).")
    .toLowerCase(),

  password: z
    .string({
      required_error: "Password is required.",
    })
    .min(6, "Password must be at least 6 characters."),

  requiredRole: z
    .enum(["super_admin", "vendor", "professional", "user"], {
      errorMap: () => ({ message: "Role must be 'super_admin', 'vendor', 'professional', or 'user'." }),
    })
    .optional(),
});

export const signupSchema = z
  .object({
    fullName: z
      .string({
        required_error: "Full name is required.",
      })
      .trim()
      .min(2, "Full name must be at least 2 characters.")
      .max(100, "Full name cannot exceed 100 characters."),

    email: z
      .string({
        required_error: "Work email is required.",
      })
      .trim()
      .regex(EMAIL_REGEX, "Please enter a valid work email address (e.g. name@company.com).")
      .toLowerCase(),

    phone: z
      .string({
        required_error: "Phone number is required.",
      })
      .trim()
      .regex(
        PHONE_REGEX,
        "Please enter a valid 10-digit mobile number (e.g. 9876543210)."
      ),

    password: z
      .string({
        required_error: "Password is required.",
      })
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

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Full name is required." })
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name cannot exceed 100 characters."),

  email: z
    .string({ required_error: "Email address is required." })
    .trim()
    .regex(EMAIL_REGEX, "Please enter a valid email address (e.g. name@company.com).")
    .toLowerCase(),

  phone: z
    .string({ required_error: "Phone number is required." })
    .trim()
    .regex(
      PHONE_REGEX,
      "Please enter a valid 10-digit mobile number (e.g. 9876543210)."
    ),

  businessName: z
    .string()
    .trim()
    .max(120, "Business name cannot exceed 120 characters.")
    .optional(),

  password: z
    .string({ required_error: "Password is required." })
    .min(8, "Password must be at least 8 characters long.")
    .max(128, "Password cannot exceed 128 characters.")
    .regex(STRONG_PASSWORD_REGEX, STRONG_PASSWORD_MESSAGE),

  role: z
    .enum(["super_admin", "vendor", "user", "professional"], {
      errorMap: () => ({ message: "Role must be 'super_admin', 'vendor', 'user', or 'professional'." }),
    })
    .default("vendor"),

  headline: z
    .string()
    .trim()
    .max(160, "Headline cannot exceed 160 characters.")
    .optional(),

  categoryId: z.string().trim().optional(),

  city: z
    .string()
    .trim()
    .max(80, "City cannot exceed 80 characters.")
    .optional(),

  qualification: z
    .string()
    .trim()
    .max(120, "Qualification cannot exceed 120 characters.")
    .optional(),
});

export const createInviteSchema = z.object({
  email: z
    .string({
      required_error: "Email is required.",
    })
    .trim()
    .regex(EMAIL_REGEX, "Please enter a valid work email address (e.g. colleague@company.com).")
    .toLowerCase(),

  role: z
    .enum(["super_admin", "vendor", "user", "professional"], {
      errorMap: () => ({ message: "Role must be 'super_admin', 'vendor', 'user', or 'professional'." }),
    })
    .default("vendor"),
});

export const approveRequestSchema = z.object({
  role: z
    .enum(["super_admin", "vendor", "user", "professional"], {
      errorMap: () => ({ message: "Role must be 'super_admin', 'vendor', 'user', or 'professional'." }),
    })
    .default("vendor"),
});

export const updateRoleSchema = z.object({
  role: z
    .enum(["super_admin", "vendor", "user", "professional"], {
      errorMap: () => ({
        message: "Role must be 'super_admin', 'vendor', 'user', or 'professional'.",
      }),
    }),
});

export const toggleStatusSchema = z.object({
  isActive: z.boolean({
    required_error: "isActive boolean is required.",
  }),
});

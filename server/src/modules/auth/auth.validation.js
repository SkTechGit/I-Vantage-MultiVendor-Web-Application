import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required.",
    })
    .trim()
    .email("Please enter a valid email address."),

  password: z
    .string({
      required_error: "Password is required.",
    })
    .min(6, "Password must be at least 6 characters."),

  requiredRole: z.enum(["vendor", "superadmin", "user"]).optional(),
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
      .email("Please enter a valid work email address.")
      .toLowerCase(),

    password: z
      .string({
        required_error: "Password is required.",
      })
      .min(8, "Password must be at least 8 characters long.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number."
      ),

    confirmPassword: z
      .string({
        required_error: "Please confirm your password.",
      }),

    inviteToken: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const createInviteSchema = z.object({
  email: z
    .string({
      required_error: "Email is required.",
    })
    .trim()
    .email("Please enter a valid email address.")
    .toLowerCase(),

  role: z
    .enum(["super_admin", "vendor", "user"], {
      errorMap: () => ({ message: "Role must be 'super_admin', 'vendor', or 'user'." }),
    })
    .default("vendor"),
});

export const approveRequestSchema = z.object({
  role: z
    .enum(["super_admin", "vendor", "user"], {
      errorMap: () => ({ message: "Role must be 'super_admin', 'vendor', or 'user'." }),
    })
    .default("vendor"),
});

export const updateRoleSchema = z.object({
  role: z.enum(["super_admin", "vendor", "user"], {
    errorMap: () => ({
      message: "Role must be 'super_admin', 'vendor', or 'user'.",
    }),
  }),
});

export const toggleStatusSchema = z.object({
  isActive: z.boolean({
    required_error: "isActive boolean is required.",
  }),
});

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
    .min(8, "Password must be at least 8 characters."),
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
    .enum(["admin", "editor"], {
      errorMap: () => ({ message: "Role must be 'admin' or 'editor'." }),
    })
    .default("admin"),
});

export const approveRequestSchema = z.object({
  role: z
    .enum(["admin", "editor"], {
      errorMap: () => ({ message: "Role must be 'admin' or 'editor'." }),
    })
    .default("admin"),
});
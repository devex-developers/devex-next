import { z } from "zod";

export const USER_ROLES = ["learner", "content_creator", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const EXPERIENCE_LEVELS = [
  "student",
  "fresh_graduate",
  "career_shifter",
  "junior_developer",
] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(128, "Password must be at most 128 characters long.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.");

const optionalUrlSchema = z
  .string()
  .trim()
  .url("Must be a valid URL starting with http:// or https://.")
  .refine(
    (url) => url.startsWith("https://") || url.startsWith("http://"),
    "URL must use http or https protocol."
  )
  .optional()
  .or(z.literal("").transform(() => undefined));

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Username must be at most 30 characters.")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username may only contain letters, numbers, underscores, and hyphens."
  );

const skillsSchema = z
  .array(z.string().trim().min(1).max(40))
  .max(20, "You may list up to 20 skills.");

/**
 * FR-01: User registration payload validation.
 * Accepts either `displayName` or `firstName` + `lastName`, plus optional onboarding profile details.
 */
export const registerSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
    password: strongPasswordSchema,
    displayName: z.string().trim().min(2, "Display name must be at least 2 characters.").max(80).optional(),
    firstName: z.string().trim().min(1).max(40).optional(),
    lastName: z.string().trim().min(1).max(40).optional(),
    username: usernameSchema.optional(),
    bio: z.string().trim().max(500, "Bio must be at most 500 characters.").optional(),
    experienceLevel: z.enum(EXPERIENCE_LEVELS).optional().default("student"),
    schoolOrOrganization: z.string().trim().max(120).optional(),
    githubUrl: optionalUrlSchema,
    portfolioUrl: optionalUrlSchema,
    skills: skillsSchema.optional(),
  })
  .refine(
    (data) => Boolean(data.displayName || (data.firstName && data.lastName)),
    {
      message: "Provide either displayName or both firstName and lastName.",
      path: ["displayName"],
    }
  )
  .transform((data) => {
    const resolvedName =
      data.displayName ?? `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim();
    return {
      ...data,
      displayName: resolvedName,
    };
  });

/**
 * FR-02: Login payload validation.
 */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required.").max(128),
  rememberMe: z.boolean().optional().default(true),
});

/**
 * FR-02: Request password reset email.
 */
export const requestPasswordResetSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  redirectTo: z.string().trim().min(1).max(300).optional(),
});

/**
 * FR-02: Confirm password reset using reset token.
 */
export const confirmPasswordResetSchema = z.object({
  token: z.string().trim().min(1, "Reset token is required."),
  newPassword: strongPasswordSchema,
});

/**
 * FR-03: Update developer profile.
 */
export const updateProfileSchema = z
  .object({
    displayName: z.string().trim().min(2).max(80).optional(),
    username: usernameSchema.nullable().optional(),
    bio: z.string().trim().max(500).nullable().optional(),
    experienceLevel: z.enum(EXPERIENCE_LEVELS).optional(),
    schoolOrOrganization: z.string().trim().max(120).nullable().optional(),
    githubUrl: optionalUrlSchema.nullable(),
    portfolioUrl: optionalUrlSchema.nullable(),
    skills: skillsSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one profile field must be provided to update.",
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

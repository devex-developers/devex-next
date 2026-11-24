import { getSql } from "@/lib/db";
import type {
  ExperienceLevel,
  UpdateProfileInput,
  UserRole,
} from "@/lib/auth/validation";

export interface DeveloperProfile {
  userId: string;
  role: UserRole;
  displayName: string;
  username: string | null;
  bio: string | null;
  experienceLevel: ExperienceLevel;
  schoolOrOrganization: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  skills: string[];
  isActive: boolean;
  deactivatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DeveloperProfileRow {
  user_id: string;
  role: UserRole;
  display_name: string;
  username: string | null;
  bio: string | null;
  experience_level: ExperienceLevel;
  school_or_organization: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  skills: string[];
  is_active: boolean;
  deactivated_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
}

function mapProfileRow(row: DeveloperProfileRow): DeveloperProfile {
  return {
    userId: row.user_id,
    role: row.role,
    displayName: row.display_name,
    username: row.username,
    bio: row.bio,
    experienceLevel: row.experience_level,
    schoolOrOrganization: row.school_or_organization,
    githubUrl: row.github_url,
    portfolioUrl: row.portfolio_url,
    skills: Array.isArray(row.skills) ? row.skills : [],
    isActive: row.is_active,
    deactivatedAt: row.deactivated_at
      ? new Date(row.deactivated_at).toISOString()
      : null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export interface CreateDeveloperProfileInput {
  userId: string;
  displayName: string;
  username?: string;
  bio?: string;
  experienceLevel?: ExperienceLevel;
  schoolOrOrganization?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  skills?: string[];
}

export async function isUsernameAvailable(
  username: string,
  excludeUserId?: string
): Promise<boolean> {
  const sql = getSql();
  const rows = excludeUserId
    ? await sql`
        SELECT 1
        FROM public.developer_profiles
        WHERE LOWER(username) = LOWER(${username})
          AND user_id <> ${excludeUserId}::uuid
        LIMIT 1
      `
    : await sql`
        SELECT 1
        FROM public.developer_profiles
        WHERE LOWER(username) = LOWER(${username})
        LIMIT 1
      `;

  return rows.length === 0;
}

/**
 * Creates a developer profile for a newly registered user.
 * Public registrations are always assigned the `learner` role (FR-38).
 */
export async function createDeveloperProfile(
  input: CreateDeveloperProfileInput
): Promise<DeveloperProfile> {
  const sql = getSql();
  const skills =
    input.skills && input.skills.length > 0 ? input.skills : ["C#", ".NET"];

  const rows = (await sql`
    INSERT INTO public.developer_profiles (
      user_id,
      role,
      display_name,
      username,
      bio,
      experience_level,
      school_or_organization,
      github_url,
      portfolio_url,
      skills
    )
    VALUES (
      ${input.userId}::uuid,
      'learner',
      ${input.displayName},
      ${input.username ?? null},
      ${input.bio ?? null},
      ${input.experienceLevel ?? "student"},
      ${input.schoolOrOrganization ?? null},
      ${input.githubUrl ?? null},
      ${input.portfolioUrl ?? null},
      ${skills}
    )
    ON CONFLICT (user_id) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      updated_at = NOW()
    RETURNING *
  `) as DeveloperProfileRow[];

  return mapProfileRow(rows[0]);
}

export async function getDeveloperProfile(
  userId: string
): Promise<DeveloperProfile | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT *
    FROM public.developer_profiles
    WHERE user_id = ${userId}::uuid
    LIMIT 1
  `) as DeveloperProfileRow[];

  if (rows.length === 0) {
    return null;
  }

  return mapProfileRow(rows[0]);
}

export async function updateDeveloperProfile(
  userId: string,
  updates: UpdateProfileInput
): Promise<DeveloperProfile | null> {
  const existing = await getDeveloperProfile(userId);
  if (!existing) {
    return null;
  }

  const sql = getSql();
  const nextDisplayName =
    updates.displayName !== undefined
      ? updates.displayName
      : existing.displayName;
  const nextUsername =
    updates.username !== undefined ? updates.username : existing.username;
  const nextBio = updates.bio !== undefined ? updates.bio : existing.bio;
  const nextExperienceLevel =
    updates.experienceLevel !== undefined
      ? updates.experienceLevel
      : existing.experienceLevel;
  const nextSchoolOrOrg =
    updates.schoolOrOrganization !== undefined
      ? updates.schoolOrOrganization
      : existing.schoolOrOrganization;
  const nextGithubUrl =
    updates.githubUrl !== undefined ? updates.githubUrl : existing.githubUrl;
  const nextPortfolioUrl =
    updates.portfolioUrl !== undefined
      ? updates.portfolioUrl
      : existing.portfolioUrl;
  const nextSkills =
    updates.skills !== undefined ? updates.skills : existing.skills;

  const rows = (await sql`
    UPDATE public.developer_profiles
    SET
      display_name = ${nextDisplayName},
      username = ${nextUsername},
      bio = ${nextBio},
      experience_level = ${nextExperienceLevel},
      school_or_organization = ${nextSchoolOrOrg},
      github_url = ${nextGithubUrl},
      portfolio_url = ${nextPortfolioUrl},
      skills = ${nextSkills},
      updated_at = NOW()
    WHERE user_id = ${userId}::uuid
    RETURNING *
  `) as DeveloperProfileRow[];

  return rows.length > 0 ? mapProfileRow(rows[0]) : null;
}

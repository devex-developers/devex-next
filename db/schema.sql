-- DevEx: Software Development Work Simulation Platform
-- Account & Developer Profile Schema (FR-01, FR-03, FR-37, FR-38)
--
-- Prerequisites:
--   Neon Auth must be enabled on your Neon branch so the `neon_auth."user"` table exists.
--   Run this script against your Neon database (e.g. via Neon SQL Editor or `psql "$DATABASE_URL" -f db/schema.sql`).

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('learner', 'content_creator', 'admin');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'experience_level') THEN
    CREATE TYPE public.experience_level AS ENUM (
      'student',
      'fresh_graduate',
      'career_shifter',
      'junior_developer'
    );
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.developer_profiles (
  user_id UUID PRIMARY KEY REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'learner',
  display_name TEXT NOT NULL,
  username TEXT UNIQUE,
  bio TEXT,
  experience_level public.experience_level NOT NULL DEFAULT 'student',
  school_or_organization TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  skills TEXT[] NOT NULL DEFAULT ARRAY['C#', '.NET']::TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  deactivated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT developer_profiles_username_format CHECK (
    username IS NULL OR username ~ '^[a-zA-Z0-9_-]{3,30}$'
  )
);

CREATE INDEX IF NOT EXISTS idx_developer_profiles_role
  ON public.developer_profiles (role);

CREATE INDEX IF NOT EXISTS idx_developer_profiles_is_active
  ON public.developer_profiles (is_active);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_developer_profiles_updated_at ON public.developer_profiles;
CREATE TRIGGER trg_developer_profiles_updated_at
  BEFORE UPDATE ON public.developer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

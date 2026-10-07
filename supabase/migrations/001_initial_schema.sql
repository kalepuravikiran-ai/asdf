-- ============================================================================
-- AURA — Autonomous Unified Reasoning Agent
-- Migration 001: Initial Database Schema, RLS Policies, Indexes, and Seed Data
-- ============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  role text DEFAULT 'Architect',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Goals Table
CREATE TABLE IF NOT EXISTS public.goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text DEFAULT 'PLANNING',
  priority text DEFAULT 'MEDIUM',
  status text DEFAULT 'ACTIVE',
  deadline timestamptz,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  success_rate numeric DEFAULT 0,
  replan_count integer DEFAULT 0,
  current_stage text DEFAULT 'UNDERSTAND',
  active_agent text DEFAULT 'Orchestrator Agent',
  summary text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  priority text DEFAULT 'MEDIUM',
  status text DEFAULT 'PENDING',
  assigned_agent text DEFAULT 'Planning Agent',
  deadline timestamptz,
  dependencies jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  estimated_minutes integer DEFAULT 30,
  actual_minutes integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

-- 4. Agent Activities Table
CREATE TABLE IF NOT EXISTS public.agent_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal_id uuid REFERENCES public.goals(id) ON DELETE CASCADE,
  task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  agent_name text NOT NULL,
  action text NOT NULL,
  status text NOT NULL,
  message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Decisions Table
CREATE TABLE IF NOT EXISTS public.decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal_id uuid REFERENCES public.goals(id) ON DELETE CASCADE,
  agent_name text NOT NULL,
  decision_type text NOT NULL,
  reasoning text,
  decision jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Progress History Table
CREATE TABLE IF NOT EXISTS public.progress_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal_id uuid REFERENCES public.goals(id) ON DELETE CASCADE,
  progress integer NOT NULL CHECK (progress >= 0 AND progress <= 100),
  event_type text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. Schedules Table
CREATE TABLE IF NOT EXISTS public.schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal_id uuid REFERENCES public.goals(id) ON DELETE CASCADE,
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text DEFAULT 'SCHEDULED',
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- Indexes for High Performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);
CREATE INDEX IF NOT EXISTS idx_tasks_goal_id ON public.tasks(goal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_agent ON public.tasks(assigned_agent);
CREATE INDEX IF NOT EXISTS idx_agent_activities_goal_id ON public.agent_activities(goal_id);
CREATE INDEX IF NOT EXISTS idx_agent_activities_created_at ON public.agent_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_decisions_goal_id ON public.decisions(goal_id);
CREATE INDEX IF NOT EXISTS idx_progress_history_goal_id ON public.progress_history(goal_id);
CREATE INDEX IF NOT EXISTS idx_schedules_goal_id ON public.schedules(goal_id);
CREATE INDEX IF NOT EXISTS idx_schedules_task_id ON public.schedules(task_id);

-- ============================================================================
-- Row Level Security (RLS) Configuration
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
  CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

  DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
  CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

  DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
  CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Goals Policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can access own goals" ON public.goals;
  CREATE POLICY "Users can access own goals" ON public.goals
    FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL);
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Tasks Policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can access own tasks" ON public.tasks;
  CREATE POLICY "Users can access own tasks" ON public.tasks
    FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL);
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Agent Activities Policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can access own agent activities" ON public.agent_activities;
  CREATE POLICY "Users can access own agent activities" ON public.agent_activities
    FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL);
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Decisions Policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can access own decisions" ON public.decisions;
  CREATE POLICY "Users can access own decisions" ON public.decisions
    FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL);
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Progress History Policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can access own progress history" ON public.progress_history;
  CREATE POLICY "Users can access own progress history" ON public.progress_history
    FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL);
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Schedules Policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can access own schedules" ON public.schedules;
  CREATE POLICY "Users can access own schedules" ON public.schedules
    FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL);
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Service Role Key bypasses RLS automatically in Supabase.

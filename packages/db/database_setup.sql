-- ==============================================================================
-- IRONPULSE: COMPLETE PRODUCTION DATABASE SCHEMA & SECURITY SETUP
-- Compatible with: PostgreSQL 14+ / Supabase
-- Includes: Extensions, Tables, Indexes, RLS Policies, Functions, Triggers & Seed Data
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 0. EXTENSIONS & CUSTOM CONFIGURATION
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean Slate Migration Drop (Optional: Comment out if preserving live production data)
-- DROP SCHEMA IF EXISTS public CASCADE;
-- CREATE SCHEMA public;
-- GRANT ALL ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Core Operative Identity & Neural Progression)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  height_cm NUMERIC(5,2) DEFAULT 175.0,
  weight_goal NUMERIC(5,2) DEFAULT 80.0,
  body_fat_goal NUMERIC(4,2) DEFAULT 12.0,
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
  rank_tier TEXT NOT NULL DEFAULT 'NEURAL INITIATE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast profile queries
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON public.profiles(level);
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON public.profiles(xp);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. EXERCISES VAULT TABLE (Master Exercise Library)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE,
  muscle_group TEXT NOT NULL,
  secondary_muscles TEXT[] DEFAULT '{}',
  equipment TEXT NOT NULL DEFAULT 'Barbell',
  mechanics TEXT DEFAULT 'Compound', -- 'Compound' or 'Isolation'
  experience_level TEXT DEFAULT 'Intermediate', -- 'Beginner', 'Intermediate', 'Advanced'
  category TEXT DEFAULT 'Strength',
  description TEXT,
  instructions TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  tips TEXT[] DEFAULT '{}',
  is_bodyweight BOOLEAN NOT NULL DEFAULT false,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Search Indexes
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON public.exercises(muscle_group);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON public.exercises(equipment);
CREATE INDEX IF NOT EXISTS idx_exercises_name ON public.exercises(name);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Exercises are viewable by all authenticated and anon users" ON public.exercises;
CREATE POLICY "Exercises are viewable by all authenticated and anon users" 
  ON public.exercises FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create custom exercises" ON public.exercises;
CREATE POLICY "Authenticated users can create custom exercises" 
  ON public.exercises FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND (created_by IS NULL OR created_by = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update their own custom exercises" ON public.exercises;
CREATE POLICY "Users can update their own custom exercises" 
  ON public.exercises FOR UPDATE USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own custom exercises" ON public.exercises;
CREATE POLICY "Users can delete their own custom exercises" 
  ON public.exercises FOR DELETE USING (created_by = auth.uid());

-- ------------------------------------------------------------------------------
-- 3. WORKOUT SESSIONS TABLE (Logged Training Logs)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  workout_name TEXT NOT NULL,
  workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes INTEGER DEFAULT 60 CHECK (duration_minutes >= 0),
  total_volume_lbs NUMERIC(10,2) DEFAULT 0 CHECK (total_volume_lbs >= 0),
  rpe NUMERIC(3,1) CHECK (rpe >= 1 AND rpe <= 10),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date ON public.workout_sessions(user_id, workout_date DESC);

ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users can view their own workout sessions" 
  ON public.workout_sessions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users can insert their own workout sessions" 
  ON public.workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users can update their own workout sessions" 
  ON public.workout_sessions FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users can delete their own workout sessions" 
  ON public.workout_sessions FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 4. WORKOUT EXERCISES & SETS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
  exercise_name TEXT NOT NULL,
  muscle_group TEXT,
  order_index INTEGER DEFAULT 0,
  sets INTEGER NOT NULL DEFAULT 1 CHECK (sets >= 1),
  reps INTEGER NOT NULL DEFAULT 0 CHECK (reps >= 0),
  weight NUMERIC(7,2) NOT NULL DEFAULT 0 CHECK (weight >= 0),
  rpe NUMERIC(3,1),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_exercises_session ON public.workout_exercises(session_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_exercise ON public.workout_exercises(exercise_id);

ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own exercise sets" ON public.workout_exercises;
CREATE POLICY "Users can view their own exercise sets" 
  ON public.workout_exercises FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions
      WHERE workout_sessions.id = workout_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert their own exercise sets" ON public.workout_exercises;
CREATE POLICY "Users can insert their own exercise sets" 
  ON public.workout_exercises FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_sessions
      WHERE workout_sessions.id = workout_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update their own exercise sets" ON public.workout_exercises;
CREATE POLICY "Users can update their own exercise sets" 
  ON public.workout_exercises FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions
      WHERE workout_sessions.id = workout_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete their own exercise sets" ON public.workout_exercises;
CREATE POLICY "Users can delete their own exercise sets" 
  ON public.workout_exercises FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions
      WHERE workout_sessions.id = workout_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------------------------
-- 5. BODY METRICS & BIOMETRIC TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.body_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  weight_kg NUMERIC(5,2) NOT NULL,
  body_fat NUMERIC(4,2),
  chest_cm NUMERIC(5,2),
  waist_cm NUMERIC(5,2),
  arms_cm NUMERIC(5,2),
  hips_cm NUMERIC(5,2),
  thighs_cm NUMERIC(5,2),
  notes TEXT,
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_body_metrics_user_date ON public.body_metrics(user_id, recorded_at DESC);

ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own body metrics" ON public.body_metrics;
CREATE POLICY "Users can view their own body metrics" 
  ON public.body_metrics FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own body metrics" ON public.body_metrics;
CREATE POLICY "Users can insert their own body metrics" 
  ON public.body_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own body metrics" ON public.body_metrics;
CREATE POLICY "Users can update their own body metrics" 
  ON public.body_metrics FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own body metrics" ON public.body_metrics;
CREATE POLICY "Users can delete their own body metrics" 
  ON public.body_metrics FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 6. ROUTINES & SPLIT PROTOCOLS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_goal TEXT DEFAULT 'Hypertrophy',
  split_type TEXT DEFAULT 'Push Pull Legs',
  difficulty TEXT DEFAULT 'Intermediate',
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_routines_user_id ON public.routines(user_id);
CREATE INDEX IF NOT EXISTS idx_routines_is_public ON public.routines(is_public);

ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own or public routines" ON public.routines;
CREATE POLICY "Users can view their own or public routines" 
  ON public.routines FOR SELECT USING (auth.uid() = user_id OR is_public = true);

DROP POLICY IF EXISTS "Users can insert their own routines" ON public.routines;
CREATE POLICY "Users can insert their own routines" 
  ON public.routines FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own routines" ON public.routines;
CREATE POLICY "Users can update their own routines" 
  ON public.routines FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own routines" ON public.routines;
CREATE POLICY "Users can delete their own routines" 
  ON public.routines FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 7. DAILY NUTRITION & MACROS MATRIX
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_nutrition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  calories INTEGER NOT NULL DEFAULT 0 CHECK (calories >= 0),
  protein NUMERIC(6,1) NOT NULL DEFAULT 0 CHECK (protein >= 0),
  carbs NUMERIC(6,1) NOT NULL DEFAULT 0 CHECK (carbs >= 0),
  fats NUMERIC(6,1) NOT NULL DEFAULT 0 CHECK (fats >= 0),
  water_ml INTEGER NOT NULL DEFAULT 0 CHECK (water_ml >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_nutrition_date UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_nutrition_user_date ON public.daily_nutrition(user_id, date DESC);

ALTER TABLE public.daily_nutrition ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own nutrition" ON public.daily_nutrition;
CREATE POLICY "Users can view their own nutrition" 
  ON public.daily_nutrition FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own nutrition" ON public.daily_nutrition;
CREATE POLICY "Users can insert their own nutrition" 
  ON public.daily_nutrition FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own nutrition" ON public.daily_nutrition;
CREATE POLICY "Users can update their own nutrition" 
  ON public.daily_nutrition FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own nutrition" ON public.daily_nutrition;
CREATE POLICY "Users can delete their own nutrition" 
  ON public.daily_nutrition FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 8. PERSONAL RECORDS (PR TRACKING & 1RM)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
  exercise_name TEXT NOT NULL,
  weight NUMERIC(7,2) NOT NULL CHECK (weight > 0),
  reps INTEGER NOT NULL CHECK (reps > 0),
  estimated_1rm NUMERIC(7,2) NOT NULL,
  achieved_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_exercise_record UNIQUE(user_id, exercise_name)
);

CREATE INDEX IF NOT EXISTS idx_pr_user_exercise ON public.personal_records(user_id, exercise_name);

ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own PRs" ON public.personal_records;
CREATE POLICY "Users can view their own PRs" 
  ON public.personal_records FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own PRs" ON public.personal_records;
CREATE POLICY "Users can insert their own PRs" 
  ON public.personal_records FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own PRs" ON public.personal_records;
CREATE POLICY "Users can update their own PRs" 
  ON public.personal_records FOR UPDATE USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 9. COMMUNITY FEEDS (POSTS, LIKES, COMMENTS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('PROGRESS', 'ROUTINE', 'QUESTION', 'GENERAL')),
  title TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  routine_id UUID REFERENCES public.routines(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;
CREATE POLICY "Anyone can view posts" 
  ON public.posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
CREATE POLICY "Authenticated users can create posts" 
  ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
CREATE POLICY "Users can update their own posts" 
  ON public.posts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
CREATE POLICY "Users can delete their own posts" 
  ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Post Likes
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_post_user_like UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_post_id ON public.likes(post_id);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view likes" ON public.likes;
CREATE POLICY "Anyone can view likes" 
  ON public.likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can like posts" ON public.likes;
CREATE POLICY "Authenticated users can like posts" 
  ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove their likes" ON public.likes;
CREATE POLICY "Users can remove their likes" 
  ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- Post Comments
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;
CREATE POLICY "Anyone can view comments" 
  ON public.comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can add comments" ON public.comments;
CREATE POLICY "Authenticated users can add comments" 
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
CREATE POLICY "Users can delete their own comments" 
  ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 10. AUTOMATED TRIGGERS & BUSINESS LOGIC
-- ------------------------------------------------------------------------------

-- Trigger 1: Auto-Create Profile with 0 XP, LVL 1, and 'NEURAL INITIATE' upon Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    username, 
    avatar_url,
    xp,
    level,
    rank_tier
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Operative ' || substr(NEW.id::text, 1, 6)),
    COALESCE(NEW.raw_user_meta_data->>'username', 'op_' || substr(NEW.id::text, 1, 8)),
    NEW.raw_user_meta_data->>'avatar_url',
    0,
    1,
    'NEURAL INITIATE'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- Trigger 2: Auto-Update Timestamp Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_workout_sessions_updated_at ON public.workout_sessions;
CREATE TRIGGER trg_workout_sessions_updated_at
  BEFORE UPDATE ON public.workout_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_routines_updated_at ON public.routines;
CREATE TRIGGER trg_routines_updated_at
  BEFORE UPDATE ON public.routines
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_daily_nutrition_updated_at ON public.daily_nutrition;
CREATE TRIGGER trg_daily_nutrition_updated_at
  BEFORE UPDATE ON public.daily_nutrition
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger 3: Automatic Server-Side XP & Rank Progression on Completed Workout Sessions
CREATE OR REPLACE FUNCTION public.award_workout_xp()
RETURNS TRIGGER AS $$
DECLARE
  v_exercise_count INTEGER;
  v_xp_earned INTEGER;
  v_current_xp INTEGER;
  v_new_xp INTEGER;
  v_new_level INTEGER;
  v_new_rank TEXT;
BEGIN
  -- Count exercises in this session
  SELECT COUNT(*) INTO v_exercise_count 
  FROM public.workout_exercises 
  WHERE session_id = NEW.id;

  -- 50 base XP + 10 XP per exercise
  v_xp_earned := 50 + (COALESCE(v_exercise_count, 1) * 10);

  -- Fetch current XP
  SELECT xp INTO v_current_xp 
  FROM public.profiles 
  WHERE id = NEW.user_id;

  v_new_xp := COALESCE(v_current_xp, 0) + v_xp_earned;
  v_new_level := FLOOR(SQRT(v_new_xp / 100.0)) + 1;

  -- Determine Rank Tier
  IF v_new_level < 5 THEN
    v_new_rank := 'NEURAL INITIATE';
  ELSIF v_new_level < 15 THEN
    v_new_rank := 'PULSE OPERATIVE';
  ELSIF v_new_level < 30 THEN
    v_new_rank := 'KINETIC ENFORCER';
  ELSIF v_new_level < 50 THEN
    v_new_rank := 'SYNAPSE ELITE';
  ELSE
    v_new_rank := 'CYBERNETIC OVERLORD';
  END IF;

  -- Update Profile
  UPDATE public.profiles
  SET 
    xp = v_new_xp,
    level = v_new_level,
    rank_tier = v_new_rank,
    updated_at = NOW()
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_award_workout_xp ON public.workout_sessions;
CREATE TRIGGER trg_award_workout_xp
  AFTER INSERT ON public.workout_sessions
  FOR EACH ROW EXECUTE FUNCTION public.award_workout_xp();

-- ------------------------------------------------------------------------------
-- 11. COMPREHENSIVE SEED DATA FOR EXERCISES VAULT
-- ------------------------------------------------------------------------------
INSERT INTO public.exercises (name, slug, muscle_group, secondary_muscles, equipment, mechanics, experience_level, category, description, instructions, benefits, tips, is_bodyweight)
VALUES
(
  'Barbell Flat Bench Press',
  'barbell-flat-bench-press',
  'Chest',
  ARRAY['Triceps', 'Front Shoulders', 'Core'],
  'Barbell',
  'Compound',
  'Intermediate',
  'Strength',
  'The premier horizontal pressing movement for maximizing pectoralis major mass and upper body raw pressing power.',
  ARRAY['Lie flat on the bench with eyes directly beneath the racked bar.', 'Retract scapulae and create a slight arch with feet firmly rooted into the floor.', 'Grip the bar just outside shoulder width with a tight overhand grip.', 'Unrack, lower the bar smoothly to your mid-chest just below nipple line.', 'Drive the bar upward powerfully until arms lock out, maintaining scapular retraction.'],
  ARRAY['Maximum chest hypertrophy stimulus', 'Exceptional anterior deltoid and tricep recruitment', 'High transfer to raw upper-body functional power'],
  ARRAY['Never bounce the bar off your ribcage.', 'Keep elbows tucked at roughly 45 to 70 degrees.', 'Maintain full heel contact with the platform.'],
  false
),
(
  'Incline Dumbbell Press',
  'incline-dumbbell-press',
  'Chest',
  ARRAY['Upper Chest (Clavicular Head)', 'Anterior Deltoid', 'Triceps'],
  'Dumbbell',
  'Compound',
  'Intermediate',
  'Hypertrophy',
  'Unilateral horizontal pressing on a 30-degree incline to emphasize upper chest development and balanced motor recruitment.',
  ARRAY['Set adjustable bench to a 30 to 45-degree angle.', 'Kick dumbbells up with your knees to your shoulders as you lie back.', 'Retract shoulder blades and brace your core.', 'Press dumbbells upward in a converging arc without clanging at the top.', 'Lower under control for a 3-second eccentric stretch.'],
  ARRAY['Emphasizes clavicular head of pectoralis major', 'Eliminates bilateral strength imbalances', 'Allows greater natural wrist and shoulder rotation'],
  ARRAY['Avoid setting the incline too steep (over 45 degrees shifts load into front delts).', 'Keep wrists stacked directly over elbows.'],
  false
),
(
  'Cable Chest Fly (Mid-Height)',
  'cable-chest-fly-mid-height',
  'Chest',
  ARRAY['Anterior Deltoid', 'Serratus Anterior'],
  'Cable',
  'Isolation',
  'Beginner',
  'Hypertrophy',
  'Constant-tension adduction movement isolating the pectoralis major through an extended horizontal range of motion.',
  ARRAY['Set pulleys at chest height and grasp handles with an overhand grip.', 'Step forward into a staggered stance with a slight forward torso lean.', 'Bring hands together in a wide hugging motion, squeezing the chest hard at peak contraction.', 'Slowly open arms wide until a deep pectoral stretch is achieved.'],
  ARRAY['Maintains peak tension throughout the entire range of motion', 'Superior inner chest mind-muscle connection', 'Minimal shoulder joint shear force'],
  ARRAY['Keep a soft bend in elbows throughout the repetition.', 'Focus on driving inner elbows toward each other.'],
  false
),
(
  'Conventional Barbell Deadlift',
  'conventional-barbell-deadlift',
  'Back',
  ARRAY['Glutes', 'Hamstrings', 'Erector Spinae', 'Traps', 'Forearms'],
  'Barbell',
  'Compound',
  'Advanced',
  'Strength',
  'The undisputed king of posterior chain strength, loading the spine, glutes, hamstrings, and upper back simultaneously.',
  ARRAY['Stand with feet hip-width apart, barbell cutting over the middle of your shoe laces.', 'Hinge hips back and grip the bar just outside your shins.', 'Pull slack out of the barbell until clicks into plates.', 'Engage lats, wedge hips down, and push the floor away through mid-foot.', 'Lock out hips and knees simultaneously with glutes squeezed tight.'],
  ARRAY['Massive full-body kinetic tension', 'Unmatched posterior chain and spinal erector density', 'Maximum CNS activation and grip strength development'],
  ARRAY['Do not hyperextend your lower back at lockout.', 'Keep the barbell glued against shins and thighs throughout the pull.'],
  false
),
(
  'Overhand Barbell Bent-Over Row',
  'overhand-barbell-bent-over-row',
  'Back',
  ARRAY['Latissimus Dorsi', 'Rhomboids', 'Rear Deltoids', 'Biceps', 'Erectors'],
  'Barbell',
  'Compound',
  'Intermediate',
  'Hypertrophy',
  'Heavy horizontal pull targeting mid-back thickness, lat engagement, and isometric spinal stability.',
  ARRAY['Hinge forward at the hips to a 45-degree angle with knees slightly bent.', 'Grip bar shoulder-width with pronated grip.', 'Pull the barbell toward your lower ribcage/navel, driving through your elbows.', 'Squeeze rhomboids and lats hard at top before controlled descent.'],
  ARRAY['Builds impressive upper back thickness and V-taper depth', 'Strengthens isometric spinal posture', 'Reinforces hip hinge mechanics'],
  ARRAY['Avoid using excessive torso momentum or jerking.', 'Keep spine neutral with chin slightly tucked.'],
  false
),
(
  'Weighted Pull-Ups',
  'weighted-pull-ups',
  'Back',
  ARRAY['Latissimus Dorsi', 'Biceps Brachii', 'Brachialis', 'Lower Trapezius'],
  'Bodyweight',
  'Compound',
  'Advanced',
  'Strength',
  'The gold standard vertical pulling movement for developing lat width, upper back thickness, and functional pulling strength.',
  ARRAY['Attach weight plate to a dip belt or grip a dumbbell between thighs.', 'Grip pull-up bar slightly wider than shoulder width.', 'Depress and retract scapulae before bending elbows.', 'Pull chest up toward the bar until chin clears top edge.', 'Lower under full control to a complete dead hang stretch.'],
  ARRAY['Builds wide lat wingspan and V-taper aesthetic', 'High functional relative strength development', 'Reinforces shoulder girdle stability'],
  ARRAY['Avoid swinging or kicking legs.', 'Ensure full extension at bottom without uncoupling shoulder engagement.'],
  false
),
(
  'Barbell Back Squat (High Bar)',
  'barbell-back-squat-high-bar',
  'Legs',
  ARRAY['Quadriceps', 'Glutes', 'Adductors', 'Core', 'Erectors'],
  'Barbell',
  'Compound',
  'Intermediate',
  'Strength',
  'The foundational lower-body compound movement for quadriceps hypertrophy, glute power, and overall systemic adaptation.',
  ARRAY['Rest the barbell securely across upper trapezius shelf.', 'Unrack with feet shoulder-width apart, toes angled out 15 to 30 degrees.', 'Take a deep intra-abdominal breath and brace core (Valsalva maneuver).', 'Sit hips down between knees until hip crease descends below top of knee.', 'Drive aggressively through midfoot out of the hole, keeping chest tall.'],
  ARRAY['Maximum quadriceps and gluteus maximus recruitment', 'Drives systemic testosterone and growth hormone output', 'Exceptional athletic jumping and sprinting transfer'],
  ARRAY['Do not allow knees to collapse inward (valgus fault).', 'Keep heels firmly planted on the platform.'],
  false
),
(
  'Romanian Deadlift (RDL)',
  'romanian-deadlift-rdl',
  'Legs',
  ARRAY['Hamstrings', 'Gluteus Maximus', 'Erector Spinae', 'Core'],
  'Barbell',
  'Compound',
  'Intermediate',
  'Hypertrophy',
  'Pure hip-hinge isolation overloading the hamstrings and glutes in the lengthened eccentric position.',
  ARRAY['Hold barbell with overhand grip at hip level with soft knees.', 'Push hips backward towards the wall while sliding bar down along thighs.', 'Maintain flat back and neutral neck until hamstrings are fully loaded.', 'Drive hips forward, squeezing glutes hard at top position.'],
  ARRAY['Exceptional hamstring hypertrophy through lengthened stretch', 'Prevents hamstring tears and knee injuries', 'Builds powerful glute lockout strength'],
  ARRAY['Do not turn this into a squat; knee angle remains fixed.', 'Stop descent when hips stop traveling backward.'],
  false
),
(
  'Standing Overhead Barbell Press (OHP)',
  'standing-overhead-barbell-press',
  'Shoulders',
  ARRAY['Anterior Deltoids', 'Lateral Deltoids', 'Triceps', 'Upper Traps', 'Core'],
  'Barbell',
  'Compound',
  'Intermediate',
  'Strength',
  'The ultimate strict vertical pressing movement for boulder shoulders, tricep lockout, and kinetic chain core stabilization.',
  ARRAY['Set bar at clavicle height in rack, grip just outside shoulder width.', 'Squeeze glutes and brace core tight to lock pelvis in place.', 'Press bar straight up, pulling chin back slightly to allow bar clearance.', 'Once bar passes forehead, push head forward into the "window" under lockout.'],
  ARRAY['Full anterior and lateral deltoid structural development', 'Massive core and glute isometric stabilization', 'Builds overhead shoulder joint resiliency'],
  ARRAY['Do not hyperextend lower back to mimic incline bench press.', 'Keep forearms vertically stacked directly under the bar.'],
  false
),
(
  'Dumbbell Lateral Raise',
  'dumbbell-lateral-raise',
  'Shoulders',
  ARRAY['Lateral Deltoid', 'Supraspinatus', 'Upper Trapezius'],
  'Dumbbell',
  'Isolation',
  'Beginner',
  'Hypertrophy',
  'Targeted medial deltoid isolation for creating wide, capped shoulders and enhancing upper-body silhouette width.',
  ARRAY['Stand with slight forward torso hinge, dumbbells resting at sides.', 'With soft elbows, raise arms outward in scapular plane (30 degrees forward).', 'Lead with elbows and lateral delts until arms reach shoulder level.', 'Control the eccentric descent for 2 to 3 seconds.'],
  ARRAY['Direct targeted medial deltoid hypertrophy', 'Creates the coveted 3D capped shoulder aesthetic', 'Low fatigue impact on systemic CNS'],
  ARRAY['Do not swing or use body momentum.', 'Keep thumbs slightly lower than or level with pinkies.'],
  false
),
(
  'Standing Barbell Bicep Curl',
  'standing-barbell-bicep-curl',
  'Arms',
  ARRAY['Biceps Brachii', 'Brachialis', 'Forearm Flexors'],
  'Barbell',
  'Isolation',
  'Beginner',
  'Hypertrophy',
  'The primary mass builder for the biceps brachii, utilizing a straight or EZ-bar for strict elbow flexion overload.',
  ARRAY['Grip barbell shoulder-width with underhand (supinated) grip.', 'Pin elbows close to ribcage with core and glutes engaged.', 'Curl bar up toward collarbones, squeezing biceps hard at peak.', 'Lower the weight under strict eccentric control to full arm extension.'],
  ARRAY['Direct bicep peak and thickness development', 'Strengthens elbow flexion mechanics and forearm grip', 'High mind-muscle contraction feedback'],
  ARRAY['Avoid rocking torso or swinging back.', 'Do not drift elbows forward excessively.'],
  false
),
(
  'Tricep Cable Rope Pushdown',
  'tricep-cable-rope-pushdown',
  'Arms',
  ARRAY['Triceps Lateral Head', 'Triceps Medial Head', 'Triceps Long Head'],
  'Cable',
  'Isolation',
  'Beginner',
  'Hypertrophy',
  'High-tension cable extension isolating the lateral and medial heads of the triceps with a flared lockout contraction.',
  ARRAY['Attach rope attachment to high cable pulley.', 'Grip rope with neutral grip, lean slightly forward with elbows tucked to sides.', 'Extend elbows down forcefully, spreading the rope apart at bottom lockout.', 'Return up slowly until forearms reach parallel to floor.'],
  ARRAY['Constant cable tension throughout whole movement arc', 'Spreading rope at base recruits lateral tricep head deeply', 'Gentle on elbow tendons compared to heavy skull crushers'],
  ARRAY['Keep upper arms locked in place; only forearms should move.', 'Do not let shoulders roll forward at top of rep.'],
  false
),
(
  'Hanging Leg Raises',
  'hanging-leg-raises',
  'Core',
  ARRAY['Rectus Abdominis', 'Hip Flexors', 'Obliques', 'Forearm Grip'],
  'Bodyweight',
  'Isolation',
  'Intermediate',
  'Hypertrophy',
  'Dynamic posterior pelvic tilt movement targeting the lower rectus abdominis and deep abdominal wall stabilization.',
  ARRAY['Hang from pull-up bar with overhand grip and engaged shoulders.', 'Tilt pelvis upward and curl knees/legs up toward chest.', 'Pause at top contraction for 1 second, exhaling all air.', 'Lower legs slowly without swinging or utilizing momentum.'],
  ARRAY['Overloads lower abdominal wall through posterior pelvic rotation', 'Improves grip strength and shoulder hang decompression', 'High core compression strength transfer to heavy squats and deadlifts'],
  ARRAY['Initiate movement by tucking pelvis, not simply swinging hip flexors.', 'Eliminate swing by resetting before every single rep.'],
  true
),
(
  'Cable Woodchopper',
  'cable-woodchopper',
  'Core',
  ARRAY['Internal Obliques', 'External Obliques', 'Transverse Abdominis', 'Shoulders'],
  'Cable',
  'Compound',
  'Intermediate',
  'Athletic',
  'Rotational kinetic core exercise training the transverse plane and multi-segmental rotational power transfer.',
  ARRAY['Position cable pulley at shoulder height with D-handle.', 'Stand sideways to pulley with wide athletic stance, gripping handle with both hands.', 'Rotate torso diagonally across your body while pivoting back foot.', 'Return slowly under control resisting rotation.'],
  ARRAY['Builds functional rotational torque and oblique definition', 'Protects lower spine through active rotational motor control', 'High athletic transfer for throwing, swinging, and martial arts'],
  ARRAY['Rotate through the thoracic spine and hips, not lower lumbar spine.', 'Keep arms extended with slight elbow bend.'],
  false
)
ON CONFLICT (name) DO UPDATE SET
  slug = EXCLUDED.slug,
  muscle_group = EXCLUDED.muscle_group,
  secondary_muscles = EXCLUDED.secondary_muscles,
  equipment = EXCLUDED.equipment,
  mechanics = EXCLUDED.mechanics,
  experience_level = EXCLUDED.experience_level,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  instructions = EXCLUDED.instructions,
  benefits = EXCLUDED.benefits,
  tips = EXCLUDED.tips,
  is_bodyweight = EXCLUDED.is_bodyweight;

-- ==============================================================================
-- END OF SCHEMA SCRIPT
-- ==============================================================================

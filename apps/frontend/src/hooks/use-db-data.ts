import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { sessionSchema, nutritionSchema, profileUpdateSchema, routineSchema, postSchema } from '@/lib/schemas';

// --- Types based on provided schema ---
export type WorkoutSession = {
  id: string;
  user_id: string;
  workout_name: string;
  workout_date: string;
  notes: string | null;
  created_at: string;
};

export type WorkoutExercise = {
  id: string;
  session_id: string;
  exercise_id: string;
  sets: number;
  reps: number;
  weight: number;
  exercise_name?: string; // Joined field
  muscle_group?: string; // Joined field
};

export type BodyMetric = {
  id: string;
  user_id: string;
  weight_kg: number;
  body_fat: number;
  chest_cm: number;
  waist_cm: number;
  arms_cm: number;
  recorded_at: string;
};

// --- Oracle Analytics Helpers ---

/**
 * Calculates Estimated 1RM using Brzycki Formula
 * 1RM = Weight / (1.0278 - (0.0278 * Reps))
 */
export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  if (reps === 0) return 0;
  return weight / (1.0278 - (0.0278 * reps));
}

/**
 * Calculates Muscle Group Distribution (Heatmap)
 * Returns weight distribution across muscle groups
 */
export function useMuscleDistribution() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['muscle-distribution', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          workout_exercises (
            weight,
            sets,
            reps,
            exercises (muscle_group)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const distribution: Record<string, number> = {};
      data.forEach(session => {
        session.workout_exercises.forEach((we: any) => {
          const muscle = we.exercises?.muscle_group || 'Other';
          const volume = we.weight * we.sets * we.reps;
          distribution[muscle] = (distribution[muscle] || 0) + volume;
        });
      });

      return Object.entries(distribution).map(([name, value]) => ({
        name: name.toUpperCase(),
        value
      })).sort((a, b) => b.value - a.value);
    },
    enabled: !!user
  });
}

// --- Hooks ---

export function useWorkouts() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['workouts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          workout_exercises (
            *,
            exercises (*)
          )
        `)
        .eq('user_id', user.id)
        .order('workout_date', { ascending: false });

      if (error) throw error;

      // Transform data to match UI expectations if needed
      return data.map(session => ({
        id: session.id,
        name: session.workout_name,
        date: session.workout_date,
        exercises: session.workout_exercises.map((we: any) => ({
          name: we.exercises?.name || 'Unknown Exercise',
          sets: we.sets,
          reps: we.reps,
          weight: we.weight,
          muscle_group: we.exercises?.muscle_group
        })),
        volume: session.workout_exercises.reduce((acc: number, we: any) => acc + (we.sets * we.reps * we.weight), 0),
        duration: 60 // Mocking duration for now as it's not in schema
      }));
    },
    enabled: !!user,
  });
}

export function useActivityData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['activity', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get workouts from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('workout_date')
        .eq('user_id', user.id)
        .gte('workout_date', new Date().toLocaleDateString('en-CA'));

      if (error) throw error;

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const activityMap: Record<string, number> = {};
      
      // Initialize with 0
      days.forEach(d => activityMap[d] = 0);
      
      data.forEach(d => {
        const dayName = days[new Date(d.workout_date).getDay()];
        activityMap[dayName]++;
      });

      return days.map(day => ({
        day,
        workouts: activityMap[day]
      }));
    },
    enabled: !!user,
  });
}

export function useProgressData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // This is a complex query to get max weight per exercise per month
      // For now, let's just get the raw workout data and transform in JS
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          workout_date,
          workout_exercises (
            weight,
            exercises (name)
          )
        `)
        .eq('user_id', user.id)
        .order('workout_date', { ascending: true });

      if (error) throw error;

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const progress: Record<string, any> = {};

      data.forEach(session => {
        const date = new Date(session.workout_date);
        const monthLabel = months[date.getMonth()];
        
        if (!progress[monthLabel]) {
          progress[monthLabel] = { date: monthLabel, squat: 0, bench: 0, deadlift: 0 };
        }

        session.workout_exercises.forEach((we: any) => {
          const name = we.exercises?.name.toLowerCase();
          if (name?.includes('squat')) progress[monthLabel].squat = Math.max(progress[monthLabel].squat, we.weight);
          if (name?.includes('bench')) progress[monthLabel].bench = Math.max(progress[monthLabel].bench, we.weight);
          if (name?.includes('deadlift')) progress[monthLabel].deadlift = Math.max(progress[monthLabel].deadlift, we.weight);
        });
      });

      return Object.values(progress);
    },
    enabled: !!user,
  });
}

export function useMetricsData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['metrics', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('body_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: true });

      if (error) throw error;
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return data.map(m => ({
        date: months[new Date(m.recorded_at).getMonth()],
        weight: m.weight_kg,
        bodyFat: m.body_fat
      }));
    },
    enabled: !!user,
  });
}

export function useSaveWorkout() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, exercises }: { name: string, exercises: any[] }) => {
      if (!user) throw new Error('Auth required');

      // Zod Validation
      const validated = sessionSchema.parse({ name, exercises });

      // 1. Create Session
      const { data: session, error: sError } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          workout_name: name,
          workout_date: new Date().toLocaleDateString('en-CA')
        })
        .select()
        .single();

      if (sError) throw sError;

      // 2. Add Exercises
      for (const ex of exercises) {
        // Need to find or create the exercise in the 'exercises' table
        // For now, let's assume we search by name and pick first or create
        const { data: existingEx } = await supabase
          .from('exercises')
          .select('id')
          .ilike('name', ex.name)
          .maybeSingle();

        let exId = existingEx?.id;

        if (!exId) {
          const { data: newEx, error: neError } = await supabase
            .from('exercises')
            .insert({ name: ex.name })
            .select()
            .single();
          if (neError) throw neError;
          exId = newEx.id;
        }

        // Add sets
        const { error: weError } = await supabase
          .from('workout_exercises')
          .insert(ex.sets.map((s: any) => ({
            session_id: session.id,
            exercise_id: exId,
            sets: 1, // Store each set as one row
            reps: parseInt(s.reps) || 0,
            weight: parseFloat(s.weight) || 0
          })));

        if (weError) throw weError;
      }

      // 3. Award XP
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
      const xpEarned = 50 + (exercises.length * 10) + (totalSets * 5);
      
      if (currentProfile) {
        const newXp = (currentProfile.xp || 0) + xpEarned;
        const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;

        await supabase
          .from('profiles')
          .update({ xp: newXp, level: newLevel })
          .eq('id', user.id);
        
        return { session, xpEarned, newLevel };
      }

      return { session, xpEarned, newLevel: 1 };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    }
  });
}

export function useSaveMetrics() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metrics: Partial<BodyMetric>) => {
      if (!user) throw new Error('Auth required');

      // Zod Validation (re-using nutrition parts or profile parts)
      const validated = profileUpdateSchema.partial().parse(metrics);

      const { data, error } = await supabase
        .from('body_metrics')
        .insert({
          user_id: user.id,
          weight_kg: metrics.weight_kg,
          body_fat: metrics.body_fat,
          chest_cm: metrics.chest_cm,
          waist_cm: metrics.waist_cm,
          arms_cm: metrics.arms_cm,
          recorded_at: new Date().toLocaleDateString('en-CA')
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    }
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workout_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    }
  });
}

// --- PROFILE ---
export interface Profile {
  id: string;
  username: string;
  full_name: string;
  height_cm: number;
  weight_goal?: number;
  body_fat_goal?: number;
  avatar_url?: string;
  xp: number;
  level: number;
}

export function calculateLevel(xp: number) {
  // Simple level logic: Level = 1 + floor(sqrt(xp / 100))
  // 100 XP -> Level 2
  // 400 XP -> Level 3
  // 900 XP -> Level 4
  return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
}

export function useProfile() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      return data as Profile;
    },
    enabled: !!user
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: Partial<Profile>) => {
      if (!user) throw new Error('Auth required');
      
      const validated = profileUpdateSchema.partial().parse(profile);
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    }
  });
}

// --- ROUTINES ---
export interface Routine {
  id: string;
  name: string;
  exercises: string[];
  created_at?: string;
}

export function useRoutines() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['routines', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      return data.map((r: any) => ({
        id: r.id,
        name: r.name,
        exercises: r.exercises || [],
        created_at: r.created_at
      })) as Routine[];
    },
    enabled: !!user
  });
}

export function useSaveRoutine() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routine: Omit<Routine, 'id'> & { id?: string }) => {
      if (!user) throw new Error('Auth required');
      
      const validated = routineSchema.parse(routine);
      
      const { data, error } = await supabase
        .from('routines')
        .upsert({
          id: routine.id,
          user_id: user.id,
          name: routine.name,
          exercises: routine.exercises
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines', user?.id] });
    }
  });
}

export function useDeleteRoutine() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('routines')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines', user?.id] });
    }
  });
}

export interface Nutrition {
  id: string;
  user_id: string;
  date: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  water_ml: number;
}

export function useNutritionData() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['nutrition', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('daily_nutrition')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as Nutrition[];
    },
    enabled: !!user,
  });
}

export function useSaveNutrition() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: Omit<Nutrition, 'id' | 'user_id' | 'date'> & { id?: string, date?: string }) => {
      if (!user) throw new Error('Auth required');
      
      const validated = nutritionSchema.parse(entry);
      
      const { data, error } = await supabase
        .from('daily_nutrition')
        .upsert({
          ...entry,
          user_id: user.id,
          date: entry.date || new Date().toLocaleDateString('en-CA')
        })
        .select()
        .single();

      if (error) throw error;
      return data as Nutrition;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition', user?.id] });
    }
  });
}

// --- PERSONAL RECORDS ---
export function usePersonalRecords() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['personal-records', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // We need to join with workout_sessions to filter by user_id
      const { data, error } = await supabase
        .from('workout_exercises')
        .select(`
          weight,
          exercises (name),
          workout_sessions!inner(user_id)
        `)
        .eq('workout_sessions.user_id', user.id);

      if (error) throw error;

      const records: Record<string, number> = {};
      data.forEach((row: any) => {
        const name = row.exercises?.name || 'Unknown Exercise';
        const weight = parseFloat(row.weight);
        if (!records[name] || weight > records[name]) {
          records[name] = weight;
        }
      });

      return Object.entries(records).map(([name, weight]) => ({
        name,
        weight
      })).sort((a, b) => b.weight - a.weight);
    },
    enabled: !!user
  });
}

// --- COMMUNITY HOOKS ---

export interface CommunityPost {
  id: string;
  user_id: string;
  type: 'PROGRESS' | 'ROUTINE' | 'QUESTION' | 'GENERAL';
  title?: string;
  content: string;
  image_url?: string;
  routine_id?: string;
  created_at: string;
  profiles?: {
    username: string;
    full_name: string;
    avatar_url?: string;
    level: number;
    xp: number;
  };
  likes_count: number;
  comments_count: number;
  user_has_liked: boolean;
}

export function usePosts(filter: string = "ALL") {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['posts', filter],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url, level, xp),
          likes:likes(count),
          comments:comments(count)
        `)
        .order('created_at', { ascending: false });

      if (filter !== "ALL") {
        query = query.eq('type', filter);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Check if current user has liked each post
      const posts = await Promise.all(data.map(async (p: any) => {
        let user_has_liked = false;
        if (user) {
          const { data: like } = await supabase
            .from('likes')
            .select('*')
            .eq('post_id', p.id)
            .eq('user_id', user.id)
            .maybeSingle();
          user_has_liked = !!like;
        }

        return {
          ...p,
          likes_count: p.likes?.[0]?.count || 0,
          comments_count: p.comments?.[0]?.count || 0,
          user_has_liked
        };
      }));

      return posts as CommunityPost[];
    }
  });
}

export function useCreatePost() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: Omit<CommunityPost, 'id' | 'user_id' | 'created_at' | 'likes_count' | 'comments_count' | 'user_has_liked'>) => {
      if (!user) throw new Error('Auth required');
      
      const validated = postSchema.parse(post);
      
      const { data, error } = await supabase
        .from('posts')
        .insert({
          ...validated,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
}

export function useToggleLike() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, hasLiked }: { postId: string, hasLiked: boolean }) => {
      if (!user) throw new Error('Auth required');
      
      if (hasLiked) {
        await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
      } else {
        await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
}

export function useTopOperatives() {
  return useQuery({
    queryKey: ['top-operatives'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, level, xp')
        .order('xp', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      return data;
    }
  });
}
export function useRpgStats() {
  const { user } = useAuth();
  const { data: workouts } = useWorkouts();
  const { data: records } = usePersonalRecords();
  const { data: nutrition } = useNutritionData();

  return useQuery({
    queryKey: ['rpg-stats', user?.id, workouts?.length, records?.length],
    queryFn: () => {
      if (!user) return [];

      // 1. Power (Max weight normalized to 500 lbs benchmark)
      const maxWeight = records?.length ? Math.max(...records.map(r => r.weight)) : 0;
      const power = Math.min((maxWeight / 500) * 100, 100);

      // 2. Endurance (Volume normalized to 50k weekly volume)
      const weeklyVolume = workouts?.slice(0, 7).reduce((acc, w) => acc + w.volume, 0) || 0;
      const endurance = Math.min((weeklyVolume / 50000) * 100, 100);

      // 3. Stamina (Session frequency)
      const sessions = workouts?.slice(0, 7).length || 0;
      const stamina = Math.min((sessions / 5) * 100, 100);

      // 4. Agility (Variety of exercises)
      const uniqueExercises = new Set(workouts?.flatMap(w => w.exercises.map((ex: any) => ex.name))).size;
      const agility = Math.min((uniqueExercises / 20) * 100, 100);

      // 5. Recovery (Nutrition + Rest balance)
      const today = new Date().toLocaleDateString('en-CA');
      const todayNut = nutrition?.find(n => n.date === today);
      const nutScore = todayNut ? (todayNut.calories / 2500) * 40 : 0;
      const proteinScore = todayNut ? (todayNut.protein / 180) * 20 : 0;
      const sessionScore = stamina > 50 ? 40 : 20;
      const recovery = Math.min(nutScore + proteinScore + sessionScore, 100);

      // 6. Focus (Consistency/Streak)
      const calculateStreak = (workouts: any[]) => {
        if (!workouts || workouts.length === 0) return 0;
        const dates = [...new Set(workouts.map(w => w.date))].sort().reverse();
        let streak = 0;
        let current = new Date();
        current.setHours(0, 0, 0, 0);

        for (const dateStr of dates) {
          const d = new Date(dateStr);
          d.setHours(0, 0, 0, 0);
          const diff = (current.getTime() - d.getTime()) / (1000 * 3600 * 24);
          if (diff <= 1) {
            streak++;
            current = d;
          } else break;
        }
        return streak;
      };
      const streak = calculateStreak(workouts || []);
      const focus = Math.min((streak / 7) * 100, 100);

      return [
        { subject: 'Power', A: Math.round(power), fullMark: 100 },
        { subject: 'Endurance', A: Math.round(endurance), fullMark: 100 },
        { subject: 'Stamina', A: Math.round(stamina), fullMark: 100 },
        { subject: 'Agility', A: Math.round(agility), fullMark: 100 },
        { subject: 'Recovery', A: Math.round(recovery), fullMark: 100 },
        { subject: 'Focus', A: Math.round(focus), fullMark: 100 },
      ];
    },
    enabled: !!user
  });
}
export function useSaveExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exercise: { name: string, muscle_group: string }) => {
      const { data, error } = await supabase
        .from('exercises')
        .upsert({
          ...exercise,
          is_custom: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['rpg-stats'] });
    }
  });
}

export function useAchievements() {
  const { data: workouts } = useWorkouts();
  const { data: records } = usePersonalRecords();
  const { data: nutrition } = useNutritionData();
  const { data: routines } = useRoutines();
  const { data: profile } = useProfile();

  return useQuery({
    queryKey: ['achievements', workouts?.length, records?.length, (nutrition || []).length, (routines || []).length, profile?.level],
    queryFn: () => {
      const calculateStreak = (workouts: any[]) => {
        if (!workouts || workouts.length === 0) return 0;
        const dates = [...new Set(workouts.map(w => w.date))].sort().reverse();
        let streak = 0;
        let current = new Date();
        current.setHours(0, 0, 0, 0);
        for (const dateStr of dates) {
          const d = new Date(dateStr);
          d.setHours(0, 0, 0, 0);
          const diff = Math.floor((current.getTime() - d.getTime()) / (1000 * 3600 * 24));
          if (diff <= 1) { streak++; current = d; } else break;
        }
        return streak;
      };

      const streak = calculateStreak(workouts || []);
      const maxVolume = (workouts || []).length > 0 ? Math.max(...(workouts || []).map(w => w.volume)) : 0;
      const maxDuration = (workouts || []).length > 0 ? Math.max(...(workouts || []).map(w => w.duration)) : 0;
      const totalVolume = (workouts || []).reduce((acc, w) => acc + w.volume, 0);

      return [
        {
          id: 'first-blood',
          title: 'First Blood',
          description: 'Commence your first training protocol.',
          icon: 'Sword',
          isUnlocked: (workouts || []).length > 0
        },
        {
          id: 'protocol-breached',
          title: 'Protocol Breached',
          description: 'Establish a new performance record.',
          icon: 'Target',
          isUnlocked: (records || []).length > 0
        },
        {
          id: 'undying-operative',
          title: 'Undying Operative',
          description: 'Maintain a 7-day synchronization streak.',
          icon: 'Flame',
          isUnlocked: streak >= 7
        },
        {
          id: 'the-titan',
          title: 'The Titan',
          description: 'Move over 10,000 LBS in a single session.',
          icon: 'Weight',
          isUnlocked: maxVolume >= 10000
        },
        {
          id: 'architect-of-iron',
          title: 'Architect of Iron',
          description: 'Construct 3 custom training routines.',
          icon: 'Shield',
          isUnlocked: (routines || []).length >= 3
        },
        {
          id: 'absolute-unit',
          title: 'Absolute Unit',
          description: 'Surpass 100,000 LBS of historical volume.',
          icon: 'Weight',
          isUnlocked: totalVolume >= 100000
        },
        {
          id: 'overdrive',
          title: 'Overdrive',
          description: 'Surpass 90 minutes of active operation.',
          icon: 'Zap',
          isUnlocked: maxDuration >= 90
        },
        {
          id: 'nutrition-prophet',
          title: 'Nutrition Prophet',
          description: 'Log 7 consecutive days of biometric data.',
          icon: 'Salad',
          isUnlocked: (nutrition || []).length >= 7
        },
        {
          id: 'veteran-operative',
          title: 'Veteran Operative',
          description: 'Achieve Operational Level 10.',
          icon: 'Trophy',
          isUnlocked: (profile?.level || 1) >= 10
        }
      ];
    }
  });
}

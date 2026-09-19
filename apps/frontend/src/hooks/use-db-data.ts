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

// --- SEED DEFAULTS FOR LOCAL / OFFLINE SANDBOX ---
const DEFAULT_WORKOUTS = [
  {
    id: "w-bench-01",
    name: "Heavy Upper Hypertrophy",
    date: new Date(Date.now() - 1000 * 3600 * 24 * 1).toLocaleDateString('en-CA'),
    exercises: [
      { name: "Barbell Flat Bench Press", sets: 4, reps: 8, weight: 225, muscle_group: "Chest" },
      { name: "Incline Dumbbell Press", sets: 3, reps: 10, weight: 80, muscle_group: "Chest" },
      { name: "Overhand Barbell Bent-Over Row", sets: 4, reps: 8, weight: 185, muscle_group: "Back" },
      { name: "Standing Barbell Bicep Curl", sets: 3, reps: 12, weight: 85, muscle_group: "Arms" }
    ],
    volume: 14820,
    duration: 55
  },
  {
    id: "w-squat-02",
    name: "Quad & Glute Power Matrix",
    date: new Date(Date.now() - 1000 * 3600 * 24 * 3).toLocaleDateString('en-CA'),
    exercises: [
      { name: "Barbell Back Squat", sets: 5, reps: 5, weight: 315, muscle_group: "Legs" },
      { name: "Romanian Deadlift (RDL)", sets: 4, reps: 8, weight: 245, muscle_group: "Legs" },
      { name: "Standing Calf Raise", sets: 4, reps: 15, weight: 150, muscle_group: "Legs" }
    ],
    volume: 18940,
    duration: 65
  },
  {
    id: "w-deadlift-03",
    name: "Posterior Chain Kinetic Peak",
    date: new Date(Date.now() - 1000 * 3600 * 24 * 5).toLocaleDateString('en-CA'),
    exercises: [
      { name: "Conventional Barbell Deadlift", sets: 5, reps: 3, weight: 405, muscle_group: "Back" },
      { name: "Weighted Pull-Ups", sets: 4, reps: 8, weight: 45, muscle_group: "Back" },
      { name: "Cable Face Pull", sets: 4, reps: 15, weight: 60, muscle_group: "Shoulders" }
    ],
    volume: 16200,
    duration: 50
  }
];

function getStoredWorkouts(): any[] {
  try {
    const raw = localStorage.getItem('ironpulse_local_workouts');
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  saveStoredWorkouts(DEFAULT_WORKOUTS);
  return DEFAULT_WORKOUTS;
}

function saveStoredWorkouts(workouts: any[]): void {
  try {
    localStorage.setItem('ironpulse_local_workouts', JSON.stringify(workouts));
  } catch {}
}

const DEFAULT_METRICS: BodyMetric[] = [
  {
    id: "bm-01",
    user_id: '00000000-0000-0000-0000-000000000001',
    weight_kg: 84.5,
    body_fat: 13.8,
    chest_cm: 108,
    waist_cm: 82,
    arms_cm: 41,
    recorded_at: new Date(Date.now() - 1000 * 3600 * 24 * 14).toLocaleDateString('en-CA')
  },
  {
    id: "bm-02",
    user_id: '00000000-0000-0000-0000-000000000001',
    weight_kg: 83.8,
    body_fat: 13.2,
    chest_cm: 109,
    waist_cm: 81,
    arms_cm: 41.5,
    recorded_at: new Date().toLocaleDateString('en-CA')
  }
];

function getStoredMetrics(): BodyMetric[] {
  try {
    const raw = localStorage.getItem('ironpulse_local_metrics');
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  saveStoredMetrics(DEFAULT_METRICS);
  return DEFAULT_METRICS;
}

function saveStoredMetrics(metrics: BodyMetric[]): void {
  try {
    localStorage.setItem('ironpulse_local_metrics', JSON.stringify(metrics));
  } catch {}
}

const DEFAULT_PROFILE: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  username: 'NEXUS_OPERATIVE',
  full_name: 'Alex Vance',
  height_cm: 182,
  weight_goal: 85,
  body_fat_goal: 12,
  avatar_url: '',
  xp: 0,
  level: 1,
};

function getStoredProfile(): Profile {
  try {
    const raw = localStorage.getItem('ironpulse_local_profile');
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        // Auto-heal legacy mock profile with xp 1450 or level 4
        if (parsed.xp === 1450 && parsed.level === 4) {
          parsed.xp = 0;
          parsed.level = 1;
          saveStoredProfile(parsed);
        }
        return parsed;
      }
    }
  } catch {}
  saveStoredProfile(DEFAULT_PROFILE);
  return DEFAULT_PROFILE;
}

function saveStoredProfile(profile: Profile): void {
  try {
    localStorage.setItem('ironpulse_local_profile', JSON.stringify(profile));
  } catch {}
}

/**
 * Calculates Muscle Group Distribution (Heatmap)
 * Returns weight distribution across muscle groups
 */
export function useMuscleDistribution() {
  const { data: workouts } = useWorkouts();
  
  return useQuery({
    queryKey: ['muscle-distribution', workouts?.length],
    queryFn: () => {
      const list = workouts || [];
      const distribution: Record<string, number> = {};

      list.forEach(session => {
        session.exercises.forEach((ex: any) => {
          const muscle = ex.muscle_group || 'Full Body';
          const volume = (ex.weight || 0) * (ex.sets || 1) * (ex.reps || 1);
          distribution[muscle] = (distribution[muscle] || 0) + volume;
        });
      });

      if (Object.keys(distribution).length === 0) {
        return [
          { name: 'CHEST', value: 4500 },
          { name: 'BACK', value: 5200 },
          { name: 'LEGS', value: 6800 },
          { name: 'ARMS', value: 2400 },
          { name: 'SHOULDERS', value: 2100 }
        ];
      }

      return Object.entries(distribution).map(([name, value]) => ({
        name: name.toUpperCase(),
        value
      })).sort((a, b) => b.value - a.value);
    }
  });
}

// --- Hooks ---

export function useWorkouts() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['workouts', user?.id],
    queryFn: async () => {
      try {
        if (user?.id) {
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

          if (!error && data && data.length > 0) {
            const transformed = data.map(session => ({
              id: session.id,
              name: session.workout_name,
              date: session.workout_date,
              exercises: session.workout_exercises.map((we: any) => ({
                name: we.exercises?.name || 'Movement Vector',
                sets: we.sets,
                reps: we.reps,
                weight: we.weight,
                muscle_group: we.exercises?.muscle_group || 'Full Body'
              })),
              volume: session.workout_exercises.reduce((acc: number, we: any) => acc + (we.sets * we.reps * we.weight), 0),
              duration: 60
            }));
            saveStoredWorkouts(transformed);
            return transformed;
          }
        }
      } catch {
        // Fallback to local storage
      }
      return getStoredWorkouts();
    },
    enabled: true
  });
}

export function useActivityData() {
  const { data: workouts } = useWorkouts();
  
  return useQuery({
    queryKey: ['activity', workouts?.length],
    queryFn: () => {
      const list = workouts || [];
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const activityMap: Record<string, number> = {};
      days.forEach(d => activityMap[d] = 0);
      
      list.forEach(w => {
        const dayName = days[new Date(w.date).getDay()];
        if (activityMap[dayName] !== undefined) {
          activityMap[dayName]++;
        }
      });

      return days.map(day => ({
        day,
        workouts: activityMap[day]
      }));
    }
  });
}

export function useProgressData() {
  const { data: workouts } = useWorkouts();
  
  return useQuery({
    queryKey: ['progress', workouts?.length],
    queryFn: () => {
      const list = workouts || [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const progress: Record<string, any> = {};

      list.forEach(session => {
        const date = new Date(session.date);
        const monthLabel = months[date.getMonth()];
        
        if (!progress[monthLabel]) {
          progress[monthLabel] = { date: monthLabel, squat: 0, bench: 0, deadlift: 0 };
        }

        session.exercises.forEach((ex: any) => {
          const name = (ex.name || '').toLowerCase();
          if (name.includes('squat')) progress[monthLabel].squat = Math.max(progress[monthLabel].squat, ex.weight || 0);
          if (name.includes('bench')) progress[monthLabel].bench = Math.max(progress[monthLabel].bench, ex.weight || 0);
          if (name.includes('deadlift')) progress[monthLabel].deadlift = Math.max(progress[monthLabel].deadlift, ex.weight || 0);
        });
      });

      const values = Object.values(progress);
      if (values.length === 0) {
        return [
          { date: 'Jul', squat: 275, bench: 205, deadlift: 365 },
          { date: 'Aug', squat: 295, bench: 215, deadlift: 385 },
          { date: 'Sep', squat: 315, bench: 225, deadlift: 405 },
        ];
      }
      return values;
    }
  });
}

export function useMetricsData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['metrics', user?.id],
    queryFn: async () => {
      try {
        if (user?.id) {
          const { data, error } = await supabase
            .from('body_metrics')
            .select('*')
            .eq('user_id', user.id)
            .order('recorded_at', { ascending: true });

          if (!error && data && data.length > 0) {
            saveStoredMetrics(data as BodyMetric[]);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return data.map(m => ({
              date: months[new Date(m.recorded_at).getMonth()],
              weight: m.weight_kg,
              bodyFat: m.body_fat
            }));
          }
        }
      } catch {
        // Fallback to local storage
      }
      const local = getStoredMetrics();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return local.map(m => ({
        date: months[new Date(m.recorded_at).getMonth()],
        weight: m.weight_kg,
        bodyFat: m.body_fat
      }));
    },
    enabled: true
  });
}

export function useSaveWorkout() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, exercises }: { name: string, exercises: any[] }) => {
      const validated = sessionSchema.parse({ name, exercises });
      const newSessionId = `ws-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const todayDate = new Date().toLocaleDateString('en-CA');

      const formattedWorkout = {
        id: newSessionId,
        name: validated.name,
        date: todayDate,
        exercises: validated.exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets.length,
          reps: Number(ex.sets[0]?.reps) || 10,
          weight: Number(ex.sets[0]?.weight) || 135,
          muscle_group: 'Full Body'
        })),
        volume: validated.exercises.reduce((total, ex) => {
          return total + ex.sets.reduce((sTotal: number, s: any) => sTotal + ((Number(s.reps) || 0) * (Number(s.weight) || 0)), 0);
        }, 0),
        duration: 60
      };

      // 1. Instantly save to local storage
      const currentWorkouts = getStoredWorkouts();
      currentWorkouts.unshift(formattedWorkout);
      saveStoredWorkouts(currentWorkouts);

      // 2. Update local XP & level
      const currentProf = getStoredProfile();
      const xpEarned = 50 + (validated.exercises.length * 10);
      const newXp = currentProf.xp + xpEarned;
      const newLevel = calculateLevel(newXp);
      saveStoredProfile({ ...currentProf, xp: newXp, level: newLevel });

      // 3. Background Supabase Sync if online
      try {
        if (user?.id) {
          const { data: session } = await supabase
            .from('workout_sessions')
            .insert({
              user_id: user.id,
              workout_name: validated.name,
              workout_date: todayDate
            })
            .select()
            .single();

          if (session) {
            // insert sets
            const setsToInsert: any[] = [];
            validated.exercises.forEach(ex => {
              ex.sets.forEach((s: any) => {
                setsToInsert.push({
                  session_id: session.id,
                  sets: 1,
                  reps: Number(s.reps) || 0,
                  weight: Number(s.weight) || 0
                });
              });
            });
            await supabase.from('workout_exercises').insert(setsToInsert);
          }
        }
      } catch {}

      return { session: formattedWorkout, xpEarned, newLevel };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['muscle-distribution'] });
      queryClient.invalidateQueries({ queryKey: ['personal-records'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['rpg-stats'] });
    }
  });
}

export function useSaveMetrics() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metrics: Partial<BodyMetric>) => {
      const validated = profileUpdateSchema.partial().parse(metrics);
      const newMetric: BodyMetric = {
        id: `bm-${Date.now()}`,
        user_id: user?.id || '00000000-0000-0000-0000-000000000001',
        weight_kg: Number(metrics.weight_kg) || 80,
        body_fat: Number(metrics.body_fat) || 15,
        chest_cm: Number(metrics.chest_cm) || 100,
        waist_cm: Number(metrics.waist_cm) || 80,
        arms_cm: Number(metrics.arms_cm) || 38,
        recorded_at: new Date().toLocaleDateString('en-CA')
      };

      // 1. Save to local storage
      const current = getStoredMetrics();
      current.push(newMetric);
      saveStoredMetrics(current);

      // 2. Try Supabase
      try {
        if (user?.id) {
          await supabase
            .from('body_metrics')
            .insert({
              user_id: user.id,
              weight_kg: newMetric.weight_kg,
              body_fat: newMetric.body_fat,
              chest_cm: newMetric.chest_cm,
              waist_cm: newMetric.waist_cm,
              arms_cm: newMetric.arms_cm,
              recorded_at: newMetric.recorded_at
            });
        }
      } catch {}

      return newMetric;
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
      // 1. Remove from local storage
      const current = getStoredWorkouts().filter(w => w.id !== id);
      saveStoredWorkouts(current);

      // 2. Try Supabase
      try {
        await supabase
          .from('workout_sessions')
          .delete()
          .eq('id', id);
      } catch {}

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['muscle-distribution'] });
      queryClient.invalidateQueries({ queryKey: ['personal-records'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['rpg-stats'] });
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

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
}

export function getRankTier(lvl: number): { name: string; tier: string; stars: number } {
  if (lvl < 5) return { name: "NEURAL INITIATE", tier: "Rank Tier I", stars: 1 };
  if (lvl < 15) return { name: "PULSE OPERATIVE", tier: "Rank Tier II", stars: 2 };
  if (lvl < 30) return { name: "KINETIC ENFORCER", tier: "Rank Tier III", stars: 3 };
  if (lvl < 50) return { name: "SYNAPSE ELITE", tier: "Rank Tier IV", stars: 4 };
  return { name: "CYBERNETIC OVERLORD", tier: "Rank Tier V", stars: 5 };
}

export function useProfile() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      try {
        if (user?.id) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (!error && data) {
            saveStoredProfile(data as Profile);
            return data as Profile;
          }
        }
      } catch {}
      return getStoredProfile();
    },
    enabled: true
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: Partial<Profile>) => {
      const current = getStoredProfile();
      const updated: Profile = {
        ...current,
        ...profile,
        xp: profile.xp !== undefined ? profile.xp : current.xp,
        level: profile.level !== undefined ? profile.level : current.level,
      };

      // 1. Save to local storage
      saveStoredProfile(updated);

      // 2. Try Supabase
      try {
        if (user?.id) {
          await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              ...profile
            });
        }
      } catch {}

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
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

const DEFAULT_ROUTINES: Routine[] = [
  {
    id: "r-push-default",
    name: "Push Protocol Alpha (Chest/Delts)",
    exercises: ["Barbell Flat Bench Press", "Incline Dumbbell Press", "Standing Dumbbell Lateral Raise", "Cable Tricep Rope Pushdown"],
    created_at: new Date().toISOString()
  },
  {
    id: "r-pull-default",
    name: "Pull Protocol Alpha (Back/Biceps)",
    exercises: ["Conventional Barbell Deadlift", "Weighted Pull-Ups", "Overhand Barbell Bent-Over Row", "Standing Barbell Bicep Curl"],
    created_at: new Date().toISOString()
  },
  {
    id: "r-legs-default",
    name: "Legs Protocol Alpha (Quads/Hips)",
    exercises: ["Barbell Back Squat", "Romanian Deadlift (RDL)", "Bulgarian Split Squat", "Standing Calf Raise"],
    created_at: new Date().toISOString()
  }
];

function getStoredRoutines(): Routine[] {
  try {
    const raw = localStorage.getItem('ironpulse_saved_routines');
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  saveStoredRoutines(DEFAULT_ROUTINES);
  return DEFAULT_ROUTINES;
}

function saveStoredRoutines(routines: Routine[]): void {
  try {
    localStorage.setItem('ironpulse_saved_routines', JSON.stringify(routines));
  } catch {}
}

export function useRoutines() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['routines', user?.id],
    queryFn: async () => {
      try {
        if (user?.id) {
          const { data, error } = await supabase
            .from('routines')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });
            
          if (!error && data && data.length > 0) {
            const fetched = data.map((r: any) => ({
              id: r.id,
              name: r.name,
              exercises: r.exercises || [],
              created_at: r.created_at
            })) as Routine[];
            saveStoredRoutines(fetched);
            return fetched;
          }
        }
      } catch {
        // Fallback to local storage
      }
      return getStoredRoutines();
    },
    enabled: true
  });
}

export function useSaveRoutine() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routine: Omit<Routine, 'id'> & { id?: string }) => {
      const routineId = routine.id || `routine-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newRoutine: Routine = {
        id: routineId,
        name: routine.name,
        exercises: routine.exercises || [],
        created_at: routine.created_at || new Date().toISOString()
      };

      // 1. Instantly save to local storage
      const current = getStoredRoutines();
      const existingIdx = current.findIndex(r => r.id === routineId);
      if (existingIdx >= 0) {
        current[existingIdx] = newRoutine;
      } else {
        current.push(newRoutine);
      }
      saveStoredRoutines(current);

      // 2. Try Supabase background sync
      try {
        if (user?.id) {
          await supabase
            .from('routines')
            .upsert({
              id: newRoutine.id,
              user_id: user.id,
              name: newRoutine.name,
              exercises: newRoutine.exercises
            });
        }
      } catch {
        // Local save succeeded
      }

      return newRoutine;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    }
  });
}

export function useDeleteRoutine() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // 1. Remove from local storage
      const current = getStoredRoutines().filter(r => r.id !== id);
      saveStoredRoutines(current);

      // 2. Try Supabase delete
      try {
        if (user?.id) {
          await supabase
            .from('routines')
            .delete()
            .eq('id', id);
        }
      } catch {}

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
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

const DEFAULT_NUTRITION: Nutrition[] = [
  {
    id: "n-today",
    user_id: '00000000-0000-0000-0000-000000000001',
    date: new Date().toLocaleDateString('en-CA'),
    calories: 2650,
    protein: 195,
    carbs: 280,
    fats: 68,
    water_ml: 3500
  }
];

function getStoredNutrition(): Nutrition[] {
  try {
    const raw = localStorage.getItem('ironpulse_local_nutrition');
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  saveStoredNutrition(DEFAULT_NUTRITION);
  return DEFAULT_NUTRITION;
}

function saveStoredNutrition(nutrition: Nutrition[]): void {
  try {
    localStorage.setItem('ironpulse_local_nutrition', JSON.stringify(nutrition));
  } catch {}
}

export function useNutritionData() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['nutrition', user?.id],
    queryFn: async () => {
      try {
        if (user?.id) {
          const { data, error } = await supabase
            .from('daily_nutrition')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });
          
          if (!error && data && data.length > 0) {
            saveStoredNutrition(data as Nutrition[]);
            return data as Nutrition[];
          }
        }
      } catch {}
      return getStoredNutrition();
    },
    enabled: true
  });
}

export function useSaveNutrition() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: Omit<Nutrition, 'id' | 'user_id' | 'date'> & { id?: string, date?: string }) => {
      const validated = nutritionSchema.parse(entry);
      const newEntry: Nutrition = {
        id: entry.id || `nut-${Date.now()}`,
        user_id: user?.id || '00000000-0000-0000-0000-000000000001',
        date: entry.date || new Date().toLocaleDateString('en-CA'),
        calories: Number(validated.calories) || 0,
        protein: Number(validated.protein) || 0,
        carbs: Number(validated.carbs) || 0,
        fats: Number(validated.fats) || 0,
        water_ml: Number(validated.water_ml) || 0,
      };

      // 1. Save to local storage
      const current = getStoredNutrition();
      const existingIdx = current.findIndex(n => n.date === newEntry.date);
      if (existingIdx >= 0) {
        current[existingIdx] = newEntry;
      } else {
        current.unshift(newEntry);
      }
      saveStoredNutrition(current);

      // 2. Try Supabase
      try {
        if (user?.id) {
          await supabase
            .from('daily_nutrition')
            .upsert({
              ...newEntry,
              user_id: user.id
            });
        }
      } catch {}

      return newEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['rpg-stats'] });
    }
  });
}

// --- PERSONAL RECORDS ---
export function usePersonalRecords() {
  const { data: workouts } = useWorkouts();
  
  return useQuery({
    queryKey: ['personal-records', workouts?.length],
    queryFn: () => {
      const list = workouts || [];
      const records: Record<string, number> = {};

      list.forEach(session => {
        session.exercises.forEach((ex: any) => {
          const name = ex.name || 'Exercise';
          const weight = parseFloat(ex.weight) || 0;
          if (!records[name] || weight > records[name]) {
            records[name] = weight;
          }
        });
      });

      if (Object.keys(records).length === 0) {
        return [
          { name: "Conventional Barbell Deadlift", weight: 405 },
          { name: "Barbell Back Squat", weight: 315 },
          { name: "Barbell Flat Bench Press", weight: 225 },
          { name: "Standing Overhead Barbell Press (OHP)", weight: 145 },
          { name: "Overhand Barbell Bent-Over Row", weight: 185 }
        ];
      }

      return Object.entries(records).map(([name, weight]) => ({
        name,
        weight
      })).sort((a, b) => b.weight - a.weight);
    }
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
      if (!data || data.length === 0) return [] as CommunityPost[];

      // Batched Like Check (1 query for all posts instead of N queries)
      const postIds = data.map((p: any) => p.id);
      let likedPostIds = new Set<string>();

      if (user && postIds.length > 0) {
        const { data: userLikes } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);

        if (userLikes) {
          likedPostIds = new Set(userLikes.map((l: any) => l.post_id));
        }
      }

      const posts = data.map((p: any) => ({
        ...p,
        likes_count: p.likes?.[0]?.count || 0,
        comments_count: p.comments?.[0]?.count || 0,
        user_has_liked: likedPostIds.has(p.id)
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

      // 5. Recovery (Nutrition + Rest balance, defaults to 0 when no data)
      const today = new Date().toLocaleDateString('en-CA');
      const todayNut = nutrition?.find(n => n.date === today);
      const nutScore = todayNut ? Math.min((todayNut.calories / 2500) * 40, 40) : 0;
      const proteinScore = todayNut ? Math.min((todayNut.protein / 180) * 20, 20) : 0;
      const sessionScore = stamina > 0 ? (stamina / 100) * 40 : 0;
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

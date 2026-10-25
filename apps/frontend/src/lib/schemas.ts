import { z } from "zod";

// Shared Patterns
const numericString = z.string().regex(/^\d*\.?\d*$/).transform(v => v === "" ? 0 : Number(v));

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid operational email"),
  password: z.string().min(6, "Passkey must be at least 6 characters")
});

export const registerSchema = z.object({
  email: z.string().email("Invalid operational email"),
  password: z.string().min(6, "Passkey must be at least 6 characters"),
  username: z.string().min(3, "Codename must be at least 3 characters").max(20),
  fullName: z.string().min(2, "Full identity required")
});

// Enhanced Multi-Step Onboarding Schemas
export const onboardingStep1Schema = z.object({
  fullName: z.string().min(2, "Full operative designation required (min 2 chars)"),
  username: z.string().min(3, "Callsign must be 3-20 characters").max(20, "Callsign maximum 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Callsign must be alphanumeric with underscores"),
  email: z.string().email("Invalid operational email vector"),
  password: z.string().min(6, "Passcode must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirmation passcode required")
});

export const onboardingStep2Schema = z.object({
  gender: z.enum(["male", "female", "cybernetic"]),
  age: z.number().min(14, "Minimum operative age is 14").max(100, "Maximum operative age is 100"),
  heightCm: z.number().min(100, "Height must be at least 100cm").max(250, "Height must be under 250cm"),
  currentWeightKg: z.number().min(30, "Current weight must be at least 30kg").max(300, "Current weight must be under 300kg"),
  targetWeightKg: z.number().min(30, "Target weight must be at least 30kg").max(300, "Target weight must be under 300kg"),
  bodyFatTier: z.enum(["shredded", "athletic", "defined", "building", "power"])
});

export const onboardingStep3Schema = z.object({
  experienceLevel: z.enum(["recruit", "operative", "veteran", "elite"]),
  workoutFrequency: z.number().min(2).max(7),
  primaryGoal: z.enum(["hypertrophy", "strength", "shred", "athleticism"]),
  dreamPhysique: z.enum(["apollo", "juggernaut", "phantom", "commando"]),
  activityLevel: z.enum(["sedentary", "moderate", "active", "extreme"])
});

export type OnboardingData = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: "male" | "female" | "cybernetic";
  age: number;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  bodyFatTier: "shredded" | "athletic" | "defined" | "building" | "power";
  experienceLevel: "recruit" | "operative" | "veteran" | "elite";
  workoutFrequency: number;
  primaryGoal: "hypertrophy" | "strength" | "shred" | "athleticism";
  dreamPhysique: "apollo" | "juggernaut" | "phantom" | "commando";
  activityLevel: "sedentary" | "moderate" | "active" | "extreme";
};

// Workout Schemas
export const setSchema = z.object({
  reps: z.union([z.number(), z.string()]).transform(v => parseInt(v.toString()) || 0),
  weight: z.union([z.number(), z.string()]).transform(v => parseFloat(v.toString()) || 0)
});

export const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name required"),
  sets: z.array(setSchema).min(1, "At least one set required")
});

export const sessionSchema = z.object({
  name: z.string().min(1, "Session protocol name required"),
  exercises: z.array(exerciseSchema).min(1, "At least one exercise required"),
  notes: z.string().optional()
});

// Profile Schemas
export const profileUpdateSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  full_name: z.string().min(2).optional(),
  height_cm: z.number().positive().optional(),
  weight_goal: z.number().positive().optional(),
  body_fat_goal: z.number().min(3).max(50).optional(),
  avatar_url: z.string().url().optional()
});

// Nutrition Schemas
export const nutritionSchema = z.object({
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fats: z.number().min(0),
  water_ml: z.number().min(0).optional()
});

// Community Schemas
export const postSchema = z.object({
  type: z.enum(['PROGRESS', 'ROUTINE', 'QUESTION', 'GENERAL']),
  title: z.string().min(3).max(100).optional(),
  content: z.string().min(5).max(2000),
  image_url: z.string().url().optional(),
  routine_id: z.string().uuid().optional()
});

export const routineSchema = z.object({
  name: z.string().min(1, "Routine name required"),
  exercises: z.array(z.string()).min(1, "At least one exercise ID required")
});

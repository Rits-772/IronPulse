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

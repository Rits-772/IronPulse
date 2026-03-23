import { pgTable, text, serial, uuid, timestamp, date, integer, numeric, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Profiles
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().notNull(),
  username: text("username").unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  heightCm: numeric("height_cm"),
  weightGoal: numeric("weight_goal"),
  bodyFatGoal: numeric("body_fat_goal"),
  xp: integer("xp").default(0).notNull(),
  level: integer("level").default(1).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Exercises
export const exercises = pgTable("exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").unique().notNull(),
  muscleGroup: text("muscle_group"),
  equipment: text("equipment"),
  description: text("description"),
  isBodyweight: boolean("is_bodyweight").default(false),
});

// Workout Sessions
export const workoutSessions = pgTable("workout_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id).notNull(),
  workoutName: text("workout_name").notNull(),
  workoutDate: date("workout_date").defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Workout Exercises (Sets)
export const workoutExercises = pgTable("workout_exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").references(() => workoutSessions.id).notNull(),
  exerciseId: uuid("exercise_id").references(() => exercises.id).notNull(),
  sets: integer("sets").default(1),
  reps: integer("reps").default(0),
  weight: numeric("weight").default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Routines
export const routines = pgTable("routines", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id).notNull(),
  name: text("name").notNull(),
  exercises: jsonb("exercises"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Nutrition
export const dailyNutrition = pgTable("daily_nutrition", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id).notNull(),
  date: date("date").defaultNow(),
  calories: integer("calories").default(0),
  protein: numeric("protein").default("0"),
  carbs: numeric("carbs").default("0"),
  fats: numeric("fats").default("0"),
  waterMl: integer("water_ml").default(0),
});

// Achievements
export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id).notNull(),
  badgeName: text("badge_name").notNull(),
  description: text("description"),
  unlockedAt: timestamp("unlocked_at", { withTimezone: true }).defaultNow(),
});

// Zod Schemas
export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);
export const insertWorkoutSchema = createInsertSchema(workoutSessions);
export const selectWorkoutSchema = createSelectSchema(workoutSessions);
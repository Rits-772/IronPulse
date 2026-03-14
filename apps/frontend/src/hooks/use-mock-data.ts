// Since this is a frontend-only prototype without a real API backend yet,
// we'll implement some mock data hooks that mimic React Query's interface
// to allow for easy swapping later.

import { useState, useEffect } from 'react';

// --- Types ---
export type Workout = {
  id: string;
  name: string;
  date: string;
  duration: number; // minutes
  volume: number; // lbs
  exercises: { name: string; sets: number; reps: number; weight: number }[];
};

export type ProgressData = {
  date: string;
  squat: number;
  bench: number;
  deadlift: number;
};

export type ActivityData = {
  day: string;
  workouts: number;
};

export type BodyMetric = {
  date: string;
  weight: number;
  bodyFat: number;
};

// --- Mock Data ---
const MOCK_WORKOUTS: Workout[] = [
  {
    id: "w1",
    name: "Heavy Legs",
    date: "2023-10-24",
    duration: 75,
    volume: 12500,
    exercises: [
      { name: "Barbell Squat", sets: 4, reps: 5, weight: 315 },
      { name: "Leg Press", sets: 3, reps: 10, weight: 450 },
      { name: "Romanian Deadlift", sets: 3, reps: 8, weight: 225 },
    ]
  },
  {
    id: "w2",
    name: "Push Power",
    date: "2023-10-22",
    duration: 60,
    volume: 8400,
    exercises: [
      { name: "Bench Press", sets: 4, reps: 5, weight: 225 },
      { name: "Overhead Press", sets: 3, reps: 8, weight: 135 },
      { name: "Tricep Extension", sets: 3, reps: 12, weight: 50 },
    ]
  },
  {
    id: "w3",
    name: "Pull & Core",
    date: "2023-10-20",
    duration: 65,
    volume: 9200,
    exercises: [
      { name: "Deadlift", sets: 3, reps: 5, weight: 405 },
      { name: "Pull-ups", sets: 4, reps: 8, weight: 0 },
      { name: "Barbell Row", sets: 3, reps: 8, weight: 185 },
    ]
  }
];

const MOCK_PROGRESS: ProgressData[] = [
  { date: "Jan", squat: 275, bench: 185, deadlift: 315 },
  { date: "Feb", squat: 285, bench: 195, deadlift: 335 },
  { date: "Mar", squat: 295, bench: 205, deadlift: 365 },
  { date: "Apr", squat: 305, bench: 215, deadlift: 385 },
  { date: "May", squat: 315, bench: 225, deadlift: 405 },
];

const MOCK_ACTIVITY: ActivityData[] = [
  { day: "Mon", workouts: 1 },
  { day: "Tue", workouts: 0 },
  { day: "Wed", workouts: 1 },
  { day: "Thu", workouts: 1 },
  { day: "Fri", workouts: 0 },
  { day: "Sat", workouts: 2 },
  { day: "Sun", workouts: 0 },
];

const MOCK_METRICS: BodyMetric[] = [
  { date: "Jan", weight: 195, bodyFat: 18 },
  { date: "Feb", weight: 192, bodyFat: 17 },
  { date: "Mar", weight: 190, bodyFat: 16 },
  { date: "Apr", weight: 188, bodyFat: 15.5 },
  { date: "May", weight: 185, bodyFat: 14 },
];

// --- Hooks ---

// Helper to simulate network delay
const useDelay = <T>(data: T, delayMs: number = 500) => {
  const [state, setState] = useState<{ data: T | undefined, isLoading: boolean }>({ data: undefined, isLoading: true });
  useEffect(() => {
    const timer = setTimeout(() => {
      setState({ data, isLoading: false });
    }, delayMs);
    return () => clearTimeout(timer);
  }, [data, delayMs]);
  return state;
};

export function useWorkouts() {
  return useDelay(MOCK_WORKOUTS);
}

export function useProgressData() {
  return useDelay(MOCK_PROGRESS);
}

export function useActivityData() {
  return useDelay(MOCK_ACTIVITY);
}

export function useMetricsData() {
  return useDelay(MOCK_METRICS);
}

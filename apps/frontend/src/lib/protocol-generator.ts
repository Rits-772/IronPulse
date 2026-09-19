import { EXERCISE_DATABASE, ExerciseDefinition } from './exercise-database';

export type SplitType = 
  | 'Push / Pull / Legs (PPL)' 
  | 'Upper / Lower' 
  | 'Full Body Protocol' 
  | 'Arnold Split (Antagonistic)' 
  | 'Cyber 5x5 Power Protocol' 
  | 'Hypertrophy Bro Split';

export type TrainingGoal = 'Hypertrophy' | 'Max Strength' | 'Athletic Power' | 'Fat Loss & Conditioning';
export type ExperienceLevel = 'Initiate' | 'Operative' | 'Elite';

export interface GeneratedRoutineDay {
  dayNumber: number;
  dayName: string;
  focus: string;
  exercises: Array<{
    name: string;
    exerciseId?: string;
    sets: number;
    reps: string;
    rpe: number;
    restSeconds: number;
    notes: string;
  }>;
}

export interface GeneratedProtocol {
  title: string;
  splitType: SplitType;
  goal: TrainingGoal;
  experienceLevel: ExperienceLevel;
  daysPerWeek: number;
  description: string;
  weeklyVolumeGuidance: string;
  days: GeneratedRoutineDay[];
}

export function generateSmartProtocol(params: {
  splitType: SplitType;
  goal: TrainingGoal;
  experienceLevel: ExperienceLevel;
  daysPerWeek: number;
}): GeneratedProtocol {
  const { splitType, goal, experienceLevel, daysPerWeek } = params;

  // Configuration modifiers based on goal & level
  const setModifier = experienceLevel === 'Elite' ? 4 : experienceLevel === 'Operative' ? 3 : 3;
  const repScheme = goal === 'Max Strength' ? '4-6' : goal === 'Hypertrophy' ? '8-12' : goal === 'Athletic Power' ? '5-8' : '12-15';
  const restTime = goal === 'Max Strength' ? 180 : goal === 'Hypertrophy' ? 90 : goal === 'Athletic Power' ? 120 : 60;
  const rpeTarget = experienceLevel === 'Elite' ? 9 : 8;

  let days: GeneratedRoutineDay[] = [];
  let description = '';

  if (splitType === 'Push / Pull / Legs (PPL)') {
    description = 'High-frequency hypertrophic protocol organizing movement patterns around synergistic kinetic muscle chains.';
    
    const pushExercises = [
      { name: 'Barbell Flat Bench Press', sets: setModifier + 1, reps: repScheme, rpe: rpeTarget, restSeconds: restTime, notes: 'Primary compound press.' },
      { name: 'Incline Dumbbell Press', sets: setModifier, reps: repScheme, rpe: rpeTarget, restSeconds: 90, notes: 'Upper chest focus.' },
      { name: 'Standing Dumbbell Lateral Raise', sets: setModifier + 1, reps: '12-15', rpe: 9, restSeconds: 60, notes: 'Side deltoid width.' },
      { name: 'Standing Overhead Barbell Press (OHP)', sets: setModifier, reps: repScheme, rpe: rpeTarget, restSeconds: restTime, notes: 'Overhead strength.' },
      { name: 'Cable Tricep Rope Pushdown', sets: setModifier, reps: '10-15', rpe: 9, restSeconds: 60, notes: 'Tricep lateral head.' },
      { name: 'EZ-Bar Skull Crushers (Lying Tricep Extension)', sets: setModifier, reps: '8-12', rpe: 8, restSeconds: 75, notes: 'Tricep long head stretch.' },
    ];

    const pullExercises = [
      { name: 'Conventional Barbell Deadlift', sets: setModifier, reps: goal === 'Max Strength' ? '3-5' : '6-8', rpe: rpeTarget, restSeconds: 180, notes: 'Posterior chain recruitment.' },
      { name: 'Weighted Pull-Ups', sets: setModifier, reps: '6-10', rpe: rpeTarget, restSeconds: 90, notes: 'Vertical pulling lat width.' },
      { name: 'Overhand Barbell Bent-Over Row', sets: setModifier, reps: repScheme, rpe: rpeTarget, restSeconds: 90, notes: 'Horizontal thickness.' },
      { name: 'Face Pulls with Rope', sets: setModifier + 1, reps: '15-20', rpe: 8, restSeconds: 60, notes: 'Rotator cuff & rear delts.' },
      { name: 'Standing Barbell Bicep Curl', sets: setModifier, reps: '8-10', rpe: 8.5, restSeconds: 60, notes: 'Bicep mass builder.' },
      { name: 'Dumbbell Hammer Curl', sets: setModifier, reps: '10-12', rpe: 8.5, restSeconds: 60, notes: 'Brachialis & forearm thickness.' },
    ];

    const legExercises = [
      { name: 'Barbell Back Squat', sets: setModifier + 1, reps: repScheme, rpe: rpeTarget, restSeconds: restTime, notes: 'Primary quad/glute motor drive.' },
      { name: 'Romanian Deadlift (RDL)', sets: setModifier, reps: '8-10', rpe: rpeTarget, restSeconds: 90, notes: 'Hamstring stretch overload.' },
      { name: 'Bulgarian Split Squat', sets: setModifier, reps: '10-12', rpe: 8.5, restSeconds: 75, notes: 'Unilateral quad & glute stabilizer.' },
      { name: 'Seated Leg Extension', sets: setModifier, reps: '12-15', rpe: 9, restSeconds: 60, notes: 'Quad peak contraction burnout.' },
      { name: 'Lying Hamstring Leg Curl', sets: setModifier, reps: '10-12', rpe: 9, restSeconds: 60, notes: 'Direct hamstring knee flexion.' },
      { name: 'Standing Calf Raise', sets: setModifier + 1, reps: '15-20', rpe: 9, restSeconds: 45, notes: '2s pause at bottom stretch.' },
    ];

    if (daysPerWeek >= 6) {
      days = [
        { dayNumber: 1, dayName: 'Push Alpha', focus: 'Chest, Shoulders & Triceps (Strength Focus)', exercises: pushExercises },
        { dayNumber: 2, dayName: 'Pull Alpha', focus: 'Back, Rear Delts & Biceps (Heavy Pull)', exercises: pullExercises },
        { dayNumber: 3, dayName: 'Legs Alpha', focus: 'Quads, Hamstrings & Calves (Squat Focus)', exercises: legExercises },
        { dayNumber: 4, dayName: 'Push Beta', focus: 'Chest Hypertrophy & Deltoid Volume', exercises: pushExercises.map(e => ({ ...e, reps: '10-15' })) },
        { dayNumber: 5, dayName: 'Pull Beta', focus: 'Lat Width & Upper Back Density', exercises: pullExercises.map(e => ({ ...e, reps: '10-15' })) },
        { dayNumber: 6, dayName: 'Legs Beta', focus: 'Hips, Hamstrings & Glutes (Hinge Focus)', exercises: legExercises.map(e => ({ ...e, reps: '12-15' })) },
      ];
    } else if (daysPerWeek >= 4) {
      days = [
        { dayNumber: 1, dayName: 'Push Prime', focus: 'Chest, Anterior/Lateral Delts & Triceps', exercises: pushExercises },
        { dayNumber: 2, dayName: 'Pull Prime', focus: 'Lats, Rhomboids, Rear Delts & Biceps', exercises: pullExercises },
        { dayNumber: 3, dayName: 'Legs Prime', focus: 'Quads, Hamstrings, Glutes & Calves', exercises: legExercises },
        { dayNumber: 4, dayName: 'Upper Cyber Dynamic', focus: 'Upper Body Hypertrophy & Weak Point Overload', exercises: [pushExercises[1], pullExercises[1], pushExercises[2], pullExercises[4], pushExercises[4]] },
      ];
    } else {
      days = [
        { dayNumber: 1, dayName: 'Push Protocol', focus: 'Chest, Shoulders & Triceps', exercises: pushExercises },
        { dayNumber: 2, dayName: 'Pull Protocol', focus: 'Back, Traps & Biceps', exercises: pullExercises },
        { dayNumber: 3, dayName: 'Legs Protocol', focus: 'Quads, Hamstrings & Calves', exercises: legExercises },
      ];
    }
  } else if (splitType === 'Upper / Lower') {
    description = 'Balanced 4-day structural split maximizing recovery between kinetic muscle groups.';
    days = [
      {
        dayNumber: 1,
        dayName: 'Upper Heavy Power',
        focus: 'Chest, Back, Shoulders & Arms (Strength)',
        exercises: [
          { name: 'Barbell Flat Bench Press', sets: 4, reps: repScheme, rpe: rpeTarget, restSeconds: restTime, notes: 'Heavy horizontal press.' },
          { name: 'Overhand Barbell Bent-Over Row', sets: 4, reps: repScheme, rpe: rpeTarget, restSeconds: restTime, notes: 'Heavy horizontal row.' },
          { name: 'Standing Overhead Barbell Press (OHP)', sets: 3, reps: repScheme, rpe: rpeTarget, restSeconds: 90, notes: 'Vertical shoulder power.' },
          { name: 'Weighted Pull-Ups', sets: 3, reps: '6-8', rpe: 8.5, restSeconds: 90, notes: 'Vertical pull.' },
          { name: 'Standing Barbell Bicep Curl', sets: 3, reps: '8-10', rpe: 8, restSeconds: 60, notes: 'Arm volume.' },
          { name: 'Cable Tricep Rope Pushdown', sets: 3, reps: '10-12', rpe: 8.5, restSeconds: 60, notes: 'Tricep pump.' },
        ]
      },
      {
        dayNumber: 2,
        dayName: 'Lower Heavy Power',
        focus: 'Squats, Hinges & Calves (Strength)',
        exercises: [
          { name: 'Barbell Back Squat', sets: 4, reps: repScheme, rpe: rpeTarget, restSeconds: restTime, notes: 'Primary quad compound.' },
          { name: 'Romanian Deadlift (RDL)', sets: 3, reps: '6-8', rpe: rpeTarget, restSeconds: 120, notes: 'Hamstring & glute hinge.' },
          { name: '45-Degree Leg Press', sets: 3, reps: '10-12', rpe: 8.5, restSeconds: 90, notes: 'Quad hypertrophy.' },
          { name: 'Lying Hamstring Leg Curl', sets: 3, reps: '10-12', rpe: 9, restSeconds: 60, notes: 'Knee flexion.' },
          { name: 'Standing Calf Raise', sets: 4, reps: '12-15', rpe: 9, restSeconds: 45, notes: 'Calf overload.' },
          { name: 'Hanging Leg / Knee Raise', sets: 3, reps: '12-15', rpe: 8, restSeconds: 60, notes: 'Core stabilization.' },
        ]
      },
      {
        dayNumber: 3,
        dayName: 'Upper Hypertrophy Flow',
        focus: 'Chest, Lats, Delts & Arms (Volume)',
        exercises: [
          { name: 'Incline Dumbbell Press', sets: 4, reps: '8-12', rpe: 8.5, restSeconds: 90, notes: 'Clavicular chest.' },
          { name: 'Wide-Grip Lat Pulldown', sets: 4, reps: '10-12', rpe: 8.5, restSeconds: 75, notes: 'Lat sweep.' },
          { name: 'Standing Dumbbell Lateral Raise', sets: 4, reps: '12-15', rpe: 9, restSeconds: 45, notes: 'Side delt burn.' },
          { name: 'Seated Cable Row (Close Grip)', sets: 3, reps: '10-12', rpe: 8.5, restSeconds: 60, notes: 'Mid-back thickness.' },
          { name: 'Incline Dumbbell Curl', sets: 3, reps: '10-12', rpe: 8.5, restSeconds: 60, notes: 'Long head bicep peak.' },
          { name: 'Overhead Cable Tricep Extension', sets: 3, reps: '12-15', rpe: 9, restSeconds: 60, notes: 'Tricep long head stretch.' },
        ]
      },
      {
        dayNumber: 4,
        dayName: 'Lower Hypertrophy Flow',
        focus: 'Quads, Hamstrings, Glutes & Abs (Volume)',
        exercises: [
          { name: 'Barbell Front Squat', sets: 3, reps: '8-10', rpe: 8.5, restSeconds: 90, notes: 'Quad & core emphasis.' },
          { name: 'Barbell Hip Thrust', sets: 4, reps: '10-12', rpe: 9, restSeconds: 90, notes: 'Glute maximum tension.' },
          { name: 'Bulgarian Split Squat', sets: 3, reps: '10-12', rpe: 8.5, restSeconds: 60, notes: 'Unilateral leg drive.' },
          { name: 'Seated Leg Extension', sets: 3, reps: '15-20', rpe: 9.5, restSeconds: 45, notes: 'Burnout quad pump.' },
          { name: 'Seated Calf Raise', sets: 4, reps: '15-20', rpe: 9, restSeconds: 45, notes: 'Soleus calf work.' },
          { name: 'Ab Wheel Rollout', sets: 3, reps: '10-12', rpe: 8.5, restSeconds: 60, notes: 'Anti-extension core.' },
        ]
      }
    ];
  } else {
    // Full Body Protocol default
    description = 'High-frequency full kinetic chain stimulator hitting major multi-joint compounds each session.';
    days = [
      {
        dayNumber: 1,
        dayName: 'Full Body Alpha',
        focus: 'Quad / Horizontal Push / Horizontal Pull',
        exercises: [
          { name: 'Barbell Back Squat', sets: 4, reps: repScheme, rpe: rpeTarget, restSeconds: restTime, notes: 'Primary leg motor.' },
          { name: 'Barbell Flat Bench Press', sets: 4, reps: repScheme, rpe: rpeTarget, restSeconds: restTime, notes: 'Primary chest press.' },
          { name: 'Overhand Barbell Bent-Over Row', sets: 4, reps: repScheme, rpe: rpeTarget, restSeconds: 90, notes: 'Upper back volume.' },
          { name: 'Standing Dumbbell Lateral Raise', sets: 3, reps: '12-15', rpe: 9, restSeconds: 45, notes: 'Side delt isolation.' },
          { name: 'Standing Barbell Bicep Curl', sets: 3, reps: '10-12', rpe: 8.5, restSeconds: 60, notes: 'Biceps.' },
          { name: 'Cable Tricep Rope Pushdown', sets: 3, reps: '10-12', rpe: 8.5, restSeconds: 60, notes: 'Triceps.' },
        ]
      },
      {
        dayNumber: 2,
        dayName: 'Full Body Beta',
        focus: 'Hinge / Vertical Push / Vertical Pull',
        exercises: [
          { name: 'Conventional Barbell Deadlift', sets: 3, reps: goal === 'Max Strength' ? '3-5' : '6-8', rpe: rpeTarget, restSeconds: 180, notes: 'Posterior chain compound.' },
          { name: 'Standing Overhead Barbell Press (OHP)', sets: 4, reps: repScheme, rpe: rpeTarget, restSeconds: restTime, notes: 'Deltoid press.' },
          { name: 'Weighted Pull-Ups', sets: 4, reps: '6-10', rpe: 8.5, restSeconds: 90, notes: 'Lat sweep.' },
          { name: 'Bulgarian Split Squat', sets: 3, reps: '10-12', rpe: 8.5, restSeconds: 60, notes: 'Unilateral quads.' },
          { name: 'Face Pulls with Rope', sets: 3, reps: '15-20', rpe: 8, restSeconds: 45, notes: 'Rear delt health.' },
          { name: 'Hanging Leg / Knee Raise', sets: 3, reps: '12-15', rpe: 8, restSeconds: 60, notes: 'Core compression.' },
        ]
      },
      {
        dayNumber: 3,
        dayName: 'Full Body Gamma',
        focus: 'Quad Hypertrophy / Incline Push / Back Isolation',
        exercises: [
          { name: '45-Degree Leg Press', sets: 4, reps: '10-12', rpe: 8.5, restSeconds: 90, notes: 'Quad mass overload.' },
          { name: 'Incline Dumbbell Press', sets: 4, reps: '8-12', rpe: 8.5, restSeconds: 90, notes: 'Upper chest.' },
          { name: 'Seated Cable Row (Close Grip)', sets: 4, reps: '10-12', rpe: 8.5, restSeconds: 60, notes: 'Mid-back thickness.' },
          { name: 'Romanian Deadlift (RDL)', sets: 3, reps: '8-10', rpe: 8, restSeconds: 90, notes: 'Hamstrings.' },
          { name: 'Dumbbell Hammer Curl', sets: 3, reps: '10-12', rpe: 8.5, restSeconds: 60, notes: 'Arms.' },
          { name: 'EZ-Bar Skull Crushers (Lying Tricep Extension)', sets: 3, reps: '10-12', rpe: 8.5, restSeconds: 60, notes: 'Triceps.' },
        ]
      }
    ];
  }

  return {
    title: `${splitType} — ${goal.toUpperCase()} PROTOCOL`,
    splitType,
    goal,
    experienceLevel,
    daysPerWeek,
    description,
    weeklyVolumeGuidance: `${days.length * 6} Total Movement Vectors / ~${days.length * 18} Sets Weekly`,
    days
  };
}

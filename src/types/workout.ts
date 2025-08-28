export interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  favorites: boolean;
  powerlifting: 'main' | 'accessory';
}

export interface WorkoutSet {
  reps: number;
  weight: number;
  duration?: number;
  completedAt: Date;
}

export interface WorkoutExercise {
  exerciseId: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  notes?: string;
}

export interface DailyWorkout {
  date: string;
  exercises: WorkoutExercise[];
  completed: boolean;
}

export interface WorkoutHistory {
  workouts: DailyWorkout[];
}

export interface ProgramExercise {
  exercise: Exercise;
  oneRepMax: number;
  selected: boolean;
}

export interface DaySchedule {
  day: number;
  percentages: number[];
  sets: number[];
  reps: number[];
  accessory: ProgramExercise[];
  weights: number[];
}

export interface WeekSchedule {
  exercise: ProgramExercise;
  days: DaySchedule[];
}
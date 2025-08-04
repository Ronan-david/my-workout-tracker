export interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
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
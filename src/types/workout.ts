export interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight?: number;
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
  id: string;
  date: string;
  exercises: WorkoutExercise[];
  totalDuration: number;
  completed: boolean;
}

export interface WorkoutHistory {
  workouts: DailyWorkout[];
}
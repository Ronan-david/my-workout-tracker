import type { Exercise } from '@/types/workout';

export const mockExercises: Exercise[] = [
  { id: '1', name: 'Bench Press', category: 'chest', description: 'Compound chest pressing movement', targetMuscles: ['chest', 'triceps', 'shoulders'], difficulty: 'intermediate' },
  { id: '2', name: 'Deadlifts', category: 'full-body', description: 'Complete posterior chain exercise', targetMuscles: ['hamstrings', 'glutes', 'erector-spinae'], difficulty: 'advanced' },
  { id: '3', name: 'Sissy Squats', category: 'legs', description: 'Lower body compound movement', targetMuscles: ['quadriceps', 'glutes', 'hamstrings'], difficulty: 'beginner' },
  { id: '4', name: 'Seated Rows', category: 'back', description: 'Horizontal pulling exercise', targetMuscles: ['lats', 'rhomboids', 'rear-delts'], difficulty: 'beginner' },
  { id: '5', name: 'Biceps curls', category: 'arm', description: 'Biceps focused movement', targetMuscles: ['biceps'], difficulty: 'beginner' },
  { id: '6', name: 'Calf Raises', category: 'calves', description: 'Calf strengthening exercise', targetMuscles: ['calves'], difficulty: 'beginner' },
  { id: '7', name: 'Legs extentions', category: 'legs', description: 'Quad strengthening exercise', targetMuscles: ['quadriceps'], difficulty: 'beginner' },
  { id: '8', name: 'Adductors', category: 'legs', description: 'Adductor strengthening exercise', targetMuscles: ['adductor'], difficulty: 'beginner' },
  { id: '9', name: 'Squats', category: 'legs', description: 'Lower body compound movement', targetMuscles: ['quadriceps', 'glutes', 'hamstrings'], difficulty: 'beginner' },
  { id: '10', name: 'Dips', category: 'triceps', description: 'Tricep focused compound movement', targetMuscles: ['triceps', 'chest', 'shoulders'], difficulty: 'intermediate' },
  { id: '11', name: 'Lat Pulldowns', category: 'back', description: 'Vertical pulling movement', targetMuscles: ['lats', 'rhomboids', 'biceps'], difficulty: 'beginner' },
  { id: '12', name: 'Leg Press', category: 'legs', description: 'Machine-based leg exercise', targetMuscles: ['quadriceps', 'glutes'], difficulty: 'beginner' },
  { id: '13', name: 'Push-ups', category: 'chest', description: 'Classic bodyweight chest exercise', targetMuscles: ['chest', 'triceps', 'shoulders'], difficulty: 'beginner' },
  { id: '14', name: 'Pull-ups', category: 'back', description: 'Upper body pulling exercise', targetMuscles: ['lats', 'rhomboids', 'biceps'], difficulty: 'intermediate' },
];

export const getTranslatedExerciseDescription = (exerciseId: string, t: any): string => {
  const descriptionMap: Record<string, string> = {
    '1': t('exercises.descriptions.bench-press'),
    '2': t('exercises.descriptions.deadlifts'),
    '3': t('exercises.descriptions.sissy-squats'),
    '4': t('exercises.descriptions.seated-rows'),
    '5': t('exercises.descriptions.biceps-curls'),
    '6': t('exercises.descriptions.calf-raises'),
    '7': t('exercises.descriptions.legs-extensions'),
    '8': t('exercises.descriptions.adductors'),
    '9': t('exercises.descriptions.squats'),
    '10': t('exercises.descriptions.dips'),
    '11': t('exercises.descriptions.lat-pulldowns'),
    '12': t('exercises.descriptions.leg-press'),
    '13': t('exercises.descriptions.push-ups'),
    '14': t('exercises.descriptions.pull-ups'),
  };
  
  return descriptionMap[exerciseId] || mockExercises.find(e => e.id === exerciseId)?.description || '';
};

export const getTranslatedExerciseCategory = (categoryKey: string, t: any): string => {
  return t(`exercises.categories.${categoryKey}`);
};

export const getTranslatedExerciseDifficulty = (difficultyKey: string, t: any): string => {
  return t(`exercises.difficulty.${difficultyKey}`);
};

export const getTranslatedMuscle = (muscleKey: string, t: any): string => {
  return t(`exercises.muscles.${muscleKey}`);
};

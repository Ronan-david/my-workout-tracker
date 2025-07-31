import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

// Mock GraphQL client for demo purposes
export const client = new ApolloClient({
  uri: 'https://mock-graphql-api.com/workout',
  cache: new InMemoryCache(),
});

export const GET_EXERCISES = gql`
  query GetExercises {
    exercises {
      id
      name
      category
      description
      targetMuscles
      difficulty
    }
  }
`;

// Mock exercises data for demo
export const mockExercises = [
  { id: '1', name: 'Push-ups', category: 'chest', description: 'Classic bodyweight chest exercise', targetMuscles: ['chest', 'triceps', 'shoulders'], difficulty: 'beginner' },
  { id: '2', name: 'Squats', category: 'legs', description: 'Lower body compound movement', targetMuscles: ['quadriceps', 'glutes', 'hamstrings'], difficulty: 'beginner' },
  { id: '3', name: 'Pull-ups', category: 'back', description: 'Upper body pulling exercise', targetMuscles: ['lats', 'rhomboids', 'biceps'], difficulty: 'intermediate' },
  { id: '4', name: 'Deadlifts', category: 'full-body', description: 'Complete posterior chain exercise', targetMuscles: ['hamstrings', 'glutes', 'erector spinae'], difficulty: 'advanced' },
  { id: '5', name: 'Bench Press', category: 'chest', description: 'Compound chest pressing movement', targetMuscles: ['chest', 'triceps', 'shoulders'], difficulty: 'intermediate' },
  { id: '6', name: 'Overhead Press', category: 'shoulders', description: 'Vertical pressing movement', targetMuscles: ['shoulders', 'triceps', 'core'], difficulty: 'intermediate' },
  { id: '7', name: 'Rows', category: 'back', description: 'Horizontal pulling exercise', targetMuscles: ['lats', 'rhomboids', 'rear delts'], difficulty: 'beginner' },
  { id: '8', name: 'Lunges', category: 'legs', description: 'Unilateral leg exercise', targetMuscles: ['quadriceps', 'glutes', 'hamstrings'], difficulty: 'beginner' },
  { id: '9', name: 'Dips', category: 'triceps', description: 'Tricep focused compound movement', targetMuscles: ['triceps', 'chest', 'shoulders'], difficulty: 'intermediate' },
  { id: '10', name: 'Planks', category: 'core', description: 'Isometric core strengthening', targetMuscles: ['core', 'shoulders'], difficulty: 'beginner' },
  { id: '11', name: 'Mountain Climbers', category: 'cardio', description: 'High intensity cardio exercise', targetMuscles: ['core', 'legs', 'shoulders'], difficulty: 'intermediate' },
  { id: '12', name: 'Burpees', category: 'full-body', description: 'Full body explosive movement', targetMuscles: ['full-body'], difficulty: 'advanced' },
  { id: '13', name: 'Hip Thrusts', category: 'glutes', description: 'Glute focused hip hinge', targetMuscles: ['glutes', 'hamstrings'], difficulty: 'beginner' },
  { id: '14', name: 'Lat Pulldowns', category: 'back', description: 'Vertical pulling movement', targetMuscles: ['lats', 'rhomboids', 'biceps'], difficulty: 'beginner' },
  { id: '15', name: 'Leg Press', category: 'legs', description: 'Machine-based leg exercise', targetMuscles: ['quadriceps', 'glutes'], difficulty: 'beginner' },
  { id: '16', name: 'Shoulder Shrugs', category: 'traps', description: 'Trap focused movement', targetMuscles: ['trapezius'], difficulty: 'beginner' },
  { id: '17', name: 'Calf Raises', category: 'calves', description: 'Calf strengthening exercise', targetMuscles: ['calves'], difficulty: 'beginner' },
  { id: '18', name: 'Russian Twists', category: 'core', description: 'Rotational core exercise', targetMuscles: ['obliques', 'core'], difficulty: 'intermediate' },
  { id: '19', name: 'Face Pulls', category: 'rear-delts', description: 'Rear deltoid isolation', targetMuscles: ['rear delts', 'rhomboids'], difficulty: 'beginner' },
  { id: '20', name: 'Turkish Get-ups', category: 'full-body', description: 'Complex full body movement', targetMuscles: ['full-body', 'core'], difficulty: 'advanced' }
];
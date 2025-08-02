import { ref as firebaseRef, push as pushToFirebase } from "firebase/database";
import type { DailyWorkout, WorkoutHistory } from '../types/workout';
import { getDatabase } from 'firebase/database';

const STORAGE_FILE = '/workout-data.json';

export class WorkoutStorageService {
  static async saveWorkout(workout: DailyWorkout): Promise<void> {
    try {
      const ddDlWkRef = getDatabase();
      const allDailyWorkouts = firebaseRef(ddDlWkRef, 'dailyWorkout');
      pushToFirebase(allDailyWorkouts, workout);

    } catch (error) {
      console.error('Error saving workout:', error);
    }
  }

  static async getHistory(): Promise<WorkoutHistory> {
    try {
      const response = await fetch(STORAGE_FILE);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return { workouts: [] };
    } catch (error) {
      console.error('Error reading workout history:', error);
      return { workouts: [] };
    }
  }

  static async getWorkoutByDate(date: string): Promise<DailyWorkout | null> {
    try {
      const history = await this.getHistory();
      return history.workouts.find(w => w.date === date) || null;
    } catch (error) {
      console.error('Error getting workout by date:', error);
      return null;
    }
  }

  static async exportData(): Promise<string> {
    try {
      const history = await this.getHistory();
      return JSON.stringify(history, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return JSON.stringify({ workouts: [] }, null, 2);
    }
  }

  private static async writeToFile(data: WorkoutHistory): Promise<void> {
    try {
      const response = await fetch('/api/save-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save workout data');
      }
    } catch (error) {
      console.error('Error writing to file:', error);
      throw error;
    }
  }
}
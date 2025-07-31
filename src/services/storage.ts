import type { DailyWorkout, WorkoutHistory } from '../types/workout';

const STORAGE_FILE = '/workout-data.json';

export class WorkoutStorageService {
  static async saveWorkout(workout: DailyWorkout): Promise<void> {
    try {
      const history = await this.getHistory();
      const existingIndex = history.workouts.findIndex(w => w.date === workout.date);
      
      if (existingIndex >= 0) {
        history.workouts[existingIndex] = workout;
      } else {
        history.workouts.push(workout);
      }
      
      history.workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      await this.writeToFile(history);
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

  static async importData(data: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(data);
      await this.writeToFile(parsed);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
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
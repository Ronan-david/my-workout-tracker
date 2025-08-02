import { ref } from "vue";

import { getDatabase, ref as firebaseRef, get, child } from "firebase/database";
import type { DailyWorkout } from "@/types/workout";

const allWorkouts = ref<DailyWorkout[]>([]);
const loading = ref(true);
const error = ref('');

const fetchOnce = async () => {
  loading.value = true;

  const dbRef = firebaseRef(getDatabase());
  try {
    const snapshot = await get(child(dbRef, `dailyWorkout`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const workoutsList = [];
      for (const id in data) {
        workoutsList.push({ id, ...data[id] });
      }
      allWorkouts.value = workoutsList;
      console.log("All workouts fetched once:", allWorkouts);
    } else {
      allWorkouts.value  = [];
      console.log("No workouts available (fetched once).");
    }
  } catch (err) {
    error.value = `Failed to load all workouts. Please try again. Error received : ${err}`;
  } finally {
    loading.value  = false;
  }
}

export {
  fetchOnce,
  allWorkouts,
  loading,
  error
}
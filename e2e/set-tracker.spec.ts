import { test, expect } from '@playwright/test'
import { SetTrackerPage, SET_TRACKER_TEST_DATA as TEST_DATA } from './page-objects/set-tracker.page'
import { WorkoutPage } from './page-objects/workout-page.page'

test.describe('SetTracker Component', () => {
  let setTracker: SetTrackerPage
  let workoutPage: WorkoutPage

  test.beforeEach(async ({ page }) => {
    setTracker = new SetTrackerPage(page)
    workoutPage = new WorkoutPage(page)
    
    await page.goto('/my-workout-tracker/workout/')
    await workoutPage.expectSelectionPageVisible()
    
    await workoutPage.startWorkoutWithExercise(TEST_DATA.exercises.benchPress)
    
    await workoutPage.expectActiveWorkoutVisible()
    await expect(setTracker.exerciseTitle()).toBeVisible()
  })
  test('should display exercise information', async () => {
    await expect(setTracker.exerciseTitle()).toBeVisible()
    await expect(setTracker.exerciseDescription()).toBeVisible()
    
    await expect(setTracker.exerciseTitle()).toContainText(TEST_DATA.exercises.benchPress)
  })

  test('should display initial empty set', async () => {
    await expect(setTracker.setNumber()).toBeVisible()
    await expect(setTracker.repsInput()).toBeVisible()
    await expect(setTracker.weightInput()).toBeVisible()
    
    await expect(setTracker.setNumber()).toHaveAttribute('data-i18n', TEST_DATA.i18nKeys.set)
  })

  test('should allow entering reps and weight for a set', async () => {
    await setTracker.fillSetData(TEST_DATA.sets.reps.light, TEST_DATA.sets.weights.light)
    
    await expect(setTracker.repsInput()).toHaveValue(TEST_DATA.sets.reps.light)
    await expect(setTracker.weightInput()).toHaveValue(TEST_DATA.sets.weights.light)
  })

  test('should show completed set with visual feedback', async () => {
    await setTracker.completeSet(TEST_DATA.sets.reps.light, TEST_DATA.sets.weights.light)
    
    await expect(setTracker.setRow()).toHaveClass(/completed/)
    await expect(setTracker.completeIcon()).toBeVisible()
  })

  test('should update completed sets counter', async () => {
    await expect(setTracker.completedSetsText()).toContainText('0/1')
    
    await setTracker.completeSet(TEST_DATA.sets.reps.light, TEST_DATA.sets.weights.light)
    
    await expect(setTracker.completedSetsText()).toContainText('1/1')
  })

  test('should show add set buttons when all sets are completed', async () => {
    await setTracker.completeSet(TEST_DATA.sets.reps.light, TEST_DATA.sets.weights.light)
    
    await expect(setTracker.addSetButton()).toBeVisible()
    await expect(setTracker.duplicateSetButton()).toBeVisible()
  })

  test('should add a new empty set', async () => {
    await setTracker.completeSet(TEST_DATA.sets.reps.light, TEST_DATA.sets.weights.light)
    await setTracker.addSetButton().click()
    
    await expect(setTracker.setNumber(1)).toBeVisible()
    await expect(setTracker.completedSetsText()).toContainText('1/2')
    await expect(setTracker.repsInput(1)).toHaveValue('0')
    await expect(setTracker.weightInput(1)).toHaveValue('0')
  })

  test('should duplicate the last set', async () => {
    const reps = TEST_DATA.sets.reps.medium
    const weight = TEST_DATA.sets.weights.medium
    
    await setTracker.completeSet(reps, weight)
    await setTracker.duplicateSetButton().click()
    
    await expect(setTracker.setNumber(1)).toBeVisible()
    await expect(setTracker.repsInput(1)).toHaveValue(reps)
    await expect(setTracker.weightInput(1)).toHaveValue(weight)
    await expect(setTracker.completedSetsText()).toContainText('2/2')
  })

  test('should validate input attributes', async () => {
    const repsInput = setTracker.repsInput()
    const weightInput = setTracker.weightInput()
    
    await expect(repsInput).toHaveAttribute('type', 'number')
    await expect(repsInput).toHaveAttribute('min', '0')
    await expect(weightInput).toHaveAttribute('type', 'number')
    await expect(weightInput).toHaveAttribute('min', '0')
  })

  test('should handle multiple sets correctly', async () => {
    await setTracker.completeSet(TEST_DATA.sets.reps.light, TEST_DATA.sets.weights.light)
    await setTracker.addSetButton().click()
    
    await setTracker.completeSet(TEST_DATA.sets.reps.medium, TEST_DATA.sets.weights.medium, 1)
    
    await expect(setTracker.completedSetsText()).toContainText('2/2')
    await expect(setTracker.setRow(0)).toHaveClass(/completed/)
    await expect(setTracker.setRow(1)).toHaveClass(/completed/)
  })

  test('should delete exercise when delete button is clicked', async () => {
    await setTracker.deleteExercise()
    await setTracker.expectSetTrackerNotVisible()
  })

  test('should maintain set state during interaction', async () => {
    await setTracker.repsInput().fill(TEST_DATA.sets.reps.light)
    await expect(setTracker.setRow()).not.toHaveClass(/completed/)
    
    await setTracker.weightInput().fill(TEST_DATA.sets.weights.light)
    await expect(setTracker.setRow()).toHaveClass(/completed/)
    
    await expect(setTracker.repsInput()).toHaveValue(TEST_DATA.sets.reps.light)
    await expect(setTracker.weightInput()).toHaveValue(TEST_DATA.sets.weights.light)
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await expect(setTracker.exerciseTitle()).toBeVisible()
    await expect(setTracker.repsInput()).toBeVisible()
    await expect(setTracker.weightInput()).toBeVisible()
    
    await setTracker.completeSet(TEST_DATA.sets.reps.light, TEST_DATA.sets.weights.light)
    await setTracker.addSetButton().click()
    
    await expect(setTracker.setNumber(1)).toBeVisible()
  })

  test('should handle edge cases for input values', async () => {
    await setTracker.fillSetData('0', TEST_DATA.sets.weights.light)
    await expect(setTracker.setRow()).not.toHaveClass(/completed/)
    
    await setTracker.fillSetData('1', '1')
    await expect(setTracker.setRow()).toHaveClass(/completed/)
    
    await setTracker.fillSetData('999', '999')
    await expect(setTracker.repsInput()).toHaveValue('999')
    await expect(setTracker.weightInput()).toHaveValue('999')
    await expect(setTracker.setRow()).toHaveClass(/completed/)
  })

})

test.describe('SetTracker Integration', () => {
  let setTracker: SetTrackerPage
  let workoutPage: WorkoutPage

  test.beforeEach(async ({ page }) => {
    setTracker = new SetTrackerPage(page)
    workoutPage = new WorkoutPage(page)
    await workoutPage.navigateToWorkoutPage()
  })

  test('should integrate properly with WorkoutPage', async () => {
    await workoutPage.startWorkoutWithMultipleExercises([
      TEST_DATA.exercises.benchPress,
      TEST_DATA.exercises.deadlifts
    ])
    
    await setTracker.expectExerciseInfo(TEST_DATA.exercises.benchPress, TEST_DATA.descriptions.benchPress, 0)
    await setTracker.expectExerciseInfo(TEST_DATA.exercises.deadlifts, TEST_DATA.descriptions.deadlifts, 1)
    
    await setTracker.completeSet(TEST_DATA.sets.reps.light, TEST_DATA.sets.weights.light, 0, 0)
    await setTracker.completeSet(TEST_DATA.sets.reps.heavy, TEST_DATA.sets.weights.heavy, 0, 1)
    
    await workoutPage.expectWorkoutProgress(100)
    await workoutPage.expectFinishWorkoutEnabled()
  })

  test('should handle workout cancellation', async () => {
    await workoutPage.startWorkoutWithExercise(TEST_DATA.exercises.benchPress)
    await setTracker.completeSet(TEST_DATA.sets.reps.light, TEST_DATA.sets.weights.light)
    
    await workoutPage.cancelWorkout()
    
    await workoutPage.expectSelectionPageVisible()
    await setTracker.expectSetTrackerNotVisible()
  })

  test('should add exercises during active workout', async () => {
    await workoutPage.startWorkoutWithExercise(TEST_DATA.exercises.benchPress)
    await setTracker.expectSetTrackerVisible()
    
    await workoutPage.addExerciseToWorkout()
    await workoutPage.expectSelectionPageVisible()
    
    await workoutPage.selectExercise(TEST_DATA.exercises.deadlifts)
    await workoutPage.startWorkout()
    
    await setTracker.expectSetTrackerVisible(0)
    await setTracker.expectSetTrackerVisible(1)
  })

  test('should handle workout filtering and selection', async () => {
    await workoutPage.filterByCategory('chest')
    await workoutPage.expectVisibleExerciseCount(2)
    
    await workoutPage.filterByCategory('')
    await workoutPage.selectMultipleExercises([
      TEST_DATA.exercises.benchPress,
      TEST_DATA.exercises.deadlifts
    ])
    
    await workoutPage.expectStartWorkoutButtonText(2)
    await workoutPage.startWorkout()
    
    await setTracker.expectSetCount(1, 0)
    await setTracker.expectSetCount(1, 1)
  })
})

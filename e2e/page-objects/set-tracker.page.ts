import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

// Test data for SetTracker component (i18n compliant with French default)
export const SET_TRACKER_TEST_DATA = {
  exercises: {
    benchPress: 'Bench Press',
    deadlifts: 'Deadlifts',
    squats: 'Squats',
    pullUps: 'Pull-ups'
  },
  // French descriptions as they appear in the app (default locale: fr)
  descriptions: {
    benchPress: 'Compound chest pressing movement',
    deadlifts: 'Complete posterior chain exercise',
    squats: 'Lower body compound movement',
    pullUps: 'Upper body pulling exercise'
  },
  sets: {
    reps: { 
      light: '10', 
      medium: '8', 
      heavy: '5',
      max: '1',
      endurance: '20'
    },
    weights: { 
      light: '50', 
      medium: '75', 
      heavy: '100',
      max: '120',
      bodyweight: '0'
    }
  },
  // Expected French UI text (default app locale)
  expectedText: {
    set: 'Série', // 'set-tracker.set'
    reps: 'Répétitions', // 'set-tracker.reps'
    weight: 'Poids (kg)', // 'set-tracker.weight'
    addSet: 'Ajouter une autre série', // 'set-tracker.add-set'
    duplicateSet: 'Dupliquer la dernière série', // 'set-tracker.duplicate-set'
    completedSetsTemplate: 'Séries terminées : {completed}/{total}' // 'set-tracker.completed-sets'
  },
  // i18n keys for validation (language-agnostic)
  i18nKeys: {
    set: 'set-tracker.set',
    reps: 'set-tracker.reps',
    weight: 'set-tracker.weight',
    completedSets: 'set-tracker.completed-sets',
    addSet: 'set-tracker.add-set',
    duplicateSet: 'set-tracker.duplicate-set',
    selectReps: 'set-tracker.select-reps',
    selectWeights: 'set-tracker.select-weights'
  }
} as const

// SetTracker Page Object Model using data-testid selectors
export class SetTrackerPage {
  constructor(private page: Page) {}

  // ==========================================
  // LOCATOR METHODS - Using data-testid (Language Agnostic)
  // ==========================================

  /**
   * Get the SetTracker component by index
   * @param index - Index of the SetTracker component (default: 0)
   */
  setTrackerComponent(index = 0): Locator {
    return this.page.getByTestId('set-tracker').nth(index)
  }

  /**
   * Get a specific set row within a SetTracker component
   * @param setIndex - Index of the set (default: 0)
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  setRow(setIndex = 0, trackerIndex = 0): Locator {
    return this.setTrackerComponent(trackerIndex)
      .getByTestId(`set-row-${setIndex}`)
  }

  /**
   * Get the reps input field for a specific set
   * @param setIndex - Index of the set (default: 0)
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  repsInput(setIndex = 0, trackerIndex = 0): Locator {
    return this.setTrackerComponent(trackerIndex)
      .getByTestId(`reps-input-${setIndex}`)
  }

  /**
   * Get the weight input field for a specific set
   * @param setIndex - Index of the set (default: 0)
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  weightInput(setIndex = 0, trackerIndex = 0): Locator {
    return this.setTrackerComponent(trackerIndex)
      .getByTestId(`weight-input-${setIndex}`)
  }

  /**
   * Get the set number label for a specific set
   * @param setIndex - Index of the set (default: 0)
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  setNumber(setIndex = 0, trackerIndex = 0): Locator {
    return this.setTrackerComponent(trackerIndex)
      .getByTestId(`set-number-${setIndex}`)
  }

  /**
   * Get the complete icon for a specific set
   * @param setIndex - Index of the set (default: 0)
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  completeIcon(setIndex = 0, trackerIndex = 0): Locator {
    return this.setTrackerComponent(trackerIndex)
      .getByTestId(`complete-icon-${setIndex}`)
  }

  /**
   * Get the "Add Another Set" button using data-testid
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  addSetButton(trackerIndex = 0): Locator {
    return this.setTrackerComponent(trackerIndex)
      .getByTestId('add-set-btn')
  }

  /**
   * Get the "Duplicate Last Set" button using data-testid
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  duplicateSetButton(trackerIndex = 0): Locator {
    return this.setTrackerComponent(trackerIndex)
      .getByTestId('duplicate-set-btn')
  }

  /**
   * Get the delete exercise button
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  deleteButton(trackerIndex = 0): Locator {
    return this.setTrackerComponent(trackerIndex)
      .getByTestId('delete-exercise-btn')
  }

  /**
   * Get the exercise title/name
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  exerciseTitle(trackerIndex = 0): Locator {
    return this.setTrackerComponent(trackerIndex)
      .getByTestId('exercise-name')
  }

  /**
   * Get the exercise description
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  exerciseDescription(trackerIndex = 0): Locator {
    return this.setTrackerComponent(trackerIndex)
      .getByTestId('exercise-description')
  }

  /**
   * Get the completed sets counter text
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  completedSetsText(trackerIndex = 0): Locator {
    return this.setTrackerComponent(trackerIndex)
      .getByTestId('completed-sets-text')
  }

  /**
   * Get the add set buttons container
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  addSetButtons(trackerIndex = 0): Locator {
    return this.setTrackerComponent(trackerIndex)
      .getByTestId('add-set-buttons')
  }

  /**
   * Get all set rows for a specific tracker
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  allSetRows(trackerIndex = 0): Locator {
    return this.setTrackerComponent(trackerIndex)
      .locator('[data-testid^="set-row-"]')
  }

  // ==========================================
  // ACTION METHODS - SetTracker Specific
  // ==========================================

  /**
   * Fill reps and weight data for a specific set
   * @param reps - Number of reps as string
   * @param weight - Weight value as string
   * @param setIndex - Index of the set (default: 0)
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async fillSetData(reps: string, weight: string, setIndex = 0, trackerIndex = 0): Promise<void> {
    await this.repsInput(setIndex, trackerIndex).fill(reps)
    await this.weightInput(setIndex, trackerIndex).fill(weight)
  }

  /**
   * Complete a set by filling reps and weight, then verify completion
   * @param reps - Number of reps as string
   * @param weight - Weight value as string
   * @param setIndex - Index of the set (default: 0)
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async completeSet(reps: string, weight: string, setIndex = 0, trackerIndex = 0): Promise<void> {
    await this.fillSetData(reps, weight, setIndex, trackerIndex)
    // Wait for completion state to update
    await expect(this.setRow(setIndex, trackerIndex)).toHaveClass(/completed/)
  }

  /**
   * Add a new empty set by clicking the "Add Another Set" button
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async addNewSet(trackerIndex = 0): Promise<void> {
    await this.addSetButton(trackerIndex).click()
  }

  /**
   * Duplicate the last set by clicking the "Duplicate Last Set" button
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async duplicateLastSet(trackerIndex = 0): Promise<void> {
    await this.duplicateSetButton(trackerIndex).click()
  }

  /**
   * Delete the exercise by clicking the delete button
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async deleteExercise(trackerIndex = 0): Promise<void> {
    await this.deleteButton(trackerIndex).click()
  }

  /**
   * Clear all input values for a specific set
   * @param setIndex - Index of the set (default: 0)
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async clearSetData(setIndex = 0, trackerIndex = 0): Promise<void> {
    await this.repsInput(setIndex, trackerIndex).fill('')
    await this.weightInput(setIndex, trackerIndex).fill('')
  }

  /**
   * Fill only reps (incomplete set)
   * @param reps - Number of reps as string
   * @param setIndex - Index of the set (default: 0)
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async fillRepsOnly(reps: string, setIndex = 0, trackerIndex = 0): Promise<void> {
    await this.repsInput(setIndex, trackerIndex).fill(reps)
  }

  /**
   * Fill only weight (incomplete set)
   * @param weight - Weight value as string
   * @param setIndex - Index of the set (default: 0)
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async fillWeightOnly(weight: string, setIndex = 0, trackerIndex = 0): Promise<void> {
    await this.weightInput(setIndex, trackerIndex).fill(weight)
  }

  // ==========================================
  // ASSERTION HELPERS - SetTracker Specific
  // ==========================================

  /**
   * Assert that a set is marked as completed
   * @param setIndex - Index of the set (default: 0)
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async expectSetCompleted(setIndex = 0, trackerIndex = 0): Promise<void> {
    await expect(this.setRow(setIndex, trackerIndex)).toHaveClass(/completed/)
    await expect(this.completeIcon(setIndex, trackerIndex)).toBeVisible()
  }

  /**
   * Assert that a set is NOT marked as completed
   * @param setIndex - Index of the set (default: 0)
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async expectSetNotCompleted(setIndex = 0, trackerIndex = 0): Promise<void> {
    await expect(this.setRow(setIndex, trackerIndex)).not.toHaveClass(/completed/)
    await expect(this.completeIcon(setIndex, trackerIndex)).not.toBeVisible()
  }

  /**
   * Assert the completed sets counter shows specific values
   * @param completed - Number of completed sets
   * @param total - Total number of sets
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async expectCompletedSetsCount(completed: number, total: number, trackerIndex = 0): Promise<void> {
    await expect(this.completedSetsText(trackerIndex)).toContainText(`${completed}/${total}`)
  }

  /**
   * Assert that add set buttons are visible (when all sets completed)
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async expectAddSetButtonsVisible(trackerIndex = 0): Promise<void> {
    await expect(this.addSetButton(trackerIndex)).toBeVisible()
    await expect(this.duplicateSetButton(trackerIndex)).toBeVisible()
  }

  /**
   * Assert that add set buttons are hidden (when not all sets completed)
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async expectAddSetButtonsHidden(trackerIndex = 0): Promise<void> {
    await expect(this.addSetButton(trackerIndex)).not.toBeVisible()
    await expect(this.duplicateSetButton(trackerIndex)).not.toBeVisible()
  }

  /**
   * Assert exercise information is displayed correctly
   * @param exerciseName - Expected exercise name
   * @param description - Expected exercise description
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async expectExerciseInfo(exerciseName: string, description: string, trackerIndex = 0): Promise<void> {
    await expect(this.exerciseTitle(trackerIndex)).toContainText(exerciseName)
    await expect(this.exerciseDescription(trackerIndex)).toContainText(description)
  }

  /**
   * Assert that the SetTracker component is visible
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async expectSetTrackerVisible(trackerIndex = 0): Promise<void> {
    await expect(this.setTrackerComponent(trackerIndex)).toBeVisible()
  }

  /**
   * Assert that the SetTracker component is not visible
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async expectSetTrackerNotVisible(trackerIndex = 0): Promise<void> {
    await expect(this.setTrackerComponent(trackerIndex)).not.toBeVisible()
  }

  /**
   * Get the number of visible set rows
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async getSetRowCount(trackerIndex = 0): Promise<number> {
    return await this.allSetRows(trackerIndex).count()
  }

  /**
   * Assert that a specific number of sets are visible
   * @param expectedCount - Expected number of sets
   * @param trackerIndex - Index of the SetTracker component (default: 0)
   */
  async expectSetCount(expectedCount: number, trackerIndex = 0): Promise<void> {
    await expect(this.allSetRows(trackerIndex)).toHaveCount(expectedCount)
  }
}

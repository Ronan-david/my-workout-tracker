import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { TestHelpers } from '../utils/test-helpers'

// CSS Classes specific to WorkoutPage component
export const WORKOUT_PAGE_CLASSES = {
  // Workout page classes
  workoutPage: '.workout-page',
  workoutPageHeader: '.workout-page__header',
  workoutPageContent: '.workout-page__content',
  workoutPageActive: '.workout-page__active',
  workoutPageSelection: '.workout-page__selection',
  workoutPageTrackers: '.workout-page__trackers',
  workoutPageProgressBar: '.workout-page__progress-bar',
  workoutPageProgressFill: '.workout-page__progress-fill',
  workoutPageProgressText: '.workout-page__progress-text',
  workoutPageActionBtn: '.workout-page__action-btn',
  workoutPageActionBtnFinish: '.workout-page__action-btn--finish',
  workoutPageActionBtnCancel: '.workout-page__action-btn--cancel',
  workoutPageStartBtn: '.workout-page__start-btn',
  workoutPageAddBtn: '.workout-page__add-btn',
  workoutPageSelectionTitle: '.workout-page__selection-title',
  workoutPageSelectionSubtitle: '.workout-page__selection-subtitle',
  workoutPageFilters: '.workout-page__filters',
  workoutPageFilter: '.workout-page__filter',
  workoutPageExercises: '.workout-page__exercises',
  
  // Exercise card classes
  exerciseCard: '.exercise-card',
  
  // Common states
  selected: '.selected'
} as const

// WorkoutPage Page Object Model
export class WorkoutPage {
  private testHelpers: TestHelpers
  
  constructor(private page: Page) {
    this.testHelpers = new TestHelpers(page)
  }

  // ==========================================
  // NAVIGATION METHODS
  // ==========================================

  /**
   * Navigate to the workout page with English locale
   */
  async navigateToWorkoutPage(): Promise<void> {
    // Go to the page first
    await this.page.goto('/my-workout-tracker/workout/')
    await this.testHelpers.waitForPageReady()
    
    // Then switch to English using the language selector
    await this.switchToEnglish()
  }

  /**
   * Switch to English locale using the language selector
   */
  async switchToEnglish(): Promise<void> {
    try {
      // Try to find and click the language selector
      const languageButton = this.page.locator('.language-button')
      if (await languageButton.isVisible()) {
        await languageButton.click()
        
        // Look for English option
        const englishOption = this.page.locator('.language-option').filter({ hasText: 'English' })
        if (await englishOption.isVisible()) {
          await englishOption.click()
          // Wait for language change to take effect
          await this.page.waitForTimeout(500)
        }
      }
    } catch (error) {
      console.log('Language selector not found, continuing with default locale')
    }
  }

  /**
   * Switch to French locale using the language selector
   */
  async switchToFrench(): Promise<void> {
    try {
      const languageButton = this.page.locator('.language-button')
      if (await languageButton.isVisible()) {
        await languageButton.click()
        
        const frenchOption = this.page.locator('.language-option').filter({ hasText: 'Français' })
        if (await frenchOption.isVisible()) {
          await frenchOption.click()
          await this.page.waitForTimeout(500)
        }
      }
    } catch (error) {
      console.log('Language selector not found, continuing with default locale')
    }
  }

  /**
   * Navigate to the workout page with specific locale
   * @param locale - Locale to use ('en' or 'fr')
   */
  async navigateToWorkoutPageWithLocale(locale: 'en' | 'fr' = 'en'): Promise<void> {
    if (locale === 'en') {
      await this.testHelpers.setLocaleToEnglish()
    } else {
      await this.testHelpers.setLocaleToFrench()
    }
    await this.page.goto('/my-workout-tracker/workout/')
    await this.testHelpers.waitForPageReady()
  }

  // ==========================================
  // LOCATOR METHODS - Exercise Selection
  // ==========================================

  /**
   * Get an exercise card by exercise name
   * @param exerciseName - Name of the exercise
   */
  exerciseCard(exerciseName: string): Locator {
    return this.page.locator(WORKOUT_PAGE_CLASSES.exerciseCard)
      .filter({ hasText: exerciseName })
  }

  /**
   * Get the start workout button
   */
  startWorkoutButton(): Locator {
    return this.page.locator(WORKOUT_PAGE_CLASSES.workoutPageStartBtn)
  }

  /**
   * Get the exercise selection section
   */
  selectionSection(): Locator {
    return this.page.locator(WORKOUT_PAGE_CLASSES.workoutPageSelection)
  }

  /**
   * Get the selection title
   */
  selectionTitle(): Locator {
    return this.page.locator(WORKOUT_PAGE_CLASSES.workoutPageSelectionTitle)
  }

  /**
   * Get the selection subtitle
   */
  selectionSubtitle(): Locator {
    return this.page.locator(WORKOUT_PAGE_CLASSES.workoutPageSelectionSubtitle)
  }

  /**
   * Get all exercise cards
   */
  allExerciseCards(): Locator {
    return this.page.locator(WORKOUT_PAGE_CLASSES.exerciseCard)
  }

  // ==========================================
  // LOCATOR METHODS - Active Workout
  // ==========================================

  /**
   * Get the active workout section
   */
  activeWorkoutSection(): Locator {
    return this.page.locator(WORKOUT_PAGE_CLASSES.workoutPageActive)
  }

  /**
   * Get the workout trackers container
   */
  trackersContainer(): Locator {
    return this.page.locator(WORKOUT_PAGE_CLASSES.workoutPageTrackers)
  }

  /**
   * Get the progress bar
   */
  progressBar(): Locator {
    return this.page.locator(WORKOUT_PAGE_CLASSES.workoutPageProgressBar)
  }

  /**
   * Get the progress fill bar
   */
  progressFill(): Locator {
    return this.page.locator(WORKOUT_PAGE_CLASSES.workoutPageProgressFill)
  }

  /**
   * Get the progress text
   */
  progressText(): Locator {
    return this.page.locator(WORKOUT_PAGE_CLASSES.workoutPageProgressText)
  }

  /**
   * Get the finish workout button
   */
  finishWorkoutButton(): Locator {
    return this.page.locator(WORKOUT_PAGE_CLASSES.workoutPageActionBtnFinish)
  }

  /**
   * Get the cancel workout button
   */
  cancelWorkoutButton(): Locator {
    return this.page.locator(WORKOUT_PAGE_CLASSES.workoutPageActionBtnCancel)
  }

  /**
   * Get the add exercise button
   */
  addExerciseButton(): Locator {
    return this.page.locator(WORKOUT_PAGE_CLASSES.workoutPageAddBtn)
  }

  // ==========================================
  // LOCATOR METHODS - Filters
  // ==========================================

  /**
   * Get the filters section
   */
  filtersSection(): Locator {
    return this.page.locator(WORKOUT_PAGE_CLASSES.workoutPageFilters)
  }

  /**
   * Get category filter dropdown
   */
  categoryFilter(): Locator {
    return this.filtersSection().locator('select').first()
  }

  /**
   * Get difficulty filter dropdown
   */
  difficultyFilter(): Locator {
    return this.filtersSection().locator('select').last()
  }

  /**
   * Get favorites checkbox
   */
  favoritesCheckbox(): Locator {
    return this.filtersSection().locator('input[type="checkbox"]')
  }

  // ==========================================
  // ACTION METHODS - Exercise Selection
  // ==========================================

  /**
   * Select an exercise by clicking its card
   * @param exerciseName - Name of the exercise to select
   */
  async selectExercise(exerciseName: string): Promise<void> {
    await this.exerciseCard(exerciseName).click()
  }

  /**
   * Select multiple exercises
   * @param exerciseNames - Array of exercise names to select
   */
  async selectMultipleExercises(exerciseNames: string[]): Promise<void> {
    for (const name of exerciseNames) {
      await this.selectExercise(name)
    }
  }

  /**
   * Start workout with selected exercises
   */
  async startWorkout(): Promise<void> {
    await this.startWorkoutButton().click()
  }

  /**
   * Start workout with a single exercise (convenience method)
   * @param exerciseName - Name of the exercise
   */
  async startWorkoutWithExercise(exerciseName: string): Promise<void> {
    await this.selectExercise(exerciseName)
    await this.startWorkout()
  }

  /**
   * Start workout with multiple exercises (convenience method)
   * @param exerciseNames - Array of exercise names
   */
  async startWorkoutWithMultipleExercises(exerciseNames: string[]): Promise<void> {
    await this.selectMultipleExercises(exerciseNames)
    await this.startWorkout()
  }

  // ==========================================
  // ACTION METHODS - Active Workout
  // ==========================================

  /**
   * Finish the current workout
   */
  async finishWorkout(): Promise<void> {
    await this.finishWorkoutButton().click()
  }

  /**
   * Cancel the current workout
   */
  async cancelWorkout(): Promise<void> {
    await this.cancelWorkoutButton().click()
  }

  /**
   * Add another exercise to the current workout
   */
  async addExerciseToWorkout(): Promise<void> {
    await this.addExerciseButton().click()
  }

  // ==========================================
  // ACTION METHODS - Filters
  // ==========================================

  /**
   * Filter exercises by category
   * @param category - Category to filter by
   */
  async filterByCategory(category: string): Promise<void> {
    await this.categoryFilter().selectOption(category)
  }

  /**
   * Filter exercises by difficulty
   * @param difficulty - Difficulty level to filter by
   */
  async filterByDifficulty(difficulty: string): Promise<void> {
    await this.difficultyFilter().selectOption(difficulty)
  }

  /**
   * Toggle favorites filter
   * @param enabled - Whether to show only favorites
   */
  async toggleFavoritesFilter(enabled: boolean): Promise<void> {
    const checkbox = this.favoritesCheckbox()
    const isCurrentlyChecked = await checkbox.isChecked()
    
    if (enabled !== isCurrentlyChecked) {
      await checkbox.click()
    }
  }

  // ==========================================
  // ASSERTION HELPERS - Exercise Selection
  // ==========================================

  /**
   * Assert that exercise selection page is visible
   */
  async expectSelectionPageVisible(): Promise<void> {
    await expect(this.selectionSection()).toBeVisible()
  }

  /**
   * Assert that active workout page is visible
   */
  async expectActiveWorkoutVisible(): Promise<void> {
    await expect(this.activeWorkoutSection()).toBeVisible()
  }

  /**
   * Assert that an exercise card is selected
   * @param exerciseName - Name of the exercise
   */
  async expectExerciseSelected(exerciseName: string): Promise<void> {
    await expect(this.exerciseCard(exerciseName)).toHaveClass(/selected/)
  }

  /**
   * Assert that an exercise card is not selected
   * @param exerciseName - Name of the exercise
   */
  async expectExerciseNotSelected(exerciseName: string): Promise<void> {
    await expect(this.exerciseCard(exerciseName)).not.toHaveClass(/selected/)
  }

  /**
   * Assert that start workout button is enabled
   */
  async expectStartWorkoutEnabled(): Promise<void> {
    await expect(this.startWorkoutButton()).toBeEnabled()
  }

  /**
   * Assert that start workout button is disabled
   */
  async expectStartWorkoutDisabled(): Promise<void> {
    await expect(this.startWorkoutButton()).toBeDisabled()
  }

  /**
   * Assert the start workout button shows correct exercise count
   * @param count - Expected number of exercises
   */
  async expectStartWorkoutButtonText(count: number): Promise<void> {
    await expect(this.startWorkoutButton()).toContainText(`Start Workout (${count} exercise${count !== 1 ? 's' : ''})`)
  }

  // ==========================================
  // ASSERTION HELPERS - Active Workout
  // ==========================================

  /**
   * Assert workout progress percentage
   * @param percentage - Expected progress percentage
   */
  async expectWorkoutProgress(percentage: number): Promise<void> {
    await expect(this.progressText()).toContainText(`${percentage}% Complete`)
  }

  /**
   * Assert that finish workout button is enabled
   */
  async expectFinishWorkoutEnabled(): Promise<void> {
    await expect(this.finishWorkoutButton()).toBeEnabled()
  }

  /**
   * Assert that finish workout button is disabled
   */
  async expectFinishWorkoutDisabled(): Promise<void> {
    await expect(this.finishWorkoutButton()).toBeDisabled()
  }

  /**
   * Assert that cancel workout button is enabled
   */
  async expectCancelWorkoutEnabled(): Promise<void> {
    await expect(this.cancelWorkoutButton()).toBeEnabled()
  }

  /**
   * Assert that cancel workout button is disabled
   */
  async expectCancelWorkoutDisabled(): Promise<void> {
    await expect(this.cancelWorkoutButton()).toBeDisabled()
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================

  /**
   * Get the number of visible exercise cards
   */
  async getVisibleExerciseCount(): Promise<number> {
    return await this.allExerciseCards().count()
  }

  /**
   * Assert that a specific number of exercises are visible
   * @param expectedCount - Expected number of visible exercises
   */
  async expectVisibleExerciseCount(expectedCount: number): Promise<void> {
    await expect(this.allExerciseCards()).toHaveCount(expectedCount)
  }

  /**
   * Get workout page title text
   */
  async getWorkoutTitle(): Promise<string> {
    return await this.page.locator('.workout-page__title').textContent() || ''
  }

  /**
   * Assert workout page title contains specific text
   * @param expectedText - Expected title text
   */
  async expectWorkoutTitle(expectedText: string): Promise<void> {
    await expect(this.page.locator('.workout-page__title')).toContainText(expectedText)
  }
}

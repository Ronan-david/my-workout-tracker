# E2E Testing Setup for SetTracker Component

## 🎯 Overview

This directory contains comprehensive end-to-end tests for the SetTracker component using Playwright. The tests are designed to run in **English locale** by default, ensuring predictable text assertions regardless of the application's default locale setting.

## 📁 File Structure

```
e2e/
├── page-objects/
│   ├── set-tracker.page.ts    # SetTracker component page object
│   └── workout-page.page.ts   # WorkoutPage component page object
├── utils/
│   └── test-helpers.ts        # Test utilities and locale management
├── set-tracker.spec.ts        # Main test file
└── README.md                 # This file
```

## 🌍 Locale Management

### Problem
The application defaults to French locale (`'fr'`), but tests are written with English text assertions.

### Solution
We've implemented locale management utilities that:

1. **Force English locale** for consistent test execution
2. **Support both locales** for internationalization testing
3. **Handle locale switching** via localStorage and cookies

### Usage

```typescript
// Automatic English locale setup (recommended)
await workoutPage.navigateToWorkoutPage() // Automatically sets English

// Manual locale control
const testHelpers = new TestHelpers(page)
await testHelpers.setLocaleToEnglish()
await testHelpers.setLocaleToFrench()
```

## 🧪 Test Coverage

### SetTracker Component Tests
- ✅ **Display functionality** - Exercise info, initial state, input fields
- ✅ **Set completion** - Visual feedback, completion states, counters
- ✅ **Set management** - Add sets, duplicate sets, multiple sets
- ✅ **Input validation** - Number inputs, min/max values, edge cases
- ✅ **User interactions** - Delete exercise, state persistence
- ✅ **Responsive design** - Mobile viewport testing
- ✅ **Locale support** - English (default) and French testing

### Integration Tests
- ✅ **WorkoutPage integration** - Multi-exercise workflows
- ✅ **Workout management** - Start, cancel, complete workflows
- ✅ **Exercise selection** - Filtering, selection, addition
- ✅ **Progress tracking** - Workout completion states

## 🔧 Page Object Model

### SetTrackerPage
Comprehensive page object for SetTracker component with:
- **Locators**: All UI elements (50+ methods)
- **Actions**: User interactions (complete sets, add sets, etc.)
- **Assertions**: Verification helpers with descriptive names
- **Multi-tracker support**: Handle multiple SetTracker instances

### WorkoutPage  
Page object for WorkoutPage component with:
- **Exercise selection**: Card selection, filtering, multi-select
- **Workout controls**: Start, cancel, finish actions
- **Progress tracking**: Progress bar, completion states
- **Assertion helpers**: Page state verification

### TestHelpers
Utility class for common test operations:
- **Locale management**: Switch between English/French
- **Navigation helpers**: Pre-configured locale navigation
- **Viewport controls**: Mobile/tablet/desktop sizes
- **Storage management**: Clear cookies/localStorage

## 🎨 Key Features

### 1. **Class-Based Selectors**
```typescript
// Instead of text-based selectors
❌ page.getByText('Add Another Set')

// Use class-based with text filtering
✅ page.locator('.add-set-btn').filter({ hasText: 'Add Another Set' })
```

### 2. **Centralized CSS Classes**
```typescript
export const SET_TRACKER_CLASSES = {
  setTracker: '.set-tracker',
  setTrackerRow: '.set-tracker__row',
  addSetBtn: '.add-set-btn',
  // ... more classes
} as const
```

### 3. **Reusable Test Data**
```typescript
export const SET_TRACKER_TEST_DATA = {
  exercises: {
    benchPress: 'Bench Press',
    deadlifts: 'Deadlifts'
  },
  sets: {
    reps: { light: '10', medium: '8', heavy: '5' },
    weights: { light: '50', medium: '75', heavy: '100' }
  }
} as const
```

### 4. **Comprehensive Action Methods**
```typescript
// Simple actions
await setTracker.fillSetData('10', '50')
await setTracker.completeSet('10', '50')
await setTracker.addNewSet()
await setTracker.deleteExercise()

// Complex assertions
await setTracker.expectSetCompleted()
await setTracker.expectCompletedSetsCount(1, 2)
await setTracker.expectAddSetButtonsVisible()
```

## 🚀 Running Tests

```bash
# Run all SetTracker tests
npx playwright test e2e/set-tracker.spec.ts

# Run with UI mode
npx playwright test e2e/set-tracker.spec.ts --ui

# Run specific test
npx playwright test e2e/set-tracker.spec.ts -g "should complete set"

# Run in headed mode (see browser)
npx playwright test e2e/set-tracker.spec.ts --headed

# Generate HTML report
npx playwright test e2e/set-tracker.spec.ts --reporter=html
```

## 🐛 Debugging

### Common Issues

1. **Locale mismatch**: Tests expect English but app shows French
   - **Solution**: Tests automatically set English locale

2. **Timing issues**: Fast interactions causing flaky tests
   - **Solution**: Built-in waits in action methods

3. **Element not found**: CSS selectors changed
   - **Solution**: Centralized CSS classes for easy updates

### Debug Commands
```bash
# Debug mode with browser
npx playwright test --debug e2e/set-tracker.spec.ts

# Generate trace files
npx playwright test --trace on e2e/set-tracker.spec.ts

# Show verbose output
npx playwright test --verbose e2e/set-tracker.spec.ts
```

## 📝 Adding New Tests

### 1. Use Page Objects
```typescript
// ✅ Good - Use page object methods
await setTracker.completeSet('10', '50')
await setTracker.expectSetCompleted()

// ❌ Avoid - Direct page interactions
await page.locator('.reps-input').fill('10')
await expect(page.locator('.set-row')).toHaveClass(/completed/)
```

### 2. Use Test Data Constants
```typescript
// ✅ Good - Use test data
await setTracker.fillSetData(TEST_DATA.sets.reps.light, TEST_DATA.sets.weights.light)

// ❌ Avoid - Magic numbers
await setTracker.fillSetData('10', '50')
```

### 3. Ensure English Locale
```typescript
test.beforeEach(async ({ page }) => {
  // This automatically sets English locale
  await workoutPage.navigateToWorkoutPage()
})
```

## 🎨 Best Practices

1. **Use descriptive test names** that explain what's being tested
2. **Group related tests** using `describe` blocks
3. **Use assertion helpers** instead of raw expect statements
4. **Test both positive and negative scenarios**
5. **Include responsive testing** for mobile viewports
6. **Test edge cases** (zero values, large numbers, etc.)
7. **Use proper waiting** instead of arbitrary delays

This testing setup provides a robust, maintainable, and comprehensive test suite for the SetTracker component! 🚀

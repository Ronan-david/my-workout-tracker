import type { Page } from '@playwright/test'

/**
 * Test utility functions for common test operations
 */
export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Set the application locale to English for testing
   * This ensures tests run with predictable English text
   */
  async setLocaleToEnglish(): Promise<void> {
    // Inject script to set locale directly on the Vue i18n instance
    await this.page.addInitScript(() => {
      // Set various storage methods as fallback
      localStorage.setItem('locale', 'en')
      localStorage.setItem('i18n-locale', 'en')
      sessionStorage.setItem('locale', 'en')
      
      // Set a global flag that can be checked
      (window as any).__PLAYWRIGHT_LOCALE__ = 'en'
    })
    
    // Also try to set locale via URL parameter
    await this.page.addInitScript(() => {
      const url = new URL(window.location.href)
      url.searchParams.set('locale', 'en')
      window.history.replaceState({}, '', url.toString())
    })
  }

  /**
   * Set the application locale to French
   */
  async setLocaleToFrench(): Promise<void> {
    await this.page.addInitScript(() => {
      localStorage.setItem('locale', 'fr')
      localStorage.setItem('i18n-locale', 'fr')
      sessionStorage.setItem('locale', 'fr')
      (window as any).__PLAYWRIGHT_LOCALE__ = 'fr'
    })
    
    await this.page.addInitScript(() => {
      const url = new URL(window.location.href)
      url.searchParams.set('locale', 'fr')
      window.history.replaceState({}, '', url.toString())
    })
  }

  /**
   * Force set locale by directly manipulating the Vue i18n instance after page load
   */
  async forceSetLocale(locale: 'en' | 'fr'): Promise<void> {
    await this.page.evaluate((localeValue) => {
      // Try to find and modify the Vue i18n instance
      const app = (window as any).__VUE_APP__
      if (app && app.config && app.config.globalProperties && app.config.globalProperties.$i18n) {
        app.config.globalProperties.$i18n.global.locale.value = localeValue
      }
      
      // Alternative approach - look for i18n in global
      if ((window as any).i18n) {
        (window as any).i18n.global.locale.value = localeValue
      }
      
      // Try Vue devtools approach
      if ((window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__) {
        const hook = (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__
        if (hook.apps && hook.apps[0]) {
          const app = hook.apps[0]
          if (app.config.globalProperties.$i18n) {
            app.config.globalProperties.$i18n.global.locale.value = localeValue
          }
        }
      }
    }, locale)
    
    // Wait a bit for the change to take effect
    await this.page.waitForTimeout(100)
  }

  /**
   * Wait for the page to be fully loaded and ready
   */
  async waitForPageReady(): Promise<void> {
    // Wait for the page to be in a loaded state
    await this.page.waitForLoadState('domcontentloaded')
    
    // Wait for network activity to settle
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Navigate to a page with English locale pre-configured
   * @param url - URL to navigate to
   */
  async navigateWithEnglishLocale(url: string): Promise<void> {
    await this.setLocaleToEnglish()
    await this.page.goto(url)
    await this.waitForPageReady()
  }

  /**
   * Clear all storage and cookies for a fresh test state
   */
  async clearStorage(): Promise<void> {
    await this.page.context().clearCookies()
    await this.page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  }

  /**
   * Set viewport to mobile size
   */
  async setMobileViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 })
  }

  /**
   * Set viewport to tablet size
   */
  async setTabletViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 768, height: 1024 })
  }

  /**
   * Set viewport to desktop size
   */
  async setDesktopViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 1920, height: 1080 })
  }

  /**
   * Take a screenshot with a descriptive name
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    })
  }

  /**
   * Wait for network to be idle (useful for SPA navigation)
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle')
  }
}

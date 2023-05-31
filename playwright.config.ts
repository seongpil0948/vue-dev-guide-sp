import { defineConfig, devices, expect } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
// const TEST_REPORT_PATH = './test-results'
export default defineConfig({
  testDir: './test/e2e',
  // timeout: 5000,
  // expect: {
  /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
  // timeout: 5000,
  // },
  // outputDir: `${TEST_REPORT_PATH}/out`,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  // reporter: [
  // ['html'],
  // ['json', { outputFolder: TEST_REPORT_PATH, outputFile: `${TEST_REPORT_PATH}/report.json` }],
  // ['./test/reporter.ts'],
  // ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3333',
    /* Only on CI systems run the tests headless */
    headless: !!process.env.CI,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ..devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    /**
     * Use the dev server by default for faster feedback loop.
     * Use the preview server on CI for more realistic testing.
    Playwright will re-use the local server if there is already a dev-server running.
     */
    // command: process.env.CI ? 'vite preview --port 3333' : 'vite dev',
    command: process.env.CI ? ' pnpm run preview --port 3333' : 'vite dev',
    port: 3333,
    reuseExistingServer: !process.env.CI,
  },
})

expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () => 'passed',
        pass: true,
      }
    }
    else {
      return {
        message: () => 'failed',
        pass: false,
      }
    }
  },
})

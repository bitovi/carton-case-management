import { defineConfig, devices } from '@playwright/test';

// Set BASE_URL to test an app that is already running somewhere else - for example the `app`
// service in docker-compose.test.yaml. When it is set, Playwright targets that URL and does not
// start its own servers. With it unset (the normal local case) behaviour is unchanged: Playwright
// starts the dev servers itself, reusing them if they are already up.
const externalBaseURL = process.env.BASE_URL;
const baseURL = externalBaseURL || 'http://localhost:5173';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Containers often have no LANG set, which makes Chromium report an invalid
    // navigator.language ("en-US@posix"). Pinning the locale keeps runs deterministic
    // and matches what a real browser reports.
    locale: 'en-US',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: externalBaseURL
    ? undefined
    : [
        {
          command: 'npm run dev:server',
          url: 'http://localhost:3001/health',
          reuseExistingServer: !process.env.CI,
        },
        {
          command: 'npm run dev:client',
          url: 'http://localhost:5173',
          reuseExistingServer: !process.env.CI,
        },
      ],
});

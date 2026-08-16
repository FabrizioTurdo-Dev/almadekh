import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  fullyParallel: false,
  workers: 1,
  use: {
    headless: true,
  },
  webServer: {
    command: 'node tests/serve.mjs',
    port: 4175,
    reuseExistingServer: true,
    timeout: 15000,
  },
})
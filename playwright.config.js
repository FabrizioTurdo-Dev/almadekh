import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  fullyParallel: false,
  workers: 1,
  use: {
    headless: true,
    // Los specs de la app usan rutas relativas; el de HEIC apunta a 127.0.0.1:4175.
    baseURL: 'http://127.0.0.1:4176',
  },
  webServer: [
    {
      // Servidor de fixtures para las pruebas de conversion HEIC.
      command: 'node tests/serve.mjs',
      port: 4175,
      reuseExistingServer: true,
      timeout: 15000,
    },
    {
      // La app real, en un puerto fijo para no depender del autoPort de Vite.
      // `--host 127.0.0.1` es necesario: por defecto Vite escucha en `localhost`,
      // que en esta maquina resuelve a ::1, y Playwright sondea 127.0.0.1.
      command: 'npm run dev -- --port 4176 --strictPort --host 127.0.0.1',
      port: 4176,
      reuseExistingServer: true,
      timeout: 60000,
    },
  ],
})
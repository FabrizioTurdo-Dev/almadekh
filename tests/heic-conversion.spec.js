import { test, expect } from '@playwright/test'

const BASE = 'http://127.0.0.1:4175'
const CSP_PATTERN = /Content Security Policy|unsafe-eval|EvalError|violates/i

async function loadConversion(page, pageName) {
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(String(err)))
  page.on('weberror', (err) => errors.push(String(err.error)))

  await page.goto(`${BASE}/${pageName}`)
  await page.waitForFunction(() => {
    const raw = window.__RESULT__
    return raw && JSON.parse(raw).error !== 'not-run'
  })
  return { result: JSON.parse(await page.evaluate(() => window.__RESULT__)), errors }
}

test('HEIC -> JPEG con el CSP de produccion (unsafe-eval habilitado)', async ({
  page,
}) => {
  const { result, errors } = await loadConversion(page, 'index.html')

  expect(errors.filter((e) => CSP_PATTERN.test(e))).toEqual([])
  expect(result.ok).toBe(true)
  expect(result.type).toBe('image/jpeg')
  expect(result.size).toBeGreaterThan(1000)
})

test('control negativo: CSP estricto (sin unsafe-eval) debe fallar con EvalError', async ({
  page,
}) => {
  const errors = []
  page.on('pageerror', (err) => errors.push(String(err)))
  page.on('weberror', (err) => errors.push(String(err.error)))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  await page.goto(`${BASE}/index-strict.html`)

  const deadline = Date.now() + 30000
  while (Date.now() < deadline && !errors.some((e) => CSP_PATTERN.test(e))) {
    await page.waitForTimeout(250)
  }

  const evidence = errors.find((e) => CSP_PATTERN.test(e))
  expect(evidence).toMatch(/unsafe-eval|EvalError|Content Security Policy/)
})
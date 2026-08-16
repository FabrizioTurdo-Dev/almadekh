import { test, expect } from '@playwright/test'

const BASE = 'http://127.0.0.1:4175'
const CSP_PATTERN = /Content Security Policy|unsafe-eval|EvalError|violates/i

async function loadConversion(page, { pageName, file }) {
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(String(err)))
  page.on('weberror', (err) => errors.push(String(err.error)))

  const url = new URL(`${BASE}/${pageName}`)
  if (file) url.searchParams.set('file', file)
  await page.goto(url.toString())
  await page.waitForFunction(() => {
    const raw = window.__RESULT__
    return raw && JSON.parse(raw).error !== 'not-run'
  })
  return {
    result: JSON.parse(await page.evaluate(() => window.__RESULT__)),
    errors,
  }
}

test('iOS 18 HEIC (IMG_4295) -> JPEG con libheif-js bajo CSP de produccion', async ({
  page,
}) => {
  const { result, errors } = await loadConversion(page, {
    pageName: 'index.html',
    file: 'IMG_4295.HEIC',
  })

  expect(errors.filter((e) => CSP_PATTERN.test(e))).toEqual([])
  expect(result.ok).toBe(true)
  expect(result.type).toBe('image/jpeg')
  expect(result.size).toBeGreaterThan(1000)
  expect(result.width).toBeGreaterThan(0)
  expect(result.height).toBeGreaterThan(0)
})

test('HEIC legacy (sample) -> JPEG con libheif-js bajo CSP de produccion', async ({
  page,
}) => {
  const { result, errors } = await loadConversion(page, {
    pageName: 'index.html',
    file: 'sample.heic',
  })

  expect(errors.filter((e) => CSP_PATTERN.test(e))).toEqual([])
  expect(result.ok).toBe(true)
  expect(result.type).toBe('image/jpeg')
  expect(result.size).toBeGreaterThan(1000)
})

test('control: el decodificador viejo (heic2any) sigue fallando con el iOS 18 HEIC', async ({
  page,
}) => {
  const { result, errors } = await loadConversion(page, {
    pageName: 'index-old.html',
    file: 'IMG_4295.HEIC',
  })

  expect(result.ok).toBe(false)
  const evidence = [result.error, ...errors].join('\n')
  expect(evidence).toMatch(/ERR_LIBHEIF|format not supported|Could not parse HEIF/)
})
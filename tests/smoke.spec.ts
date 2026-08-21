import { test, expect, type Page } from '@playwright/test'

/**
 * Pruebas de regresion de la app.
 *
 * Cada bloque fija una correccion concreta de la auditoria: si alguien vuelve
 * a introducir el problema, el test lo dice. No tocan Supabase (no se llega a
 * enviar ningun pedido real).
 */

const MOBILE = { width: 375, height: 667 }

/** Recorre la pagina entera despacio, para disparar lazy-load y `whileInView`. */
async function scrollAll(page: Page) {
  await page.evaluate(async () => {
    let y = 0
    while (y < document.body.scrollHeight) {
      y += 200
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 90))
    }
  })
  await page.waitForTimeout(1500)
}

test.beforeEach(async ({ page }) => {
  // El splash dura 3,5s y tapa todo: se marca como visto antes de cargar.
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem('almadekh_splash_seen', 'true')
    } catch {
      /* modo privado */
    }
  })
})

test.describe('landing', () => {
  test.use({ viewport: MOBILE, isMobile: true, hasTouch: true })

  test('no crece durante el scroll (galeria con medidas)', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#eventos', { state: 'attached' })
    await page.waitForTimeout(1000)

    const antes = await page.evaluate(() => document.body.scrollHeight)
    await scrollAll(page)
    const despues = await page.evaluate(() => document.body.scrollHeight)

    // Sin width/height en las <img> de la galeria esto crecia ~2.900px y el
    // visitante perdia la posicion de scroll a mitad de pagina.
    expect(Math.abs(despues - antes)).toBeLessThan(60)
  })

  test('la galeria sirve WebP y ninguna imagen queda rota', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#eventos', { state: 'attached' })
    await scrollAll(page)

    const galeria = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll<HTMLImageElement>('picture img')]
      return {
        total: imgs.length,
        rotas: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
        webp: imgs.filter((i) => i.currentSrc.endsWith('.webp')).length,
      }
    })

    expect(galeria.total).toBe(25)
    expect(galeria.rotas).toBe(0)
    expect(galeria.webp).toBe(galeria.total)
  })

  test('no hay scroll horizontal', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#eventos', { state: 'attached' })
    await scrollAll(page)

    const desborde = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(desborde).toBeLessThanOrEqual(1)
  })

  test('el parallax de Espacio no descubre el marco', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#espacio', { state: 'attached' })
    await scrollAll(page)
    await page.locator('#espacio').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    const hueco = await page.evaluate(() => {
      const marco = [...document.querySelectorAll('#espacio div')].find(
        (d) =>
          d.querySelector('img[src*="espacio.jpg"]') &&
          getComputedStyle(d).overflow === 'hidden'
      )
      const img = marco?.querySelector('img')
      if (!marco || !img) return null
      const m = marco.getBoundingClientRect()
      const i = img.getBoundingClientRect()
      return { arriba: i.top - m.top, abajo: m.bottom - i.bottom }
    })

    expect(hueco).not.toBeNull()
    // Valores <= 0 significan que la imagen sobra por ambos lados del marco.
    expect(hueco!.arriba).toBeLessThanOrEqual(0)
    expect(hueco!.abajo).toBeLessThanOrEqual(0)
  })

  test('el telefono se muestra en formato argentino', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#contacto', { state: 'attached' })
    const tel = page.locator('#contacto a[href^="tel:"]').first()
    await expect(tel).toHaveText(/^0\d{2,4} \d{3,4}-\d{3,4}$/)
  })

  test('sin errores de consola', async ({ page }) => {
    const errores: string[] = []
    page.on('console', (m) => {
      if (m.type() === 'error') errores.push(m.text())
    })
    page.on('pageerror', (e) => errores.push(String(e)))

    await page.goto('/')
    await page.waitForSelector('#eventos', { state: 'attached' })
    await scrollAll(page)

    expect(errores).toEqual([])
  })
})

test.describe('menu', () => {
  test.use({ viewport: MOBILE, isMobile: true, hasTouch: true })

  test('las solapas de categoria quedan fijas al hacer scroll', async ({ page }) => {
    await page.goto('/menu')
    await page.waitForSelector('main, [class*="sticky"]', { state: 'attached' })
    await page.waitForTimeout(800)
    await page.evaluate(() => window.scrollTo(0, 1200))
    await page.waitForTimeout(400)

    const top = await page.evaluate(() => {
      const tabs = document.querySelector('[class*="sticky"][class*="overflow-x-auto"]')
      return tabs ? tabs.getBoundingClientRect().top : null
    })

    // Con `overflow-hidden` en un ancestro el sticky no se activaba y las
    // solapas se iban de pantalla (top llegaba a -269).
    expect(top).not.toBeNull()
    expect(top!).toBeGreaterThanOrEqual(-1)
    expect(top!).toBeLessThan(60)
  })

  test('los controles tactiles llegan a 44px', async ({ page }) => {
    await page.goto('/menu')
    await page.waitForTimeout(1200)

    const chicos = await page.evaluate(() => {
      const out: { txt: string; w: number; h: number }[] = []
      document.querySelectorAll('button, a[href]').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (!r.width || !r.height) return
        if (r.height < 44 || r.width < 44) {
          out.push({
            txt: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30),
            w: Math.round(r.width),
            h: Math.round(r.height),
          })
        }
      })
      return out
    })

    expect(chicos).toEqual([])
  })

  test('agregar platos actualiza el carrito y valida antes de enviar', async ({ page }) => {
    await page.goto('/menu')
    await page.waitForTimeout(1200)

    await page.locator('button[aria-label^="Agregar"]').first().click()
    await page.locator('button[aria-label^="Agregar"]').first().click()
    await page.waitForTimeout(300)

    await page.getByLabel('Abrir carrito').click()
    await page.waitForTimeout(500)

    await expect(page.getByRole('heading', { name: 'Tu Pedido' })).toBeVisible()
    await expect(page.getByText(/2 ítems/)).toBeVisible()

    // Sin nombre ni modalidad el envio tiene que estar bloqueado.
    const enviar = page.getByRole('button', { name: /Enviar Pedido/ })
    await expect(enviar).toBeDisabled()

    await page.getByLabel('Tu nombre').fill('Prueba')
    await expect(enviar).toBeDisabled()

    await page.getByLabel('Modalidad de entrega').selectOption('Para llevar')
    await expect(enviar).toBeEnabled()
    // No se hace clic: crearia un pedido real en Supabase.
  })
})

test.describe('404', () => {
  test('una ruta inexistente muestra el 404 y vuelve al inicio', async ({ page }) => {
    await page.goto('/no-existe-esta-ruta')
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
    await page.getByRole('button', { name: 'Volver al Inicio' }).click()
    await expect(page).toHaveURL(/\/$/)
  })
})

import { expect, test } from '@playwright/test'

const publicPages = [
  '/',
  '/cursos',
  '/artigos',
  '/certificados',
  '/metodo-fimathe',
  '/manual',
  '/ea',
  '/relogio',
  '/sitemap',
  '/download',
]

for (const url of publicPages) {
  test(`public page ${url} loads`, async ({ page }) => {
    const response = await page.goto(url)
    expect(response?.status(), `HTTP status for ${url}`).toBeLessThan(400)
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })
}

test('footer exposes the cursos link', async ({ page }) => {
  await page.goto('/')
  const footer = page.locator('footer').first()
  await expect(footer).toBeVisible()

  const cursosLink = footer.locator('a[href="/cursos"]').first()
  await expect(cursosLink).toBeVisible()
  await expect(cursosLink).toHaveText(/Cursos/)
})

test('sitemap lists public routes', async ({ page }) => {
  await page.goto('/sitemap')
  await expect(page.locator('main, footer').first()).toBeVisible()
  await expect(page.getByRole('link', { name: 'Cursos' }).first()).toBeVisible()
})

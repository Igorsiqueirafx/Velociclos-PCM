import { expect, test } from '@playwright/test'

test('the implemented sitemap route loads directly', async ({ page }) => {
  await page.goto('/sitemap')
  await expect(page.getByRole('heading', { name: 'Mapa do Site', level: 1 })).toBeVisible()
})

test('desktop navigation opens the implemented sitemap route', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')

  const sitemapLink = page
    .getByRole('navigation', { name: 'Menu de navegação principal' })
    .getByRole('link', { name: 'Sitemap', exact: true })
  await expect(sitemapLink).toBeVisible()
  await sitemapLink.click()

  await expect(page).toHaveURL(/\/sitemap$/)
  await expect(page.getByRole('heading', { name: 'Mapa do Site', level: 1 })).toBeVisible()
})

test('mobile navigation opens the sitemap and closes the menu', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  const menuButton = page.getByRole('button', { name: 'Abrir menu de navegação' })
  await menuButton.click()
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true')

  await page
    .getByRole('navigation', { name: 'Menu mobile' })
    .getByRole('link', { name: 'Sitemap' })
    .click()

  await expect(page).toHaveURL(/\/sitemap$/)
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('heading', { name: 'Mapa do Site', level: 1 })).toBeVisible()
})

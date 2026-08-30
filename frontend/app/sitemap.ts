import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://velociclos.vercel.app'

  const publicRoutes = [
    '',
    '/cursos',
    '/artigos',
    '/certificados',
    '/metodo-fimathe',
    '/manual',
    '/ea',
    '/relogio',
    '/entrar',
    '/lead-capture',
    '/cadastro-lead',
    '/auth/login',
    '/auth/register',
    '/site-map',
  ]

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}

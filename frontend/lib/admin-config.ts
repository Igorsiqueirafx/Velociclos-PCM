export const ADMIN_DOMAINS = ['velociclosadm.vercel.app']

export function isAdminHost(host: string | null | undefined): boolean {
  if (!host) return false
  const normalized = host.split(':')[0].toLowerCase()
  return ADMIN_DOMAINS.includes(normalized)
}

export function isAdminSiteEnabled(): boolean {
  return process.env.NEXT_PUBLIC_IS_ADMIN_SITE === 'true'
}

export function resolveIsAdminSite(host: string | null | undefined): boolean {
  return isAdminHost(host) || isAdminSiteEnabled()
}

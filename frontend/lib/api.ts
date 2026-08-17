const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'

export async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }
  return res.json()
}

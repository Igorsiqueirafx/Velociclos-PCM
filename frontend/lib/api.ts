const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.vercel.app'
const DEFAULT_TIMEOUT = 5000

function createAbortController(timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  return { controller, clear: () => clearTimeout(timeoutId) }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { controller, clear } = createAbortController()
  const method = (options.method || 'GET').toUpperCase()
  const isRevalidationCandidate = method === 'GET' && !options.next?.revalidate

  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
      signal: controller.signal,
      next: {
        revalidate: isRevalidationCandidate ? 60 : 0,
        ...options.next,
      },
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`API error ${res.status}: ${text}`)
    }

    if (res.status === 204 || !res.body) {
      return {} as T
    }

    return res.json()
  } finally {
    clear()
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  return api<T>(path)
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return api<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  return api<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function apiDelete<T>(path: string): Promise<T> {
  return api<T>(path, {
    method: 'DELETE',
  })
}
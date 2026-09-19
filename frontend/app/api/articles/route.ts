import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.vercel.app'

async function proxy(path: string) {
  const url = new URL(BACKEND_URL)
  url.pathname = path

  const response = await fetch(url.toString(), {
    headers: {
      cookie: '',
    },
    cache: 'no-store',
  })

  const data = await response.text()
  return new NextResponse(data, {
    status: response.status,
    headers: {
      'content-type': response.headers.get('content-type') || 'application/json',
    },
  })
}

export async function GET(_request: NextRequest) {
  return proxy('/api/articles')
}


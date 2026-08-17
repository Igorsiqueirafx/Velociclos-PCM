import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'velociclos2024'

export async function POST() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/playlists/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_PASSWORD}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync playlists' },
      { status: 500 }
    )
  }
}

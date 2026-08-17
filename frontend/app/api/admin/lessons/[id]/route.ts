import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'velociclos2024'

async function getAuthHeaders() {
  return {
    'Authorization': `Bearer ${ADMIN_PASSWORD}`,
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const res = await fetch(`${BACKEND_URL}/api/lessons/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    })
    if (!res.ok) {
      const data = await res.json()
      return NextResponse.json(data, { status: res.status })
    }
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 })
  }
}

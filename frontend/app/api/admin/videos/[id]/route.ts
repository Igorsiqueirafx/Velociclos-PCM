import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.up.railway.app'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'velociclos2024'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const res = await fetch(`${BACKEND_URL}/api/videos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${ADMIN_PASSWORD}`,
      },
    })

    if (!res.ok) {
      const data = await res.json()
      return NextResponse.json(data, { status: res.status })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete video' },
      { status: 500 }
    )
  }
}

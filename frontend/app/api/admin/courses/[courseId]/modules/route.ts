import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api-backend.vercel.app'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'velociclos2024'

async function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ADMIN_PASSWORD}`,
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const res = await fetch(`${BACKEND_URL}/api/courses/${courseId}/modules`, {
      headers: await getAuthHeaders(),
      cache: 'no-store',
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json(data, { status: res.status })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const body = await request.json()
    const res = await fetch(`${BACKEND_URL}/api/courses/${courseId}/modules`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json(data, { status: res.status })
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 })
  }
}

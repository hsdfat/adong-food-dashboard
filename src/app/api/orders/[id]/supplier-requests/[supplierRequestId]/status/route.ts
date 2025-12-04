import { NextRequest, NextResponse } from 'next/server'
import { apiClient, ApiError } from '@/utils/api_client'

type Params = {
  id: string;
  supplierRequestId: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const body = await request.json()

    const payload = {
      status: body.status,
      notes: body.notes ?? '',
    }

    const backendUrl = `/api/orders/${params.id}/supplier-requests/${params.supplierRequestId}/status`

    const data = await apiClient(backendUrl, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })

    return NextResponse.json(data)
  } catch (error) {
    const status =
      (error as ApiError)?.status && (error as ApiError).status > 0
        ? (error as ApiError).status
        : 500
    const message =
      error instanceof Error ? error.message : 'Failed to update supplier request status'

    return NextResponse.json(
      { error: message },
      { status },
    )
  }
}



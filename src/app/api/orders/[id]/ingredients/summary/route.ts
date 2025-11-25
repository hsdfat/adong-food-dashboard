import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '@/utils/api_client'

interface IngredientItem {
  ingredientId?: string
  ingredientName?: string
  ingredient_name?: string
  totalQuantity?: number
  quantity?: number
  unit?: string
  standardPerPortion?: number
  standard_per_portion?: number
}

interface RawDataResponse {
  data?: unknown
  ingredients?: IngredientItem[]
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = new URLSearchParams()

    // Pass through query parameters
    const kitchenId = searchParams.get('kitchen_id')
    const status = searchParams.get('status')
    const fromDate = searchParams.get('from_date')
    const toDate = searchParams.get('to_date')
    const dishId = searchParams.get('dish_id')
    const ingredientId = searchParams.get('ingredient_id')

    if (kitchenId) queryParams.append('kitchen_id', kitchenId)
    if (status) queryParams.append('status', status)
    if (fromDate) queryParams.append('from_date', fromDate)
    if (toDate) queryParams.append('to_date', toDate)
    if (dishId) queryParams.append('dish_id', dishId)
    if (ingredientId) queryParams.append('ingredient_id', ingredientId)

    const url = queryParams.toString()
      ? `/api/orders/${params.id}/ingredients/summary?${queryParams.toString()}`
      : `/api/orders/${params.id}/ingredients/summary`

    const data = await apiClient<RawDataResponse>(url)

    // Handle wrapped response structure { data: {...} } or unwrapped
    const rawData = (data as RawDataResponse).data || data

    // Backend returns array directly, transform it to expected format
    let ingredientsArray: IngredientItem[] = []

    if (Array.isArray(rawData)) {
      // Backend returns array directly
      ingredientsArray = rawData as IngredientItem[]
    } else if (rawData && typeof rawData === 'object' && 'ingredients' in rawData && Array.isArray((rawData as RawDataResponse).ingredients)) {
      // Backend returns object with ingredients array
      ingredientsArray = (rawData as RawDataResponse).ingredients || []
    } else if (rawData && typeof rawData === 'object') {
      // Single object, wrap in array
      ingredientsArray = [rawData as IngredientItem]
    }

    // Transform ingredients: map totalQuantity to quantity
    const transformedIngredients = ingredientsArray.map((item: IngredientItem) => ({
      ingredientId: item.ingredientId,
      ingredientName: item.ingredientName || item.ingredient_name,
      quantity:
        item.totalQuantity !== undefined
          ? item.totalQuantity
          : item.quantity || 0,
      unit: item.unit,
      standardPerPortion:
        item.standardPerPortion !== undefined
          ? item.standardPerPortion
          : item.standard_per_portion || undefined,
    }))

    // Create response object with orderId and ingredients
    const responseData = {
      orderId: parseInt(params.id, 10),
      ingredients: transformedIngredients,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch ingredients summary'
    const errorStatus = (error as { status?: number }).status || 500
    return NextResponse.json(
      { error: errorMessage },
      { status: errorStatus },
    )
  }
}

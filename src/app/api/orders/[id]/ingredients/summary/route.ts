import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '@/utils/api_client'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
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

        const data = await apiClient<any>(url)

        // Handle wrapped response structure { data: {...} } or unwrapped
        let rawData = data.data || data

        // Backend returns array directly, transform it to expected format
        let ingredientsArray: any[] = []

        if (Array.isArray(rawData)) {
            // Backend returns array directly
            ingredientsArray = rawData
        } else if (rawData && Array.isArray(rawData.ingredients)) {
            // Backend returns object with ingredients array
            ingredientsArray = rawData.ingredients
        } else if (rawData && typeof rawData === 'object') {
            // Single object, wrap in array
            ingredientsArray = [rawData]
        }

        // Transform ingredients: map totalQuantity to quantity
        const transformedIngredients = ingredientsArray.map((item: any) => ({
            ingredientId: item.ingredientId,
            ingredientName: item.ingredientName || item.ingredient_name,
            quantity: item.totalQuantity !== undefined ? item.totalQuantity : (item.quantity || 0),
            unit: item.unit,
            standardPerPortion: item.standardPerPortion !== undefined ? item.standardPerPortion : (item.standard_per_portion || undefined),
        }))

        // Create response object with orderId and ingredients
        const responseData = {
            orderId: parseInt(params.id),
            ingredients: transformedIngredients,
        }

        return NextResponse.json(responseData)
    } catch (error: any) {
        console.error('Error fetching ingredients summary:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch ingredients summary' },
            { status: error.status || 500 }
        )
    }
}


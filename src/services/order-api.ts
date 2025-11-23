// services/order-api.ts
import { apiClient } from '@/utils/api_client'
import {
  OrderDTO,
  CreateOrderInput,
  UpdateOrderInput,
  GetOrdersParams,
} from '@/models/order'
import { ResourceCollection } from '@/models/resource'

const BASE_URL = '/api/orders'

export const orderApi = {
  /**
   * Get all orders with pagination and filters
   */
  async getAll(
    params?: GetOrdersParams,
  ): Promise<ResourceCollection<OrderDTO>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.per_page)
      queryParams.append('per_page', params.per_page.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir)
    if (params?.kitchen_id) queryParams.append('kitchen_id', params.kitchen_id)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.from_date) queryParams.append('from_date', params.from_date)
    if (params?.to_date) queryParams.append('to_date', params.to_date)
    if (params?.dish_id) queryParams.append('dish_id', params.dish_id)
    if (params?.ingredient_id)
      queryParams.append('ingredient_id', params.ingredient_id)

    const url = queryParams.toString()
      ? `${BASE_URL}?${queryParams.toString()}`
      : BASE_URL
    return await apiClient<ResourceCollection<OrderDTO>>(url)
  },

  /**
   * Get order by ID
   */
  async getById(id: number | string): Promise<OrderDTO> {
    return await apiClient<OrderDTO>(`${BASE_URL}/${id}`)
  },

  /**
   * Get ingredients summary for an order
   */
  async getIngredientsSummary(
    id: number | string,
    params?: {
      kitchen_id?: string
      status?: string
      from_date?: string
      to_date?: string
      dish_id?: string
      ingredient_id?: string
    },
  ): Promise<unknown> {
    const queryParams = new URLSearchParams()
    if (params?.kitchen_id) queryParams.append('kitchen_id', params.kitchen_id)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.from_date) queryParams.append('from_date', params.from_date)
    if (params?.to_date) queryParams.append('to_date', params.to_date)
    if (params?.dish_id) queryParams.append('dish_id', params.dish_id)
    if (params?.ingredient_id)
      queryParams.append('ingredient_id', params.ingredient_id)

    const url = queryParams.toString()
      ? `${BASE_URL}/${id}/ingredients/summary?${queryParams.toString()}`
      : `${BASE_URL}/${id}/ingredients/summary`
    return await apiClient<unknown>(url)
  },

  /**
   * Get ingredient summary for a specific ingredient in an order
   */
  async getIngredientSummary(
    orderId: number | string,
    ingredientId: string,
    params?: {
      kitchen_id?: string
      status?: string
      from_date?: string
      to_date?: string
      dish_id?: string
    },
  ): Promise<unknown> {
    const queryParams = new URLSearchParams()
    if (params?.kitchen_id) queryParams.append('kitchen_id', params.kitchen_id)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.from_date) queryParams.append('from_date', params.from_date)
    if (params?.to_date) queryParams.append('to_date', params.to_date)
    if (params?.dish_id) queryParams.append('dish_id', params.dish_id)

    const url = queryParams.toString()
      ? `${BASE_URL}/${orderId}/ingredients/${ingredientId}/summary?${queryParams.toString()}`
      : `${BASE_URL}/${orderId}/ingredients/${ingredientId}/summary`
    return await apiClient<unknown>(url)
  },

  /**
   * Create new order
   */
  async create(data: CreateOrderInput): Promise<OrderDTO> {
    return await apiClient<OrderDTO>(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update existing order
   */
  async update(id: number | string, data: UpdateOrderInput): Promise<OrderDTO> {
    return await apiClient<OrderDTO>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update order status only (PATCH)
   * PATCH /api/orders/{orderId}/status
   */
  async updateStatus(id: number | string, status: string): Promise<OrderDTO> {
    return await apiClient<OrderDTO>(`${BASE_URL}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: status }),
    })
  },

  /**
   * Delete order
   */
  async delete(id: number | string): Promise<void> {
    return await apiClient(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })
  },

  /**
   * Create supplier requests for an order
   * POST /api/orders/{orderId}/supplier-requests
   */
  async createSupplierRequests(
    orderId: number | string,
    data: {
      Selections: Array<{
        IngredientId: string
        SelectedSupplierId: string
        SelectedProductId: number
        Quantity: number
        Unit: string
        UnitPrice: number
        Notes?: string
      }>
    },
  ): Promise<any> {
    return await apiClient<unknown>(
      `${BASE_URL}/${orderId}/supplier-requests`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    )
  },

  /**
   * Get supplier requests for an order
   * GET /api/orders/{orderId}/supplier-requests
   */
  async getSupplierRequests(orderId: number | string): Promise<any[]> {
    return await apiClient<unknown[]>(
      `${BASE_URL}/${orderId}/supplier-requests`,
    )
  },

  /**
   * Get best suppliers for order ingredients
   * POST /api/orders/{orderId}/best-suppliers
   */
  async getBestSuppliers(
    orderId: number | string,
    data: {
      ingredients: Array<{
        ingredientId: string
        ingredientName: string
        totalQuantity: number
        unit: string
      }>
    },
  ): Promise<any> {
    return await apiClient<unknown>(`${BASE_URL}/${orderId}/best-suppliers`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

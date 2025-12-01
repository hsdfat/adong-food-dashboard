// services/order-api.ts
import { apiClient } from '@/utils/api_client'
import {
  OrderDTO,
  CreateOrderInput,
  UpdateOrderInput,
  GetOrdersParams,
  GetOrderSuppliersResponse,
  GetSuppliersForOrderResponse,
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
    return apiClient<ResourceCollection<OrderDTO>>(url)
  },

  /**
   * Get order by ID
   */
  async getById(id: number | string): Promise<OrderDTO> {
    return apiClient<OrderDTO>(`${BASE_URL}/${id}`)
  },

  /**
   * Get ingredients summary for an order
   */
  async getIngredientsSummary(
    id: number | string,
    params?: {
      kitchen_id?: string;
      status?: string;
      from_date?: string;
      to_date?: string;
      dish_id?: string;
      ingredient_id?: string;
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
    return apiClient<unknown>(url)
  },

  /**
   * Get ingredient summary for a specific ingredient in an order
   */
  async getIngredientSummary(
    orderId: number | string,
    ingredientId: string,
    params?: {
      kitchen_id?: string;
      status?: string;
      from_date?: string;
      to_date?: string;
      dish_id?: string;
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
    return apiClient<unknown>(url)
  },

  /**
   * Create new order
   */
  async create(data: CreateOrderInput): Promise<OrderDTO> {
    return apiClient<OrderDTO>(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update existing order
   */
  async update(id: number | string, data: UpdateOrderInput): Promise<OrderDTO> {
    return apiClient<OrderDTO>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update order status only (PATCH)
   * PATCH /api/orders/{orderId}/status
   */
  async updateStatus(id: number | string, status: string): Promise<OrderDTO> {
    return apiClient<OrderDTO>(`${BASE_URL}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },

  /**
   * Delete order
   */
  async delete(id: number | string): Promise<void> {
    return apiClient(`${BASE_URL}/${id}`, {
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
        IngredientId: string;
        SelectedSupplierId: string;
        SelectedProductId: number;
        Quantity: number;
        Unit: string;
        UnitPrice: number;
        Notes?: string;
      }>;
    },
  ): Promise<unknown> {
    return apiClient<unknown>(
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
  async getSupplierRequests(orderId: number | string): Promise<unknown[]> {
    return apiClient<unknown[]>(
      `${BASE_URL}/${orderId}/selected-suppliers`,
    )
  },

  /**
   * Get best suppliers for order ingredients when creating a new order
   * POST /api/orders/best-suppliers
   */
  async getBestSuppliersForNewOrder(data: {
    kitchenId: string;
    ingredients: Array<{
      ingredientId: string;
      quantity: number;
      unit: string;
    }>;
  }): Promise<any> {
    return apiClient<unknown>(`${BASE_URL}/best-suppliers`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Get best suppliers for order ingredients (for existing orders)
   * GET /api/orders/{orderId}/best-suppliers
   */
  async getBestSuppliersByOrderId(orderId: number | string): Promise<any> {
    return apiClient<unknown>(
      `${BASE_URL}/${orderId}/best-suppliers`,
      {
        method: 'GET',
      },
    )
  },

  /**
   * Get order suppliers for inventory operations
   * Returns order with supplier details optimized for import/export forms
   * GET /api/orders/{orderId}/suppliers-for-inventory
   * Optional supplier_id parameter to filter ingredients by specific supplier
   */
  async getSuppliersForInventory(orderId: string, supplierId?: string): Promise<GetOrderSuppliersResponse> {
    const url = supplierId
      ? `${BASE_URL}/${orderId}/suppliers-for-inventory?supplier_id=${supplierId}`
      : `${BASE_URL}/${orderId}/suppliers-for-inventory`
    return apiClient<GetOrderSuppliersResponse>(url)
  },

  /**
   * Get all suppliers with highlighting for which are used in the order
   * Returns all suppliers with isUsedInOrder flag and ingredient count
   * GET /api/orders/{orderId}/suppliers-with-highlight
   */
  async getSuppliersWithHighlight(orderId: string): Promise<GetSuppliersForOrderResponse> {
    return apiClient<GetSuppliersForOrderResponse>(
      `${BASE_URL}/${orderId}/suppliers-with-highlight`,
    )
  },

  /**
   * Save supplier selections for order ingredients
   * POST /api/orders/{orderId}/supplier-requests
   */
  async saveSupplierSelections(
    orderId: number | string,
    selections: Array<{
      ingredientId: string;
      selectedSupplierId: string;
      selectedProductId: number;
      quantity: number;
      unit: string;
      unitPrice: number;
      notes?: string;
    }>,
  ): Promise<any> {
    return apiClient<any>(`${BASE_URL}/${orderId}/supplier-requests`, {
      method: 'POST',
      body: JSON.stringify({ selections }),
    })
  },
}

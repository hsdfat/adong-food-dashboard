// services/supplier-price.service.ts

import { apiClient } from '@/utils/api_client'
import {
  SupplierPrice,
  CreateSupplierPriceInput,
  UpdateSupplierPriceInput,
  SupplierPriceListResponse,
} from '@/models/supplier-price'

const BASE_URL = '/api/supplier-prices'

export const supplierPriceApi = {
  /**
   * Get all supplier prices with pagination and search
   */
  async getAll(params?: {
    page?: number
    pageSize?: number
    search?: string
    sortBy?: string
    sortDir?: 'asc' | 'desc'
  }): Promise<SupplierPriceListResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize)
      queryParams.append('pageSize', params.pageSize.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir)

    const url = `${BASE_URL}?${queryParams.toString()}`
    return await apiClient<SupplierPriceListResponse>(url)
  },

  /**
   * Get supplier price by ID
   */
  async getById(id: number): Promise<SupplierPrice> {
    return await apiClient<SupplierPrice>(`${BASE_URL}/${id}`)
  },

  /**
   * Get supplier prices by ingredient ID
   */
  async getByIngredient(ingredientId: string): Promise<SupplierPrice[]> {
    return await apiClient<SupplierPrice[]>(
      `${BASE_URL}/ingredient/${ingredientId}`,
    )
  },

  /**
   * Get supplier prices by supplier ID
   */
  async getBySupplier(supplierId: string): Promise<SupplierPrice[]> {
    return await apiClient<SupplierPrice[]>(
      `${BASE_URL}/supplier/${supplierId}`,
    )
  },

  /**
   * Create new supplier price
   */
  async create(data: CreateSupplierPriceInput): Promise<SupplierPrice> {
    return await apiClient<SupplierPrice>(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update existing supplier price
   */
  async update(
    id: number,
    data: UpdateSupplierPriceInput,
  ): Promise<SupplierPrice> {
    return await apiClient<SupplierPrice>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete supplier price
   */
  async delete(id: number): Promise<void> {
    return await apiClient(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })
  },

  /**
   * Get active prices for an ingredient
   */
  async getActivePrices(ingredientId: string): Promise<SupplierPrice[]> {
    return await apiClient<SupplierPrice[]>(
      `${BASE_URL}/ingredient/${ingredientId}/active`,
    )
  },
}

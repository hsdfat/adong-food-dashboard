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
    page?: number;
    per_page?: number;
    search?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    effectiveFrom?: string;
    effectiveTo?: string;
  }): Promise<SupplierPriceListResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.per_page)
      queryParams.append('per_page', params.per_page.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir)
    if (params?.effectiveFrom)
      queryParams.append('effective_from', params.effectiveFrom)
    if (params?.effectiveTo)
      queryParams.append('effective_to', params.effectiveTo)

    const url = `${BASE_URL}?${queryParams.toString()}`
    return apiClient<SupplierPriceListResponse>(url)
  },

  /**
   * Get supplier price by ID
   */
  async getById(id: number): Promise<SupplierPrice> {
    return apiClient<SupplierPrice>(`${BASE_URL}/${id}`)
  },

  /**
   * Get supplier prices by ingredient ID
   */
  async getByIngredient(ingredientId: string): Promise<SupplierPrice[]> {
    return apiClient<SupplierPrice[]>(
      `${BASE_URL}/ingredient/${ingredientId}`,
    )
  },

  /**
   * Get supplier prices by supplier ID with pagination
   */
  async getBySupplier(
    supplierId: string,
    params?: {
      page?: number;
      per_page?: number;
      search?: string;
    },
  ): Promise<SupplierPriceListResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString())
    if (params?.search) queryParams.append('search', params.search)

    const url = queryParams.toString()
      ? `${BASE_URL}/supplier/${supplierId}?${queryParams.toString()}`
      : `${BASE_URL}/supplier/${supplierId}`

    return apiClient<SupplierPriceListResponse>(url)
  },

  /**
   * Create new supplier price
   */
  async create(data: CreateSupplierPriceInput): Promise<SupplierPrice> {
    return apiClient<SupplierPrice>(BASE_URL, {
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
    return apiClient<SupplierPrice>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete supplier price
   */
  async delete(id: number): Promise<void> {
    return apiClient(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })
  },

  /**
   * Get active prices for an ingredient
   */
  async getActivePrices(ingredientId: string): Promise<SupplierPrice[]> {
    return apiClient<SupplierPrice[]>(
      `${BASE_URL}/ingredient/${ingredientId}/active`,
    )
  },
}

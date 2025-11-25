// services/recipeStandardApi.ts
import { apiClient } from '@/utils/api_client'
import {
  RecipeStandard,
  CreateRecipeStandardInput,
  UpdateRecipeStandardInput,
} from '@/models/recipe_standard'
import { ResourceCollection } from '@/models/resource'

const BASE_URL = '/api/recipe-standards'

export const recipeStandardApi = {
  // Get all recipe standards with pagination and search
  getAll: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }): Promise<ResourceCollection<RecipeStandard>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.per_page)
      queryParams.append('per_page', params.per_page.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir)

    const url = queryParams.toString()
      ? `${BASE_URL}?${queryParams.toString()}`
      : BASE_URL

    return apiClient<ResourceCollection<RecipeStandard>>(url)
  },

  // Get recipe standard by ID
  getById: async (id: number): Promise<RecipeStandard> => {
    const response = await apiClient<RecipeStandard>(`${BASE_URL}/${id}`)
    return response
  },

  // Get recipe standards by dish ID
  getByDish: async (
    dishId: string,
  ): Promise<ResourceCollection<RecipeStandard>> => apiClient<ResourceCollection<RecipeStandard>>(
      `${BASE_URL}/dish/${dishId}`,
    ),

  // Create new recipe standard
  create: async (data: CreateRecipeStandardInput): Promise<RecipeStandard> => {
    const response = await apiClient<RecipeStandard>(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response
  },

  // Update recipe standard
  update: async (
    id: number,
    data: UpdateRecipeStandardInput,
  ): Promise<RecipeStandard> => {
    const response = await apiClient<RecipeStandard>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response
  },

  // Delete recipe standard
  delete: async (id: number): Promise<void> => {
    await apiClient(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })
  },
}

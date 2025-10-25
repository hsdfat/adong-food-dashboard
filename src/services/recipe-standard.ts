// services/recipeStandardApi.ts
import { apiClient } from '@/utils/api_client'
import { 
  RecipeStandard, 
  CreateRecipeStandardInput, 
  UpdateRecipeStandardInput,
  RecipeStandardsResponse 
} from '@/models/recipe_standard'

const BASE_URL = '/api/recipe-standards'

export const recipeStandardApi = {
  // Get all recipe standards with pagination and search
  getAll: async (params?: {
    page?: number
    pageSize?: number
    search?: string
    sortBy?: string
    sortDir?: 'asc' | 'desc'
  }): Promise<RecipeStandard[]> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir)

    const url = queryParams.toString() 
      ? `${BASE_URL}?${queryParams.toString()}`
      : BASE_URL

    const response = await apiClient<RecipeStandardsResponse>(url)
    return response.data
  },

  // Get recipe standard by ID
  getById: async (id: number): Promise<RecipeStandard> => {
    const response = await apiClient<RecipeStandard>(`${BASE_URL}/${id}`)
    return response
  },

  // Get recipe standards by dish ID
  getByDish: async (dishId: string): Promise<RecipeStandard[]> => {
    const response = await apiClient<RecipeStandard[]>(`${BASE_URL}/dish/${dishId}`)
    return response
  },

  // Create new recipe standard
  create: async (data: CreateRecipeStandardInput): Promise<RecipeStandard> => {
    const response = await apiClient<RecipeStandard>(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response
  },

  // Update recipe standard
  update: async (id: number, data: UpdateRecipeStandardInput): Promise<RecipeStandard> => {
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
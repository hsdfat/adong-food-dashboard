import { apiClient } from '@/utils/api_client'
import { Ingredient, CreateIngredientInput, UpdateIngredientInput } from '@/models/ingredient'

export const ingredientApi = {
  getAll: async (): Promise<Ingredient[]> => {
    return apiClient<Ingredient[]>('/api/ingredients')
  },

  getById: async (id: string): Promise<Ingredient> => {
    return apiClient<Ingredient>(`/api/ingredients/${id}`)
  },

  create: async (data: CreateIngredientInput): Promise<Ingredient> => {
    return apiClient<Ingredient>('/api/ingredients', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: UpdateIngredientInput): Promise<Ingredient> => {
    return apiClient<Ingredient>(`/api/ingredients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiClient<{ message: string }>(`/api/ingredients/${id}`, {
      method: 'DELETE',
    })
  },
}
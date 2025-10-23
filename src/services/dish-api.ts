import { apiClient } from '@/utils/api_client'
import { Dish, CreateDishInput, UpdateDishInput } from '@/models/dish'
import { ResourceCollection } from '@/models/resource'

export const dishApi = {
  getAll: async (queryString: string = ''): Promise<ResourceCollection<Dish>> => {
    return apiClient<ResourceCollection<Dish>>(`/api/dishes${queryString}`)
  },

  getById: async (id: string): Promise<Dish> => {
    return apiClient<Dish>(`/api/dishes/${id}`)
  },

  create: async (data: CreateDishInput): Promise<Dish> => {
    return apiClient<Dish>('/api/dishes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: UpdateDishInput): Promise<Dish> => {
    return apiClient<Dish>(`/api/dishes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiClient<{ message: string }>(`/api/dishes/${id}`, {
      method: 'DELETE',
    })
  },
}
// File: src/lib/api/menu-card.ts

import { apiClient } from '@/utils/api_client'
import type { MenuCard, MenuCardCreateRequest } from '@/models/menu_card'

export const menuCardApi = {
  getAll: async (): Promise<MenuCard[]> => {
    return apiClient<MenuCard[]>('/api/menu-cards')
  },

  getById: async (id: string): Promise<MenuCard> => {
    return apiClient<MenuCard>(`/api/menu-cards/${id}`)
  },

  create: async (data: MenuCardCreateRequest): Promise<MenuCard> => {
    return apiClient<MenuCard>('/api/menu-cards', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  //   update: async (id: string, data: UpdateMenuCardInput): Promise<MenuCard> => {
  //     return apiClient<MenuCard>(`/api/menu-cardss/${id}`, {
  //       method: 'PUT',
  //       body: JSON.stringify(data),
  //     })
  //   },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiClient<{ message: string }>(`/api/menu-cards/${id}`, {
      method: 'DELETE',
    })
  },

  approve: async (id: string): Promise<{ message: string }> => {
    return apiClient<{ message: string }>(`/api/menu-cards/${id}/approve`, {
      method: 'DELETE',
    })
  },
}

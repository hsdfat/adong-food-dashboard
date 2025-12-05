// services/notification-api.ts
import { apiClient } from '@/utils/api_client'
import {
  Notification,
  CreateNotificationInput,
  NotificationCountResponse,
} from '@/models/notification'
import { ResourceCollection } from '@/models/resource'

const BASE_URL = '/api/notifications'

export interface GetNotificationsParams {
  page?: number
  per_page?: number
  search?: string
  sortBy?: string
  sortDir?: string
  is_read?: boolean
  notification_type?: string
  priority?: string
}

export const notificationApi = {
  /**
   * Get all notifications for current user with pagination and filters
   */
  async getAll(
    params?: GetNotificationsParams,
  ): Promise<ResourceCollection<Notification>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.per_page)
      queryParams.append('per_page', params.per_page.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir)
    if (params?.is_read !== undefined)
      queryParams.append('is_read', params.is_read.toString())
    if (params?.notification_type)
      queryParams.append('notification_type', params.notification_type)
    if (params?.priority) queryParams.append('priority', params.priority)

    const url = queryParams.toString()
      ? `${BASE_URL}?${queryParams.toString()}`
      : BASE_URL
    return apiClient<ResourceCollection<Notification>>(url)
  },

  /**
   * Get notification count (unread and total)
   */
  async getCount(): Promise<NotificationCountResponse> {
    return apiClient<NotificationCountResponse>(`${BASE_URL}/count`)
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<Notification> {
    return apiClient<Notification>(`${BASE_URL}/${id}/read`, {
      method: 'PATCH',
    })
  },

  /**
   * Create a new notification (admin or internal use)
   */
  async create(data: CreateNotificationInput): Promise<Notification> {
    return apiClient<Notification>(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

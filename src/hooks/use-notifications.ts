'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { notificationApi } from '@/services/notification-api'
import { Notification, NotificationCountResponse } from '@/models/notification'

export interface UseNotificationsOptions {
  pollingInterval?: number // in milliseconds, default 30000 (30s)
  enabled?: boolean // whether polling is enabled, default true
  maxNotifications?: number // max notifications to fetch, default 10
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const {
    pollingInterval = 30000,
    enabled = true,
    maxNotifications = 10,
  } = options

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [count, setCount] = useState<NotificationCountResponse>({
    unreadCount: 0,
    totalCount: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchCount = useCallback(async () => {
    try {
      const countData = await notificationApi.getCount()
      setCount(countData)
      return countData
    } catch (err) {
      console.error('Failed to fetch notification count:', err)
      setError('Failed to fetch notification count')
      return null
    }
  }, [])

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await notificationApi.getAll({
        page: 1,
        per_page: maxNotifications,
        is_read: false,
        sortBy: 'created_date',
        sortDir: 'desc',
      })

      setNotifications(data.data)
      return data.data
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
      setError('Failed to fetch notifications')
      return []
    } finally {
      setLoading(false)
    }
  }, [maxNotifications])

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await notificationApi.markAsRead(notificationId)

        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.notificationId === notificationId ? { ...n, isRead: true } : n,
          ),
        )

        // Update count
        setCount((prev) => ({
          unreadCount: Math.max(0, prev.unreadCount - 1),
          totalCount: prev.totalCount,
        }))

        return true
      } catch (err) {
        console.error('Failed to mark notification as read:', err)
        return false
      }
    },
    [],
  )

  const refresh = useCallback(async () => {
    await Promise.all([fetchCount(), fetchNotifications()])
  }, [fetchCount, fetchNotifications])

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      refresh()
    }
  }, [enabled, refresh])

  // Setup polling
  useEffect(() => {
    if (!enabled || pollingInterval <= 0) {
      return
    }

    intervalRef.current = setInterval(() => {
      fetchCount()
    }, pollingInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [enabled, pollingInterval, fetchCount])

  return {
    notifications,
    count,
    loading,
    error,
    markAsRead,
    refresh,
    fetchCount,
    fetchNotifications,
  }
}

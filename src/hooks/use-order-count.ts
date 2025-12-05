'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { orderApi } from '@/services/order-api'
import { OrderCountResponse } from '@/models/order'

export interface UseOrderCountOptions {
  pollingInterval?: number // in milliseconds, default 60000 (60s)
  enabled?: boolean // whether polling is enabled, default true
  kitchenId?: string // optional kitchen filter
}

export function useOrderCount(options: UseOrderCountOptions = {}) {
  const {
    pollingInterval = 60000,
    enabled = true,
    kitchenId,
  } = options

  const [orderCount, setOrderCount] = useState<OrderCountResponse>({
    totalCount: 0,
    statusCounts: [],
    pendingCount: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchCount = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = kitchenId ? { kitchen_id: kitchenId } : undefined
      const data = await orderApi.getCount(params)
      setOrderCount(data)
      return data
    } catch (err) {
      console.error('Failed to fetch order count:', err)
      setError('Failed to fetch order count')
      return null
    } finally {
      setLoading(false)
    }
  }, [kitchenId])

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchCount()
    }
  }, [enabled, fetchCount])

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
    orderCount,
    loading,
    error,
    refresh: fetchCount,
  }
}

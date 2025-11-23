'use client'

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Alert,
  Spinner,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { orderApi } from '@/services'
import { OrderDTO } from '@/models/order'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import Pagination from '@/components/Pagination/Pagination'
import OrderFilters from './components/OrderFilters'
import OrderTable from './components/OrderTable'

// ==================== TYPE DEFINITIONS ====================

interface FilterState {
  searchQuery: string
  dateFrom: string
  dateTo: string
  showFilters: boolean
}

interface StatusState {
  original: Record<string, string>
  edited: Record<string, string>
  saving: Record<string, boolean>
}

// ==================== CONSTANTS ====================

const DEFAULT_PER_PAGE = 10
const COMMON_STATUSES = [
  'Pending',
  'Approved',
  'Completed',
  'Cancelled',
  'Rejected',
]

const STATUS_COLORS = {
  pending: { bg: '#ffc107', text: '#000000', border: '#ffc107' },
  approved: { bg: '#198754', text: '#ffffff', border: '#198754' },
  completed: { bg: '#198754', text: '#ffffff', border: '#198754' },
  cancelled: { bg: '#dc3545', text: '#ffffff', border: '#dc3545' },
  rejected: { bg: '#dc3545', text: '#ffffff', border: '#dc3545' },
  default: { bg: '#6c757d', text: '#ffffff', border: '#6c757d' },
}

// ==================== UTILITY FUNCTIONS ====================

function getDefaultDateRange() {
  const today = new Date()
  const weekAgo = new Date()
  weekAgo.setDate(today.getDate() - 7)

  return {
    from: weekAgo.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0],
  }
}

function getStatusColors(status: string) {
  const statusLower = status.toLowerCase()
  return (
    STATUS_COLORS[statusLower as keyof typeof STATUS_COLORS] ||
    STATUS_COLORS.default
  )
}

// ==================== MAIN COMPONENT ====================

function OrdersList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dict = useDictionary()

  // ==================== STATE MANAGEMENT ====================

  // Data State
  const [ordersData, setOrdersData] =
    useState<ResourceCollection<OrderDTO> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    dateFrom: '',
    dateTo: '',
    showFilters: true,
  })

  // Status Management State
  const [statusState, setStatusState] = useState<StatusState>({
    original: {},
    edited: {},
    saving: {},
  })

  // Refs for preventing duplicate calls
  const isInitialized = useRef(false)
  const isLoadingRef = useRef(false)

  // ==================== URL PARAMS ====================

  const urlParams = useMemo(
    () => ({
      page: parseInt(searchParams.get('page') || '1'),
      perPage: parseInt(
        searchParams.get('per_page') || String(DEFAULT_PER_PAGE),
      ),
      search: searchParams.get('search') || '',
      fromDate: searchParams.get('from_date') || '',
      toDate: searchParams.get('to_date') || '',
    }),
    [searchParams],
  )

  // ==================== DATA LOADING ====================

  const loadOrders = useCallback(async () => {
    // Prevent duplicate API calls
    if (isLoadingRef.current) {
      console.log('[OrdersList] Already loading, skipping duplicate call')
      return
    }

    try {
      isLoadingRef.current = true
      setLoading(true)
      setError('')

      const data = await orderApi.getAll({
        page: urlParams.page,
        per_page: urlParams.perPage,
        search: urlParams.search || undefined,
        from_date: urlParams.fromDate || undefined,
        to_date: urlParams.toDate || undefined,
      })

      setOrdersData(data)

      // Initialize status tracking
      if (data.data) {
        const originalStatuses: Record<string, string> = {}
        data.data.forEach((order) => {
          originalStatuses[order.orderId] = order.status
        })

        setStatusState((prev) => ({
          ...prev,
          original: originalStatuses,
          // Keep only edited statuses for orders still in current page
          edited: Object.fromEntries(
            Object.entries(prev.edited).filter(([orderId]) =>
              data.data.some((o) => String(o.orderId) === orderId),
            ),
          ),
        }))
      }
    } catch (err: any) {
      console.error('[OrdersList] Load error:', err)
      setError(err?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
  }, [
    urlParams.page,
    urlParams.perPage,
    urlParams.search,
    urlParams.fromDate,
    urlParams.toDate,
  ])

  // ==================== INITIALIZATION ====================

  useEffect(() => {
    // Initialize default date range only once on mount
    if (!isInitialized.current) {
      isInitialized.current = true

      // Set default dates if not in URL
      if (!urlParams.fromDate && !urlParams.toDate) {
        const defaults = getDefaultDateRange()
        const newParams = new URLSearchParams(searchParams)
        newParams.set('from_date', defaults.from)
        newParams.set('to_date', defaults.to)
        router.replace(`/orders?${newParams.toString()}`, { scroll: false })
        return // Don't load orders yet, wait for URL update
      }
    }

    // Load orders when URL params change
    loadOrders()
  }, [
    urlParams.page,
    urlParams.perPage,
    urlParams.search,
    urlParams.fromDate,
    urlParams.toDate,
  ])

  // Sync filters with URL params
  useEffect(() => {
    const defaults = getDefaultDateRange()
    setFilters({
      searchQuery: urlParams.search,
      dateFrom: urlParams.fromDate || defaults.from,
      dateTo: urlParams.toDate || defaults.to,
      showFilters: true,
    })
  }, [urlParams.search, urlParams.fromDate, urlParams.toDate])

  // ==================== FILTER HANDLERS ====================

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      const newParams = new URLSearchParams(searchParams)
      newParams.set('page', '1') // Reset to first page

      if (filters.searchQuery.trim()) {
        newParams.set('search', filters.searchQuery.trim())
      } else {
        newParams.delete('search')
      }

      if (filters.dateFrom) {
        newParams.set('from_date', filters.dateFrom)
      } else {
        newParams.delete('from_date')
      }

      if (filters.dateTo) {
        newParams.set('to_date', filters.dateTo)
      } else {
        newParams.delete('to_date')
      }

      router.push(`/orders?${newParams.toString()}`)
    },
    [filters, searchParams, router],
  )

  const handleClearFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: '',
      dateFrom: '',
      dateTo: '',
    }))

    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', '1')
    newParams.delete('search')
    newParams.delete('from_date')
    newParams.delete('to_date')
    router.push(`/orders?${newParams.toString()}`)
  }, [searchParams, router])

  const toggleFilters = useCallback(() => {
    setFilters((prev) => ({ ...prev, showFilters: !prev.showFilters }))
  }, [])

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  // ==================== STATUS HANDLERS ====================

  const handleStatusChange = useCallback(
    (orderId: string, newStatus: string) => {
      setStatusState((prev) => {
        const originalStatus = prev.original[orderId]

        if (newStatus === originalStatus) {
          // Revert to original - remove from edited
          const { [orderId]: _, ...remainingEdited } = prev.edited
          return { ...prev, edited: remainingEdited }
        } else {
          // Status changed - add to edited
          return {
            ...prev,
            edited: { ...prev.edited, [orderId]: newStatus },
          }
        }
      })
    },
    [],
  )

  const handleSaveStatus = useCallback(
    async (orderId: string) => {
      const newStatus = statusState.edited[orderId]
      if (!newStatus) return

      try {
        setStatusState((prev) => ({
          ...prev,
          saving: { ...prev.saving, [orderId]: true },
        }))
        setError('')

        await orderApi.updateStatus(parseInt(orderId), newStatus)

        // Update original status and remove from edited
        setStatusState((prev) => {
          const { [orderId]: _, ...remainingEdited } = prev.edited
          const { [orderId]: __, ...remainingSaving } = prev.saving
          return {
            original: { ...prev.original, [orderId]: newStatus },
            edited: remainingEdited,
            saving: remainingSaving,
          }
        })

        // Reload to get fresh data
        await loadOrders()
      } catch (err: any) {
        console.error('[OrdersList] Status update error:', err)
        setError(err?.message || 'Failed to update order status')
        setStatusState((prev) => ({
          ...prev,
          saving: { ...prev.saving, [orderId]: false },
        }))
      }
    },
    [statusState.edited, loadOrders],
  )

  const handleDiscardStatus = useCallback((orderId: string) => {
    setStatusState((prev) => {
      const { [orderId]: _, ...remainingEdited } = prev.edited
      return { ...prev, edited: remainingEdited }
    })
  }, [])

  // ==================== DELETE HANDLER ====================

  const handleDelete = useCallback(
    async (orderId: string) => {
      if (!confirm(dict.orders?.confirm_delete || 'Are you sure you want to delete this order?')) {
        return
      }

      try {
        await orderApi.delete(parseInt(orderId))
        await loadOrders()
      } catch (err: any) {
        console.error('[OrdersList] Delete error:', err)
        setError(err?.message || 'Failed to delete order')
      }
    },
    [loadOrders],
  )

  // ==================== COMPUTED VALUES ====================

  const allStatuses = useMemo(() => {
    const statusSet = new Set<string>(COMMON_STATUSES)

    // Add any statuses from loaded orders
    ordersData?.data?.forEach((order) => {
      if (order.status) {
        statusSet.add(order.status)
      }
    })

    return Array.from(statusSet).sort()
  }, [ordersData?.data])

  const hasActiveFilters = useMemo(
    () => Boolean(urlParams.search || urlParams.fromDate || urlParams.toDate),
    [urlParams.search, urlParams.fromDate, urlParams.toDate],
  )

  // ==================== HELPER FUNCTIONS ====================

  const getCurrentStatus = useCallback(
    (orderId: string): string => {
      return (
        statusState.edited[orderId] ||
        statusState.original[orderId] ||
        'Pending'
      )
    },
    [statusState.edited, statusState.original],
  )

  const isStatusChanged = useCallback(
    (orderId: string): boolean => {
      return orderId in statusState.edited
    },
    [statusState.edited],
  )

  const isSavingStatus = useCallback(
    (orderId: string): boolean => {
      return Boolean(statusState.saving[orderId])
    },
    [statusState.saving],
  )

  // ==================== RENDER HELPERS ====================

  // ==================== RENDER ====================

  if (loading && !ordersData) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-5">
            <Spinner animation="border" className="me-2" />
            <span>{dict.orders?.loading || 'Loading orders...'}</span>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4>{dict.orders?.title || 'Order Management'}</h4>
            <div className="text-muted">{dict.orders?.subtitle || 'List of orders'}</div>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push('/orders/create')}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            {dict.orders?.create || 'Create Order'}
          </Button>
        </div>
      </CardHeader>

      <CardBody>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Search and Filters */}
        <OrderFilters
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          onFilterChange={updateFilter}
          onSearch={handleSearch}
          onClearFilters={handleClearFilters}
          onToggleFilters={toggleFilters}
        />

        {/* Orders Table */}
        {ordersData?.data && ordersData.data.length > 0 ? (
          <>
            <OrderTable
              orders={ordersData.data}
              allStatuses={allStatuses}
              hasActiveFilters={hasActiveFilters}
              getCurrentStatus={getCurrentStatus}
              isStatusChanged={isStatusChanged}
              isSavingStatus={isSavingStatus}
              getStatusColors={getStatusColors}
              onStatusChange={handleStatusChange}
              onSaveStatus={handleSaveStatus}
              onDiscardStatus={handleDiscardStatus}
              onView={(orderId) => router.push(`/orders/${orderId}`)}
              onViewIngredients={(orderId) =>
                router.push(`/orders/${orderId}/ingredients/summary`)
              }
              onViewSupplierRequests={(orderId) =>
                router.push(`/orders/${orderId}/supplier-requests`)
              }
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {ordersData.meta && <Pagination meta={ordersData.meta} />}
          </>
        ) : (
          <OrderTable
            orders={[]}
            allStatuses={allStatuses}
            hasActiveFilters={hasActiveFilters}
            getCurrentStatus={getCurrentStatus}
            isStatusChanged={isStatusChanged}
            isSavingStatus={isSavingStatus}
            getStatusColors={getStatusColors}
            onStatusChange={handleStatusChange}
            onSaveStatus={handleSaveStatus}
            onDiscardStatus={handleDiscardStatus}
            onView={(orderId) => router.push(`/orders/${orderId}`)}
            onViewIngredients={(orderId) =>
              router.push(`/orders/${orderId}/ingredients/summary`)
            }
            onViewSupplierRequests={(orderId) =>
              router.push(`/orders/${orderId}/supplier-requests`)
            }
            onDelete={handleDelete}
          />
        )}
      </CardBody>
    </Card>
  )
}

// ==================== EXPORT ====================

export default React.memo(OrdersList)

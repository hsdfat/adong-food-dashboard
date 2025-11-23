'use client'

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert,
  FormControl,
  InputGroup,
  FormSelect,
  Row,
  Col,
  Form,
  Spinner,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faEllipsisVertical,
  faSearch,
  faEye,
  faTrash,
  faSave,
  faXmark,
  faFilter,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { orderApi } from '@/services'
import { OrderDTO } from '@/models/order'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import Pagination from '@/components/Pagination/Pagination'

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
const COMMON_STATUSES = ['Pending', 'Approved', 'Completed', 'Cancelled', 'Rejected']

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
  return STATUS_COLORS[statusLower as keyof typeof STATUS_COLORS] || STATUS_COLORS.default
}

// ==================== MAIN COMPONENT ====================

function OrdersList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dict = useDictionary()

  // ==================== STATE MANAGEMENT ====================

  // Data State
  const [ordersData, setOrdersData] = useState<ResourceCollection<OrderDTO> | null>(null)
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

  const urlParams = useMemo(() => ({
    page: parseInt(searchParams.get('page') || '1'),
    perPage: parseInt(searchParams.get('per_page') || String(DEFAULT_PER_PAGE)),
    search: searchParams.get('search') || '',
    fromDate: searchParams.get('from_date') || '',
    toDate: searchParams.get('to_date') || '',
  }), [searchParams])

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

        setStatusState(prev => ({
          ...prev,
          original: originalStatuses,
          // Keep only edited statuses for orders still in current page
          edited: Object.fromEntries(
            Object.entries(prev.edited).filter(([orderId]) =>
              data.data.some(o => String(o.orderId) === orderId)
            )
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
  }, [urlParams.page, urlParams.perPage, urlParams.search, urlParams.fromDate, urlParams.toDate])

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
  }, [urlParams.page, urlParams.perPage, urlParams.search, urlParams.fromDate, urlParams.toDate])

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

  const handleSearch = useCallback((e: React.FormEvent) => {
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
  }, [filters, searchParams, router])

  const handleClearFilters = useCallback(() => {
    setFilters(prev => ({
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
    setFilters(prev => ({ ...prev, showFilters: !prev.showFilters }))
  }, [])

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  // ==================== STATUS HANDLERS ====================

  const handleStatusChange = useCallback((orderId: string, newStatus: string) => {
    setStatusState(prev => {
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
  }, [])

  const handleSaveStatus = useCallback(async (orderId: string) => {
    const newStatus = statusState.edited[orderId]
    if (!newStatus) return

    try {
      setStatusState(prev => ({
        ...prev,
        saving: { ...prev.saving, [orderId]: true },
      }))
      setError('')

      await orderApi.updateStatus(parseInt(orderId), newStatus)

      // Update original status and remove from edited
      setStatusState(prev => {
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
      setStatusState(prev => ({
        ...prev,
        saving: { ...prev.saving, [orderId]: false },
      }))
    }
  }, [statusState.edited, loadOrders])

  const handleDiscardStatus = useCallback((orderId: string) => {
    setStatusState(prev => {
      const { [orderId]: _, ...remainingEdited } = prev.edited
      return { ...prev, edited: remainingEdited }
    })
  }, [])

  // ==================== DELETE HANDLER ====================

  const handleDelete = useCallback(async (orderId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      return
    }

    try {
      await orderApi.delete(parseInt(orderId))
      await loadOrders()
    } catch (err: any) {
      console.error('[OrdersList] Delete error:', err)
      setError(err?.message || 'Failed to delete order')
    }
  }, [loadOrders])

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
    [urlParams.search, urlParams.fromDate, urlParams.toDate]
  )

  // ==================== HELPER FUNCTIONS ====================

  const getCurrentStatus = useCallback(
    (orderId: string): string => {
      return statusState.edited[orderId] || statusState.original[orderId] || 'Pending'
    },
    [statusState.edited, statusState.original]
  )

  const isStatusChanged = useCallback(
    (orderId: string): boolean => {
      return orderId in statusState.edited
    },
    [statusState.edited]
  )

  const isSavingStatus = useCallback(
    (orderId: string): boolean => {
      return Boolean(statusState.saving[orderId])
    },
    [statusState.saving]
  )

  // ==================== RENDER HELPERS ====================

  const renderStatusSelect = useCallback(
    (order: OrderDTO) => {
      const orderId = String(order.orderId)
      const currentStatus = getCurrentStatus(orderId)
      const colors = getStatusColors(currentStatus)
      const isChanged = isStatusChanged(orderId)
      const isSaving = isSavingStatus(orderId)

      return (
        <div className="d-flex align-items-center gap-2">
          <FormSelect
            size="sm"
            value={currentStatus}
            onChange={(e) => handleStatusChange(orderId, e.target.value)}
            disabled={isSaving}
            style={{
              minWidth: '120px',
              backgroundColor: colors.bg,
              color: colors.text,
              borderColor: colors.border,
            }}
          >
            {allStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </FormSelect>

          {isChanged && (
            <div className="d-flex gap-1">
              <Button
                variant="success"
                size="sm"
                onClick={() => handleSaveStatus(orderId)}
                disabled={isSaving}
                title="Lưu"
              >
                {isSaving ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <FontAwesomeIcon icon={faSave} />
                )}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDiscardStatus(orderId)}
                disabled={isSaving}
                title="Hủy"
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>
            </div>
          )}
        </div>
      )
    },
    [
      allStatuses,
      getCurrentStatus,
      isStatusChanged,
      isSavingStatus,
      handleStatusChange,
      handleSaveStatus,
      handleDiscardStatus,
    ]
  )

  const renderActions = useCallback(
    (order: OrderDTO) => {
      const orderId = String(order.orderId)

      return (
        <Dropdown>
          <DropdownToggle variant="link" className="text-decoration-none" title="Actions">
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => router.push(`/orders/${orderId}`)}>
              <FontAwesomeIcon icon={faEye} className="me-2" />
              Xem chi tiết
            </DropdownItem>
            <DropdownItem onClick={() => router.push(`/orders/${orderId}/ingredients/summary`)}>
              <FontAwesomeIcon icon={faEye} className="me-2" />
              Tổng hợp nguyên liệu
            </DropdownItem>
            <DropdownItem onClick={() => router.push(`/orders/${orderId}/supplier-requests`)}>
              <FontAwesomeIcon icon={faEye} className="me-2" />
              Yêu cầu nhà cung cấp
            </DropdownItem>
            <DropdownItem disabled className="dropdown-divider" />
            <DropdownItem onClick={() => handleDelete(orderId)} className="text-danger">
              <FontAwesomeIcon icon={faTrash} className="me-2" />
              Xóa
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )
    },
    [router, handleDelete]
  )

  // ==================== RENDER ====================

  if (loading && !ordersData) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-5">
            <Spinner animation="border" className="me-2" />
            <span>Đang tải đơn hàng...</span>
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
            <h4>Quản lý đơn hàng</h4>
            <div className="text-muted">Danh sách phiếu lên đơn</div>
          </div>
          <Button variant="primary" onClick={() => router.push('/orders/create')}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Tạo đơn hàng
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
        <Form onSubmit={handleSearch} className="mb-4">
          <Row className="g-2 mb-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small mb-1">Tìm kiếm</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faSearch} />
                  </InputGroup.Text>
                  <FormControl
                    type="text"
                    placeholder="Tìm theo mã đơn, bếp, người tạo..."
                    value={filters.searchQuery}
                    onChange={(e) => updateFilter('searchQuery', e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end gap-2">
              <Button variant="outline-secondary" onClick={toggleFilters} className="mb-0">
                <FontAwesomeIcon icon={faFilter} className="me-2" />
                {filters.showFilters ? 'Ẩn' : 'Hiện'} bộ lọc
              </Button>
              {hasActiveFilters && (
                <Button variant="outline-secondary" onClick={handleClearFilters} className="mb-0">
                  Xóa bộ lọc
                </Button>
              )}
              <Button variant="primary" type="submit" className="mb-0">
                <FontAwesomeIcon icon={faSearch} className="me-2" />
                Tìm kiếm
              </Button>
            </Col>
          </Row>

          {/* Date Range Filters */}
          {filters.showFilters && (
            <Row className="g-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small mb-1">
                    <FontAwesomeIcon icon={faCalendar} className="me-1" />
                    Từ ngày
                  </Form.Label>
                  <FormControl
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => updateFilter('dateFrom', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small mb-1">
                    <FontAwesomeIcon icon={faCalendar} className="me-1" />
                    Đến ngày
                  </Form.Label>
                  <FormControl
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => updateFilter('dateTo', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
        </Form>

        {/* Orders Table */}
        {ordersData?.data && ordersData.data.length > 0 ? (
          <>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-light">
                  <tr>
                    <th className="table-priority-column">Mã đơn hàng</th>
                    <th className="table-priority-column">Bếp</th>
                    <th className="table-non-priority-column">Ngày lên đơn</th>
                    <th className="table-non-priority-column">Trạng thái</th>
                    <th className="table-non-priority-column">Người tạo</th>
                    <th className="table-non-priority-column">Chi tiết</th>
                    <th className="text-center table-non-priority-column">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersData.data.map((order) => (
                    <tr key={order.orderId}>
                      <td className="table-priority-column">
                        <strong>#{order.orderId}</strong>
                      </td>
                      <td className="table-priority-column">
                        <div>
                          <div>{order.kitchenName}</div>
                          <small className="text-muted">{order.kitchenId}</small>
                        </div>
                      </td>
                      <td className="table-non-priority-column">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                      <td className="table-non-priority-column">{renderStatusSelect(order)}</td>
                      <td className="table-non-priority-column">
                        <div>
                          <div>{order.createdByName}</div>
                          <small className="text-muted">{order.createdByUserId}</small>
                        </div>
                      </td>
                      <td className="table-non-priority-column">
                        <div>
                          {order.details?.length || 0} món ăn
                          {order.supplementaries && order.supplementaries.length > 0 && (
                            <div className="text-muted small">
                              + {order.supplementaries.length} thực phẩm bổ sung
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="text-center table-non-priority-column">{renderActions(order)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            {ordersData.meta && <Pagination meta={ordersData.meta} />}
          </>
        ) : (
          <Alert variant="info" className="mb-0">
            {hasActiveFilters
              ? 'Không tìm thấy đơn hàng nào phù hợp với bộ lọc.'
              : 'Chưa có đơn hàng nào.'}
          </Alert>
        )}
      </CardBody>
    </Card>
  )
}

// ==================== EXPORT ====================

export default React.memo(OrdersList)
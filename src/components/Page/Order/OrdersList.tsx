'use client'

import React, { useEffect, useState, useRef } from 'react'
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
  Badge,
  FormControl,
  InputGroup,
  FormSelect,
  Row,
  Col,
  Form,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faEllipsisVertical,
  faSearch,
  faEye,
  faEdit,
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

export default function OrdersList() {
  const [ordersData, setOrdersData] =
    useState<ResourceCollection<OrderDTO> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [showFilters, setShowFilters] = useState(true)
  const [originalStatuses, setOriginalStatuses] = useState<Record<number, string>>({})
  const [editedStatuses, setEditedStatuses] = useState<Record<number, string>>({})
  const [savingStatuses, setSavingStatuses] = useState<Record<number, boolean>>({})
  const hasInitializedDefaults = useRef(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const dict = useDictionary()

  // Get query params
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('per_page') || '10')
  const search = searchParams.get('search') || ''
  const fromDate = searchParams.get('from_date') || ''
  const toDate = searchParams.get('to_date') || ''

  // Calculate default dates (latest week: 7 days ago to today)
  const getDefaultDateRange = () => {
    const today = new Date()
    const weekAgo = new Date()
    weekAgo.setDate(today.getDate() - 7)

    return {
      from: weekAgo.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0],
    }
  }

  // Initialize default dates if not in URL (only once on mount)
  useEffect(() => {
    if (hasInitializedDefaults.current) return

    const urlFromDate = searchParams.get('from_date')
    const urlToDate = searchParams.get('to_date')

    if (!urlFromDate && !urlToDate) {
      hasInitializedDefaults.current = true
      const defaults = getDefaultDateRange()
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.set('from_date', defaults.from)
      newSearchParams.set('to_date', defaults.to)
      router.replace(`/orders?${newSearchParams.toString()}`, { scroll: false })
    } else {
      hasInitializedDefaults.current = true
    }
  }, [searchParams, router])

  useEffect(() => {
    setSearchQuery(search)
    const defaults = getDefaultDateRange()
    setDateFrom(fromDate || defaults.from)
    setDateTo(toDate || defaults.to)
    loadOrders()
  }, [page, perPage, search, fromDate, toDate])

  const loadOrders = async (preserveEditedStatuses = false) => {
    try {
      setLoading(true)
      setError('')

      const data = await orderApi.getAll({
        page,
        per_page: perPage,
        search: search || undefined,
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
      })
      setOrdersData(data)

      // Initialize original statuses
      if (data.data) {
        const statusMap: Record<number, string> = {}
        data.data.forEach((order) => {
          statusMap[order.orderId] = order.status
        })
        setOriginalStatuses(statusMap)

        // Only clear edited statuses if not preserving them
        if (!preserveEditedStatuses) {
          setEditedStatuses({})
        } else {
          // Remove edited statuses for orders that are no longer in the current page
          const currentOrderIds = new Set(data.data.map((o) => o.orderId))
          const newEditedStatuses: Record<number, string> = {}
          Object.keys(editedStatuses).forEach((orderIdStr) => {
            const orderId = parseInt(orderIdStr)
            if (currentOrderIds.has(orderId)) {
              newEditedStatuses[orderId] = editedStatuses[orderId]
            }
          })
          setEditedStatuses(newEditedStatuses)
        }
      }
    } catch (err) {
      setError(dict.orders?.error_load || 'Failed to load orders')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        dict.orders?.confirm_delete ||
        'Are you sure you want to delete this order?',
      )
    ) {
      return
    }

    try {
      await orderApi.delete(id)
      loadOrders()
    } catch (err) {
      setError(dict.orders?.error_delete || 'Failed to delete order')
      console.error(err)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', '1') // Reset to first page

    if (searchQuery.trim()) {
      newSearchParams.set('search', searchQuery.trim())
    } else {
      newSearchParams.delete('search')
    }

    if (dateFrom) {
      newSearchParams.set('from_date', dateFrom)
    } else {
      newSearchParams.delete('from_date')
    }

    if (dateTo) {
      newSearchParams.set('to_date', dateTo)
    } else {
      newSearchParams.delete('to_date')
    }

    router.push(`/orders?${newSearchParams.toString()}`)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setDateFrom('')
    setDateTo('')
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', '1')
    newSearchParams.delete('search')
    newSearchParams.delete('from_date')
    newSearchParams.delete('to_date')
    router.push(`/orders?${newSearchParams.toString()}`)
  }

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'pending') {
      return <Badge bg="warning">Pending</Badge>
    } else if (statusLower === 'approved' || statusLower === 'completed') {
      return <Badge bg="success">{status}</Badge>
    } else if (statusLower === 'cancelled' || statusLower === 'rejected') {
      return <Badge bg="danger">{status}</Badge>
    }
    return <Badge bg="secondary">{status}</Badge>
  }

  const getStatusBadgeColor = (status: string): string => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'pending') {
      return 'warning'
    } else if (statusLower === 'approved' || statusLower === 'completed') {
      return 'success'
    } else if (statusLower === 'cancelled' || statusLower === 'rejected') {
      return 'danger'
    }
    return 'secondary'
  }

  const getStatusBackgroundColor = (status: string): string => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'pending') {
      return '#ffc107' // Bootstrap warning color
    } else if (statusLower === 'approved' || statusLower === 'completed') {
      return '#198754' // Bootstrap success color
    } else if (statusLower === 'cancelled' || statusLower === 'rejected') {
      return '#dc3545' // Bootstrap danger color
    }
    return '#6c757d' // Bootstrap secondary color
  }

  const getStatusTextColor = (status: string): string => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'pending') {
      return '#000000' // Black text for warning background
    }
    return '#ffffff' // White text for other backgrounds
  }

  const getStatusBorderColor = (status: string): string => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'pending') {
      return '#ffc107'
    } else if (statusLower === 'approved' || statusLower === 'completed') {
      return '#198754'
    } else if (statusLower === 'cancelled' || statusLower === 'rejected') {
      return '#dc3545'
    }
    return '#6c757d'
  }

  const handleStatusChange = (orderId: number, newStatus: string) => {
    const originalStatus = originalStatuses[orderId] || ''
    if (newStatus === originalStatus) {
      // Revert to original - remove from edited statuses
      const newEditedStatuses = { ...editedStatuses }
      delete newEditedStatuses[orderId]
      setEditedStatuses(newEditedStatuses)
    } else {
      // Status changed - add to edited statuses
      setEditedStatuses({
        ...editedStatuses,
        [orderId]: newStatus,
      })
    }
  }

  const handleSaveStatus = async (orderId: number) => {
    const newStatus = editedStatuses[orderId]
    if (!newStatus) return

    try {
      setSavingStatuses({ ...savingStatuses, [orderId]: true })
      setError('')

      await orderApi.updateStatus(orderId, newStatus)

      // Update original status and remove from edited
      setOriginalStatuses({
        ...originalStatuses,
        [orderId]: newStatus,
      })
      const newEditedStatuses = { ...editedStatuses }
      delete newEditedStatuses[orderId]
      setEditedStatuses(newEditedStatuses)

      // Reload orders to get updated data, but preserve other edited statuses
      await loadOrders(true)
    } catch (err) {
      setError(dict.orders?.error_update || 'Failed to update order status')
      console.error(err)
    } finally {
      setSavingStatuses({ ...savingStatuses, [orderId]: false })
    }
  }

  const handleDiscardStatus = (orderId: number) => {
    // Remove from edited statuses to revert
    const newEditedStatuses = { ...editedStatuses }
    delete newEditedStatuses[orderId]
    setEditedStatuses(newEditedStatuses)
  }

  const isStatusChanged = (orderId: number): boolean => {
    return orderId in editedStatuses
  }

  const getCurrentStatus = (orderId: number, originalStatus: string): string => {
    return editedStatuses[orderId] || originalStatus
  }

  // Common order statuses - ensure all statuses from orders are included
  const getAllStatuses = (): string[] => {
    const statusSet = new Set<string>()
    // Add common statuses
    const commonStatuses = ['Pending', 'Approved', 'Completed', 'Cancelled', 'Rejected']
    commonStatuses.forEach((s) => statusSet.add(s))

    // Add any statuses from loaded orders
    if (ordersData?.data) {
      ordersData.data.forEach((order) => {
        if (order.status) {
          statusSet.add(order.status)
        }
      })
    }

    return Array.from(statusSet).sort()
  }

  if (loading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-4">
            {dict.orders?.loading || 'Loading...'}
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
            <h4>{dict.sidebar?.items?.order || 'Orders'}</h4>
            <div className="text-muted">
              {dict.orders?.title || 'Manage orders'}
            </div>
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
        <form onSubmit={handleSearch} className="mb-3">
          <Row className="g-2 mb-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small mb-1">
                  {dict.orders?.search_placeholder || 'Search by Order ID, Kitchen, or Created By Name'}
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faSearch} />
                  </InputGroup.Text>
                  <FormControl
                    type="text"
                    placeholder={dict.orders?.search_placeholder || 'Search orders...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="mb-0"
              >
                <FontAwesomeIcon icon={faFilter} className="me-2" />
                {dict.common?.filter || 'Filter'}
              </Button>
              {(search || dateFrom || dateTo) && (
                <Button
                  variant="outline-secondary"
                  onClick={handleClearSearch}
                  className="mb-0"
                >
                  {dict.common?.clear || 'Clear'}
                </Button>
              )}
              <Button variant="primary" type="submit" className="mb-0">
                <FontAwesomeIcon icon={faSearch} className="me-2" />
                {dict.common?.search || 'Search'}
              </Button>
            </Col>
          </Row>

          {/* Date Range Filters - Collapsible */}
          {showFilters && (
            <Row className="g-2">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small mb-1">
                    <FontAwesomeIcon icon={faCalendar} className="me-1" />
                    {dict.orders?.columns?.order_date || 'Order Date'} - From
                  </Form.Label>
                  <FormControl
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small mb-1">
                    <FontAwesomeIcon icon={faCalendar} className="me-1" />
                    {dict.orders?.columns?.order_date || 'Order Date'} - To
                  </Form.Label>
                  <FormControl
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
        </form>

        {/* Orders Table */}
        {ordersData && ordersData.data && ordersData.data.length > 0 ? (
          <>
            <Table striped bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>{dict.orders?.columns?.order_id || 'Order ID'}</th>
                  <th>{dict.orders?.columns?.kitchen || 'Kitchen'}</th>
                  <th>{dict.orders?.columns?.order_date || 'Order Date'}</th>
                  <th>{dict.orders?.columns?.status || 'Status'}</th>
                  <th>{dict.orders?.columns?.created_by || 'Created By'}</th>
                  <th>{dict.orders?.columns?.details_count || 'Details Count'}</th>
                  <th className="text-center">{dict.orders?.columns?.actions || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {ordersData.data.map((order) => (
                  <tr key={order.orderId}>
                    <td>
                      <strong>#{order.orderId}</strong>
                    </td>
                    <td>
                      <div>
                        <div>{order.kitchenName}</div>
                        <small className="text-muted">{order.kitchenId}</small>
                      </div>
                    </td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <FormSelect
                          size="sm"
                          value={getCurrentStatus(order.orderId, order.status)}
                          onChange={(e) =>
                            handleStatusChange(order.orderId, e.target.value)
                          }
                          style={{
                            minWidth: '120px',
                            backgroundColor: getStatusBackgroundColor(getCurrentStatus(order.orderId, order.status)),
                            color: getStatusTextColor(getCurrentStatus(order.orderId, order.status)),
                            borderColor: getStatusBorderColor(getCurrentStatus(order.orderId, order.status)),
                          }}
                          disabled={savingStatuses[order.orderId]}
                        >
                          {getAllStatuses().map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </FormSelect>
                        {isStatusChanged(order.orderId) && (
                          <div className="d-flex gap-1">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleSaveStatus(order.orderId)}
                              disabled={savingStatuses[order.orderId]}
                            >
                              <FontAwesomeIcon
                                icon={faSave}
                                title={dict.common?.save || 'Save'}
                              />
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleDiscardStatus(order.orderId)}
                              disabled={savingStatuses[order.orderId]}
                            >
                              <FontAwesomeIcon
                                icon={faXmark}
                                title={dict.common?.cancel || 'Cancel'}
                              />
                            </Button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{order.createdByName}</div>
                        <small className="text-muted">
                          {order.createdByUserId}
                        </small>
                      </div>
                    </td>
                    <td>
                      {order.details?.length || 0} {dict.orders?.labels?.dish_plural || 'dish(es)'}
                      {order.supplementaries &&
                        order.supplementaries.length > 0 && (
                          <span className="text-muted">
                            {' '}
                            + {order.supplementaries.length} {dict.orders?.labels?.supplementary || 'supplementary'}
                          </span>
                        )}
                    </td>
                    <td className="text-center">
                      <Dropdown>
                        <DropdownToggle
                          variant="link"
                          className="text-decoration-none"
                          id={`dropdown-${order.orderId}`}
                        >
                          <FontAwesomeIcon icon={faEllipsisVertical} />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() =>
                              router.push(`/orders/${order.orderId}`)
                            }
                          >
                            <FontAwesomeIcon icon={faEye} className="me-2" />
                            {dict.orders?.view_details || 'View Details'}
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              router.push(
                                `/orders/${order.orderId}/ingredients/summary`,
                              )
                            }
                          >
                            <FontAwesomeIcon icon={faEye} className="me-2" />
                            {dict.orders?.labels?.view_ingredients_summary || 'View Ingredients Summary'}
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => handleDelete(order.orderId)}
                            className="text-danger"
                          >
                            <FontAwesomeIcon icon={faTrash} className="me-2" />
                            {dict.action?.delete || 'Delete'}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination */}
            {ordersData.meta && <Pagination meta={ordersData.meta} />}
          </>
        ) : (
          <Alert variant="info">
            {dict.orders?.no_orders || 'No orders found'}
          </Alert>
        )}
      </CardBody>
    </Card>
  )
}


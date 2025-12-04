'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardBody,
  Button,
  Spinner,
  Alert,
  Badge,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Table,
  Modal,
  Form,
  Dropdown,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faEye,
  faChevronDown,
  faCheck,
  faTimes,
  faEdit,
} from '@fortawesome/free-solid-svg-icons'
import { orderApi } from '@/services'
import { OrderDTO } from '@/models/order'
import useDictionary from '@/locales/dictionary-hook'
import { useNotification } from '@/components/Common/Notification/NotificationProvider'

type Selection = {
  orderIngredientSupplierId: number;
  orderId: string;
  ingredientId: string;
  selectedSupplierId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalCost: number;
  status: string;
  selectionDate: string;
  selectedByUserId: string;
  notes: string;
  ingredient: {
    ingredientId: string;
    ingredientName: string;
    unit: string;
  };
  selectedSupplier: {
    supplierId: string;
    supplierName: string;
    zaloLink: string;
  };
  selectedProduct: {
    productId: number;
    productName: string;
  };
  selectedBy: {
    userId: string;
    fullName: string;
  };
}

type SupplierSelectionsResponse = {
  count: number;
  orderId: string;
  selections: Selection[];
}

export default function OrdersGroupedList() {
  const [orders, setOrders] = useState<OrderDTO[]>([])
  const [orderSuppliers, setOrderSuppliers] = useState<
    Map<string, Selection[]>
  >(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeKey, setActiveKey] = useState<string>('')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<Selection | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [updating, setUpdating] = useState(false)
  const router = useRouter()
  const dict = useDictionary()
  const { addNotification } = useNotification()

  // Common rejection reasons - will use translations
  const commonRejectionReasons = [
    (dict.orders as any)?.rejection_reasons?.lack_of_ingredient || 'Thiếu nguyên liệu - hết hàng',
    (dict.orders as any)?.rejection_reasons?.insufficient_quantity || 'Số lượng không đủ',
    (dict.orders as any)?.rejection_reasons?.price_too_high || 'Giá tăng vượt ngân sách',
    (dict.orders as any)?.rejection_reasons?.quality_issues || 'Chất lượng không đạt yêu cầu',
    (dict.orders as any)?.rejection_reasons?.supplier_unavailable || 'Nhà cung cấp tạm thời không khả dụng',
    (dict.orders as any)?.rejection_reasons?.seasonal || 'Nguyên liệu theo mùa - hiện không có',
    (dict.orders as any)?.rejection_reasons?.delivery_time || 'Thời gian giao hàng quá lâu',
    (dict.orders as any)?.rejection_reasons?.minimum_order || 'Không đạt số lượng đặt hàng tối thiểu',
  ]

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await orderApi.getAll({ per_page: 1000 })
      setOrders(response.data || [])
    } catch (err) {
      setError(
        (dict.orders as any)?.error_load || 'Không thể tải danh sách đơn hàng',
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadSupplierRequestsForOrder = async (orderId: string) => {
    if (orderSuppliers.has(orderId)) return

    try {
      const data = await orderApi.getSupplierRequests(orderId)

      // Handle selections response format
      let selections: Selection[] = []
      if (data && typeof data === 'object' && 'selections' in data) {
        const response = data as unknown as SupplierSelectionsResponse
        selections = response.selections || []
      }

      setOrderSuppliers((prev) => new Map(prev).set(orderId, selections))
    } catch (err) {
      console.error(`Failed to load supplier requests for order ${orderId}:`, err)
      setOrderSuppliers((prev) => new Map(prev).set(orderId, []))
    }
  }

  const handleAccordionToggle = (orderId: string) => {
    if (activeKey === orderId) {
      setActiveKey('')
    } else {
      setActiveKey(orderId)
      loadSupplierRequestsForOrder(orderId)
    }
  }

  const formatNumber = (num: number): string => {
    const rounded = Math.round(num * 10000000000) / 10000000000
    return rounded.toString().replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1')
  }

  const getStatusName = (status: string) => {
    const s = (status || 'Pending').toLowerCase()
    const statusNames = (dict.orders as any)?.status_names || {}

    if (s === 'pending') return statusNames.pending || 'Chờ xử lý'
    if (s === 'approved') return statusNames.approved || 'Đã duyệt'
    if (s === 'completed') return statusNames.completed || 'Hoàn thành'
    if (s === 'rejected') return statusNames.rejected || 'Đã từ chối'
    return status
  }

  const getStatusBadge = (status: string) => {
    const s = (status || 'Pending').toLowerCase()
    const statusNames = (dict.orders as any)?.status_names || {}

    if (s === 'pending') return <Badge bg="warning">{statusNames.pending || 'Chờ xử lý'}</Badge>
    if (s === 'approved') return <Badge bg="success">{statusNames.approved || 'Đã duyệt'}</Badge>
    if (s === 'completed') return <Badge bg="info">{statusNames.completed || 'Hoàn thành'}</Badge>
    if (s === 'rejected') return <Badge bg="danger">{statusNames.rejected || 'Đã từ chối'}</Badge>
    return <Badge bg="secondary">{status}</Badge>
  }

  const handleStatusChange = (selection: Selection, status: string) => {
    setSelectedRequest(selection)
    setNewStatus(status)
    setRejectionReason(selection.notes || '')
    setShowStatusModal(true)
  }

  const handleBulkStatusChange = (supplierSelections: Selection[], status: string) => {
    // Set first selection as representative
    setSelectedRequest(supplierSelections[0])
    setNewStatus(status)
    setRejectionReason('')
    setShowStatusModal(true)
    // Store all selections for bulk update
    ;(window as any)._bulkSelections = supplierSelections
  }

  const updateSupplierRequestStatus = async () => {
    if (!selectedRequest) return

    setUpdating(true)
    try {
      // Check if this is a bulk update
      const bulkSelections = (window as any)._bulkSelections as Selection[] | undefined
      const isBulkUpdate = bulkSelections && bulkSelections.length > 1

      if (isBulkUpdate) {
        // Bulk update all selections via Next.js API route (includes auth via apiClient)
        const responses = await Promise.all(
          bulkSelections.map((sel) =>
            fetch(
              `/api/orders/${sel.orderId}/supplier-requests/${sel.orderIngredientSupplierId}/status`,
              {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  status: newStatus,
                  notes: rejectionReason || sel.notes,
                }),
              },
            ),
          ),
        )

        const failed = responses.find((res) => !res.ok)
        if (failed) {
          throw new Error('Failed to update one or more supplier requests')
        }

        // Update local state for all selections
        const updatedSelections = orderSuppliers.get(selectedRequest.orderId)?.map((sel) => {
          const shouldUpdate = bulkSelections.some(b => b.orderIngredientSupplierId === sel.orderIngredientSupplierId)
          return shouldUpdate
            ? { ...sel, status: newStatus, notes: rejectionReason || sel.notes }
            : sel
        })

        if (updatedSelections) {
          setOrderSuppliers((prev) =>
            new Map(prev).set(selectedRequest.orderId, updatedSelections)
          )
        }

        // Clear bulk selections
        delete (window as any)._bulkSelections
      } else {
        // Single update via Next.js API route (includes auth via apiClient)
        const response = await fetch(
          `/api/orders/${selectedRequest.orderId}/supplier-requests/${selectedRequest.orderIngredientSupplierId}/status`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: newStatus,
              notes: rejectionReason || selectedRequest.notes,
            }),
          },
        )

        if (!response.ok) {
          throw new Error('Failed to update status')
        }

        // Update local state
        const updatedSelections = orderSuppliers.get(selectedRequest.orderId)?.map((sel) =>
          sel.orderIngredientSupplierId === selectedRequest.orderIngredientSupplierId
            ? { ...sel, status: newStatus, notes: rejectionReason || sel.notes }
            : sel
        )

        if (updatedSelections) {
          setOrderSuppliers((prev) =>
            new Map(prev).set(selectedRequest.orderId, updatedSelections)
          )
        }
      }

      const statusName = getStatusName(newStatus)
      const count = isBulkUpdate ? bulkSelections.length : 1
      const message = isBulkUpdate
        ? `Đã cập nhật ${count} nguyên liệu thành ${statusName}`
        : ((dict.orders as any)?.supplier_request_status?.status_updated || 'Đã cập nhật trạng thái yêu cầu nhà cung cấp thành {{status}}').replace('{{status}}', statusName)

      addNotification({
        type: 'success',
        title: dict.common?.success || 'Thành công',
        message,
      })

      setShowStatusModal(false)
      setSelectedRequest(null)
      setRejectionReason('')
    } catch (err) {
      console.error('Failed to update supplier request status:', err)
      addNotification({
        type: 'error',
        title: dict.common?.error || 'Lỗi',
        message: (dict.orders as any)?.supplier_request_status?.update_failed || 'Không thể cập nhật trạng thái yêu cầu nhà cung cấp',
      })
    } finally {
      setUpdating(false)
    }
  }

  const renderSupplierTable = (selections: Selection[]) => {
    if (!selections || selections.length === 0) {
      return (
        <Alert variant="info" className="mb-0">
          {(dict.orders as any)?.no_supplier_requests ||
            'Không có yêu cầu nhà cung cấp nào cho đơn hàng này.'}
        </Alert>
      )
    }

    // Group selections by supplier
    const groupedBySupplier = selections.reduce((acc, selection) => {
      const supplierId = selection.selectedSupplierId
      if (!acc[supplierId]) {
        acc[supplierId] = []
      }
      acc[supplierId].push(selection)
      return acc
    }, {} as Record<string, Selection[]>)

    return (
      <div>
        {Object.entries(groupedBySupplier).map(([supplierId, supplierSelections]) => {
          const firstSelection = supplierSelections[0]
          const supplierTotal = supplierSelections.reduce((sum, sel) => sum + sel.totalCost, 0)

          return (
            <div key={supplierId} className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                <div>
                  <h6 className="mb-0">
                    <Badge bg="primary">{firstSelection.selectedSupplier.supplierName}</Badge>
                  </h6>
                  <small className="text-muted">
                    {supplierSelections.length} ingredient(s) • Total: {formatNumber(supplierTotal)}
                  </small>
                </div>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary" size="sm">
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                    {(dict.orders as any)?.bulk_status_update || 'Cập nhật tất cả'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleBulkStatusChange(supplierSelections, 'Pending')}
                    >
                      {(dict.orders as any)?.status_names?.pending || 'Chờ xử lý'}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleBulkStatusChange(supplierSelections, 'Approved')}
                    >
                      <FontAwesomeIcon icon={faCheck} className="me-1" />
                      {(dict.orders as any)?.status_names?.approved || 'Đã duyệt'}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleBulkStatusChange(supplierSelections, 'Rejected')}
                    >
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      {(dict.orders as any)?.status_names?.rejected || 'Đã từ chối'}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleBulkStatusChange(supplierSelections, 'Completed')}
                    >
                      {(dict.orders as any)?.status_names?.completed || 'Hoàn thành'}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              {/* Desktop View */}
              <div className="d-none d-md-block">
                <Table bordered hover size="sm">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '25%' }}>
                        {(dict.orders as any)?.table_headers?.ingredient ||
                          'Nguyên liệu'}
                      </th>
                      <th style={{ width: '12%' }} className="text-end">
                        {(dict.orders as any)?.table_headers?.quantity ||
                          'Số lượng'}
                      </th>
                      <th style={{ width: '12%' }} className="text-end">
                        {(dict.orders as any)?.table_headers?.unit_price ||
                          'Đơn giá'}
                      </th>
                      <th style={{ width: '12%' }} className="text-end">
                        {(dict.orders as any)?.table_headers?.total_cost ||
                          'Thành tiền'}
                      </th>
                      <th style={{ width: '12%' }} className="text-center">
                        {(dict.orders as any)?.table_headers?.status ||
                          'Trạng thái'}
                      </th>
                      <th style={{ width: '15%' }}>
                        {(dict.orders as any)?.table_headers?.selected_by ||
                          'Người chọn'}
                      </th>
                      <th style={{ width: '12%' }} className="text-center">
                        {(dict.orders as any)?.table_headers?.actions ||
                          'Thao tác'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierSelections.map((selection) => (
                      <tr key={selection.orderIngredientSupplierId}>
                        <td>
                          <strong>{selection.ingredient.ingredientName}</strong>
                          {selection.notes && (
                            <>
                              <br />
                              <small className="text-muted">{selection.notes}</small>
                            </>
                          )}
                        </td>
                        <td className="text-end">
                          {formatNumber(selection.quantity)} {selection.unit}
                        </td>
                        <td className="text-end">
                          {formatNumber(selection.unitPrice)}
                        </td>
                        <td className="text-end">
                          <strong>{formatNumber(selection.totalCost)}</strong>
                        </td>
                        <td className="text-center">
                          {getStatusBadge(selection.status || 'Pending')}
                        </td>
                        <td>
                          {selection.selectedBy.fullName}
                          <br />
                          <small className="text-muted">
                            {new Date(selection.selectionDate).toLocaleDateString()}
                          </small>
                        </td>
                        <td className="text-center">
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                              <FontAwesomeIcon icon={faEdit} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => handleStatusChange(selection, 'Pending')}
                              >
                                {(dict.orders as any)?.status_names?.pending || 'Chờ xử lý'}
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleStatusChange(selection, 'Approved')}
                              >
                                <FontAwesomeIcon icon={faCheck} className="me-1" />
                                {(dict.orders as any)?.status_names?.approved || 'Đã duyệt'}
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleStatusChange(selection, 'Rejected')}
                              >
                                <FontAwesomeIcon icon={faTimes} className="me-1" />
                                {(dict.orders as any)?.status_names?.rejected || 'Đã từ chối'}
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleStatusChange(selection, 'Completed')}
                              >
                                {(dict.orders as any)?.status_names?.completed || 'Hoàn thành'}
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Mobile View - Compact List */}
              <div className="d-md-none">
                <div className="list-group list-group-flush">
                  {supplierSelections.map((selection) => (
                    <div
                      key={selection.orderIngredientSupplierId}
                      className="list-group-item px-2 py-2"
                      style={{ fontSize: '0.875rem' }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div className="flex-grow-1">
                          <div className="fw-bold">{selection.ingredient.ingredientName}</div>
                          <div className="d-flex gap-2 align-items-center mt-1">
                            {getStatusBadge(selection.status || 'Pending')}
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                              {formatNumber(selection.quantity)} {selection.unit} × {formatNumber(selection.unitPrice)} = <strong>{formatNumber(selection.totalCost)}</strong>
                            </span>
                          </div>
                          {selection.notes && (
                            <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                              {selection.notes}
                            </div>
                          )}
                        </div>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm" className="py-0 px-2">
                            <FontAwesomeIcon icon={faEdit} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => handleStatusChange(selection, 'Pending')}
                            >
                              {(dict.orders as any)?.status_names?.pending || 'Chờ xử lý'}
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleStatusChange(selection, 'Approved')}
                            >
                              <FontAwesomeIcon icon={faCheck} className="me-1" />
                              {(dict.orders as any)?.status_names?.approved || 'Đã duyệt'}
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleStatusChange(selection, 'Rejected')}
                            >
                              <FontAwesomeIcon icon={faTimes} className="me-1" />
                              {(dict.orders as any)?.status_names?.rejected || 'Đã từ chối'}
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleStatusChange(selection, 'Completed')}
                            >
                              {(dict.orders as any)?.status_names?.completed || 'Hoàn thành'}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderOrderSuppliers = (order: OrderDTO) => {
    const orderIdStr = String(order.orderId)
    const suppliers = orderSuppliers.get(orderIdStr)

    if (!suppliers) {
      return (
        <div className="text-center py-3">
          <Spinner animation="border" size="sm" />
          <p className="mt-2 mb-0 text-muted">
            {(dict.orders as any)?.loading_supplier_requests ||
              'Đang tải yêu cầu nhà cung cấp...'}
          </p>
        </div>
      )
    }

    return renderSupplierTable(suppliers)
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2">{dict.common?.loading || 'Đang tải...'}</p>
      </div>
    )
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  return (
    <>
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>
            {(dict.orders as any)?.title_with_supplier_requests ||
              'Đơn hàng có yêu cầu nhà cung cấp'}
          </h4>
          <Button
            variant="primary"
            onClick={() => router.push('/orders/create')}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            {dict.orders?.create || 'Tạo đơn hàng'}
          </Button>
        </div>

        {orders.length === 0 ? (
          <Alert variant="info">
            {dict.common?.no_data || 'Không có đơn hàng nào'}
          </Alert>
        ) : (
          <Accordion activeKey={activeKey}>
            {orders.map((order) => (
              <AccordionItem key={order.orderId} eventKey={String(order.orderId)}>
                <AccordionHeader
                  onClick={() => handleAccordionToggle(String(order.orderId))}
                >
                  <div className="d-flex justify-content-between align-items-center w-100 me-3">
                    <div>
                      <strong>Order #{order.orderId}</strong>
                      <span className="ms-2">{getStatusBadge(order.status)}</span>
                      <br />
                      <small className="text-muted">
                        {order.kitchenName} • {new Date(order.orderDate).toLocaleDateString()}
                        {order.note && ` • ${order.note}`}
                      </small>
                    </div>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      style={{
                        transition: 'transform 0.2s',
                        transform:
                          activeKey === String(order.orderId) ? 'rotate(180deg)' : 'none',
                      }}
                    />
                  </div>
                </AccordionHeader>
                <AccordionBody>
                  <div className="mb-3">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => router.push(`/orders/${order.orderId}`)}
                      className="me-2"
                    >
                      <FontAwesomeIcon icon={faEye} className="me-1" />
                      View Order
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => router.push(`/orders/${order.orderId}/supplier-requests`)}
                    >
                      View Full Supplier Requests
                    </Button>
                  </div>
                  {renderOrderSuppliers(order)}
                </AccordionBody>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {(dict.orders as any)?.supplier_request_status?.title || 'Cập nhật trạng thái yêu cầu NCC'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div>
              {(window as any)._bulkSelections && (window as any)._bulkSelections.length > 1 ? (
                <>
                  <Alert variant="info">
                    {((dict.orders as any)?.bulk_status_update_info || 'Cập nhật trạng thái cho {{count}} nguyên liệu từ nhà cung cấp này').replace('{{count}}', String((window as any)._bulkSelections.length))}
                  </Alert>
                  <p>
                    <strong>{(dict.orders as any)?.supplier_request_status?.supplier || 'Nhà cung cấp'}:</strong> {selectedRequest.selectedSupplier.supplierName}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>{(dict.orders as any)?.supplier_request_status?.ingredient || 'Nguyên liệu'}:</strong> {selectedRequest.ingredient.ingredientName}
                  </p>
                  <p>
                    <strong>{(dict.orders as any)?.supplier_request_status?.supplier || 'Nhà cung cấp'}:</strong> {selectedRequest.selectedSupplier.supplierName}
                  </p>
                </>
              )}
              <p>
                <strong>{(dict.orders as any)?.supplier_request_status?.new_status || 'Trạng thái mới'}:</strong> {getStatusBadge(newStatus)}
              </p>

              <div className="mt-3">
                <Form.Group>
                  <Form.Label>
                    {newStatus === 'Rejected'
                      ? ((dict.orders as any)?.rejection_reasons?.title || 'Lý do từ chối *')
                      : ((dict.orders as any)?.status_notes?.title || 'Ghi chú')}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder={
                      newStatus === 'Rejected'
                        ? ((dict.orders as any)?.rejection_reasons?.placeholder || 'Nhập lý do hoặc chọn từ các lý do phổ biến bên dưới')
                        : ((dict.orders as any)?.status_notes?.placeholder || 'Nhập ghi chú về thay đổi trạng thái (không bắt buộc)')
                    }
                  />
                  <Form.Text className="text-muted">
                    {newStatus === 'Rejected'
                      ? ((dict.orders as any)?.rejection_reasons?.explanation || 'Vui lòng giải thích lý do yêu cầu nhà cung cấp bị từ chối')
                      : ((dict.orders as any)?.status_notes?.explanation || 'Ghi chú về lý do thay đổi trạng thái (không bắt buộc)')}
                  </Form.Text>
                </Form.Group>

                {newStatus === 'Rejected' && (
                  <div className="mt-3">
                    <Form.Label className="text-muted small">
                      {(dict.orders as any)?.rejection_reasons?.common_title || 'Lý do phổ biến (nhấp để sử dụng):'}
                    </Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {commonRejectionReasons.map((reason: string, index: number) => (
                        <Badge
                          key={index}
                          bg="secondary"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setRejectionReason(reason)}
                        >
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            {dict.action?.cancel || 'Hủy'}
          </Button>
          <Button
            variant="primary"
            onClick={updateSupplierRequestStatus}
            disabled={updating}
          >
            {updating
              ? ((dict.orders as any)?.supplier_request_status?.updating || 'Đang cập nhật...')
              : ((dict.orders as any)?.supplier_request_status?.update_button || 'Cập nhật trạng thái')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

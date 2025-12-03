'use client'

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Alert,
  Table,
  Badge,
  Spinner,
  Modal,
} from 'react-bootstrap'
import { useParams, useRouter } from 'next/navigation'
import useDictionary from '@/locales/dictionary-hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faEye,
  faExternalLink,
  faCopy,
  faFileAlt,
} from '@fortawesome/free-solid-svg-icons'
import { orderApi, messageTemplateApi } from '@/services'
import StatusToast from '@/components/Common/StatusToast'
import { MessageTemplate } from '@/models/message-template'

type IngredientInfo = {
  ingredientId: string;
  ingredientName: string;
  ingredientTypeId: string;
  property: string;
  materialGroup: string;
  unit: string;
  createdDate: string;
  modifiedDate: string;
};

type SupplierInfo = {
  supplierId: string;
  supplierName: string;
  zaloLink: string;
  address: string;
  phone: string;
  email: string;
  active: boolean;
  createdDate: string;
  modifiedDate: string;
}

type ProductInfo = {
  productId: number;
  productName: string;
  ingredientId: string;
  category: string;
  supplierId: string;
  manufacturer: string;
  unit: string;
  specification: string;
  unitPrice: number;
  pricePer1: number;
  effectiveFrom: null;
  effectiveTo: null;
  active: boolean;
  newPrice: number;
  promotion: string;
  createdDate: string;
  modifiedDate: string;
}

type UserInfo = {
  userId: string;
  userName: string;
  password: string;
  fullName: string;
  role: string;
  kitchenId: string;
  email: string;
  phone: string;
  active: boolean;
  createdDate: string;
  modifiedDate: string;
}

type Selection = {
  orderIngredientSupplierId: number;
  orderId: string;
  ingredientId: string;
  selectedSupplierId: string;
  selectedProductId: number;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalCost: number;
  selectionDate: string;
  selectedByUserId: string;
  notes: string;
  createdDate: string;
  modifiedDate: string;
  ingredient: IngredientInfo;
  selectedSupplier: SupplierInfo;
  selectedProduct: ProductInfo;
  selectedBy: UserInfo;
}

type SupplierSelectionsResponse = {
  count: number;
  orderId: string;
  selections: Selection[];
}

export default function OrderSupplierRequestsPage() {
  const params = useParams()
  const router = useRouter()
  const dict = useDictionary()
  const orderId = params?.id ? String(params.id) : ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [selections, setSelections] = useState<Selection[]>([])
  const [copySuccess, setCopySuccess] = useState<string>('')
  const [showCopyToast, setShowCopyToast] = useState<boolean>(false)
  const [messageTemplate, setMessageTemplate] = useState<MessageTemplate | null>(null)
  const [kitchenId, setKitchenId] = useState<string>('')
  const [kitchenName, setKitchenName] = useState<string>('')
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewMessage, setPreviewMessage] = useState<string>('')
  const [originalPreviewMessage, setOriginalPreviewMessage] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      if (!orderId) return
      try {
        setLoading(true)
        setError('')

        // Load selections, template, and order info in parallel
        const [selectionsData, templatesData, orderData] = await Promise.all([
          orderApi.getSupplierRequests(orderId),
          messageTemplateApi.getAll('?type=zalo_supplier_request&active=true'),
          orderApi.getById(orderId)
        ])

        // Handle selections response format
        if (selectionsData && typeof selectionsData === 'object' && 'selections' in selectionsData) {
          const response = selectionsData as unknown as SupplierSelectionsResponse
          setSelections(response.selections || [])
        } else {
          setSelections([])
        }

        // Set the first active template
        if (templatesData && templatesData.data && templatesData.data.length > 0) {
          setMessageTemplate(templatesData.data[0])
        }

        // Set kitchen info from order
        if (orderData) {
          setKitchenId(orderData.kitchenId || '')
          setKitchenName(orderData.kitchenName || orderData.kitchenId || '')
        }
      } catch (e) {
        const errorObj = e as Error
        setError(errorObj?.message || 'Failed to load supplier requests')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [orderId])

  const formatNumber = (num: number): string => {
    const rounded = Math.round(num * 10000000000) / 10000000000
    return rounded.toString().replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1')
  }

    const columns = dict.orders?.columns as { [key: string]: string } | undefined

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase()
    if (s === 'pending') return <Badge bg="warning">{dict.orders?.labels?.status_badges?.pending || 'Pending'}</Badge>
    if (s === 'approved' || s === 'completed')
      return <Badge bg="success">{status}</Badge>
    if (s === 'cancelled' || s === 'rejected')
      return <Badge bg="danger">{status}</Badge>
    return <Badge bg="secondary">{status}</Badge>
  }

  const buildZaloMessage = (supplierSelections: Selection[]): string => {
    if (supplierSelections.length === 0) return ''

    const firstSelection = supplierSelections[0]
    const { supplierName } = firstSelection.selectedSupplier

    // Calculate total cost for all ingredients
    const grandTotal = supplierSelections.reduce((sum, sel) => sum + sel.totalCost, 0)

    // Build ingredient list with proper alignment
    const ingredientLines = supplierSelections.map(sel => {
      const ingredientName = sel.ingredient.ingredientName.padEnd(20, ' ')
      const quantity = `${formatNumber(sel.quantity)} ${sel.unit}`.padEnd(12, ' ')
      const unitPrice = formatNumber(sel.unitPrice).padStart(10, ' ')
      const totalCost = formatNumber(sel.totalCost).padStart(12, ' ')
      return `${ingredientName}${quantity}${unitPrice}${totalCost}`
    }).join('\n')

    // Collect all notes
    const allNotes = supplierSelections
      .map(sel => sel.notes)
      .filter(note => note && note.trim())
      .join('\n')

    // Use template if available, otherwise use default
    let message = messageTemplate?.content || `Tên bếp: {{kitchenName}}
Mã đơn: {{orderId}}

Danh sách sản phẩm:
Sản phẩm            Số lượng    Đơn giá     Thành tiền
{{ingredientList}}

Tổng tiền: {{totalCost}}

Ghi chú thêm (nếu có):
{{notes}}

👉 Đề nghị NCC {{supplierName}} xác nhận đơn. Nếu có thay đổi báo lại để AĐ điều chỉnh.
Xin cảm ơn!`

    // Replace placeholders with actual values
    message = message
      .replace(/\{\{kitchenId\}\}/g, kitchenId)
      .replace(/\{\{kitchenName\}\}/g, kitchenName)
      .replace(/\{\{orderId\}\}/g, firstSelection.orderId)
      .replace(/\{\{supplierName\}\}/g, supplierName)
      .replace(/\{\{ingredientList\}\}/g, ingredientLines)
      .replace(/\{\{totalCost\}\}/g, formatNumber(grandTotal))
      .replace(/\{\{notes\}\}/g, allNotes || 'Không có ghi chú')
      // Legacy single ingredient placeholders (for backwards compatibility)
      .replace(/\{\{ingredientName\}\}/g, supplierSelections.length === 1 ? supplierSelections[0].ingredient.ingredientName : '')
      .replace(/\{\{quantity\}\}/g, supplierSelections.length === 1 ? formatNumber(supplierSelections[0].quantity) : '')
      .replace(/\{\{unitPrice\}\}/g, supplierSelections.length === 1 ? formatNumber(supplierSelections[0].unitPrice) : '')

    return message
  }

  const handleCopyMessage = async (supplierSelections: Selection[]) => {
    setCopySuccess('')
    try {
      const message = buildZaloMessage(supplierSelections)
      await navigator.clipboard.writeText(message)
      setCopySuccess(
        dict.orders?.labels?.copy_to_clipboard_success ||
          'Copied message to clipboard',
      )
      setShowCopyToast(true)
      setTimeout(() => setCopySuccess(''), 2500)
    } catch (err) {
      console.debug('Copy to clipboard error:', err)
    }
  }

  const handlePreviewMessage = (supplierSelections: Selection[]) => {
    const message = buildZaloMessage(supplierSelections)
    setPreviewMessage(message)
    setOriginalPreviewMessage(message)
    setShowPreviewModal(true)
  }

  const handleZaloClick = async (
    _e: React.MouseEvent,
    _link: string,
    supplierSelections: Selection[],
  ) => {
    // Don't prevent default - let the link work naturally
    // We'll copy to clipboard in parallel
    await handleCopyMessage(supplierSelections)
    // Let the default <a> tag behavior handle opening the link
    // This is more reliable on iOS Safari than window.open()
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

  if (loading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-4">
            <Spinner animation="border" className="me-2" />
            {dict.orders?.loading || 'Loading...'}
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4>
              {dict.orders?.labels?.supplier_requests_title ||
                'Supplier Requests'}{' '}
              #{orderId}
            </h4>
            <div className="text-muted">
              {dict.orders?.labels?.supplier_requests_subtitle ||
                'List of supplier requests for this order'}
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              onClick={() => router.push(`/orders/${orderId}`)}
            >
              <FontAwesomeIcon icon={faEye} className="me-2" />
              {dict.orders?.labels?.view_order || 'View Order'}
            </Button>
            <Button variant="secondary" onClick={() => router.push('/orders')}>
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              {dict.orders?.labels?.back_to_orders || 'Back to Orders'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <StatusToast
          show={showCopyToast && Boolean(copySuccess)}
          message={copySuccess}
          onClose={() => {
            setShowCopyToast(false)
            setCopySuccess('')
          }}
          variant="success"
          delay={2000}
          position={{ placement: 'top-end' }}
        />
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {selections.length === 0 ? (
          <Alert variant="info" className="mb-0">
            {dict.orders?.labels?.no_supplier_requests ||
              'No supplier requests found for this order.'}
          </Alert>
        ) : (
          <>
            {Object.entries(groupedBySupplier).map(([supplierId, supplierSelections]) => {
              const firstSelection = supplierSelections[0]
              const supplierTotal = supplierSelections.reduce((sum, sel) => sum + sel.totalCost, 0)

              return (
                <div key={supplierId} className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2 p-3 bg-light rounded">
                    <div>
                      <h5 className="mb-1">
                        {firstSelection.selectedSupplier.supplierName}
                      </h5>
                      <small className="text-muted">
                        {supplierId} • {supplierSelections.length} ingredient(s) • Total: {formatNumber(supplierTotal)}
                      </small>
                    </div>
                    <div className="d-flex gap-2">
                      {firstSelection.selectedSupplier.zaloLink && (
                        <a
                          href={firstSelection.selectedSupplier.zaloLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) =>
                            handleZaloClick(
                              e,
                              firstSelection.selectedSupplier.zaloLink,
                              supplierSelections,
                            )
                          }
                          className="btn btn-primary btn-sm"
                        >
                          <FontAwesomeIcon
                            icon={faExternalLink}
                            className="me-1"
                          />{' '}
                          {dict.orders?.labels?.zalo || 'Zalo'}
                        </a>
                      )}
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => handleCopyMessage(supplierSelections)}
                        title="Copy message to clipboard"
                      >
                        <FontAwesomeIcon icon={faCopy} className="me-1" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-info"
                        onClick={() => handlePreviewMessage(supplierSelections)}
                        title="Preview message"
                      >
                        <FontAwesomeIcon icon={faFileAlt} className="me-1" />
                        Preview
                      </Button>
                    </div>
                  </div>

                  <Table striped bordered hover responsive size="sm">
                    <thead className="table-light">
                      <tr>
                        <th>{columns?.ingredient || 'Ingredient'}</th>
                        <th className="text-end">{columns?.quantity || 'Quantity'}</th>
                        <th className="text-end">{columns?.unit_price || 'Unit Price'}</th>
                        <th className="text-end">{columns?.total_cost || 'Total Cost'}</th>
                        <th>{columns?.selected_by || 'Selected By'}</th>
                        <th>{columns?.selection_date || 'Selection Date'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplierSelections.map((selection) => (
                        <tr key={selection.orderIngredientSupplierId}>
                          <td>
                            <div>
                              <div>
                                <strong>{selection.ingredient.ingredientName}</strong>
                              </div>
                              <small className="text-muted">
                                {selection.ingredientId}
                              </small>
                              <div className="small text-muted">
                                {selection.ingredient.materialGroup} •{' '}
                                {selection.ingredient.property}
                              </div>
                            </div>
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
                          <td>
                            <div>
                              <div>{selection.selectedBy.fullName}</div>
                              <small className="text-muted">
                                {selection.selectedBy.role}
                              </small>
                            </div>
                          </td>
                          <td>{new Date(selection.selectionDate).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )
            })}
          </>
        )}
      </CardBody>
    </Card>

    {/* Preview Modal */}
    <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Message Preview & Edit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2">
          <small className="text-muted">You can edit the message below before copying:</small>
        </div>
        <textarea
          className="form-control"
          style={{
            fontFamily: 'monospace',
            whiteSpace: 'pre',
            minHeight: '400px',
            fontSize: '14px'
          }}
          value={previewMessage}
          onChange={(e) => setPreviewMessage(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
          Close
        </Button>
        <Button
          variant="outline-warning"
          onClick={() => setPreviewMessage(originalPreviewMessage)}
          disabled={previewMessage === originalPreviewMessage}
        >
          Reset
        </Button>
        <Button
          variant="primary"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(previewMessage)
              setCopySuccess('Copied message to clipboard')
              setShowCopyToast(true)
              setTimeout(() => setCopySuccess(''), 2500)
              setShowPreviewModal(false)
            } catch (err) {
              console.debug('Copy error:', err)
            }
          }}
        >
          <FontAwesomeIcon icon={faCopy} className="me-2" />
          Copy to Clipboard
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  )
}

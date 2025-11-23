'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Alert,
  Table,
  Badge,
  Spinner,
} from 'react-bootstrap'
import { useParams, useRouter } from 'next/navigation'
import useDictionary from '@/locales/dictionary-hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faEye,
  faExternalLink,
} from '@fortawesome/free-solid-svg-icons'
import { orderApi } from '@/services'
import StatusToast from '@/components/Common/StatusToast'

type IngredientInfo = {
  ingredientId: string
  ingredientName: string
  ingredientTypeId: string
  property: string
  materialGroup: string
  unit: string
  createdDate: string
  modifiedDate: string
}

type SupplierInfo = {
  supplierId: string
  supplierName: string
  zaloLink: string
  address: string
  phone: string
  email: string
  active: boolean
  createdDate: string
  modifiedDate: string
}

type ProductInfo = {
  productId: number
  productName: string
  ingredientId: string
  category: string
  supplierId: string
  manufacturer: string
  unit: string
  specification: string
  unitPrice: number
  pricePer1: number
  effectiveFrom: null
  effectiveTo: null
  active: boolean
  newPrice: number
  promotion: string
  createdDate: string
  modifiedDate: string
}

type UserInfo = {
  userId: string
  userName: string
  password: string
  fullName: string
  role: string
  kitchenId: string
  email: string
  phone: string
  active: boolean
  createdDate: string
  modifiedDate: string
}

type Selection = {
  orderIngredientSupplierId: number
  orderId: string
  ingredientId: string
  selectedSupplierId: string
  selectedProductId: number
  quantity: number
  unit: string
  unitPrice: number
  totalCost: number
  selectionDate: string
  selectedByUserId: string
  notes: string
  createdDate: string
  modifiedDate: string
  ingredient: IngredientInfo
  selectedSupplier: SupplierInfo
  selectedProduct: ProductInfo
  selectedBy: UserInfo
}

type SupplierSelectionsResponse = {
  count: number
  orderId: string
  selections: Selection[]
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

  useEffect(() => {
    const load = async () => {
      if (!orderId) return
      try {
        setLoading(true)
        setError('')
        const data = await orderApi.getSupplierRequests(orderId)
        // Handle new response format
        if (data && typeof data === 'object' && 'selections' in data) {
          const response = data as unknown as SupplierSelectionsResponse
          setSelections(response.selections || [])
        } else {
          // Fallback for old format or empty response
          setSelections([])
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load supplier requests')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [orderId])

  const formatNumber = (num: number): string => {
    const rounded = Math.round(num * 100) / 100
    return rounded.toString().replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1')
  }

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase()
    if (s === 'pending') return <Badge bg="warning">Pending</Badge>
    if (s === 'approved' || s === 'completed')
      return <Badge bg="success">{status}</Badge>
    if (s === 'cancelled' || s === 'rejected')
      return <Badge bg="danger">{status}</Badge>
    return <Badge bg="secondary">{status}</Badge>
  }

  const buildZaloMessage = (selection: Selection): string => {
    const supplierName = selection.selectedSupplier.supplierName
    const header = `Yêu cầu nhà cung cấp cho đơn hàng #${selection.orderId}\nNhà cung cấp: ${supplierName} (${selection.selectedSupplierId})\nNgày chọn: ${new Date(selection.selectionDate).toLocaleString()}`
    const lines = [
      ` - ${selection.ingredient.ingredientName} (${selection.ingredientId}): ${formatNumber(selection.quantity)} ${selection.unit} x ${formatNumber(selection.unitPrice)} = ${formatNumber(selection.totalCost)}`,
    ]
    if (selection.notes) {
      lines.push(`Ghi chú: ${selection.notes}`)
    }
    const footer = `Tổng tiền: ${formatNumber(selection.totalCost)}\nNgười chọn: ${selection.selectedBy.fullName}\nVui lòng xác nhận giúp. Xin cảm ơn!`
    return [header, 'Danh sách nguyên liệu:', ...lines, footer].join('\n')
  }

  const handleZaloClick = async (
    e: React.MouseEvent,
    link: string,
    selection: Selection,
  ) => {
    e.preventDefault()
    setCopySuccess('')
    try {
      const message = buildZaloMessage(selection)
      await navigator.clipboard.writeText(message)
      setCopySuccess(
        dict.orders?.labels?.copy_to_clipboard_success ||
          'Copied message to clipboard',
      )
      setShowCopyToast(true)
      setTimeout(() => {
        window.open(link, '_blank', 'noopener,noreferrer')
      }, 1000)
      setTimeout(() => setCopySuccess(''), 2500)
    } catch (err: any) {
      // Optional: could show error toast if needed
    }
  }

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
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>Selection ID</th>
                <th>Ingredient</th>
                <th>Supplier</th>
                <th className="text-end">Quantity</th>
                <th className="text-end">Unit Price</th>
                <th className="text-end">Total Cost</th>
                <th>Selected By</th>
                <th>Selection Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selections.map((selection) => (
                <tr key={selection.orderIngredientSupplierId}>
                  <td>
                    <strong>#{selection.orderIngredientSupplierId}</strong>
                  </td>
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
                  <td>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <div>
                        <div>{selection.selectedSupplier.supplierName}</div>
                        <small className="text-muted">
                          {selection.selectedSupplierId}
                        </small>
                      </div>
                      {selection.selectedSupplier.zaloLink && (
                        <a
                          className="btn btn-sm btn-outline-primary"
                          href={selection.selectedSupplier.zaloLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) =>
                            handleZaloClick(
                              e,
                              selection.selectedSupplier.zaloLink,
                              selection,
                            )
                          }
                        >
                          <FontAwesomeIcon
                            icon={faExternalLink}
                            className="me-1"
                          />{' '}
                          {dict.orders?.labels?.zalo || 'Zalo'}
                        </a>
                      )}
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
                  <td>
                    <div className="d-flex gap-1">
                      {selection.selectedSupplier.zaloLink && (
                        <Button
                          size="sm"
                          variant="outline-primary"
                          href={selection.selectedSupplier.zaloLink}
                          target="_blank"
                          onClick={(e) =>
                            handleZaloClick(
                              e,
                              selection.selectedSupplier.zaloLink,
                              selection,
                            )
                          }
                        >
                          <FontAwesomeIcon
                            icon={faExternalLink}
                            className="me-1"
                          />{' '}
                          Zalo
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  )
}

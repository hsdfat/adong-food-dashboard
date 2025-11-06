'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, Button, Alert, Table, Badge, Spinner } from 'react-bootstrap'
import { useParams, useRouter } from 'next/navigation'
import useDictionary from '@/locales/dictionary-hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faEye, faExternalLink } from '@fortawesome/free-solid-svg-icons'
import { orderApi } from '@/services'
import StatusToast from '@/components/Common/StatusToast'

type SupplierInfo = {
  supplierId: string
  supplierName?: string
  zaloLink?: string
  address?: string
  phone?: string
  email?: string
  active?: boolean
}

type RequestDetail = {
  requestDetailId: number
  requestId: number
  ingredientId: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  ingredient?: {
    ingredientId: string
    ingredientName: string
    unit?: string
  }
}

type SupplierRequest = {
  requestId: number
  orderId: string
  supplierId: string
  status: string
  createdDate: string
  modifiedDate: string
  supplier?: SupplierInfo
  details?: RequestDetail[]
}

export default function OrderSupplierRequestsPage() {
  const params = useParams()
  const router = useRouter()
  const dict = useDictionary()
  const orderId = params?.id ? String(params.id) : ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [requests, setRequests] = useState<SupplierRequest[]>([])
  const [copySuccess, setCopySuccess] = useState<string>('')
  const [showCopyToast, setShowCopyToast] = useState<boolean>(false)

  useEffect(() => {
    const load = async () => {
      if (!orderId) return
      try {
        setLoading(true)
        setError('')
        const data = await orderApi.getSupplierRequests(orderId)
        const arr = Array.isArray(data) ? data : []
        setRequests(arr as unknown as SupplierRequest[])
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
    if (s === 'approved' || s === 'completed') return <Badge bg="success">{status}</Badge>
    if (s === 'cancelled' || s === 'rejected') return <Badge bg="danger">{status}</Badge>
    return <Badge bg="secondary">{status}</Badge>
  }

  const buildZaloMessage = (r: SupplierRequest): string => {
    const supplierName = r.supplier?.supplierName || r.supplierId
    const header = `Yêu cầu nhà cung cấp cho đơn hàng #${r.orderId} (Mã yêu cầu #${r.requestId})\nNhà cung cấp: ${supplierName} (${r.supplierId})\nTrạng thái: ${r.status}`
    const lines = (r.details || []).map((d) => {
      const name = d.ingredient?.ingredientName || d.ingredientId
      const qty = `${formatNumber(d.quantity)} ${d.unit}`
      const unitPrice = formatNumber(d.unitPrice)
      const total = formatNumber(d.totalPrice || d.unitPrice * d.quantity)
      return ` - ${name} (${d.ingredientId}): ${qty} x ${unitPrice} = ${total}`
    })
    const totalAmount = (r.details || []).reduce((sum, d) => sum + (d.totalPrice || (d.unitPrice * (d.quantity || 0)) || 0), 0)
    const footer = `Tổng tiền: ${formatNumber(totalAmount)}\nVui lòng xác nhận giúp. Xin cảm ơn!`
    return [header, 'Danh sách nguyên liệu:', ...lines, footer].join('\n')
  }

  const handleZaloClick = async (e: React.MouseEvent, link: string, r: SupplierRequest) => {
    e.preventDefault()
    setCopySuccess('')
    try {
      const message = buildZaloMessage(r)
      await navigator.clipboard.writeText(message)
      setCopySuccess(dict.orders?.labels?.copy_to_clipboard_success || 'Copied message to clipboard')
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
            <h4>{dict.orders?.labels?.supplier_requests_title || 'Supplier Requests'} #{orderId}</h4>
            <div className="text-muted">
              {dict.orders?.labels?.supplier_requests_subtitle || 'List of supplier requests for this order'}
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={() => router.push(`/orders/${orderId}`)}>
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
        {requests.length === 0 ? (
          <Alert variant="info" className="mb-0">
            {dict.orders?.labels?.no_supplier_requests || 'No supplier requests found for this order.'}
          </Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>Request ID</th>
                <th>Supplier</th>
                <th className="text-end">Items</th>
                <th className="text-end">Total Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => {
                const details = r.details || []
                const totalAmount = details.reduce((sum, d) => sum + (d.totalPrice || (d.unitPrice * (d.quantity || 0)) || 0), 0)
                return (
                  <tr key={r.requestId}>
                    <td><strong>#{r.requestId}</strong></td>
                    <td>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <div>
                          <div>{r.supplier?.supplierName || r.supplierId}</div>
                          <small className="text-muted">{r.supplierId}</small>
                        </div>
                        {r.supplier?.zaloLink && (
                          <a
                            className="btn btn-sm btn-outline-primary"
                            href={r.supplier.zaloLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => handleZaloClick(e, r.supplier!.zaloLink!, r)}
                          >
                            <FontAwesomeIcon icon={faExternalLink} className="me-1" /> {dict.orders?.labels?.zalo || 'Zalo'}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="text-end">{details.length}</td>
                    <td className="text-end"><strong>{formatNumber(totalAmount)}</strong></td>
                    <td>{getStatusBadge(r.status)}</td>
                    <td>{new Date(r.createdDate).toLocaleString()}</td>
                    <td>{new Date(r.modifiedDate).toLocaleString()}</td>
                  </tr>
                )
              })}
              {/* Details rows */}
              {requests.map((r) => (
                (r.details || []).map((d) => (
                  <tr key={`detail-${r.requestId}-${d.requestDetailId}`}>
                    <td colSpan={2} className="ps-4">
                      <small className="text-muted">{r.requestId}</small>
                    </td>
                    <td colSpan={5}>
                      <div className="d-flex justify-content-between flex-wrap">
                        <div>
                          <strong>{d.ingredient?.ingredientName || d.ingredientId}</strong>
                          <span className="text-muted ms-2">{d.ingredientId}</span>
                        </div>
                        <div>
                          <span className="me-3">{formatNumber(d.quantity)} {d.unit}</span>
                          <span className="me-3">x {formatNumber(d.unitPrice)}</span>
                          <strong>= {formatNumber(d.totalPrice || d.unitPrice * d.quantity)}</strong>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  )
}



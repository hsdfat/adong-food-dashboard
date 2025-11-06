'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Table, Alert, Badge, Spinner, Button } from 'react-bootstrap'
import { useParams, useRouter } from 'next/navigation'
import { orderApi } from '@/services'
import { OrderDTO } from '@/models/order'
import useDictionary from '@/locales/dictionary-hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faList } from '@fortawesome/free-solid-svg-icons'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dict = useDictionary()
  const orderId = params?.id ? (params.id as string) : null

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [order, setOrder] = useState<OrderDTO | null>(null)

  useEffect(() => {
    if (orderId) {
      loadOrder()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  const loadOrder = async () => {
    if (!orderId) return

    try {
      setLoading(true)
      setError('')

      const data = await orderApi.getById(orderId)
      setOrder(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load order')
      console.error(err)
    } finally {
      setLoading(false)
    }
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

  const formatNumber = (num: number): string => {
    const rounded = Math.round(num * 100) / 100
    return rounded.toString().replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1')
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

  if (error || !order) {
    return (
      <Card>
        <CardBody>
          <Alert variant="danger">{error || dict.orders?.labels?.order_not_found || 'Order not found'}</Alert>
          <Button variant="secondary" onClick={() => router.push('/orders')}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            {dict.orders?.labels?.back_to_orders || 'Back to Orders'}
          </Button>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4>Order #{order.orderId}</h4>
            <div className="text-muted">
              {order.kitchenName} - {new Date(order.orderDate).toLocaleDateString()}
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              onClick={() => router.push(`/orders/${orderId}/ingredients/summary`)}
            >
              <FontAwesomeIcon icon={faList} className="me-2" />
              {dict.orders?.labels?.view_ingredients_summary || 'View Ingredients Summary'}
            </Button>
            <Button variant="secondary" onClick={() => router.push('/orders')}>
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              {dict.orders?.labels?.back_to_orders || 'Back to Orders'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        {/* Order Info */}
        <div className="mb-4">
          <h5>{dict.orders?.labels?.order_information || 'Order Information'}</h5>
          <Table bordered>
            <tbody>
              <tr>
                <th style={{ width: '200px' }}>{dict.orders?.columns?.order_id || 'Order ID'}</th>
                <td>#{order.orderId}</td>
              </tr>
              <tr>
                <th>{dict.orders?.columns?.kitchen || 'Kitchen'}</th>
                <td>
                  <div>{order.kitchenName}</div>
                  <small className="text-muted">{order.kitchenId}</small>
                </td>
              </tr>
              <tr>
                <th>{dict.orders?.columns?.order_date || 'Order Date'}</th>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <th>{dict.orders?.columns?.status || 'Status'}</th>
                <td>{getStatusBadge(order.status)}</td>
              </tr>
              <tr>
                <th>{dict.orders?.columns?.created_by || 'Created By'}</th>
                <td>
                  <div>{order.createdByName}</div>
                  <small className="text-muted">{order.createdByUserId}</small>
                </td>
              </tr>
              {order.note && (
                <tr>
                  <th>{dict.orders?.columns?.note || 'Note'}</th>
                  <td>{order.note}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Order Details */}
        {order.details && order.details.length > 0 && (
          <div className="mb-4">
            <h5>{dict.orders?.labels?.order_details || 'Order Details'}</h5>
            <Table striped bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>{dict.orders?.columns?.dish || 'Dish'}</th>
                  <th className="text-center">{dict.orders?.columns?.portions || 'Portions'}</th>
                  <th>{dict.orders?.columns?.ingredients || 'Ingredients'}</th>
                  <th>{dict.orders?.columns?.note || 'Note'}</th>
                </tr>
              </thead>
              <tbody>
                {order.details.map((detail) => (
                  <tr key={detail.orderDetailId}>
                    <td>
                      <div>
                        <strong>{detail.dishName}</strong>
                        <div>
                          <small className="text-muted">{detail.dishId}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <Badge bg="primary">{detail.portions}</Badge>
                    </td>
                    <td>
                      {detail.ingredients && detail.ingredients.length > 0 ? (
                        <ul className="mb-0">
                          {detail.ingredients.map((ing) => (
                            <li key={ing.orderIngredientId}>
                              {ing.ingredientName} - {formatNumber(ing.quantity)}{' '}
                              {ing.unit}
                              {ing.standardPerPortion !== undefined && (
                                <span className="text-muted">
                                  {' '}
                                  ({formatNumber(ing.standardPerPortion)}/
                                  {dict.orders?.labels?.portion || 'portion'})
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted">{dict.orders?.labels?.no_ingredients_text || 'No ingredients'}</span>
                      )}
                    </td>
                    <td>{detail.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Supplementary Foods */}
        {order.supplementaries && order.supplementaries.length > 0 && (
          <div className="mb-4">
            <h5>{dict.orders?.labels?.supplementary_foods || 'Supplementary Foods'}</h5>
            <Table striped bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>{dict.orders?.columns?.ingredient || 'Ingredient'}</th>
                  <th className="text-center">{dict.orders?.columns?.portions || 'Portions'}</th>
                  <th className="text-end">{dict.orders?.columns?.quantity || 'Quantity'}</th>
                  <th>{dict.orders?.columns?.unit || 'Unit'}</th>
                  <th>{dict.orders?.columns?.note || 'Note'}</th>
                </tr>
              </thead>
              <tbody>
                {order.supplementaries.map((supp) => (
                  <tr key={supp.supplementaryId}>
                    <td>
                      <div>
                        <strong>{supp.ingredientName}</strong>
                        <div>
                          <small className="text-muted">
                            {supp.ingredientId}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <Badge bg="info">{supp.portions}</Badge>
                    </td>
                    <td className="text-end">
                      <strong>{formatNumber(supp.quantity)}</strong>
                    </td>
                    <td>{supp.unit}</td>
                    <td>{supp.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </CardBody>
    </Card>
  )
}


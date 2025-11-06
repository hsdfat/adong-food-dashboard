'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, Table, Alert, Badge, Spinner, Button, FormSelect, FormControl } from 'react-bootstrap'
import { useParams, useRouter } from 'next/navigation'
import { orderApi } from '@/services'
import { OrderDTO } from '@/models/order'
import useDictionary from '@/locales/dictionary-hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faList, faSave, faSearch } from '@fortawesome/free-solid-svg-icons'
import { supplierPriceApi } from '@/services/supplier-price.service'
import { SupplierPrice } from '@/models/supplier-price'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dict = useDictionary()
  const orderId = params?.id ? (params.id as string) : null

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [order, setOrder] = useState<OrderDTO | null>(null)

  // Ingredient summary + supplier prices
  const [summaryLoading, setSummaryLoading] = useState(false)
  type IngredientSummaryRow = { ingredientId: string; ingredientName: string; quantity: number; unit: string }
  const [ingredientSummary, setIngredientSummary] = useState<IngredientSummaryRow[]>([])
  const [pricesByIngredient, setPricesByIngredient] = useState<Record<string, SupplierPrice[]>>({})
  const [selectedSupplierByIngredient, setSelectedSupplierByIngredient] = useState<Record<string, number | ''>>({})
  const [filterByIngredient, setFilterByIngredient] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState('')

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
      // After order loads, also load ingredient summary
      await loadIngredientSummary(orderId as string)
    } catch (err: any) {
      setError(err.message || 'Failed to load order')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadIngredientSummary = async (id: string | number) => {
    try {
      setSummaryLoading(true)
      const res = await orderApi.getIngredientsSummary(id)

      // Support multiple response shapes:
      // 1) Array<{ ingredientId, ingredientName, unit, totalQuantity }>
      // 2) { ingredients: [...] }
      // 3) { data: [...] } or { data: { ingredients: [...] } }
      const unwrap = (val: any) => (val?.data !== undefined ? val.data : val)
      const raw = unwrap(res)

      let items: any[] = []
      if (Array.isArray(raw)) {
        items = raw
      } else if (Array.isArray(raw?.ingredients)) {
        items = raw.ingredients
      } else if (Array.isArray(raw?.data)) {
        items = raw.data
      }

      const normalized = items.map((ing: any) => ({
        ingredientId: ing.ingredientId,
        ingredientName: ing.ingredientName,
        quantity: ing.totalQuantity ?? ing.quantity ?? 0,
        unit: ing.unit,
      }))
      setIngredientSummary(normalized)

      // Preload supplier prices for each ingredient in parallel
      const uniqueIds = Array.from(new Set(normalized.map((i: any) => i.ingredientId)))
      const priceResults = await Promise.all(
        uniqueIds.map(async (ingId) => {
          try {
            const response = await supplierPriceApi.getByIngredient(ingId)
            // Handle response that might be wrapped in data property or be a direct array
            // API might return: { data: [...] } or directly [...]
            let prices: any = response
            if (response && typeof response === 'object' && 'data' in response) {
              prices = response.data
            }
            // Ensure it's an array
            const priceArray = Array.isArray(prices) ? prices : []
            // Filter for active prices if the API returns all prices
            // Only filter if active field exists, otherwise include all
            const activePrices = priceArray.filter((p: SupplierPrice) => {
              if (p.active === undefined || p.active === null) return true
              return p.active !== false
            })
            console.log(`Loaded ${activePrices.length} supplier prices for ingredient ${ingId}`)
            return [ingId, activePrices] as [string, SupplierPrice[]]
          } catch (e) {
            console.error('Failed to load prices for', ingId, e)
            return [ingId, []] as [string, SupplierPrice[]]
          }
        }),
      )
      const map: Record<string, SupplierPrice[]> = {}
      priceResults.forEach(([ingId, prices]) => {
        map[ingId] = prices
      })
      setPricesByIngredient(map)
      // Load any saved selections from localStorage
      try {
        const key = `order_supplier_selection_${id}`
        const saved = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed && typeof parsed === 'object') {
            setSelectedSupplierByIngredient(parsed)
          }
        }
      } catch (e) {
        // ignore localStorage errors
      }
    } finally {
      setSummaryLoading(false)
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

  const handleSelectSupplier = (ingredientId: string, productIdStr: string) => {
    const productId = productIdStr ? parseInt(productIdStr, 10) : ''
    setSelectedSupplierByIngredient((prev: Record<string, number | ''>) => ({ ...prev, [ingredientId]: productId }))
  }

  const handleFilterChange = (ingredientId: string, value: string) => {
    setFilterByIngredient((prev) => ({ ...prev, [ingredientId]: value }))
  }

  const handleSaveSelections = async () => {
    if (!orderId) return
    try {
      setSaving(true)
      setSaveSuccess('')
      const key = `order_supplier_selection_${orderId}`
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(selectedSupplierByIngredient))
      }
      setSaveSuccess('Selections saved')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveSuccess(''), 2000)
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
        {saveSuccess && (
          <Alert variant="success" className="mb-3" onClose={() => setSaveSuccess('')} dismissible>
            {saveSuccess}
          </Alert>
        )}
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

        {/* Ingredient Summary with Supplier Selection */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">{dict.orders?.ingredient_summary || 'Ingredient Summary'}</h5>
            <Button variant="success" size="sm" onClick={handleSaveSelections} disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Save selections
                </>
              )}
            </Button>
          </div>
          {summaryLoading ? (
            <div className="py-3 text-center">
              <Spinner animation="border" className="me-2" />
              {dict.orders?.loading || 'Loading...'}
            </div>
          ) : ingredientSummary.length === 0 ? (
            <Alert variant="info">{dict.orders?.no_ingredients || 'No ingredients found for this order'}</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>{dict.orders?.columns?.ingredient_id || 'Ingredient ID'}</th>
                  <th>{dict.orders?.columns?.ingredient_name || 'Ingredient Name'}</th>
                  <th className="text-end">{dict.orders?.columns?.quantity || 'Quantity'}</th>
                  <th>{dict.orders?.columns?.unit || 'Unit'}</th>
                  <th style={{ minWidth: '300px' }}>{dict.orders?.columns?.supplier || 'Supplier'}</th>
                  <th className="text-end" style={{ width: '140px' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {ingredientSummary.map((ing: IngredientSummaryRow) => {
                  const prices = pricesByIngredient[ing.ingredientId] || []
                  const selected = selectedSupplierByIngredient[ing.ingredientId] ?? ''
                  const filter = (filterByIngredient[ing.ingredientId] || '').toLowerCase()
                  const filteredPrices = filter
                    ? prices.filter((p: SupplierPrice) =>
                        (p.supplierName || '').toLowerCase().includes(filter) ||
                        (p.productName || '').toLowerCase().includes(filter),
                      )
                    : prices
                  const selectedPrice = prices.find((p: SupplierPrice) => p.productId === selected)
                  return (
                    <tr key={ing.ingredientId}>
                      <td>
                        <Badge bg="secondary">{ing.ingredientId}</Badge>
                      </td>
                      <td><strong>{ing.ingredientName}</strong></td>
                      <td className="text-end"><strong>{formatNumber(ing.quantity)}</strong></td>
                      <td>{ing.unit}</td>
                      <td>
                        <div className="mb-1">
                          <div className="input-group input-group-sm">
                            <span className="input-group-text">
                              <FontAwesomeIcon icon={faSearch} />
                            </span>
                            <FormControl
                              size="sm"
                              placeholder="Search supplier..."
                              value={filterByIngredient[ing.ingredientId] || ''}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleFilterChange(ing.ingredientId, e.target.value)
                              }
                              disabled={prices.length === 0}
                            />
                          </div>
                        </div>
                        <FormSelect
                          size="sm"
                          value={selected}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectSupplier(ing.ingredientId, e.target.value)}
                          disabled={prices.length === 0}
                        >
                          <option value="">
                            {prices.length === 0 ? (dict.orders?.labels?.no_supplier_price || 'No active supplier price') : (dict.orders?.labels?.select || 'Select...')}
                          </option>
                          {filteredPrices.map((p: SupplierPrice) => (
                            <option key={p.productId} value={p.productId}>
                              {p.supplierName} - {formatNumber(p.pricePer1)} / {p.unit || ing.unit}
                            </option>
                          ))}
                        </FormSelect>
                      </td>
                      <td className="text-end">
                        {selectedPrice ? (
                          <strong>{formatNumber(selectedPrice.pricePer1)}</strong>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          )}
        </div>
      </CardBody>
    </Card>
  )
}


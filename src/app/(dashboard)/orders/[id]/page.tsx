'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, Table, Alert, Badge, Spinner, Button, FormSelect, FormControl, Modal, InputGroup } from 'react-bootstrap'
import { useParams, useRouter } from 'next/navigation'
import { orderApi } from '@/services'
import { OrderDTO } from '@/models/order'
import useDictionary from '@/locales/dictionary-hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faList, faSave, faSearch, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { supplierPriceApi } from '@/services/supplier-price.service'
import { SupplierPrice } from '@/models/supplier-price'
import StatusToast from '@/components/Common/StatusToast'

// Mock best supplier data - in real implementation this would come from an API
const mockBestSuppliers: Record<string, number> = {
  'ING022': 1001, // Best supplier for ingredient NL001 is productId 1001
  'NL002': 1002,
  'NL003': 1003,
  'NL004': 1004,
  'ING023': 1006,
  'ING024': 1007,
  'ING025': 1008,
  'ING026': 1009
}

// Mock supplier price data for testing
const generateMockSupplierPrices = (ingredientId: string): SupplierPrice[] => {
  const baseSuppliers = [
    { productId: 1001, supplierId: 'SUP001', supplierName: 'Fresh Foods Co', productName: 'Premium Tomatoes', price: 25000 },
    { productId: 1002, supplierId: 'SUP002', supplierName: 'Global Ingredients', productName: 'Organic Onions', price: 18000 },
    { productId: 1003, supplierId: 'SUP003', supplierName: 'Farm Direct', productName: 'Fresh Garlic', price: 35000 },
    { productId: 1004, supplierId: 'SUP004', supplierName: 'Wholesale Market', productName: 'Quality Potatoes', price: 12000 },
    { productId: 1005, supplierId: 'SUP005', supplierName: 'Organic Farms', productName: 'Fresh Carrots', price: 22000 },
    { productId: 1006, supplierId: 'SUP006', supplierName: 'Import Foods', productName: 'Bell Peppers', price: 28000 },
    { productId: 1007, supplierId: 'SUP007', supplierName: 'Local Growers', productName: 'Fresh Lettuce', price: 15000 },
    { productId: 1008, supplierId: 'SUP008', supplierName: 'Specialty Foods', productName: 'Fresh Herbs', price: 45000 },
    { productId: 1009, supplierId: 'SUP009', supplierName: 'Mega Suppliers', productName: 'Fresh Mushrooms', price: 32000 },
    { productId: 1010, supplierId: 'SUP010', supplierName: 'Quality Imports', productName: 'Fresh Spinach', price: 20000 },
  ]
  
  // Generate 2-3 alternative suppliers for each ingredient with slightly higher prices
  const bestSupplier = baseSuppliers.find(s => s.productId === mockBestSuppliers[ingredientId])
  const alternatives = baseSuppliers
    .filter(s => s.productId !== mockBestSuppliers[ingredientId])
    .slice(0, 2)
    .map(s => ({
      ...s,
      productId: parseInt(`${s.productId}${ingredientId.slice(-2)}`),
      price: s.price + Math.floor(Math.random() * 5000) + 1000, // Higher price for alternatives
    }))
  
  const mockPrices: SupplierPrice[] = []
  
  if (bestSupplier) {
    mockPrices.push({
      productId: bestSupplier.productId,
      productName: bestSupplier.productName,
      ingredientId: ingredientId,
      ingredientName: `Ingredient ${ingredientId}`,
      category: 'Vegetables',
      supplierId: bestSupplier.supplierId,
      supplierName: bestSupplier.supplierName,
      manufacturer: 'Farm Fresh Inc',
      unit: 'kg',
      specification: 'Premium Quality',
      unitPrice: bestSupplier.price,
      pricePer1: bestSupplier.price,
      effectiveFrom: new Date().toISOString(),
      effectiveTo: null,
      active: true,
      newPrice: bestSupplier.price,
      promotion: 'Best Price',
    })
  }
  
  alternatives.forEach(alt => {
    mockPrices.push({
      productId: alt.productId,
      productName: alt.productName,
      ingredientId: ingredientId,
      ingredientName: `Ingredient ${ingredientId}`,
      category: 'Vegetables',
      supplierId: alt.supplierId,
      supplierName: alt.supplierName,
      manufacturer: 'Alternative Supplier',
      unit: 'kg',
      specification: 'Standard Quality',
      unitPrice: alt.price,
      pricePer1: alt.price,
      effectiveFrom: new Date().toISOString(),
      effectiveTo: null,
      active: true,
      newPrice: alt.price,
      promotion: 'Regular Price',
    })
  })
  
  return mockPrices
}

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
  const [savingRow, setSavingRow] = useState<string>('')
  const [saveSuccess, setSaveSuccess] = useState('')
  const [saveError, setSaveError] = useState('')

  // Supplier selection modal (similar to OrderForm kitchen select)
  const [showSupplierModal, setShowSupplierModal] = useState(false)
  const [activeIngredientId, setActiveIngredientId] = useState<string>('')
  const [activeIngredientName, setActiveIngredientName] = useState<string>('')
  const [supplierSearch, setSupplierSearch] = useState<string>('')

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
            let priceArray = Array.isArray(prices) ? prices : []
            
            // If no prices from API, use mock data for testing
            if (priceArray.length === 0) {
              priceArray = generateMockSupplierPrices(ingId)
              console.log(`Using mock supplier prices for ingredient ${ingId}:`, priceArray.length, 'items')
            } else {
              console.log(`Using API supplier prices for ingredient ${ingId}:`, priceArray.length, 'items')
            }
            
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
            // Use mock data as fallback
            const mockPrices = generateMockSupplierPrices(ingId)
            console.log(`Using mock supplier prices as fallback for ingredient ${ingId}:`, mockPrices.length, 'items')
            return [ingId, mockPrices] as [string, SupplierPrice[]]
          }
        }),
      )
      const map: Record<string, SupplierPrice[]> = {}
      priceResults.forEach(([ingId, prices]) => {
        map[ingId] = prices
      })
      setPricesByIngredient(map)
      // Load any saved selections from localStorage
      let savedSelections: Record<string, number | ''> = {}
      try {
        const key = `order_supplier_selection_${id}`
        const saved = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed && typeof parsed === 'object') {
            savedSelections = parsed
          }
        }
      } catch (e) {
        // ignore localStorage errors
      }
      
      // Auto-fill best suppliers for ingredients without saved selections
      const autoFilledSelections = { ...savedSelections }
      let autoFilledCount = 0
      
      console.log('=== DEBUG: Auto-fill Best Suppliers ===')
      console.log('Saved selections:', savedSelections)
      console.log('Available ingredients:', normalized.map(ing => ing.ingredientId))
      console.log('Mock best suppliers:', mockBestSuppliers)
      
      normalized.forEach((ing) => {
        console.log(`Processing ingredient ${ing.ingredientId}:`)
        console.log(`  - Has saved selection: ${!!autoFilledSelections[ing.ingredientId]}`)
        console.log(`  - Best product ID: ${mockBestSuppliers[ing.ingredientId]}`)
        console.log(`  - Available prices: ${map[ing.ingredientId]?.length || 0} items`)
        
        if (!autoFilledSelections[ing.ingredientId]) {
          const bestProductId = mockBestSuppliers[ing.ingredientId]
          const prices = map[ing.ingredientId] || []
          
          if (bestProductId && prices.some(p => p.productId === bestProductId)) {
            autoFilledSelections[ing.ingredientId] = bestProductId
            autoFilledCount++
            console.log(`  ✓ Auto-filled with product ID: ${bestProductId}`)
          } else {
            console.log(`  ✗ Could not auto-fill (no best supplier or not found in prices)`)
          }
        } else {
          console.log(`  - Already has selection: ${autoFilledSelections[ing.ingredientId]}`)
        }
      })
      
      console.log(`Final selections:`, autoFilledSelections)
      console.log(`Auto-filled count: ${autoFilledCount}`)
      console.log('=== END DEBUG ===')
      
      setSelectedSupplierByIngredient(autoFilledSelections)
      
      if (autoFilledCount > 0) {
        console.log(`Auto-filled best suppliers for ${autoFilledCount} ingredients`)
      }
    } finally {
      setSummaryLoading(false)
    }
  }

  // Auto-fill best suppliers (function kept for manual use if needed)
  const handleAutoFillBestSuppliers = () => {
    const newSelections: Record<string, number | ''> = {}
    let autoFilledCount = 0
    
    ingredientSummary.forEach((ing) => {
      const bestProductId = mockBestSuppliers[ing.ingredientId]
      const prices = pricesByIngredient[ing.ingredientId] || []
      
      if (bestProductId && prices.some(p => p.productId === bestProductId)) {
        newSelections[ing.ingredientId] = bestProductId
        autoFilledCount++
      }
    })
    
    setSelectedSupplierByIngredient(prev => ({ ...prev, ...newSelections }))
    setSaveSuccess(`Auto-filled best suppliers for ${autoFilledCount} ingredients`)
    setTimeout(() => setSaveSuccess(''), 3000)
  }

  // Get best supplier for a specific ingredient
  const getBestSupplier = (ingredientId: string): SupplierPrice | null => {
    const bestProductId = mockBestSuppliers[ingredientId]
    const prices = pricesByIngredient[ingredientId] || []
    return prices.find(p => p.productId === bestProductId) || null
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

  const handleSaveSelectionsLocal = () => {
    if (!orderId) return
    const key = `order_supplier_selection_${orderId}`
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(selectedSupplierByIngredient))
    }
  }

  // Save one ingredient selection to backend
  const handleSaveRow = async (ingredientId: string) => {
    if (!orderId) return
    setSaveError('')
    try {
      const prices = pricesByIngredient[ingredientId] || []
      const selectedProductId = selectedSupplierByIngredient[ingredientId]
      
      if (!selectedProductId) {
        setSaveError('Please select a supplier for this ingredient first')
        return
      }
      
      const selectedPrice = prices.find((p) => p.productId === selectedProductId)
      if (!selectedPrice) {
        setSaveError('Selected supplier not found in price list')
        return
      }
      
      const row = ingredientSummary.find((r) => r.ingredientId === ingredientId)
      if (!row) {
        setSaveError('Ingredient not found in summary')
        return
      }
      
      setSavingRow(ingredientId)
      await orderApi.createSupplierRequests(orderId, {
        supplierId: selectedPrice.supplierId,
        ingredients: [
          {
            ingredientId: ingredientId,
            quantity: row.quantity,
            unit: row.unit,
            unitPrice: (selectedPrice.pricePer1 && selectedPrice.pricePer1 > 0 ? selectedPrice.pricePer1 : selectedPrice.unitPrice) || 0,
          },
        ],
      })
      
      handleSaveSelectionsLocal()
      setSaveSuccess('Saved supplier request for 1 ingredient')
    } catch (e: any) {
      console.error('Save failed:', e)
      setSaveError(e?.message || 'Failed to save supplier request')
    } finally {
      setSavingRow('')
      setSaving(false)
      setTimeout(() => {
        setSaveSuccess('')
        setSaveError('')
      }, 3000)
    }
  }

  // Save all selected suppliers grouped by supplierId
  const handleSaveAll = async () => {
    if (!orderId) return
    setSaveError('')
    try {
      setSaving(true)
      // Build map supplierId -> ingredients[]
      const grouped: Record<string, { ingredientId: string; quantity: number; unit: string; unitPrice: number }[]> = {}
      let validSelectionsCount = 0
      
      for (const ing of ingredientSummary) {
        const selectedProductId = selectedSupplierByIngredient[ing.ingredientId]
        if (!selectedProductId) {
          console.warn(`No supplier selected for ingredient ${ing.ingredientId}`)
          continue
        }
        
        const prices = pricesByIngredient[ing.ingredientId] || []
        const selectedPrice = prices.find((p) => p.productId === selectedProductId)
        if (!selectedPrice) {
          console.warn(`Selected supplier not found for ingredient ${ing.ingredientId}`)
          continue
        }
        
        const unitPrice = (selectedPrice.pricePer1 && selectedPrice.pricePer1 > 0 ? selectedPrice.pricePer1 : selectedPrice.unitPrice) || 0
        if (!grouped[selectedPrice.supplierId]) grouped[selectedPrice.supplierId] = []
        grouped[selectedPrice.supplierId].push({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          unit: ing.unit,
          unitPrice: unitPrice,
        })
        validSelectionsCount++
      }

      const supplierIds = Object.keys(grouped)
      if (supplierIds.length === 0 || validSelectionsCount === 0) {
        setSaveError('No valid supplier selections to save')
        return
      }

      // Send one request per supplier
      for (const sid of supplierIds) {
        await orderApi.createSupplierRequests(orderId, {
          supplierId: sid,
          ingredients: grouped[sid],
        })
      }

      handleSaveSelectionsLocal()
      setSaveSuccess(`Saved supplier requests for ${validSelectionsCount} ingredients`)
    } catch (e: any) {
      console.error('Save all failed:', e)
      setSaveError(e?.message || 'Failed to save supplier requests')
    } finally {
      setSaving(false)
      setTimeout(() => {
        setSaveSuccess('')
        setSaveError('')
      }, 3000)
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
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 2000, minWidth: 280 }}>
          {Boolean(saveSuccess) && (
            <Alert variant="success" dismissible onClose={() => setSaveSuccess('')}>
              {saveSuccess}
            </Alert>
          )}
          {Boolean(saveError) && (
            <Alert variant="danger" dismissible onClose={() => setSaveError('')}>
              {saveError}
            </Alert>
          )}
        </div>
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
            <div className="d-flex gap-2">
              <Button variant="success" size="sm" onClick={handleSaveAll} disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {dict.orders?.labels?.saving || 'Saving...'}
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    {dict.orders?.labels?.save_all_selected || 'Save all selected'}
                  </>
                )}
              </Button>
            </div>
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
                  <th style={{ minWidth: '360px' }}>{dict.orders?.columns?.supplier || 'Supplier'}</th>
                  <th className="text-end" style={{ width: '140px' }}>{dict.orders?.columns?.price || 'Price'}</th>
                  <th className="text-end" style={{ width: '160px' }}>{dict.orders?.columns?.total_price || 'Total Price'}</th>
                  <th style={{ width: '200px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ingredientSummary.map((ing: IngredientSummaryRow) => {
                  const prices = pricesByIngredient[ing.ingredientId] || []
                  const selected = selectedSupplierByIngredient[ing.ingredientId] ?? ''
                  const selectedPrice = prices.find((p: SupplierPrice) => p.productId === selected)
                  const bestSupplier = getBestSupplier(ing.ingredientId)
                  const unitPrice = selectedPrice ? ((selectedPrice.pricePer1 && selectedPrice.pricePer1 > 0) ? selectedPrice.pricePer1 : selectedPrice.unitPrice) : 0
                  const totalPrice = unitPrice * (ing.quantity || 0)
                  const isBestSelected = bestSupplier && selectedPrice && bestSupplier.productId === selectedPrice.productId
                  return (
                    <tr key={ing.ingredientId}>
                      <td>
                        <Badge bg="secondary">{ing.ingredientId}</Badge>
                      </td>
                      <td><strong>{ing.ingredientName}</strong></td>
                      <td className="text-end"><strong>{formatNumber(ing.quantity)}</strong></td>
                      <td>{ing.unit}</td>
                      <td>
                        <InputGroup size="sm">
                          <FormControl
                            readOnly
                            placeholder={prices.length === 0 ? (dict.orders?.labels?.no_supplier_price || 'No active supplier price') : (dict.orders?.labels?.select || 'Select...')}
                            value={selectedPrice ? `${selectedPrice.supplierName} ${selectedPrice.productName ? '- ' + selectedPrice.productName : ''}` : ''}
                            className={isBestSelected ? 'border-success bg-success-subtle' : ''}
                          />
                          <Button
                            variant="outline-primary"
                            size="sm"
                            disabled={prices.length === 0}
                            onClick={() => {
                              setActiveIngredientId(ing.ingredientId)
                              setActiveIngredientName(ing.ingredientName)
                              setSupplierSearch('')
                              setShowSupplierModal(true)
                            }}
                            title={dict.orders?.labels?.select || 'Select'}
                          >
                            <FontAwesomeIcon icon={faSearch} />
                          </Button>
                          <Button
                            variant="success"
                            size="sm"
                            disabled={!selectedPrice || savingRow === ing.ingredientId}
                            onClick={() => handleSaveRow(ing.ingredientId)}
                            title={dict.common?.save || 'Save'}
                          >
                            {savingRow === ing.ingredientId ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              <FontAwesomeIcon icon={faSave} />
                            )}
                          </Button>
                        </InputGroup>
                        {isBestSelected && (
                          <div className="mt-1">
                            <Badge bg="success">Best Supplier</Badge>
                          </div>
                        )}
                      </td>
                      <td className="text-end">
                        {selectedPrice ? (
                          <strong>{formatNumber(unitPrice)}</strong>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="text-end">
                        {selectedPrice ? (
                          <strong>{formatNumber(totalPrice)}</strong>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => { }}
                            title="Actions"
                          >
                            <FontAwesomeIcon icon={faEllipsis} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          )}
        </div>

        {/* Modal: Select Supplier per Ingredient */}
        <Modal
          show={showSupplierModal}
          onHide={() => {
            setShowSupplierModal(false)
            setSupplierSearch('')
          }}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {dict.orders?.labels?.select || 'Select'} {dict.orders?.columns?.supplier || 'Supplier'}
              {activeIngredientName ? ` - ${activeIngredientName}` : ''}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <FormControl
                  type="text"
                  placeholder={dict.orders?.labels?.search || 'Search...'}
                  value={supplierSearch}
                  onChange={(e) => setSupplierSearch(e.target.value)}
                />
              </InputGroup>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {activeIngredientId ? (
                (() => {
                  const allPrices = pricesByIngredient[activeIngredientId] || []
                  const list = supplierSearch
                    ? allPrices.filter((p) =>
                      (p.supplierName || '').toLowerCase().includes(supplierSearch.toLowerCase()) ||
                      (p.productName || '').toLowerCase().includes(supplierSearch.toLowerCase()),
                    )
                    : allPrices
                  if (list.length === 0) {
                    return <Alert variant="info">{dict.orders?.labels?.no_supplier_price || 'No active supplier price'}</Alert>
                  }
                  const current = selectedSupplierByIngredient[activeIngredientId] ?? ''
                  const bestProductId = mockBestSuppliers[activeIngredientId]
                  return (
                    <div className="list-group">
                      {list.map((p) => {
                        const isBest = p.productId === bestProductId
                        return (
                          <button
                            key={p.productId}
                            type="button"
                            className={`list-group-item list-group-item-action ${
                              current === p.productId ? 'active' : ''
                            } ${isBest && current !== p.productId ? 'border-success' : ''}`}
                            onClick={() => {
                              handleSelectSupplier(activeIngredientId, String(p.productId))
                              setShowSupplierModal(false)
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <div className="fw-bold d-flex align-items-center gap-2">
                                  {p.supplierName}
                                  {isBest && (
                                    <Badge bg="success">Best</Badge>
                                  )}
                                </div>
                                <small className={current === p.productId ? 'text-white-50' : 'text-muted'}>
                                  {p.productName || '-'} • {p.unit || ''}
                                </small>
                              </div>
                              <Badge 
                                bg={
                                  current === p.productId 
                                    ? 'light' 
                                    : isBest 
                                      ? 'success' 
                                      : 'primary'
                                } 
                                text={current === p.productId ? 'dark' : 'white'}
                              >
                                {formatNumber((p.pricePer1 && p.pricePer1 > 0 ? p.pricePer1 : p.unitPrice) || 0)}
                              </Badge>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )
                })()
              ) : (
                <Alert variant="info">{dict.orders?.labels?.select || 'Select'} ingredient</Alert>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowSupplierModal(false)
                setSupplierSearch('')
              }}
            >
              {dict.orders?.labels?.close || 'Close'}
            </Button>
          </Modal.Footer>
        </Modal>
      </CardBody>
    </Card>
  )
}


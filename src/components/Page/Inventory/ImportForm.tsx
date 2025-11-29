'use client'

import React, { useState, useEffect } from 'react'
import {
  FormGroup,
  FormLabel,
  FormControl,
  Button,
  Table,
  Alert,
  Badge,
  Card,
  CardBody,
  CardHeader,
} from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { inventoryImportApi, kitchenApi, ingredientApi, supplierApi, orderApi, supplierPriceApi } from '@/services'
import { createImport, updateImport, getImportById } from '@/app/actions/inventory'
import {
  InventoryImport,
  CreateImportInput,
  UpdateImportInput,
  CreateImportDetailInput,
  Kitchen,
  Ingredient,
  Supplier,
  SupplierWithOrderFlag,
} from '@/models'
import useDictionary from '@/locales/dictionary-hook'
import MasterDataFormPage from '@/components/Common/MasterDataFormPage'
import SingleSelectionModal from '@/components/Common/SingleSelectionModal'
import MultiSelectionModal from '@/components/Common/MultiSelectionModal'
import { useLoadingOverlay } from '@/components/Common/LoadingOverlay'
import { generateId } from '@/utils/id-generator'

interface ImportFormProps {
  importId?: string;
  isEdit?: boolean;
}

// Supplier block interface
interface SupplierBlock {
  id: string;
  supplierId: string;
  supplierName: string;
  details: (CreateImportDetailInput & { tempId?: string })[];
}

export default function ImportForm({
  importId,
  isEdit = false,
}: ImportFormProps) {
  const router = useRouter()
  const dict = useDictionary()
  const { showLoading, hideLoading } = useLoadingOverlay()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(isEdit)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [importData, setImportData] = useState<InventoryImport | null>(null)

  // Form state
  const [currentImportId, setCurrentImportId] = useState(importId || '')
  const [kitchenId, setKitchenId] = useState('')
  const [kitchenName, setKitchenName] = useState('')
  const [importDate, setImportDate] = useState(
    new Date().toISOString().split('T')[0],
  )
  const [orderId, setOrderId] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [notes, setNotes] = useState('')
  const [supplierBlocks, setSupplierBlocks] = useState<SupplierBlock[]>([])

  // Modal states
  const [showKitchenModal, setShowKitchenModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showSupplierModal, setShowSupplierModal] = useState(false)
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null)
  const [availableKitchens, setAvailableKitchens] = useState<Kitchen[]>([])
  const [availableOrders, setAvailableOrders] = useState<any[]>([])
  const [availableSuppliers, setAvailableSuppliers] = useState<Supplier[]>([])
  const [suppliersWithOrderFlag, setSuppliersWithOrderFlag] = useState<SupplierWithOrderFlag[]>([])
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([])
  const [supplierIngredients, setSupplierIngredients] = useState<Ingredient[]>([])
  const [searchKitchen, setSearchKitchen] = useState('')
  const [searchOrder, setSearchOrder] = useState('')
  const [searchSupplier, setSearchSupplier] = useState('')
  const [searchIngredient, setSearchIngredient] = useState('')
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [loadingOrderData, setLoadingOrderData] = useState(false)
  const [loadingIngredients, setLoadingIngredients] = useState(false)

  // Auto-generate ID for new imports
  useEffect(() => {
    if (!isEdit && !importId && !currentImportId) {
      setCurrentImportId(generateId('IM'))
    } else if (importId) {
      setCurrentImportId(importId)
    }
  }, [isEdit, importId, currentImportId])

  // Load data for edit
  useEffect(() => {
    const loadData = async () => {
      if (isEdit && importId) {
        try {
          setLoadingData(true)
          const response = await getImportById(importId)
          const {data} = response
          setImportData(data)
          setKitchenId(data.kitchenId)
          setKitchenName(data.kitchen?.kitchenName || '')
          setImportDate(data.importDate.split('T')[0])
          setOrderId(data.orderId || '')
          setNotes(data.notes || '')

          if (data.importDetails) {
            // Group by supplier
            const grouped = new Map<string, (CreateImportDetailInput & { tempId?: string })[]>()

            data.importDetails.forEach((detail) => {
              const suppId = detail.supplierId || 'no-supplier'
              if (!grouped.has(suppId)) {
                grouped.set(suppId, [])
              }
              grouped.get(suppId)!.push({
                ingredientId: detail.ingredientId,
                supplierId: detail.supplierId,
                quantity: detail.quantity,
                unit: detail.unit,
                unitPrice: detail.unitPrice,
                expiryDate: detail.expiryDate?.split('T')[0],
                batchNumber: detail.batchNumber,
                notes: detail.notes,
                tempId: `edit-${detail.importDetailId}`,
              })
            })

            const blocks: SupplierBlock[] = []
            grouped.forEach((details, suppId) => {
              const supplier = suppId === 'no-supplier'
                ? null
                : data.importDetails?.find(d => d.supplierId === suppId)?.supplier

              blocks.push({
                id: `block-${Date.now()}-${Math.random()}`,
                supplierId: suppId === 'no-supplier' ? '' : suppId,
                supplierName: supplier?.supplierName || 'No Supplier',
                details,
              })
            })

            setSupplierBlocks(blocks)
          }
        } catch (err) {
          setError('Failed to load import data')
          console.error(err)
        } finally {
          setLoadingData(false)
        }
      }
    }

    loadData()
  }, [isEdit, importId])

  // Load available options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [kitchensRes, suppliersRes, ingredientsRes] = await Promise.all([
          kitchenApi.getAll(),
          supplierApi.getAll(),
          ingredientApi.getAll(),
        ])
        setAvailableKitchens(kitchensRes.data || [])
        setAvailableSuppliers(suppliersRes.data || [])
        setAvailableIngredients(ingredientsRes.data || [])
      } catch (err) {
        console.error('Failed to load options:', err)
      }
    }

    loadOptions()
  }, [])

  // Load orders when kitchen is selected
  useEffect(() => {
    const loadOrders = async () => {
      if (kitchenId) {
        try {
          const ordersRes = await orderApi.getAll({ kitchen_id: kitchenId, per_page: 100 })
          setAvailableOrders(ordersRes.data || [])
        } catch (err) {
          console.error('Failed to load orders:', err)
        }
      }
    }

    loadOrders()
  }, [kitchenId])

  // Handle order selection and load supplier data
  const handleOrderSelect = async (selectedOrderId: string) => {
    if (!selectedOrderId) return

    setLoadingOrderData(true)
    try {
      const [orderSuppliers, suppliersHighlight] = await Promise.all([
        orderApi.getSuppliersForInventory(selectedOrderId),
        orderApi.getSuppliersWithHighlight(selectedOrderId),
      ])

      setOrderId(selectedOrderId)
      setOrderDate(orderSuppliers.orderDate)
      setSuppliersWithOrderFlag(suppliersHighlight.suppliers)

      // Group ingredients by supplier
      if (orderSuppliers.suppliers && orderSuppliers.suppliers.length > 0) {
        const grouped = new Map<string, typeof orderSuppliers.suppliers>()

        orderSuppliers.suppliers.forEach((item) => {
          const suppId = item.supplierId || 'no-supplier'
          if (!grouped.has(suppId)) {
            grouped.set(suppId, [])
          }
          grouped.get(suppId)!.push(item)
        })

        const blocks: SupplierBlock[] = []
        grouped.forEach((items, suppId) => {
          const firstItem = items[0]
          blocks.push({
            id: `block-${Date.now()}-${Math.random()}-${suppId}`,
            supplierId: suppId === 'no-supplier' ? '' : suppId,
            supplierName: firstItem.supplierName || 'No Supplier',
            details: items.map((item) => ({
              ingredientId: item.ingredientId,
              supplierId: suppId === 'no-supplier' ? undefined : suppId,
              quantity: item.quantity,
              unit: item.unit,
              unitPrice: item.unitPrice || 0,
              tempId: `order-${Date.now()}-${Math.random()}`,
            })),
          })
        })

        setSupplierBlocks(blocks)
        setSuccess(`Loaded ${orderSuppliers.suppliers.length} ingredients from ${blocks.length} supplier(s)`)
        setTimeout(() => setSuccess(''), 3000)
      }

      setShowOrderModal(false)
    } catch (err: any) {
      console.error('Failed to load order data:', err)
      setError(err.message || 'Failed to load order data')
    } finally {
      setLoadingOrderData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    showLoading()

    if (!kitchenId) {
      setError('Please select a kitchen')
      setLoading(false)
      hideLoading()
      return
    }

    // Flatten all supplier blocks into importDetails
    const allDetails = supplierBlocks.flatMap(block =>
      block.details.map(detail => ({
        ingredientId: detail.ingredientId,
        supplierId: detail.supplierId || undefined,
        quantity: detail.quantity,
        unit: detail.unit,
        unitPrice: detail.unitPrice,
        expiryDate: detail.expiryDate || undefined,
        batchNumber: detail.batchNumber || undefined,
        notes: detail.notes || undefined,
      }))
    )

    if (allDetails.length === 0) {
      setError('Please add at least one ingredient')
      setLoading(false)
      hideLoading()
      return
    }

    // Validate that all details have valid quantity and unit price
    const invalidDetails = allDetails.filter(d => d.quantity <= 0 || d.unitPrice <= 0)
    if (invalidDetails.length > 0) {
      setError('All ingredients must have valid quantity and unit price (greater than 0)')
      setLoading(false)
      hideLoading()
      return
    }

    try {
      const submitData: CreateImportInput | UpdateImportInput = {
        kitchenId,
        importDate,
        orderId: orderId || undefined,
        supplierId: undefined, // Not used when we have per-detail suppliers
        status: 'draft',
        notes: notes || undefined,
        importDetails: allDetails,
      }

      if (isEdit && importId) {
        await updateImport(importId, submitData)
        setSuccess('Import updated successfully')
      } else {
        await createImport(submitData)
        setSuccess('Import created successfully')
      }

      setTimeout(() => {
        router.push('/inventory/imports')
      }, 1500)
    } catch (err: any) {
      console.error('Submit error:', err)
      setError(err.message || 'Failed to save import')
      hideLoading()
    } finally {
      setLoading(false)
    }
  }

  // Add new supplier block
  const handleAddSupplierBlock = () => {
    setShowSupplierModal(true)
    setCurrentBlockId(null)
  }

  const handleSupplierSelect = async (supplierId: string, supplierName: string) => {
    const newBlock: SupplierBlock = {
      id: `block-${Date.now()}-${Math.random()}`,
      supplierId,
      supplierName,
      details: [],
    }
    setSupplierBlocks([...supplierBlocks, newBlock])
    setShowSupplierModal(false)
  }

  // Remove supplier block
  const handleRemoveSupplierBlock = (blockId: string) => {
    if (confirm('Remove this supplier and all its ingredients?')) {
      setSupplierBlocks(supplierBlocks.filter(b => b.id !== blockId))
    }
  }

  // Open ingredient modal for specific supplier block
  const handleOpenIngredientModal = async (blockId: string) => {
    setCurrentBlockId(blockId)
    const block = supplierBlocks.find(b => b.id === blockId)

    if (!block) return

    setShowIngredientModal(true)

    if (block.supplierId) {
      setLoadingIngredients(true)
      try {
        const response = await supplierPriceApi.getBySupplier(block.supplierId, { per_page: 100 })
        const uniqueIngredients = new Map<string, Ingredient>()
        response.data.forEach((price) => {
          if (price.ingredientId && !uniqueIngredients.has(price.ingredientId)) {
            uniqueIngredients.set(price.ingredientId, {
              ingredientId: price.ingredientId,
              ingredientName: price.ingredientName,
              unit: price.unit,
              property: '',
              materialGroup: '',
              createdDate: '',
              modifiedDate: '',
            })
          }
        })
        setSupplierIngredients(Array.from(uniqueIngredients.values()))
      } catch (err: any) {
        console.error('Failed to load supplier ingredients:', err)
        setSupplierIngredients(availableIngredients)
      } finally {
        setLoadingIngredients(false)
      }
    } else {
      setSupplierIngredients(availableIngredients)
    }
  }

  const handleAddIngredients = () => {
    if (!currentBlockId) return

    const block = supplierBlocks.find(b => b.id === currentBlockId)
    if (!block) return

    const ingredientSource = block.supplierId ? supplierIngredients : availableIngredients

    const newDetails = selectedIngredients
      .filter((id) => !block.details.some((d) => d.ingredientId === id))
      .map((id) => {
        const ingredient = ingredientSource.find((i) => i.ingredientId === id)
        return {
          ingredientId: id,
          supplierId: block.supplierId || undefined,
          quantity: 0,
          unit: ingredient?.unit || '',
          unitPrice: 0,
          tempId: `temp-${Date.now()}-${Math.random()}`,
        }
      })

    const updatedBlocks = supplierBlocks.map(b =>
      b.id === currentBlockId
        ? { ...b, details: [...b.details, ...newDetails] }
        : b
    )

    setSupplierBlocks(updatedBlocks)
    setSelectedIngredients([])
    setShowIngredientModal(false)
    setCurrentBlockId(null)
  }

  const handleRemoveDetail = (blockId: string, index: number) => {
    const updatedBlocks = supplierBlocks.map(b =>
      b.id === blockId
        ? { ...b, details: b.details.filter((_, i) => i !== index) }
        : b
    )
    setSupplierBlocks(updatedBlocks)
  }

  const handleDetailChange = (
    blockId: string,
    index: number,
    field: keyof CreateImportDetailInput,
    value: any,
  ) => {
    const updatedBlocks = supplierBlocks.map(b => {
      if (b.id === blockId) {
        const updatedDetails = [...b.details]
        updatedDetails[index] = { ...updatedDetails[index], [field]: value }
        return { ...b, details: updatedDetails }
      }
      return b
    })
    setSupplierBlocks(updatedBlocks)
  }

  const calculateTotal = () =>
    supplierBlocks.reduce((total, block) =>
      total + block.details.reduce((sum, detail) =>
        sum + detail.quantity * detail.unitPrice, 0
      ), 0
    )

  const calculateBlockTotal = (block: SupplierBlock) =>
    block.details.reduce((sum, detail) => sum + detail.quantity * detail.unitPrice, 0)

  if (loadingData) {
    return <div>Loading...</div>
  }

  return (
    <>
      <MasterDataFormPage
        title={
          isEdit
            ? dict.inventory?.edit_import || 'Edit Import'
            : dict.inventory?.add_import || 'Add New Import'
        }
        onSubmit={handleSubmit}
        cancelPath="/inventory/imports"
        loading={loading}
        error={error}
        success={success}
        submitLabel={dict.action?.save || 'Save'}
        cancelLabel={dict.action?.cancel || 'Cancel'}
      >
        <FormGroup className="mb-3">
          <FormLabel>{dict.inventory?.kitchen || 'Kitchen'} *</FormLabel>
          <div className="d-flex gap-2">
            <FormControl
              type="text"
              value={kitchenName || 'Select kitchen...'}
              readOnly
              placeholder="Select kitchen"
            />
            <Button
              variant="outline-primary"
              onClick={() => setShowKitchenModal(true)}
            >
              {(dict.action as any)?.select || 'Select'}
            </Button>
          </div>
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>Order</FormLabel>
          <div className="d-flex gap-2">
            <FormControl
              type="text"
              value={orderId ? `${orderId} ${orderDate ? `(${orderDate})` : ''}` : ''}
              readOnly
              placeholder="Select order (optional)"
            />
            <Button
              variant="outline-primary"
              onClick={() => setShowOrderModal(true)}
              disabled={!kitchenId || loadingOrderData}
            >
              {loadingOrderData ? 'Loading...' : (dict.action as any)?.select || 'Select'}
            </Button>
            {orderId && (
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setOrderId('')
                  setOrderDate('')
                  setSupplierBlocks([])
                }}
              >
                Clear
              </Button>
            )}
          </div>
          {!kitchenId && (
            <small className="text-muted">Please select a kitchen first to choose an order</small>
          )}
          {orderId && (
            <small className="text-success d-block mt-1">
              Order selected. Ingredients grouped by supplier automatically.
            </small>
          )}
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.inventory?.import_date || 'Import Date'} *</FormLabel>
          <FormControl
            type="date"
            value={importDate}
            onChange={(e) => setImportDate(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.inventory?.notes || 'Notes'}</FormLabel>
          <FormControl
            as="textarea"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes (optional)"
          />
        </FormGroup>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <FormLabel className="mb-0">
              {dict.inventory?.import_details || 'Import Details'} *
            </FormLabel>
            <Button
              variant="success"
              size="sm"
              onClick={handleAddSupplierBlock}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add Supplier
            </Button>
          </div>

          {supplierBlocks.length === 0 ? (
            <Alert variant="info">
              No suppliers added. Click &quot;Add Supplier&quot; to start adding ingredients.
            </Alert>
          ) : (
            <>
              {supplierBlocks.map((block, blockIndex) => (
                <Card key={block.id} className="mb-3">
                  <CardHeader className="d-flex justify-content-between align-items-center bg-light">
                    <div>
                      <h6 className="mb-0">
                        <Badge bg="primary" className="me-2">Supplier {blockIndex + 1}</Badge>
                        {block.supplierName}
                      </h6>
                      <small className="text-muted">
                        {block.details.length} ingredient(s) • Total: {new Intl.NumberFormat('vi-VN').format(calculateBlockTotal(block))}
                      </small>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenIngredientModal(block.id)}
                      >
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        Add Ingredients
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveSupplierBlock(block.id)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody>
                    {block.details.length === 0 ? (
                      <Alert variant="secondary" className="mb-0">
                        No ingredients added for this supplier yet.
                      </Alert>
                    ) : (
                      <Table responsive bordered size="sm">
                        <thead>
                          <tr>
                            <th>{dict.inventory?.ingredient || 'Ingredient'}</th>
                            <th>{dict.inventory?.quantity || 'Quantity'}</th>
                            <th>{dict.inventory?.unit || 'Unit'}</th>
                            <th>{dict.inventory?.unit_price || 'Unit Price'}</th>
                            <th>{dict.inventory?.total_price || 'Total'}</th>
                            <th>{dict.inventory?.expiry_date || 'Expiry'}</th>
                            <th>{dict.inventory?.batch_number || 'Batch'}</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {block.details.map((detail, index) => {
                            const ingredient = availableIngredients.find(
                              (i) => i.ingredientId === detail.ingredientId,
                            )
                            const totalPrice = detail.quantity * detail.unitPrice

                            return (
                              <tr key={detail.tempId || index}>
                                <td>
                                  {ingredient?.ingredientName || detail.ingredientId}
                                </td>
                                <td>
                                  <FormControl
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={detail.quantity}
                                    onChange={(e) =>
                                      handleDetailChange(
                                        block.id,
                                        index,
                                        'quantity',
                                        parseFloat(e.target.value) || 0,
                                      )
                                    }
                                    size="sm"
                                    required
                                  />
                                </td>
                                <td>
                                  <FormControl
                                    type="text"
                                    value={detail.unit}
                                    onChange={(e) =>
                                      handleDetailChange(block.id, index, 'unit', e.target.value)
                                    }
                                    size="sm"
                                    required
                                  />
                                </td>
                                <td>
                                  <FormControl
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={detail.unitPrice}
                                    onChange={(e) =>
                                      handleDetailChange(
                                        block.id,
                                        index,
                                        'unitPrice',
                                        parseFloat(e.target.value) || 0,
                                      )
                                    }
                                    size="sm"
                                    required
                                  />
                                </td>
                                <td>
                                  <strong>{new Intl.NumberFormat('vi-VN').format(totalPrice)}</strong>
                                </td>
                                <td>
                                  <FormControl
                                    type="date"
                                    value={detail.expiryDate || ''}
                                    onChange={(e) =>
                                      handleDetailChange(block.id, index, 'expiryDate', e.target.value)
                                    }
                                    size="sm"
                                  />
                                </td>
                                <td>
                                  <FormControl
                                    type="text"
                                    value={detail.batchNumber || ''}
                                    onChange={(e) =>
                                      handleDetailChange(block.id, index, 'batchNumber', e.target.value)
                                    }
                                    size="sm"
                                    placeholder="Batch"
                                  />
                                </td>
                                <td>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleRemoveDetail(block.id, index)}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </Table>
                    )}
                  </CardBody>
                </Card>
              ))}

              <Card className="bg-light">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Grand Total</h5>
                    <h4 className="mb-0 text-primary">
                      {new Intl.NumberFormat('vi-VN').format(calculateTotal())}
                    </h4>
                  </div>
                </CardBody>
              </Card>
            </>
          )}
        </div>
      </MasterDataFormPage>

      {/* Order Selection Modal */}
      <SingleSelectionModal
        show={showOrderModal}
        onHide={() => {
          setShowOrderModal(false)
          setSearchOrder('')
        }}
        title="Select Order"
        items={availableOrders
          .filter((o) =>
            o.orderId.toLowerCase().includes(searchOrder.toLowerCase()) ||
            (o.note && o.note.toLowerCase().includes(searchOrder.toLowerCase()))
          )
          .map((o) => ({
            id: o.orderId,
            name: `Order ${o.orderId}`,
            subtitle: `${o.orderDate} - ${o.status}${o.note ? ` - ${o.note}` : ''}`,
            badge: o.status,
          }))}
        searchValue={searchOrder}
        onSearchChange={setSearchOrder}
        selectedId={orderId}
        onSelect={(item) => handleOrderSelect(item.id)}
        searchPlaceholder="Search orders..."
        emptyMessage={kitchenId ? 'No order found' : 'Please select a kitchen first'}
      />

      {/* Kitchen Selection Modal */}
      <SingleSelectionModal
        show={showKitchenModal}
        onHide={() => {
          setShowKitchenModal(false)
          setSearchKitchen('')
        }}
        title={dict.inventory?.select_kitchen || 'Select Kitchen'}
        items={availableKitchens
          .filter((k) =>
            k.kitchenName.toLowerCase().includes(searchKitchen.toLowerCase()),
          )
          .map((k) => ({
            id: k.kitchenId,
            name: k.kitchenName,
            subtitle: k.address,
            badge: k.kitchenId,
          }))}
        searchValue={searchKitchen}
        onSearchChange={setSearchKitchen}
        selectedId={kitchenId}
        onSelect={(item) => {
          setKitchenId(item.id)
          const kitchen = availableKitchens.find((k) => k.kitchenId === item.id)
          setKitchenName(kitchen?.kitchenName || '')
          setShowKitchenModal(false)
        }}
        searchPlaceholder={dict.inventory?.search_kitchen || 'Search kitchens...'}
        emptyMessage={dict.inventory?.no_kitchen || 'No kitchen found'}
      />

      {/* Supplier Selection Modal */}
      <SingleSelectionModal
        show={showSupplierModal}
        onHide={() => {
          setShowSupplierModal(false)
          setSearchSupplier('')
        }}
        title="Select Supplier to Add"
        items={(orderId && suppliersWithOrderFlag.length > 0
          ? suppliersWithOrderFlag
          : availableSuppliers.map(s => ({
              supplierId: s.supplierId,
              supplierName: s.supplierName,
              address: s.address,
              phone: s.phone,
              email: s.email,
              active: s.active,
              isUsedInOrder: false,
              ingredientCount: 0,
            }))
        )
          .filter((s) =>
            s.supplierName.toLowerCase().includes(searchSupplier.toLowerCase()),
          )
          .filter((s) => !supplierBlocks.some(b => b.supplierId === s.supplierId))
          .map((s) => ({
            id: s.supplierId,
            name: s.supplierName,
            subtitle: `${s.address || ''}${s.isUsedInOrder ? ` • ${s.ingredientCount} ingredient(s) in order` : ''}`,
            badge: s.isUsedInOrder ? '✓ In Order' : s.supplierId,
            variant: s.isUsedInOrder ? 'success' : undefined,
          }))}
        searchValue={searchSupplier}
        onSearchChange={setSearchSupplier}
        selectedId=""
        onSelect={(item) => {
          const supplier = orderId && suppliersWithOrderFlag.length > 0
            ? suppliersWithOrderFlag.find((s) => s.supplierId === item.id)
            : availableSuppliers.find((s) => s.supplierId === item.id)
          handleSupplierSelect(item.id, supplier?.supplierName || item.name)
        }}
        searchPlaceholder="Search suppliers..."
        emptyMessage="No available suppliers to add"
      />

      {/* Ingredient Selection Modal */}
      <MultiSelectionModal
        show={showIngredientModal}
        onHide={() => {
          setShowIngredientModal(false)
          setSearchIngredient('')
          setSelectedIngredients([])
          setCurrentBlockId(null)
        }}
        title={
          currentBlockId
            ? `Select Ingredients for ${supplierBlocks.find(b => b.id === currentBlockId)?.supplierName}`
            : 'Select Ingredients'
        }
        items={loadingIngredients
          ? []
          : (currentBlockId && supplierBlocks.find(b => b.id === currentBlockId)?.supplierId
              ? supplierIngredients
              : availableIngredients)
              .filter((i) =>
                i.ingredientName.toLowerCase().includes(searchIngredient.toLowerCase()),
              )
              .map((i) => ({
                id: i.ingredientId,
                name: i.ingredientName,
                subtitle: i.unit,
                badge: i.ingredientId,
              }))}
        searchValue={searchIngredient}
        onSearchChange={setSearchIngredient}
        selectedIds={selectedIngredients}
        onSelect={(id, checked) => {
          if (checked) {
            setSelectedIngredients([...selectedIngredients, id])
          } else {
            setSelectedIngredients(selectedIngredients.filter((i) => i !== id))
          }
        }}
        onConfirm={handleAddIngredients}
        searchPlaceholder={dict.inventory?.search_ingredient || 'Search ingredients...'}
        emptyMessage={
          loadingIngredients
            ? 'Loading ingredients...'
            : 'No ingredients available'
        }
        confirmLabel={`${dict.action?.add || 'Add'} ${selectedIngredients.length} ${dict.inventory?.ingredients || 'Ingredients'}`}
        selectedCountLabel={`${dict.common?.selected || 'Selected'} ${selectedIngredients.length}`}
      />
    </>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
  Table,
  Alert,
  Badge,
} from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { inventoryImportApi, kitchenApi, ingredientApi, supplierApi } from '@/services'
import {
  InventoryImport,
  CreateImportInput,
  UpdateImportInput,
  CreateImportDetailInput,
  Kitchen,
  Ingredient,
  Supplier,
} from '@/models'
import useDictionary from '@/locales/dictionary-hook'
import MasterDataFormPage from '@/components/Common/MasterDataFormPage'
import SingleSelectionModal from '@/components/Common/SingleSelectionModal'
import MultiSelectionModal from '@/components/Common/MultiSelectionModal'

interface ImportFormProps {
  importId?: string;
  isEdit?: boolean;
}

export default function ImportForm({
  importId,
  isEdit = false,
}: ImportFormProps) {
  const router = useRouter()
  const dict = useDictionary()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(isEdit)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [importData, setImportData] = useState<InventoryImport | null>(null)

  // Form state
  const [kitchenId, setKitchenId] = useState('')
  const [kitchenName, setKitchenName] = useState('')
  const [importDate, setImportDate] = useState(
    new Date().toISOString().split('T')[0],
  )
  const [orderId, setOrderId] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [notes, setNotes] = useState('')
  const [importDetails, setImportDetails] = useState<
    (CreateImportDetailInput & { tempId?: string })[]
  >([])

  // Modal states
  const [showKitchenModal, setShowKitchenModal] = useState(false)
  const [showSupplierModal, setShowSupplierModal] = useState(false)
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [availableKitchens, setAvailableKitchens] = useState<Kitchen[]>([])
  const [availableSuppliers, setAvailableSuppliers] = useState<Supplier[]>([])
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([])
  const [searchKitchen, setSearchKitchen] = useState('')
  const [searchSupplier, setSearchSupplier] = useState('')
  const [searchIngredient, setSearchIngredient] = useState('')
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])

  // Load data for edit
  useEffect(() => {
    const loadData = async () => {
      if (isEdit && importId) {
        try {
          setLoadingData(true)
          const response = await inventoryImportApi.getById(importId)
          const {data} = response
          setImportData(data)
          setKitchenId(data.kitchenId)
          setKitchenName(data.kitchen?.kitchenName || '')
          setImportDate(data.importDate.split('T')[0])
          setOrderId(data.orderId || '')
          setSupplierId(data.supplierId || '')
          setSupplierName(data.supplier?.supplierName || '')
          setNotes(data.notes || '')
          if (data.importDetails) {
            setImportDetails(
              data.importDetails.map((detail) => ({
                ingredientId: detail.ingredientId,
                quantity: detail.quantity,
                unit: detail.unit,
                unitPrice: detail.unitPrice,
                expiryDate: detail.expiryDate?.split('T')[0],
                batchNumber: detail.batchNumber,
                notes: detail.notes,
              })),
            )
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!kitchenId) {
      setError('Please select a kitchen')
      setLoading(false)
      return
    }

    if (importDetails.length === 0) {
      setError('Please add at least one import detail')
      setLoading(false)
      return
    }

    try {
      const submitData: CreateImportInput | UpdateImportInput = {
        kitchenId,
        importDate,
        orderId: orderId || undefined,
        supplierId: supplierId || undefined,
        status: 'draft',
        notes: notes || undefined,
        importDetails: importDetails.map((detail) => ({
          ingredientId: detail.ingredientId,
          quantity: detail.quantity,
          unit: detail.unit,
          unitPrice: detail.unitPrice,
          expiryDate: detail.expiryDate,
          batchNumber: detail.batchNumber,
          notes: detail.notes,
        })),
      }

      if (isEdit && importId) {
        await inventoryImportApi.update(importId, submitData)
        setSuccess('Import updated successfully')
      } else {
        await inventoryImportApi.create(submitData)
        setSuccess('Import created successfully')
      }

      setTimeout(() => {
        router.push('/inventory/imports')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to save import')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddIngredients = () => {
    const newDetails = selectedIngredients
      .filter((id) => !importDetails.some((d) => d.ingredientId === id))
      .map((id) => {
        const ingredient = availableIngredients.find((i) => i.ingredientId === id)
        return {
          ingredientId: id,
          quantity: 0,
          unit: ingredient?.unit || '',
          unitPrice: 0,
          tempId: `temp-${Date.now()}-${Math.random()}`,
        }
      })

    setImportDetails([...importDetails, ...newDetails])
    setSelectedIngredients([])
    setShowIngredientModal(false)
  }

  const handleRemoveDetail = (index: number) => {
    setImportDetails(importDetails.filter((_, i) => i !== index))
  }

  const handleDetailChange = (
    index: number,
    field: keyof CreateImportDetailInput,
    value: any,
  ) => {
    const updated = [...importDetails]
    updated[index] = { ...updated[index], [field]: value }
    setImportDetails(updated)
  }

  const calculateTotal = () => importDetails.reduce(
      (sum, detail) => sum + detail.quantity * detail.unitPrice,
      0,
    )

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
          <FormLabel>{dict.inventory?.import_date || 'Import Date'} *</FormLabel>
          <FormControl
            type="date"
            value={importDate}
            onChange={(e) => setImportDate(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.inventory?.supplier || 'Supplier'}</FormLabel>
          <div className="d-flex gap-2">
            <FormControl
              type="text"
              value={supplierName || 'Select supplier...'}
              readOnly
              placeholder="Select supplier (optional)"
            />
            <Button
              variant="outline-primary"
              onClick={() => setShowSupplierModal(true)}
            >
              {(dict.action as any)?.select || 'Select'}
            </Button>
            {supplierId && (
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSupplierId('')
                  setSupplierName('')
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.inventory?.order_id || 'Order ID'}</FormLabel>
          <FormControl
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Order ID (optional)"
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
          <div className="d-flex justify-content-between align-items-center mb-2">
            <FormLabel className="mb-0">
              {dict.inventory?.import_details || 'Import Details'} *
            </FormLabel>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowIngredientModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              {dict.action?.add || 'Add'} {dict.inventory?.ingredient || 'Ingredient'}
            </Button>
          </div>

          {importDetails.length === 0 ? (
            <Alert variant="info">
              {dict.inventory?.no_details || 'No import details. Please add ingredients.'}
            </Alert>
          ) : (
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>{dict.inventory?.ingredient || 'Ingredient'}</th>
                  <th>{dict.inventory?.quantity || 'Quantity'}</th>
                  <th>{dict.inventory?.unit || 'Unit'}</th>
                  <th>{dict.inventory?.unit_price || 'Unit Price'}</th>
                  <th>{dict.inventory?.total_price || 'Total Price'}</th>
                  <th>{dict.inventory?.expiry_date || 'Expiry Date'}</th>
                  <th>{dict.inventory?.batch_number || 'Batch Number'}</th>
                  <th>{(dict.action as any)?.actions || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {importDetails.map((detail, index) => {
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
                              index,
                              'quantity',
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          required
                        />
                      </td>
                      <td>
                        <FormControl
                          type="text"
                          value={detail.unit}
                          onChange={(e) =>
                            handleDetailChange(index, 'unit', e.target.value)
                          }
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
                              index,
                              'unitPrice',
                              parseFloat(e.target.value) || 0,
                            )
                          }
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
                            handleDetailChange(index, 'expiryDate', e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <FormControl
                          type="text"
                          value={detail.batchNumber || ''}
                          onChange={(e) =>
                            handleDetailChange(index, 'batchNumber', e.target.value)
                          }
                          placeholder="Batch number"
                        />
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveDetail(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-end">
                    <strong>{dict.inventory?.total_amount || 'Total Amount'}:</strong>
                  </td>
                  <td>
                    <strong>
                      {new Intl.NumberFormat('vi-VN').format(calculateTotal())}
                    </strong>
                  </td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </Table>
          )}
        </div>
      </MasterDataFormPage>

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
        title={dict.inventory?.select_supplier || 'Select Supplier'}
        items={availableSuppliers
          .filter((s) =>
            s.supplierName.toLowerCase().includes(searchSupplier.toLowerCase()),
          )
          .map((s) => ({
            id: s.supplierId,
            name: s.supplierName,
            subtitle: s.address,
            badge: s.supplierId,
          }))}
        searchValue={searchSupplier}
        onSearchChange={setSearchSupplier}
        selectedId={supplierId}
        onSelect={(item) => {
          setSupplierId(item.id)
          const supplier = availableSuppliers.find((s) => s.supplierId === item.id)
          setSupplierName(supplier?.supplierName || '')
          setShowSupplierModal(false)
        }}
        searchPlaceholder={dict.inventory?.search_supplier || 'Search suppliers...'}
        emptyMessage={dict.inventory?.no_supplier || 'No supplier found'}
      />

      {/* Ingredient Selection Modal */}
      <MultiSelectionModal
        show={showIngredientModal}
        onHide={() => {
          setShowIngredientModal(false)
          setSearchIngredient('')
          setSelectedIngredients([])
        }}
        title={dict.inventory?.select_ingredients || 'Select Ingredients'}
        items={availableIngredients
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
        emptyMessage={dict.inventory?.no_ingredient || 'No ingredient found'}
        confirmLabel={`${dict.action?.add || 'Add'} ${selectedIngredients.length} ${dict.inventory?.ingredients || 'Ingredients'}`}
        selectedCountLabel={`${dict.common?.selected || 'Selected'} ${selectedIngredients.length}`}
      />
    </>
  )
}


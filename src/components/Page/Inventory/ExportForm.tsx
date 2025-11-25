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
} from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import {
  inventoryExportApi,
  kitchenApi,
  ingredientApi,
} from '@/services'
import {
  InventoryExport,
  CreateExportInput,
  UpdateExportInput,
  CreateExportDetailInput,
  Kitchen,
  Ingredient,
} from '@/models'
import useDictionary from '@/locales/dictionary-hook'
import MasterDataFormPage from '@/components/Common/MasterDataFormPage'
import SingleSelectionModal from '@/components/Common/SingleSelectionModal'
import MultiSelectionModal from '@/components/Common/MultiSelectionModal'

interface ExportFormProps {
  exportId?: string;
  isEdit?: boolean;
}

export default function ExportForm({
  exportId,
  isEdit = false,
}: ExportFormProps) {
  const router = useRouter()
  const dict = useDictionary()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(isEdit)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [exportData, setExportData] = useState<InventoryExport | null>(null)

  // Form state
  const [kitchenId, setKitchenId] = useState('')
  const [kitchenName, setKitchenName] = useState('')
  const [exportDate, setExportDate] = useState(
    new Date().toISOString().split('T')[0],
  )
  const [exportType, setExportType] = useState<
    'production' | 'transfer' | 'disposal' | 'return' | 'sample'
  >('production')
  const [destinationKitchenId, setDestinationKitchenId] = useState('')
  const [destinationKitchenName, setDestinationKitchenName] = useState('')
  const [orderId, setOrderId] = useState('')
  const [notes, setNotes] = useState('')
  const [exportDetails, setExportDetails] = useState<
    (CreateExportDetailInput & { tempId?: string })[]
  >([])

  // Modal states
  const [showKitchenModal, setShowKitchenModal] = useState(false)
  const [showDestinationModal, setShowDestinationModal] = useState(false)
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [availableKitchens, setAvailableKitchens] = useState<Kitchen[]>([])
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([])
  const [searchKitchen, setSearchKitchen] = useState('')
  const [searchDestination, setSearchDestination] = useState('')
  const [searchIngredient, setSearchIngredient] = useState('')
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])

  // Load data for edit
  useEffect(() => {
    const loadData = async () => {
      if (isEdit && exportId) {
        try {
          setLoadingData(true)
          const response = await inventoryExportApi.getById(exportId)
          const {data} = response
          setExportData(data)
          setKitchenId(data.kitchenId)
          setKitchenName(data.kitchen?.kitchenName || '')
          setExportDate(data.exportDate.split('T')[0])
          setExportType(data.exportType)
          setDestinationKitchenId(data.destinationKitchenId || '')
          setDestinationKitchenName(data.destinationKitchen?.kitchenName || '')
          setOrderId(data.orderId || '')
          setNotes(data.notes || '')
          if (data.exportDetails) {
            setExportDetails(
              data.exportDetails.map((detail) => ({
                ingredientId: detail.ingredientId,
                quantity: detail.quantity,
                unit: detail.unit,
                unitCost: detail.unitCost,
                batchNumber: detail.batchNumber,
                notes: detail.notes,
              })),
            )
          }
        } catch (err) {
          setError('Failed to load export data')
          console.error(err)
        } finally {
          setLoadingData(false)
        }
      }
    }

    loadData()
  }, [isEdit, exportId])

  // Load available options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [kitchensRes, ingredientsRes] = await Promise.all([
          kitchenApi.getAll(),
          ingredientApi.getAll(),
        ])
        setAvailableKitchens(kitchensRes.data || [])
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

    if (exportType === 'transfer' && !destinationKitchenId) {
      setError('Please select a destination kitchen for transfer')
      setLoading(false)
      return
    }

    if (exportDetails.length === 0) {
      setError('Please add at least one export detail')
      setLoading(false)
      return
    }

    try {
      const submitData: CreateExportInput | UpdateExportInput = {
        kitchenId,
        exportDate,
        exportType,
        destinationKitchenId:
          exportType === 'transfer' ? destinationKitchenId : undefined,
        orderId: orderId || undefined,
        status: 'draft',
        notes: notes || undefined,
        exportDetails: exportDetails.map((detail) => ({
          ingredientId: detail.ingredientId,
          quantity: detail.quantity,
          unit: detail.unit,
          unitCost: detail.unitCost,
          batchNumber: detail.batchNumber,
          notes: detail.notes,
        })),
      }

      if (isEdit && exportId) {
        await inventoryExportApi.update(exportId, submitData)
        setSuccess('Export updated successfully')
      } else {
        await inventoryExportApi.create(submitData)
        setSuccess('Export created successfully')
      }

      setTimeout(() => {
        router.push('/inventory/exports')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to save export')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddIngredients = () => {
    const newDetails = selectedIngredients
      .filter((id) => !exportDetails.some((d) => d.ingredientId === id))
      .map((id) => {
        const ingredient = availableIngredients.find((i) => i.ingredientId === id)
        return {
          ingredientId: id,
          quantity: 0,
          unit: ingredient?.unit || '',
          unitCost: 0,
          tempId: `temp-${Date.now()}-${Math.random()}`,
        }
      })

    setExportDetails([...exportDetails, ...newDetails])
    setSelectedIngredients([])
    setShowIngredientModal(false)
  }

  const handleRemoveDetail = (index: number) => {
    setExportDetails(exportDetails.filter((_, i) => i !== index))
  }

  const handleDetailChange = (
    index: number,
    field: keyof CreateExportDetailInput,
    value: any,
  ) => {
    const updated = [...exportDetails]
    updated[index] = { ...updated[index], [field]: value }
    setExportDetails(updated)
  }

  const calculateTotal = () => exportDetails.reduce(
      (sum, detail) => sum + detail.quantity * (detail.unitCost || 0),
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
            ? dict.inventory?.edit_export || 'Edit Export'
            : dict.inventory?.add_export || 'Add New Export'
        }
        onSubmit={handleSubmit}
        cancelPath="/inventory/exports"
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
          <FormLabel>{dict.inventory?.export_date || 'Export Date'} *</FormLabel>
          <FormControl
            type="date"
            value={exportDate}
            onChange={(e) => setExportDate(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.inventory?.export_type || 'Export Type'} *</FormLabel>
          <FormControl
            as="select"
            value={exportType}
            onChange={(e) =>
              setExportType(
                e.target.value as
                  | 'production'
                  | 'transfer'
                  | 'disposal'
                  | 'return'
                  | 'sample',
              )
            }
            required
          >
            <option value="production">
              {dict.inventory?.type_production || 'Production'}
            </option>
            <option value="transfer">
              {dict.inventory?.type_transfer || 'Transfer'}
            </option>
            <option value="disposal">
              {dict.inventory?.type_disposal || 'Disposal'}
            </option>
            <option value="return">
              {dict.inventory?.type_return || 'Return'}
            </option>
            <option value="sample">
              {dict.inventory?.type_sample || 'Sample'}
            </option>
          </FormControl>
        </FormGroup>

        {exportType === 'transfer' && (
          <FormGroup className="mb-3">
            <FormLabel>
              {dict.inventory?.destination_kitchen || 'Destination Kitchen'} *
            </FormLabel>
            <div className="d-flex gap-2">
              <FormControl
                type="text"
                value={destinationKitchenName || 'Select destination kitchen...'}
                readOnly
                placeholder="Select destination kitchen"
              />
              <Button
                variant="outline-primary"
                onClick={() => setShowDestinationModal(true)}
              >
                {(dict.action as any)?.select || 'Select'}
              </Button>
              {destinationKitchenId && (
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setDestinationKitchenId('')
                    setDestinationKitchenName('')
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </FormGroup>
        )}

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
              {dict.inventory?.export_details || 'Export Details'} *
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

          {exportDetails.length === 0 ? (
            <Alert variant="info">
              {dict.inventory?.no_details || 'No export details. Please add ingredients.'}
            </Alert>
          ) : (
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>{dict.inventory?.ingredient || 'Ingredient'}</th>
                  <th>{dict.inventory?.quantity || 'Quantity'}</th>
                  <th>{dict.inventory?.unit || 'Unit'}</th>
                  <th>{dict.inventory?.unit_cost || 'Unit Cost'}</th>
                  <th>{dict.inventory?.total_cost || 'Total Cost'}</th>
                  <th>{dict.inventory?.batch_number || 'Batch Number'}</th>
                  <th>{(dict.action as any)?.actions || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {exportDetails.map((detail, index) => {
                  const ingredient = availableIngredients.find(
                    (i) => i.ingredientId === detail.ingredientId,
                  )
                  const totalCost = detail.quantity * (detail.unitCost || 0)

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
                          value={detail.unitCost || ''}
                          onChange={(e) =>
                            handleDetailChange(
                              index,
                              'unitCost',
                              parseFloat(e.target.value) || 0,
                            )
                          }
                        />
                      </td>
                      <td>
                        <strong>
                          {new Intl.NumberFormat('vi-VN').format(totalCost)}
                        </strong>
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
                  <td colSpan={2} />
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

      {/* Destination Kitchen Selection Modal */}
      <SingleSelectionModal
        show={showDestinationModal}
        onHide={() => {
          setShowDestinationModal(false)
          setSearchDestination('')
        }}
        title={dict.inventory?.select_destination_kitchen || 'Select Destination Kitchen'}
        items={availableKitchens
          .filter((k) => k.kitchenId !== kitchenId)
          .filter((k) =>
            k.kitchenName.toLowerCase().includes(searchDestination.toLowerCase()),
          )
          .map((k) => ({
            id: k.kitchenId,
            name: k.kitchenName,
            subtitle: k.address,
            badge: k.kitchenId,
          }))}
        searchValue={searchDestination}
        onSearchChange={setSearchDestination}
        selectedId={destinationKitchenId}
        onSelect={(item) => {
          setDestinationKitchenId(item.id)
          const kitchen = availableKitchens.find((k) => k.kitchenId === item.id)
          setDestinationKitchenName(kitchen?.kitchenName || '')
          setShowDestinationModal(false)
        }}
        searchPlaceholder={dict.inventory?.search_kitchen || 'Search kitchens...'}
        emptyMessage={dict.inventory?.no_kitchen || 'No kitchen found'}
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


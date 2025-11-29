'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  inventoryAdjustmentApi,
  inventoryStockApi,
} from '@/services/inventory-api'
import {
  CreateAdjustmentInput,
  InventoryAdjustment,
  InventoryStock,
} from '@/models'
import { useLoadingOverlay } from '@/components/Common/LoadingOverlay'

interface AdjustmentFormProps {
  adjustment?: InventoryAdjustment
  mode: 'create' | 'edit'
}

export default function AdjustmentForm({
  adjustment,
  mode,
}: AdjustmentFormProps) {
  const router = useRouter()
  const { showLoading, hideLoading } = useLoadingOverlay()
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<InventoryStock[]>([])

  const [formData, setFormData] = useState<CreateAdjustmentInput>({
    kitchenId: adjustment?.kitchenId || 'K001',
    adjustmentDate: adjustment?.adjustmentDate.split('T')[0] ||
      new Date().toISOString().split('T')[0],
    adjustmentType: adjustment?.adjustmentType || 'count',
    reason: adjustment?.reason || '',
    status: adjustment?.status || 'draft',
    adjustmentDetails: adjustment?.adjustmentDetails?.map((d) => ({
      ingredientId: d.ingredientId,
      quantityBefore: d.quantityBefore,
      quantityAfter: d.quantityAfter,
      unit: d.unit,
      unitCost: d.unitCost,
      reason: d.reason || '',
    })) || [],
  })

  const fetchStocks = async () => {
    try {
      const response = await inventoryStockApi.getAll(
        `?kitchen_id=${formData.kitchenId}&page_size=1000`,
      )
      setStocks(response.data)
    } catch (error) {
      console.error('Error fetching stocks:', error)
    }
  }

  useEffect(() => {
    fetchStocks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.kitchenId])

  const handleAddDetail = () => {
    const newDetail = {
      ingredientId: '',
      quantityBefore: 0,
      quantityAfter: 0,
      unit: 'kg',
      unitCost: 0,
      reason: '',
    }
    setFormData({
      ...formData,
      adjustmentDetails: [...formData.adjustmentDetails, newDetail],
    })
  }

  const handleRemoveDetail = (index: number) => {
    const details = [...formData.adjustmentDetails]
    details.splice(index, 1)
    setFormData({ ...formData, adjustmentDetails: details })
  }

  const handleDetailChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const details = [...formData.adjustmentDetails]
    details[index] = { ...details[index], [field]: value }

    // Auto-fill current stock as quantityBefore
    if (field === 'ingredientId' && value) {
      const stock = stocks.find((s) => s.ingredientId === value)
      if (stock) {
        details[index].quantityBefore = stock.quantity
        details[index].unit = stock.unit
      }
    }

    setFormData({ ...formData, adjustmentDetails: details })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.adjustmentDetails.length === 0) {
      // eslint-disable-next-line no-alert
      alert('Please add at least one adjustment detail')
      return
    }

    // Validate all details have ingredients
    const invalidDetails = formData.adjustmentDetails.filter(
      (d) => !d.ingredientId,
    )
    if (invalidDetails.length > 0) {
      // eslint-disable-next-line no-alert
      alert('Please select ingredients for all details')
      return
    }

    setLoading(true)
    showLoading()
    try {
      if (mode === 'create') {
        const response = await inventoryAdjustmentApi.create(formData)
        // eslint-disable-next-line no-alert
        alert('Adjustment created successfully')
        router.push(`/inventory/adjustments/${response.data.adjustmentId}`)
      } else if (adjustment) {
        const response = await inventoryAdjustmentApi.update(
          adjustment.adjustmentId,
          formData,
        )
        // eslint-disable-next-line no-alert
        alert('Adjustment updated successfully')
        router.push(`/inventory/adjustments/${response.data.adjustmentId}`)
      }
    } catch (error: any) {
      console.error('Error saving adjustment:', error)
      // eslint-disable-next-line no-alert
      alert(error.message || 'Failed to save adjustment')
      hideLoading()
    } finally {
      setLoading(false)
    }
  }

  const adjustmentTypes = [
    { value: 'count', label: 'Stock Count' },
    { value: 'damage', label: 'Damage' },
    { value: 'loss', label: 'Loss' },
    { value: 'found', label: 'Found' },
    { value: 'expired', label: 'Expired' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <form onSubmit={handleSubmit}>
      <div className="card mb-3">
        <div className="card-header">
          <h5 className="mb-0">Adjustment Information</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label htmlFor="kitchenIdInput" className="form-label">
                Kitchen ID <span className="text-danger">*</span>
              </label>
              <input
                id="kitchenIdInput"
                type="text"
                className="form-control"
                value={formData.kitchenId}
                onChange={(e) =>
                  setFormData({ ...formData, kitchenId: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="adjustmentDateInput" className="form-label">
                Adjustment Date <span className="text-danger">*</span>
              </label>
              <input
                id="adjustmentDateInput"
                type="date"
                className="form-control"
                value={formData.adjustmentDate}
                onChange={(e) =>
                  setFormData({ ...formData, adjustmentDate: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="adjustmentTypeSelect" className="form-label">
                Type <span className="text-danger">*</span>
              </label>
              <select
                id="adjustmentTypeSelect"
                className="form-select"
                value={formData.adjustmentType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    adjustmentType: e.target.value as any,
                  })
                }
                required
              >
                {adjustmentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor="statusSelect" className="form-label">
                Status
              </label>
              <select
                id="statusSelect"
                className="form-select"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'draft' | 'approved',
                  })
                }
              >
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="col-12">
              <label htmlFor="reasonTextarea" className="form-label">
                Reason
              </label>
              <textarea
                id="reasonTextarea"
                className="form-control"
                rows={2}
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="Enter reason for adjustment"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Adjustment Details</h5>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={handleAddDetail}
          >
            <i className="fa fa-plus me-2" />
            Add Item
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '25%' }}>
                    Ingredient <span className="text-danger">*</span>
                  </th>
                  <th style={{ width: '12%' }}>Before</th>
                  <th style={{ width: '12%' }}>
                    After <span className="text-danger">*</span>
                  </th>
                  <th style={{ width: '10%' }}>Diff</th>
                  <th style={{ width: '8%' }}>Unit</th>
                  <th style={{ width: '12%' }}>Unit Cost</th>
                  <th style={{ width: '10%' }}>Total</th>
                  <th style={{ width: '6%' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.adjustmentDetails.map((detail, index) => {
                  const diff = detail.quantityAfter - detail.quantityBefore
                  const totalValue = diff * (detail.unitCost || 0)
                  let diffClass = 'fw-bold'
                  if (diff > 0) {
                    diffClass += ' text-success'
                  } else if (diff < 0) {
                    diffClass += ' text-danger'
                  }

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={detail.ingredientId}
                          onChange={(e) =>
                            handleDetailChange(
                              index,
                              'ingredientId',
                              e.target.value,
                            )
                          }
                          required
                        >
                          <option value="">Select ingredient...</option>
                          {stocks.map((stock) => (
                            <option
                              key={stock.ingredientId}
                              value={stock.ingredientId}
                            >
                              {stock.ingredient?.ingredientName} (Current:{' '}
                              {stock.quantity} {stock.unit})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={detail.quantityBefore}
                          onChange={(e) =>
                            handleDetailChange(
                              index,
                              'quantityBefore',
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          step="0.01"
                          readOnly
                          aria-label="Quantity before"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={detail.quantityAfter}
                          onChange={(e) =>
                            handleDetailChange(
                              index,
                              'quantityAfter',
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          step="0.01"
                          required
                          aria-label="Quantity after"
                        />
                      </td>
                      <td>
                        <span className={diffClass}>
                          {diff > 0 ? '+' : ''}
                          {diff.toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={detail.unit}
                          onChange={(e) =>
                            handleDetailChange(index, 'unit', e.target.value)
                          }
                          required
                          aria-label="Unit"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={detail.unitCost || ''}
                          onChange={(e) =>
                            handleDetailChange(
                              index,
                              'unitCost',
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          step="0.01"
                          placeholder="0.00"
                          aria-label="Unit cost"
                        />
                      </td>
                      <td className="text-end">
                        {totalValue.toLocaleString()}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveDetail(index)}
                          aria-label="Remove item"
                        >
                          <i className="fa fa-trash" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {formData.adjustmentDetails.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-4">
                      No items added. Click &quot;Add Item&quot; to start.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="table-secondary fw-bold">
                  <td colSpan={7} className="text-end">
                    Total Value:
                  </td>
                  <td className="text-end">
                    {formData.adjustmentDetails
                      .reduce(
                        (sum, d) =>
                          sum +
                          (d.quantityAfter - d.quantityBefore) *
                            (d.unitCost || 0),
                        0,
                      )
                      .toLocaleString()}{' '}
                    VND
                  </td>
                  <td aria-label="Empty cell" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Saving...
            </>
          ) : (
            <>
              <i className="fa fa-save me-2" />
              {mode === 'create' ? 'Create' : 'Update'} Adjustment
            </>
          )}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

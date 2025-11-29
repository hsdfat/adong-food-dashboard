'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  CreateRequestInput,
  IngredientRequest,
  Ingredient,
  Supplier,
  Order,
} from '@/models'
import { ingredientApi, supplierApi, orderApi } from '@/services'
import { ingredientRequestApi } from '@/services/inventory-api'
import { useLoadingOverlay } from '@/components/Common/LoadingOverlay'

interface RequestFormProps {
  request?: IngredientRequest
  mode: 'create' | 'edit'
}

export default function RequestForm({ request, mode }: RequestFormProps) {
  const router = useRouter()
  const { showLoading, hideLoading } = useLoadingOverlay()
  const [loading, setLoading] = useState(false)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  const [formData, setFormData] = useState<CreateRequestInput>({
    orderId: request?.orderId || '',
    kitchenId: request?.kitchenId || 'K001',
    requestDate: request?.requestDate.split('T')[0] ||
      new Date().toISOString().split('T')[0],
    requiredDate: request?.requiredDate.split('T')[0] ||
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    status: request?.status || 'pending',
    notes: request?.notes || '',
    requestDetails: request?.requestDetails?.map((d) => ({
      ingredientId: d.ingredientId,
      quantity: d.quantity,
      unit: d.unit,
      supplierId: d.supplierId || undefined,
      unitPrice: d.unitPrice,
      notes: d.notes || '',
    })) || [],
  })

  const fetchData = async () => {
    try {
      const [ingredientsRes, suppliersRes, ordersRes] = await Promise.all([
        ingredientApi.getAll('?page_size=1000'),
        supplierApi.getAll('?page_size=1000'),
        orderApi.getAll('?page_size=100'),
      ])
      setIngredients(ingredientsRes.data)
      setSuppliers(suppliersRes.data)
      setOrders(ordersRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddDetail = () => {
    const newDetail = {
      ingredientId: '',
      quantity: 0,
      unit: 'kg',
      supplierId: undefined,
      unitPrice: 0,
      notes: '',
    }
    setFormData({
      ...formData,
      requestDetails: [...formData.requestDetails, newDetail],
    })
  }

  const handleRemoveDetail = (index: number) => {
    const details = [...formData.requestDetails]
    details.splice(index, 1)
    setFormData({ ...formData, requestDetails: details })
  }

  const handleDetailChange = (
    index: number,
    field: string,
    value: string | number | undefined,
  ) => {
    const details = [...formData.requestDetails]
    details[index] = { ...details[index], [field]: value }

    // Auto-fill unit from ingredient
    if (field === 'ingredientId' && value) {
      const ingredient = ingredients.find((i) => i.ingredientId === value)
      if (ingredient) {
        details[index].unit = ingredient.unit
      }
    }

    setFormData({ ...formData, requestDetails: details })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.requestDetails.length === 0) {
      // eslint-disable-next-line no-alert
      alert('Please add at least one request detail')
      return
    }

    // Validate all details have ingredients
    const invalidDetails = formData.requestDetails.filter(
      (d) => !d.ingredientId || d.quantity <= 0,
    )
    if (invalidDetails.length > 0) {
      // eslint-disable-next-line no-alert
      alert('Please fill all required fields for all details')
      return
    }

    setLoading(true)
    showLoading()
    try {
      if (mode === 'create') {
        const response = await ingredientRequestApi.create(formData)
        // Navigation will keep loading overlay active until page changes
        router.push(`/inventory/requests/${response.data.requestId}`)
      } else if (request) {
        const response = await ingredientRequestApi.update(
          request.requestId,
          formData,
        )
        // Navigation will keep loading overlay active until page changes
        router.push(`/inventory/requests/${response.data.requestId}`)
      }
    } catch (error: any) {
      console.error('Error saving request:', error)
      // eslint-disable-next-line no-alert
      alert(error.message || 'Failed to save request')
      hideLoading()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="card mb-3">
        <div className="card-header">
          <h5 className="mb-0">Request Information</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label htmlFor="orderIdSelect" className="form-label">
                Order ID <span className="text-danger">*</span>
              </label>
              <select
                id="orderIdSelect"
                className="form-select"
                value={formData.orderId}
                onChange={(e) =>
                  setFormData({ ...formData, orderId: e.target.value })
                }
                required
              >
                <option value="">Select order...</option>
                {orders.map((order) => (
                  <option key={order.orderId} value={order.orderId}>
                    {order.orderId} - {order.orderName}
                  </option>
                ))}
              </select>
            </div>
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
              <label htmlFor="requestDateInput" className="form-label">
                Request Date <span className="text-danger">*</span>
              </label>
              <input
                id="requestDateInput"
                type="date"
                className="form-control"
                value={formData.requestDate}
                onChange={(e) =>
                  setFormData({ ...formData, requestDate: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="requiredDateInput" className="form-label">
                Required Date <span className="text-danger">*</span>
              </label>
              <input
                id="requiredDateInput"
                type="date"
                className="form-control"
                value={formData.requiredDate}
                onChange={(e) =>
                  setFormData({ ...formData, requiredDate: e.target.value })
                }
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="notesTextarea" className="form-label">
                Notes
              </label>
              <textarea
                id="notesTextarea"
                className="form-control"
                rows={2}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Enter any notes or special instructions"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Request Details</h5>
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
                  <th style={{ width: '15%' }}>
                    Quantity <span className="text-danger">*</span>
                  </th>
                  <th style={{ width: '10%' }}>Unit</th>
                  <th style={{ width: '20%' }}>Supplier</th>
                  <th style={{ width: '12%' }}>Unit Price</th>
                  <th style={{ width: '10%' }}>Total</th>
                  <th style={{ width: '3%' }} aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {formData.requestDetails.map((detail, index) => {
                  const totalPrice = detail.quantity * (detail.unitPrice || 0)

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
                          {ingredients.map((ing) => (
                            <option key={ing.ingredientId} value={ing.ingredientId}>
                              {ing.ingredientName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={detail.quantity}
                          onChange={(e) =>
                            handleDetailChange(
                              index,
                              'quantity',
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          step="0.01"
                          required
                        />
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
                        />
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={detail.supplierId || ''}
                          onChange={(e) =>
                            handleDetailChange(
                              index,
                              'supplierId',
                              e.target.value || undefined,
                            )
                          }
                        >
                          <option value="">Select supplier...</option>
                          {suppliers.map((sup) => (
                            <option key={sup.supplierId} value={sup.supplierId}>
                              {sup.supplierName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={detail.unitPrice || ''}
                          onChange={(e) =>
                            handleDetailChange(
                              index,
                              'unitPrice',
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          step="0.01"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="text-end">
                        {totalPrice.toLocaleString()}
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
                {formData.requestDetails.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      No items added. Click &quot;Add Item&quot; to start.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="table-secondary fw-bold">
                  <td colSpan={6} className="text-end">
                    Total Amount:
                  </td>
                  <td className="text-end">
                    {formData.requestDetails
                      .reduce(
                        (sum, d) => sum + d.quantity * (d.unitPrice || 0),
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
              {mode === 'create' ? 'Create' : 'Update'} Request
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

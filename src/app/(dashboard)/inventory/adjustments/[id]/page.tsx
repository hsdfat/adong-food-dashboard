'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { inventoryAdjustmentApi } from '@/services/inventory-api'
import { InventoryAdjustment } from '@/models'
import Link from 'next/link'

export default function AdjustmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [adjustment, setAdjustment] = useState<InventoryAdjustment | null>(
    null,
  )
  const [loading, setLoading] = useState(true)

  const typeLabels: Record<string, string> = {
    count: 'Stock Count',
    damage: 'Damage',
    loss: 'Loss',
    found: 'Found',
    expired: 'Expired',
    other: 'Other',
  }

  const fetchAdjustment = async () => {
    try {
      setLoading(true)
      const response = await inventoryAdjustmentApi.getById(id)
      setAdjustment(response.data)
    } catch (error) {
      console.error('Error fetching adjustment:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdjustment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleApprove = async () => {
    if (
      // eslint-disable-next-line no-alert, no-restricted-globals
      !confirm(
        'Approve this adjustment? This will update inventory stocks immediately.',
      )
    )
      return

    try {
      await inventoryAdjustmentApi.approve(id)
      fetchAdjustment()
    } catch (error) {
      console.error('Error approving adjustment:', error)
      // eslint-disable-next-line no-alert
      alert('Failed to approve adjustment')
    }
  }

  const handleDelete = async () => {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (!confirm('Are you sure you want to delete this adjustment?')) return

    try {
      await inventoryAdjustmentApi.delete(id)
      router.push('/inventory/adjustments')
    } catch (error) {
      console.error('Error deleting adjustment:', error)
      // eslint-disable-next-line no-alert
      alert('Failed to delete adjustment')
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!adjustment) {
    return (
      <div className="alert alert-danger">
        Adjustment not found
        <Link href="/inventory/adjustments" className="btn btn-link">
          Back to list
        </Link>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    draft: 'badge bg-secondary',
    approved: 'badge bg-success',
  }

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/inventory/adjustments">Adjustments</Link>
              </li>
              <li className="breadcrumb-item active">{adjustment.adjustmentId}</li>
            </ol>
          </nav>
          <h2>Adjustment Details</h2>
        </div>
        <div className="col-auto">
          {adjustment.status === 'draft' && (
            <>
              <button
                type="button"
                className="btn btn-success me-2"
                onClick={handleApprove}
              >
                <i className="fa fa-check me-2" />
                Approve & Apply
              </button>
              <Link
                href={`/inventory/adjustments/${id}/edit`}
                className="btn btn-secondary me-2"
              >
                <i className="fa fa-edit me-2" />
                Edit
              </Link>
              <button
                type="button"
                className="btn btn-danger me-2"
                onClick={handleDelete}
              >
                <i className="fa fa-trash me-2" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="mb-0">Adjustment Information</h5>
            </div>
            <div className="card-body">
              <table className="table table-sm">
                <tbody>
                  <tr>
                    <th style={{ width: '40%' }}>Adjustment ID:</th>
                    <td>{adjustment.adjustmentId}</td>
                  </tr>
                  <tr>
                    <th>Kitchen:</th>
                    <td>{adjustment.kitchen?.kitchenName || '-'}</td>
                  </tr>
                  <tr>
                    <th>Adjustment Date:</th>
                    <td>
                      {new Date(adjustment.adjustmentDate).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <th>Type:</th>
                    <td>{typeLabels[adjustment.adjustmentType]}</td>
                  </tr>
                  <tr>
                    <th>Status:</th>
                    <td>
                      <span className={statusColors[adjustment.status]}>
                        {adjustment.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Total Value:</th>
                    <td className="fw-bold">
                      {adjustment.totalValue?.toLocaleString() || '0'} VND
                    </td>
                  </tr>
                  {adjustment.reason && (
                    <tr>
                      <th>Reason:</th>
                      <td>{adjustment.reason}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="mb-0">Tracking Information</h5>
            </div>
            <div className="card-body">
              <table className="table table-sm">
                <tbody>
                  <tr>
                    <th style={{ width: '40%' }}>Created By:</th>
                    <td>{adjustment.createdBy?.username || '-'}</td>
                  </tr>
                  <tr>
                    <th>Created Date:</th>
                    <td>
                      {new Date(adjustment.createdDate).toLocaleString()}
                    </td>
                  </tr>
                  {adjustment.approvedBy && (
                    <>
                      <tr>
                        <th>Approved By:</th>
                        <td>{adjustment.approvedBy.username}</td>
                      </tr>
                      <tr>
                        <th>Approved Date:</th>
                        <td>
                          {adjustment.approvedDate
                            ? new Date(adjustment.approvedDate).toLocaleString()
                            : '-'}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Adjustment Details</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ingredient</th>
                  <th className="text-end">Before</th>
                  <th className="text-end">After</th>
                  <th className="text-end">Difference</th>
                  <th>Unit</th>
                  <th className="text-end">Unit Cost</th>
                  <th className="text-end">Total Value</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {adjustment.adjustmentDetails?.map((detail, index) => {
                  const isDiff = detail.quantityDifference !== 0
                  const isIncrease = detail.quantityDifference > 0
                  let diffClass = 'text-end fw-bold'
                  if (isDiff) {
                    diffClass += isIncrease ? ' text-success' : ' text-danger'
                  }
                  return (
                    <tr key={detail.adjustmentDetailId}>
                      <td>{index + 1}</td>
                      <td>{detail.ingredient?.ingredientName || '-'}</td>
                      <td className="text-end">
                        {detail.quantityBefore.toLocaleString()}
                      </td>
                      <td className="text-end">
                        {detail.quantityAfter.toLocaleString()}
                      </td>
                      <td className={diffClass}>
                        {isIncrease ? '+' : ''}
                        {detail.quantityDifference.toLocaleString()}
                      </td>
                      <td>{detail.unit}</td>
                      <td className="text-end">
                        {detail.unitCost?.toLocaleString() || '-'} VND
                      </td>
                      <td className="text-end">
                        {detail.totalValue?.toLocaleString() || '-'} VND
                      </td>
                      <td>{detail.reason || '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="table-secondary fw-bold">
                  <td colSpan={7} className="text-end">
                    Total Value:
                  </td>
                  <td className="text-end">
                    {adjustment.totalValue?.toLocaleString() || '0'} VND
                  </td>
                  <td aria-label="Empty cell" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

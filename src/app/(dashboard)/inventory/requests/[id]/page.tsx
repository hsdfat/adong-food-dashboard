'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ingredientRequestApi } from '@/services/inventory-api'
import { IngredientRequest } from '@/models'
import Link from 'next/link'

export default function RequestDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [request, setRequest] = useState<IngredientRequest | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true)
        const response = await ingredientRequestApi.getById(id)
        setRequest(response.data)
      } catch (error) {
        console.error('Error fetching request:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRequest()
  }, [id])

  const fetchRequest = async () => {
    try {
      setLoading(true)
      const response = await ingredientRequestApi.getById(id)
      setRequest(response.data)
    } catch (error) {
      console.error('Error fetching request:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (!confirm('Approve this request?')) return

    try {
      await ingredientRequestApi.approve(id)
      fetchRequest()
    } catch (error) {
      console.error('Error approving request:', error)
      // eslint-disable-next-line no-alert
      alert('Failed to approve request')
    }
  }

  const handleDelete = async () => {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (!confirm('Are you sure you want to delete this request?')) return

    try {
      await ingredientRequestApi.delete(id)
      router.push('/inventory/requests')
    } catch (error) {
      console.error('Error deleting request:', error)
      // eslint-disable-next-line no-alert
      alert('Failed to delete request')
    }
  }

  const handleCreateReceipt = async () => {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (!confirm('Create goods receipt from this request?')) return

    try {
      const response = await ingredientRequestApi.createImportFromRequest(id)
      // eslint-disable-next-line no-alert
      alert(`Goods receipt created: ${response.data.importId}`)
      router.push(`/inventory/imports/${response.data.importId}`)
    } catch (error) {
      console.error('Error creating receipt:', error)
      // eslint-disable-next-line no-alert
      alert('Failed to create receipt')
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

  if (!request) {
    return (
      <div className="alert alert-danger">
        Request not found
        <Link href="/inventory/requests" className="btn btn-link">
          Back to list
        </Link>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    pending: 'badge bg-warning',
    approved: 'badge bg-success',
    received: 'badge bg-info',
  }

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/inventory/requests">Requests</Link>
              </li>
              <li className="breadcrumb-item active">{request.requestId}</li>
            </ol>
          </nav>
          <h2>Request Details</h2>
        </div>
        <div className="col-auto">
          {request.status === 'pending' && (
            <>
              <button
                type="button"
                className="btn btn-success me-2"
                onClick={handleApprove}
              >
                <i className="fa fa-check me-2" />
                Approve
              </button>
              <Link
                href={`/inventory/requests/${id}/edit`}
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
          {request.status === 'approved' && (
            <button
              type="button"
              className="btn btn-info me-2"
              onClick={handleCreateReceipt}
            >
              <i className="fa fa-box me-2" />
              Create Receipt
            </button>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="mb-0">Request Information</h5>
            </div>
            <div className="card-body">
              <table className="table table-sm">
                <tbody>
                  <tr>
                    <th style={{ width: '40%' }}>Request ID:</th>
                    <td>{request.requestId}</td>
                  </tr>
                  <tr>
                    <th>Order ID:</th>
                    <td>
                      <Link href={`/orders/${request.orderId}`}>
                        {request.orderId}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <th>Kitchen:</th>
                    <td>{request.kitchen?.kitchenName || '-'}</td>
                  </tr>
                  <tr>
                    <th>Request Date:</th>
                    <td>
                      {new Date(request.requestDate).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <th>Required Date:</th>
                    <td>
                      {new Date(request.requiredDate).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <th>Status:</th>
                    <td>
                      <span className={statusColors[request.status]}>
                        {request.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Total Amount:</th>
                    <td className="fw-bold">
                      {request.totalAmount.toLocaleString()} VND
                    </td>
                  </tr>
                  {request.notes && (
                    <tr>
                      <th>Notes:</th>
                      <td>{request.notes}</td>
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
                    <td>{request.createdBy?.username || '-'}</td>
                  </tr>
                  <tr>
                    <th>Created Date:</th>
                    <td>
                      {new Date(request.createdDate).toLocaleString()}
                    </td>
                  </tr>
                  {request.approvedBy && (
                    <>
                      <tr>
                        <th>Approved By:</th>
                        <td>{request.approvedBy.username}</td>
                      </tr>
                      <tr>
                        <th>Approved Date:</th>
                        <td>
                          {request.approvedDate
                            ? new Date(request.approvedDate).toLocaleString()
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
          <h5 className="mb-0">Request Details</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ingredient</th>
                  <th>Supplier</th>
                  <th className="text-end">Quantity</th>
                  <th>Unit</th>
                  <th className="text-end">Unit Price</th>
                  <th className="text-end">Total Price</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {request.requestDetails?.map((detail, index) => (
                  <tr key={detail.requestDetailId}>
                    <td>{index + 1}</td>
                    <td>{detail.ingredient?.ingredientName || '-'}</td>
                    <td>{detail.supplier?.supplierName || '-'}</td>
                    <td className="text-end">
                      {detail.quantity.toLocaleString()}
                    </td>
                    <td>{detail.unit}</td>
                    <td className="text-end">
                      {detail.unitPrice?.toLocaleString() || '-'} VND
                    </td>
                    <td className="text-end">
                      {detail.totalPrice?.toLocaleString() || '-'} VND
                    </td>
                    <td>{detail.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-secondary fw-bold">
                  <td colSpan={6} className="text-end">
                    Total Amount:
                  </td>
                  <td className="text-end">
                    {request.totalAmount.toLocaleString()} VND
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

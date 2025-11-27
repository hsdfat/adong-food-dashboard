'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ingredientRequestApi } from '@/services/inventory-api'
import { IngredientRequest } from '@/models'
import Link from 'next/link'

export default function IngredientRequestsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [requests, setRequests] = useState<IngredientRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  })

  const statusColors: Record<string, string> = {
    pending: 'badge bg-warning',
    approved: 'badge bg-success',
    received: 'badge bg-info',
  }

  const statusLabels: Record<string, string> = {
    pending: 'Pending',
    approved: 'Approved',
    received: 'Received',
  }

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        const queryString = searchParams.toString()
          ? `?${searchParams.toString()}`
          : '?page=1&page_size=20'
        const response = await ingredientRequestApi.getAll(queryString)
        setRequests(response.data)
        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            pageSize: response.pagination.limit,
            total: response.pagination.total,
            totalPages: response.pagination.total_pages,
          })
        }
      } catch (error) {
        console.error('Error fetching requests:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [searchParams])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const queryString = searchParams.toString()
        ? `?${searchParams.toString()}`
        : '?page=1&page_size=20'
      const response = await ingredientRequestApi.getAll(queryString)
      setRequests(response.data)
      if (response.pagination) {
        setPagination({
          page: response.pagination.page,
          pageSize: response.pagination.limit,
          total: response.pagination.total,
          totalPages: response.pagination.total_pages,
        })
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (!confirm('Are you sure you want to delete this request?')) return

    try {
      await ingredientRequestApi.delete(id)
      fetchRequests()
    } catch (error) {
      console.error('Error deleting request:', error)
      // eslint-disable-next-line no-alert
      alert('Failed to delete request')
    }
  }

  const handleApprove = async (id: string) => {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (!confirm('Approve this request?')) return

    try {
      await ingredientRequestApi.approve(id)
      fetchRequests()
    } catch (error) {
      console.error('Error approving request:', error)
      // eslint-disable-next-line no-alert
      alert('Failed to approve request')
    }
  }

  const handleCreateReceipt = async (requestId: string) => {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (!confirm('Create goods receipt from this request?')) return

    try {
      const response = await ingredientRequestApi.createImportFromRequest(
        requestId,
      )
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

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col">
          <h2>Ingredient Requests</h2>
        </div>
        <div className="col-auto">
          <Link
            href="/inventory/requests/create"
            className="btn btn-primary me-2"
          >
            <i className="fa fa-plus me-2" />
            Create Request
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Order ID</th>
                  <th>Kitchen</th>
                  <th>Request Date</th>
                  <th>Required Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      No requests found
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.requestId}>
                      <td>
                        <Link
                          href={`/inventory/requests/${request.requestId}`}
                          className="text-decoration-none"
                        >
                          {request.requestId}
                        </Link>
                      </td>
                      <td>
                        {request.order ? (
                          <Link
                            href={`/orders/${request.orderId}`}
                            className="text-decoration-none"
                          >
                            {request.orderId}
                          </Link>
                        ) : (
                          request.orderId
                        )}
                      </td>
                      <td>{request.kitchen?.kitchenName || '-'}</td>
                      <td>
                        {new Date(request.requestDate).toLocaleDateString()}
                      </td>
                      <td>
                        {new Date(request.requiredDate).toLocaleDateString()}
                      </td>
                      <td className="text-end">
                        {request.totalAmount.toLocaleString()} VND
                      </td>
                      <td>
                        <span className={statusColors[request.status]}>
                          {statusLabels[request.status]}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            href={`/inventory/requests/${request.requestId}`}
                            className="btn btn-outline-primary"
                            aria-label="View request details"
                          >
                            <i className="fa fa-eye" />
                          </Link>
                          {request.status === 'pending' && (
                            <>
                              <Link
                                href={`/inventory/requests/${request.requestId}/edit`}
                                className="btn btn-outline-secondary"
                                aria-label="Edit request"
                              >
                                <i className="fa fa-edit" />
                              </Link>
                              <button
                                type="button"
                                className="btn btn-outline-success"
                                onClick={() =>
                                  handleApprove(request.requestId)
                                }
                                aria-label="Approve request"
                              >
                                <i className="fa fa-check" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(request.requestId)}
                                aria-label="Delete request"
                              >
                                <i className="fa fa-trash" />
                              </button>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <button
                              type="button"
                              className="btn btn-outline-info"
                              onClick={() =>
                                handleCreateReceipt(request.requestId)
                              }
                            >
                              <i className="fa fa-box me-1" />
                              Create Receipt
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() =>
                      router.push(
                        `/inventory/requests?page=${pagination.page - 1}&page_size=${pagination.pageSize}`,
                      )
                    }
                  >
                    Previous
                  </button>
                </li>
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((page) => (
                  <li
                    key={page}
                    className={`page-item ${pagination.page === page ? 'active' : ''}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() =>
                        router.push(
                          `/inventory/requests?page=${page}&page_size=${pagination.pageSize}`,
                        )
                      }
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() =>
                      router.push(
                        `/inventory/requests?page=${pagination.page + 1}&page_size=${pagination.pageSize}`,
                      )
                    }
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}

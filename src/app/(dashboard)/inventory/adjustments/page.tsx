'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { inventoryAdjustmentApi } from '@/services/inventory-api'
import { InventoryAdjustment } from '@/models'
import Link from 'next/link'

export default function AdjustmentsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  })

  const statusColors: Record<string, string> = {
    draft: 'badge bg-secondary',
    approved: 'badge bg-success',
  }

  const typeLabels: Record<string, string> = {
    count: 'Stock Count',
    damage: 'Damage',
    loss: 'Loss',
    found: 'Found',
    expired: 'Expired',
    other: 'Other',
  }

  useEffect(() => {
    const fetchAdjustments = async () => {
      try {
        setLoading(true)
        const queryString = searchParams.toString()
          ? `?${searchParams.toString()}`
          : '?page=1&page_size=20'
        const response = await inventoryAdjustmentApi.getAll(queryString)
        setAdjustments(response.data)
        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            pageSize: response.pagination.limit,
            total: response.pagination.total,
            totalPages: response.pagination.total_pages,
          })
        }
      } catch (error) {
        console.error('Error fetching adjustments:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAdjustments()
  }, [searchParams])

  const fetchAdjustments = async () => {
    try {
      setLoading(true)
      const queryString = searchParams.toString()
        ? `?${searchParams.toString()}`
        : '?page=1&page_size=20'
      const response = await inventoryAdjustmentApi.getAll(queryString)
      setAdjustments(response.data)
      if (response.pagination) {
        setPagination({
          page: response.pagination.page,
          pageSize: response.pagination.limit,
          total: response.pagination.total,
          totalPages: response.pagination.total_pages,
        })
      }
    } catch (error) {
      console.error('Error fetching adjustments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (!confirm('Are you sure you want to delete this adjustment?')) return

    try {
      await inventoryAdjustmentApi.delete(id)
      fetchAdjustments()
    } catch (error) {
      console.error('Error deleting adjustment:', error)
      // eslint-disable-next-line no-alert
      alert('Failed to delete adjustment')
    }
  }

  const handleApprove = async (id: string) => {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (!confirm('Approve this adjustment? This will update inventory stocks.'))
      return

    try {
      await inventoryAdjustmentApi.approve(id)
      fetchAdjustments()
    } catch (error) {
      console.error('Error approving adjustment:', error)
      // eslint-disable-next-line no-alert
      alert('Failed to approve adjustment')
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
          <h2>Inventory Adjustments</h2>
        </div>
        <div className="col-auto">
          <Link
            href="/inventory/adjustments/create"
            className="btn btn-primary me-2"
          >
            <i className="fa fa-plus me-2" />
            Create Adjustment
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Adjustment ID</th>
                  <th>Kitchen</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Total Value</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adjustments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      No adjustments found
                    </td>
                  </tr>
                ) : (
                  adjustments.map((adjustment) => (
                    <tr key={adjustment.adjustmentId}>
                      <td>
                        <Link
                          href={`/inventory/adjustments/${adjustment.adjustmentId}`}
                          className="text-decoration-none"
                        >
                          {adjustment.adjustmentId}
                        </Link>
                      </td>
                      <td>{adjustment.kitchen?.kitchenName || '-'}</td>
                      <td>
                        {new Date(
                          adjustment.adjustmentDate,
                        ).toLocaleDateString()}
                      </td>
                      <td>{typeLabels[adjustment.adjustmentType]}</td>
                      <td>{adjustment.reason || '-'}</td>
                      <td className="text-end">
                        {adjustment.totalValue?.toLocaleString() || '0'} VND
                      </td>
                      <td>
                        <span className={statusColors[adjustment.status]}>
                          {adjustment.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            href={`/inventory/adjustments/${adjustment.adjustmentId}`}
                            className="btn btn-outline-primary"
                            aria-label="View details"
                          >
                            <i className="fa fa-eye" />
                          </Link>
                          {adjustment.status === 'draft' && (
                            <>
                              <Link
                                href={`/inventory/adjustments/${adjustment.adjustmentId}/edit`}
                                className="btn btn-outline-secondary"
                                aria-label="Edit adjustment"
                              >
                                <i className="fa fa-edit" />
                              </Link>
                              <button
                                type="button"
                                className="btn btn-outline-success"
                                onClick={() =>
                                  handleApprove(adjustment.adjustmentId)
                                }
                                aria-label="Approve adjustment"
                              >
                                <i className="fa fa-check" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() =>
                                  handleDelete(adjustment.adjustmentId)
                                }
                                aria-label="Delete adjustment"
                              >
                                <i className="fa fa-trash" />
                              </button>
                            </>
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
                        `/inventory/adjustments?page=${pagination.page - 1}&page_size=${pagination.pageSize}`,
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
                          `/inventory/adjustments?page=${page}&page_size=${pagination.pageSize}`,
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
                        `/inventory/adjustments?page=${pagination.page + 1}&page_size=${pagination.pageSize}`,
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

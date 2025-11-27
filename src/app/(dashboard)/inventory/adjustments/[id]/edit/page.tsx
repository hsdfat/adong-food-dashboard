'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { inventoryAdjustmentApi } from '@/services/inventory-api'
import { InventoryAdjustment } from '@/models'
import AdjustmentForm from '@/components/Page/Inventory/AdjustmentForm'

export default function EditAdjustmentPage() {
  const params = useParams()
  const id = params.id as string
  const [adjustment, setAdjustment] = useState<InventoryAdjustment | null>(
    null,
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    fetchAdjustment()
  }, [id])

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

  if (adjustment.status === 'approved') {
    return (
      <div className="alert alert-warning">
        Cannot edit approved adjustment
        <Link
          href={`/inventory/adjustments/${id}`}
          className="btn btn-link"
        >
          View Details
        </Link>
      </div>
    )
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
              <li className="breadcrumb-item">
                <Link href={`/inventory/adjustments/${id}`}>
                  {adjustment.adjustmentId}
                </Link>
              </li>
              <li className="breadcrumb-item active">Edit</li>
            </ol>
          </nav>
          <h2>Edit Adjustment</h2>
        </div>
      </div>

      <AdjustmentForm mode="edit" adjustment={adjustment} />
    </div>
  )
}

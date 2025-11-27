'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ingredientRequestApi } from '@/services/inventory-api'
import { IngredientRequest } from '@/models'
import RequestForm from '@/components/Page/Inventory/RequestForm'

export default function EditRequestPage() {
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

  if (request.status !== 'pending') {
    return (
      <div className="alert alert-warning">
        Cannot edit request with status: {request.status}
        <Link href={`/inventory/requests/${id}`} className="btn btn-link">
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
                <Link href="/inventory/requests">Requests</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href={`/inventory/requests/${id}`}>
                  {request.requestId}
                </Link>
              </li>
              <li className="breadcrumb-item active">Edit</li>
            </ol>
          </nav>
          <h2>Edit Request</h2>
        </div>
      </div>

      <RequestForm mode="edit" request={request} />
    </div>
  )
}

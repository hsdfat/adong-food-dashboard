'use client'

import Link from 'next/link'
import RequestForm from '@/components/Page/Inventory/RequestForm'

export default function CreateRequestPage() {
  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/inventory/requests">Requests</Link>
              </li>
              <li className="breadcrumb-item active">Create New</li>
            </ol>
          </nav>
          <h2>Create Ingredient Request</h2>
        </div>
      </div>

      <RequestForm mode="create" />
    </div>
  )
}

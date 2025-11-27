'use client'

import Link from 'next/link'
import AdjustmentForm from '@/components/Page/Inventory/AdjustmentForm'

export default function CreateAdjustmentPage() {
  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/inventory/adjustments">Adjustments</Link>
              </li>
              <li className="breadcrumb-item active">Create New</li>
            </ol>
          </nav>
          <h2>Create Inventory Adjustment</h2>
        </div>
      </div>

      <AdjustmentForm mode="create" />
    </div>
  )
}

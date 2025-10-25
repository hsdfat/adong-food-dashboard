// app/(dashboard)/supplier-prices/create/page.tsx

import { Metadata } from 'next'
import SupplierPriceForm from '@/components/Page/SupplierPrice/SupplierPriceForm'

export const metadata: Metadata = {
  title: 'Create Supplier Price',
}

export default function CreateSupplierPricePage() {
  return (
    <div className="container-xxl">
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-header">
              <strong>Create New Supplier Price</strong>
            </div>
            <div className="card-body">
              <SupplierPriceForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

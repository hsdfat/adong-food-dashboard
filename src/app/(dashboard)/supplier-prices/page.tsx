// app/(dashboard)/supplier-prices/page.tsx

import { Metadata } from 'next'
import SupplierPricesList from '@/components/Page/SupplierPrice/SupplierPricesList'

export const metadata: Metadata = {
  title: 'Supplier Prices',
}

export default function SupplierPricesPage() {
  return (
    <div className="container-xxl">
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-header">
              <strong>Supplier Prices Management</strong>
            </div>
            <div className="card-body">
              <SupplierPricesList />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

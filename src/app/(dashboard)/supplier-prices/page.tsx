'use client'
import { Metadata } from 'next'
import SupplierPricesList from '@/components/Page/SupplierPrice/SupplierPricesList'
import useDictionary from '@/locales/dictionary-hook'

export default function SupplierPricesPage() {
  const dict = useDictionary()

  return (
    <div className="container-xxl">
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-header">
              <strong>{dict.supplierPrice?.description}</strong>
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

// app/(dashboard)/supplier-prices/[id]/edit/page.tsx

'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import SupplierPriceForm from '@/components/Page/SupplierPrice/SupplierPriceForm'
import { SupplierPrice } from '@/models/supplier-price'
import { supplierPriceApi } from '@/services/supplier-price.service'

export default function EditSupplierPricePage() {
  const params = useParams()
  const id = params?.id as string

  const [supplierPrice, setSupplierPrice] = useState<SupplierPrice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadSupplierPrice = useCallback(async () => {
    try {
      setLoading(true)
      const data = await supplierPriceApi.getById(parseInt(id, 10))
      setSupplierPrice(data)
    } catch (err) {
      setError('Failed to load supplier price')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      loadSupplierPrice()
    }
  }, [id, loadSupplierPrice])

  if (loading) {
    return <div className="text-center py-4">Loading...</div>
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    )
  }

  return (
    <div className="container-xxl">
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-header">
              <strong>Edit Supplier Price</strong>
            </div>
            <div className="card-body">
              {supplierPrice && (
                <SupplierPriceForm supplierPrice={supplierPrice} isEdit />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

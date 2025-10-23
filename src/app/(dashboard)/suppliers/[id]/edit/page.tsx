'use server'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import SupplierForm from '@/components/Page/Supplier/SupplierForm'
import { notFound } from 'next/navigation'
import { supplierApi } from '@/services'
import { Supplier } from '@/models'

const fetchSupplier = async (id: string): Promise<Supplier | null> => {
  try {
    // Note: This is server-side fetch, need to handle authentication differently
    console.log('Fetching supplier with id:', id)
    const response = await supplierApi.getById(id)
    return response
  } catch (error) {
    console.error('Error fetching supplier:', error)
    return null
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  console.log('Fetching supplier with id:', params.id)
  const supplier = await fetchSupplier(params.id)

  if (!supplier) {
    return notFound()
  }

  return (
    <Card>
      <CardHeader>Edit Supplier: {supplier.supplierName}</CardHeader>
      <CardBody>
        <SupplierForm supplier={supplier} isEdit />
      </CardBody>
    </Card>
  )
}
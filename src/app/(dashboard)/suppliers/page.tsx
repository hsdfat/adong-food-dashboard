import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import { getDictionary } from '@/locales/dictionary'
import SuppliersList from '@/components/Page/Supplier/SuppliersList'

export default async function Page() {
  const dict = await getDictionary()

  return (
    <Card>
      {/* <CardHeader>
        {dict.sidebar.items?.ingredients || 'Ingredients'}
      </CardHeader> */}
      <CardBody>
        <SuppliersList />
      </CardBody>
    </Card>
  )
}
import React from 'react'
import { Card, CardBody } from 'react-bootstrap'
import SuppliersList from '@/components/Page/Supplier/SuppliersList'

export default async function Page() {
  return (
    <Card>
      <CardBody>
        <SuppliersList />
      </CardBody>
    </Card>
  )
}

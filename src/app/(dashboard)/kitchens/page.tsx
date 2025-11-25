import React from 'react'
import { Card, CardBody } from 'react-bootstrap'
import KitchensList from '@/components/Page/Kitchen/KitchensList'

export default async function Page() {
  return (
    <Card>
      <CardBody>
        <KitchensList />
      </CardBody>
    </Card>
  )
}

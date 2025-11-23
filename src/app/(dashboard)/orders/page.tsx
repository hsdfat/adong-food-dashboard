import React from 'react'
import { Card, CardBody } from 'react-bootstrap'
import OrdersList from '@/components/Page/Order/OrdersList'

export default function OrdersPage() {
  return (
    <Card>
      <CardBody>
        <OrdersList />
      </CardBody>
    </Card>
  )
}

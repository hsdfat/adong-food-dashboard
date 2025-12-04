import React from 'react'
import { Card, CardBody } from 'react-bootstrap'
import OrdersGroupedList from '@/components/Page/Order/OrdersGroupedList'

export default function OrdersGroupedPage() {
  return (
    <Card>
      <CardBody>
        <OrdersGroupedList />
      </CardBody>
    </Card>
  )
}

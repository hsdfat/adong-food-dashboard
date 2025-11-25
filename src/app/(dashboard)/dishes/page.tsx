'use client'

import React from 'react'
import { Card, CardBody } from 'react-bootstrap'
import DishesList from '@/components/Page/Dish/DishesList'

export default function Page() {
  return (
    <Card>
      <CardBody>
        <DishesList />
      </CardBody>
    </Card>
  )
}

'use client';
import React from 'react'
import { Card, CardBody } from 'react-bootstrap'
import StockForm from '@/components/Page/Inventory/StockForm'

interface PageProps {
  params: {
    id: string
  }
}

export default function Page({ params }: PageProps) {
  const stockId = parseInt(params.id)

  if (isNaN(stockId)) {
    return <div>Invalid stock ID</div>
  }

  return (
    <Card>
      <CardBody>
        <StockForm stockId={stockId} />
      </CardBody>
    </Card>
  )
}


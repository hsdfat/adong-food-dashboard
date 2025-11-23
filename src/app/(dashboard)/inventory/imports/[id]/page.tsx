'use client';
import React from 'react'
import { Card, CardBody } from 'react-bootstrap'
import ImportDetail from '@/components/Page/Inventory/ImportDetail'

interface PageProps {
  params: {
    id: string
  }
}

export default function Page({ params }: PageProps) {
  return (
    <Card>
      <CardBody>
        <ImportDetail importId={params.id} />
      </CardBody>
    </Card>
  )
}


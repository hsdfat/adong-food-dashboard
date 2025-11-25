'use client'

import React from 'react'
import { Card, CardBody } from 'react-bootstrap'
import ExportDetail from '@/components/Page/Inventory/ExportDetail'

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <Card>
      <CardBody>
        <ExportDetail exportId={params.id} />
      </CardBody>
    </Card>
  )
}


'use client'

import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import ExportList from '@/components/Page/Inventory/ExportList'
import useDictionary from '@/locales/dictionary-hook'

export default function Page() {
  const dict = useDictionary()

  return (
    <Card>
      <CardHeader>
        {dict.inventory?.exports_title || 'Export Management'}
      </CardHeader>
      <CardBody>
        <ExportList />
      </CardBody>
    </Card>
  )
}


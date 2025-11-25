'use client'

import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import ImportList from '@/components/Page/Inventory/ImportList'
import useDictionary from '@/locales/dictionary-hook'

export default function Page() {
  const dict = useDictionary()

  return (
    <Card>
      <CardHeader>
        {dict.inventory?.imports_title || 'Import Management'}
      </CardHeader>
      <CardBody>
        <ImportList />
      </CardBody>
    </Card>
  )
}


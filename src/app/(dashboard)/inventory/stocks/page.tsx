'use client'
import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import StockList from '@/components/Page/Inventory/StockList'
import useDictionary from '@/locales/dictionary-hook'

export default function Page() {
  const dict = useDictionary()

  return (
    <Card>
      <CardHeader>
        {dict.inventory?.stocks_title || 'Stock Management'}
      </CardHeader>
      <CardBody>
        <StockList />
      </CardBody>
    </Card>
  )
}


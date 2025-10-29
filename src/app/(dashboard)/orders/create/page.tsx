// app/(dashboard)/recipe-standards/page.tsx
'use client'

import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import OrderForm from '@/components/Page/Order/OrderForm'
import useDictionary from '@/locales/dictionary-hook'

export default function RecipeStandardsPage() {
  const dict = useDictionary()

  return (
    <Card>
      <CardHeader>
        <h4>{dict.sidebar?.items?.order || 'Orders'}</h4>
        <div className="text-muted">
          {dict.orders?.title ||
            'Manage orders'}
        </div>
      </CardHeader>
      <CardBody>
        <OrderForm />
      </CardBody>
    </Card>
  )
}

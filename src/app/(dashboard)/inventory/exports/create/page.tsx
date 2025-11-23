'use client'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import ExportForm from '@/components/Page/Inventory/ExportForm'
import useDictionary from '@/locales/dictionary-hook'

export default function Page() {
  const dict = useDictionary()

  return (
    <Card>
      <CardHeader>
        {dict.inventory?.add_export || 'Add New Export'}
      </CardHeader>
      <CardBody>
        <ExportForm />
      </CardBody>
    </Card>
  )
}


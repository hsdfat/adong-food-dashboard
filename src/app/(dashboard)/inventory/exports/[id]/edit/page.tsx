'use client'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import ExportForm from '@/components/Page/Inventory/ExportForm'
import useDictionary from '@/locales/dictionary-hook'

interface PageProps {
  params: {
    id: string
  }
}

export default function Page({ params }: PageProps) {
  const dict = useDictionary()

  return (
    <Card>
      <CardHeader>
        {dict.inventory?.edit_export || 'Edit Export'}
      </CardHeader>
      <CardBody>
        <ExportForm exportId={params.id} isEdit={true} />
      </CardBody>
    </Card>
  )
}


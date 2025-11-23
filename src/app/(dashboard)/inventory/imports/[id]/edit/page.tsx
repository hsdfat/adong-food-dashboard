'use client';
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import ImportForm from '@/components/Page/Inventory/ImportForm'
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
        {dict.inventory?.edit_import || 'Edit Import'}
      </CardHeader>
      <CardBody>
        <ImportForm importId={params.id} isEdit={true} />
      </CardBody>
    </Card>
  )
}


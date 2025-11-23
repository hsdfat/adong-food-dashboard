'use client';

import { Card, CardBody, CardHeader } from 'react-bootstrap';
import ImportForm from '@/components/Page/Inventory/ImportForm'
import useDictionary from '@/locales/dictionary-hook'

export default function Page() {
  const dict = useDictionary()

  return (
    <Card>
      <CardHeader>
        {dict.inventory?.add_import || 'Add New Import'}
      </CardHeader>
      <CardBody>
        <ImportForm />
      </CardBody>
    </Card>
  )
}


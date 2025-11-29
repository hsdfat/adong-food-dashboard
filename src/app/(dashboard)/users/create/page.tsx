'use client'

import { Card, CardBody, CardHeader } from 'react-bootstrap'
import UserForm from '@/components/Page/User/UserForm'
import useDictionary from '@/locales/dictionary-hook'

export default function Page() {
  const dict = useDictionary()

  return (
    <Card>
      <CardHeader>{dict.users?.add_new || 'Add New User'}</CardHeader>
      <CardBody>
        <UserForm />
      </CardBody>
    </Card>
  )
}

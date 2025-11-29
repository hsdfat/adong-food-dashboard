'use client'

import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import UserList from '@/components/Page/User/UserList'
import useDictionary from '@/locales/dictionary-hook'

export default function Page() {
  const dict = useDictionary()

  return (
    <Card>
      <CardHeader>
        {dict.users?.title || 'User Management'}
      </CardHeader>
      <CardBody>
        <UserList />
      </CardBody>
    </Card>
  )
}

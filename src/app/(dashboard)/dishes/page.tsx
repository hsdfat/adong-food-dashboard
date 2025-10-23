'use client'
import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import DishesList from '@/components/Page/Dish/DishesList'

export default async function Page() {
console.log('Fetching dictionary for dishes page')
  return (
    <Card>
      <CardBody>
      </CardBody>
      <DishesList />
    </Card>
  )
}
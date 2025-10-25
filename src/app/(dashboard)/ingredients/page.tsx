'use client'
import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import IngredientsList from '@/components/Page/Ingredient/IngredientList'
import useDictionary from '@/locales/dictionary-hook'

export default async function Page() {
  const dict = useDictionary()

  return (
    <Card>
      <CardHeader>
        {dict.sidebar.items?.ingredients || 'Ingredients'}
      </CardHeader>
      <CardBody>
        <IngredientsList />
      </CardBody>
    </Card>
  )
}

import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import IngredientsList from '@/components/Page/Ingredient/IngredientList'
import { getDictionary } from '@/locales/dictionary'

export default async function Page() {
  const dict = await getDictionary()

  return (
    <Card>
      {/* <CardHeader>
        {dict.sidebar.items?.ingredients || 'Ingredients'}
      </CardHeader> */}
      <CardBody>
        <IngredientsList />
      </CardBody>
    </Card>
  )
}
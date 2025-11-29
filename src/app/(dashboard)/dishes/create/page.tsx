'use client'

import { Card, CardBody, CardHeader } from 'react-bootstrap'
import DishWithRecipeForm from '@/components/Page/Dish/DishWithRecipeForm'
import useDictionary from '@/locales/dictionary-hook'

export default function Page() {
  const dict = useDictionary()
  return (
    <Card>
      <CardHeader>{dict.dishes.add_new}</CardHeader>
      <CardBody>
        <DishWithRecipeForm />
      </CardBody>
    </Card>
  )
}

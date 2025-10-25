'use client'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import IngredientForm from '@/components/Page/Ingredient/IngredientForm'
import useDictionary from '@/locales/dictionary-hook'

export default function Page() {
  const dict = useDictionary()

  return (
    <Card>
      <CardHeader>{dict.ingredients?.add_new || 'Add new'}</CardHeader>
      <CardBody>
        <IngredientForm />
      </CardBody>
    </Card>
  )
}

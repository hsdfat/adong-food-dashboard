'use client'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import DishForm from '@/components/Page/Dish/DishForm'
import useDictionary from '@/locales/dictionary-hook'

export default function Page() {
  const dict = useDictionary()
  return (
    <Card>
      <CardHeader>{dict.dishes.add_new}</CardHeader>
      <CardBody>
        <DishForm />
      </CardBody>
    </Card>
  )
}

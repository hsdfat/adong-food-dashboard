'use server'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import { notFound } from 'next/navigation'
import { dishApi } from '@/services'
import { Dish } from '@/models'
import DishForm from '@/components/Page/Dish/DishForm'

const fetchDish = async (id: string): Promise<Dish | null> => {
  try {
    // Note: This is server-side fetch, need to handle authentication differently
    console.log('Fetching dish with id:', id)
    const response = await dishApi.getById(id)
    return response
  } catch (error) {
    console.error('Error fetching dish:', error)
    return null
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  console.log('Fetching dish with id:', params.id)
  const dish = await fetchDish(params.id)

  if (!dish) {
    return notFound()
  }

  return (
    <Card>
      <CardHeader>Edit Dish: {dish.dishName}</CardHeader>
      <CardBody>
        <DishForm dish={dish} isEdit />
      </CardBody>
    </Card>
  )
}
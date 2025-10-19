'use server'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import KitchenForm from '@/components/Page/Kitchen/KitchenForm'
import { notFound } from 'next/navigation'
import { kitchenApi } from '@/services'
import { Kitchen } from '@/models'

const fetchKitchen = async (id: string): Promise<Kitchen | null> => {
  try {
    // Note: This is server-side fetch, need to handle authentication differently
    console.log('Fetching kitchen with id:', id)
    const response = await kitchenApi.getById(id)
    return response
  } catch (error) {
    console.error('Error fetching kitchen:', error)
    return null
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  console.log('Fetching kitchen with id:', params.id)
  const kitchen = await fetchKitchen(params.id)

  if (!kitchen) {
    return notFound()
  }

  return (
    <Card>
      <CardHeader>Edit Kitchen: {kitchen.kitchenName}</CardHeader>
      <CardBody>
        <KitchenForm kitchen={kitchen} isEdit />
      </CardBody>
    </Card>
  )
}
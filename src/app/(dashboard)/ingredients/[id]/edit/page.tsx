import { Card, CardBody, CardHeader } from 'react-bootstrap'
import IngredientForm from '@/components/Page/Ingredient/IngredientForm'
import { notFound } from 'next/navigation'
import { dishApi, ingredientApi } from '@/services'
import { Ingredient } from '@/models'
import { getDictionary } from '@/locales/dictionary'

const fetchIngredient = async (id: string): Promise<Ingredient | null> => {
 
  try {
    // Note: This is server-side fetch, need to handle authentication differently
    console.log('Fetching ingredient with id:', id)
    const response = await ingredientApi.getById(id)
    return response
  } catch (error) {
    console.error('Error fetching ingredient:', error)
    return null
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const dict = await getDictionary()
  console.log('Fetching ingredient with id:', params.id)
  const ingredient = await fetchIngredient(params.id)

  if (!ingredient) {
    return notFound()
  }

  return (
    <Card>
      <CardHeader>{dict.ingredients?.edit || 'Edit'}: {ingredient.ingredientName}</CardHeader>
      <CardBody>
        <IngredientForm ingredient={ingredient} isEdit />
      </CardBody>
    </Card>
  )
}
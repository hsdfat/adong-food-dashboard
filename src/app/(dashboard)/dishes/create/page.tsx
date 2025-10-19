import { Card, CardBody, CardHeader } from 'react-bootstrap'
import IngredientForm from '@/components/Page/Ingredient/IngredientForm'

export default function Page() {
  return (
    <Card>
      <CardHeader>Add New Ingredient</CardHeader>
      <CardBody>
        <IngredientForm />
      </CardBody>
    </Card>
  )
}
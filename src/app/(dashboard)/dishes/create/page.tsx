import { Card, CardBody, CardHeader } from 'react-bootstrap'
import DishForm from '@/components/Page/Dish/DishForm'

export default function Page() {
  return (
    <Card>
      <CardHeader>Add New Dish</CardHeader>
      <CardBody>
        <DishForm />
      </CardBody>
    </Card>
  )
}
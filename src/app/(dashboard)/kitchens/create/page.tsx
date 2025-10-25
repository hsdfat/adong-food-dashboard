import { Card, CardBody, CardHeader } from 'react-bootstrap'
import KitchenForm from '@/components/Page/Kitchen/KitchenForm'

export default function Page() {
  return (
    <Card>
      <CardHeader>Add New Kitchen</CardHeader>
      <CardBody>
        <KitchenForm />
      </CardBody>
    </Card>
  )
}

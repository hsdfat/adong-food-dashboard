import { Card, CardBody, CardHeader } from 'react-bootstrap'
import SupplierForm from '@/components/Page/Supplier/SupplierForm'

export default function Page() {
  return (
    <Card>
      <CardHeader>Add New Supplier</CardHeader>
      <CardBody>
        <SupplierForm />
      </CardBody>
    </Card>
  )
}

import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import { getDictionary } from '@/locales/dictionary'
import KitchenFavoriteSuppliersList from '@/components/Page/KitchenFavoriteSupplier/KitchenFavoriteSuppliersList'

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const dict = await getDictionary()
  const kitchenId = params.id

  return (
    <Card>
      <CardHeader>
        {dict.kitchens?.favorite_suppliers || 'Kitchen Favorite Suppliers'}
      </CardHeader>
      <CardBody>
        <KitchenFavoriteSuppliersList kitchenId={kitchenId} />
      </CardBody>
    </Card>
  )
}

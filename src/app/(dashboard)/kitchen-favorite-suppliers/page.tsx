import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import { getDictionary } from '@/locales/dictionary'
import KitchenFavoriteSuppliersList from '@/components/Page/KitchenFavoriteSupplier/KitchenFavoriteSuppliersList'

export default async function Page() {
  const dict = await getDictionary()

  return (
    <Card>
      <CardHeader>
        {dict.sidebar.items?.kitchen_favorite_suppliers ||
          'Kitchen Favorite Suppliers'}
      </CardHeader>
      <CardBody>
        <KitchenFavoriteSuppliersList />
      </CardBody>
    </Card>
  )
}

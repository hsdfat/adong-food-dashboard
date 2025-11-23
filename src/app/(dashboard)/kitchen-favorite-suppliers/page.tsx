import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import { getDictionary } from '@/locales/dictionary'
import KitchenFavoriteSuppliersList from '@/components/Page/KitchenFavoriteSupplier/KitchenFavoriteSuppliersList'

interface PageProps {
  searchParams: {
    kitchenId?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const dict = await getDictionary()
  const kitchenId = searchParams.kitchenId || ''

  if (!kitchenId) {
    return (
      <Card>
        <CardBody>
          <div className="alert alert-warning">
            Please provide a kitchen ID in the URL query parameters (e.g., ?kitchenId=xxx)
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        {dict.sidebar.items?.kitchen_favorite_suppliers ||
          'Kitchen Favorite Suppliers'}
      </CardHeader>
      <CardBody>
        <KitchenFavoriteSuppliersList kitchenId={kitchenId} />
      </CardBody>
    </Card>
  )
}

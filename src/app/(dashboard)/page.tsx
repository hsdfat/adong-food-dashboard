import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import { getDictionary } from '@/locales/dictionary'
import { getServerLocale } from '@/locales/server-utils'
import QuickActions from '@/components/Dashboard/QuickActions'

export default async function DashboardPage() {
  const localeCookie = await getServerLocale()
  const dict = await getDictionary(localeCookie)

  return (
    <div>
      <h1>{dict.dashboard?.title || 'Dashboard'}</h1>
      <p>{dict.dashboard?.welcome || 'Welcome to Á Đông Food Management'}</p>

      <Card className="mt-4">
        <CardHeader>
          <h5 className="mb-0">
            {dict.action?.quick_action || 'Hành động nhanh'}
          </h5>
        </CardHeader>
        <CardBody>
          <QuickActions />
        </CardBody>
      </Card>
    </div>
  )
}

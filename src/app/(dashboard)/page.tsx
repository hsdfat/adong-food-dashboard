import React from 'react'
import { Button, Card, CardBody, CardHeader } from 'react-bootstrap'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { getDictionary } from '@/locales/dictionary'
import { getServerLocale } from '@/locales/server-utils'

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
            {dict.action?.quick_action || 'Quick Actions'}
          </h5>
        </CardHeader>
        <CardBody>
          <Link href="/orders/create" passHref legacyBehavior>
            <Button variant="primary" size="lg">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              {dict.orders?.create || 'Tạo phiếu lên đơn món'}
            </Button>
          </Link>
        </CardBody>
      </Card>
    </div>
  )
}

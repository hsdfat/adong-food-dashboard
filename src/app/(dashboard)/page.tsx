import React from 'react'
import { Button, Card, CardBody, CardHeader } from 'react-bootstrap'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardList, faFileImport } from '@fortawesome/free-solid-svg-icons'
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
        <CardBody className="d-flex gap-3 flex-wrap">
          <Link href="/orders/create" passHref legacyBehavior>
            <Button variant="primary" size="lg">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              {dict.orders?.create || 'Tạo phiếu lên đơn món'}
            </Button>
          </Link>
          <Link href="/inventory/imports" passHref legacyBehavior>
            <Button variant="success" size="lg">
              <FontAwesomeIcon icon={faFileImport} className="me-2" />
              {dict.orders?.import_list || 'Danh sách nhập kho'}
            </Button>
          </Link>
        </CardBody>
      </Card>
    </div>
  )
}

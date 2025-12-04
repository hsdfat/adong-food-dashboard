'use client'

import React, { useState } from 'react'
import { Card, CardBody, ButtonGroup, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTable, faList } from '@fortawesome/free-solid-svg-icons'
import OrdersList from '@/components/Page/Order/OrdersList'
import OrdersGroupedList from '@/components/Page/Order/OrdersGroupedList'

export default function OrdersPage() {
  const [viewMode, setViewMode] = useState<'table' | 'grouped'>('grouped')

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-end mb-3">
          <ButtonGroup>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
              onClick={() => setViewMode('table')}
            >
              <FontAwesomeIcon icon={faTable} className="me-1" />
              Table View
            </Button>
            <Button
              variant={viewMode === 'grouped' ? 'primary' : 'outline-primary'}
              onClick={() => setViewMode('grouped')}
            >
              <FontAwesomeIcon icon={faList} className="me-1" />
              Grouped View
            </Button>
          </ButtonGroup>
        </div>
        {viewMode === 'table' ? <OrdersList /> : <OrdersGroupedList />}
      </CardBody>
    </Card>
  )
}

'use client'

import React, { useState } from 'react'
import { Badge, Dropdown, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { useOrderCount } from '@/hooks/use-order-count'
import { orderApi } from '@/services/order-api'
import { OrderDTO } from '@/models/order'
import { OrderPanel } from './OrderPanel'

export interface OrderBadgeProps {
  pollingInterval?: number
  onOrderClick: (orderId: string) => void
  onViewAllClick: () => void
}

export function OrderBadge({
  pollingInterval = 60000,
  onOrderClick,
  onViewAllClick,
}: OrderBadgeProps) {
  const [pendingOrders, setPendingOrders] = useState<OrderDTO[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [showPanel, setShowPanel] = useState(false)

  const { orderCount, loading } = useOrderCount({
    pollingInterval,
    enabled: true,
  })

  const pendingCount = orderCount.pendingCount

  // Fetch top 3 pending orders when dropdown opens
  const fetchPendingOrders = async () => {
    try {
      setLoadingOrders(true)
      const response = await orderApi.getAll({
        status: 'Pending',
        per_page: 3,
        page: 1,
        sortBy: 'created_date',
        sortDir: 'desc',
      })
      setPendingOrders(response.data)
    } catch (error) {
      console.error('Failed to fetch pending orders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleToggle = (isOpen: boolean) => {
    setShowPanel(isOpen)
    if (isOpen) {
      fetchPendingOrders()
    }
  }

  return (
    <Dropdown onToggle={handleToggle} show={showPanel}>
      <Dropdown.Toggle
        as="a"
        className="nav-link px-2 mx-1 px-sm-3 mx-sm-0 position-relative"
        style={{ cursor: 'pointer' }}
      >
        <FontAwesomeIcon icon={faClipboardList} style={{ fontSize: '1.25rem' }} />
        {loading && pendingCount === 0 ? (
          <Spinner
            animation="border"
            size="sm"
            className="position-absolute top-0 start-100 translate-middle"
            style={{ width: '0.75rem', height: '0.75rem' }}
          />
        ) : pendingCount > 0 ? (
          <Badge
            bg="warning"
            text="dark"
            pill
            className="position-absolute top-0 start-100 translate-middle"
          >
            {pendingCount > 99 ? '99+' : pendingCount}
          </Badge>
        ) : null}
      </Dropdown.Toggle>

      {showPanel && (
        <OrderPanel
          orders={pendingOrders}
          loading={loadingOrders}
          totalCount={pendingCount}
          onOrderClick={(orderId) => {
            setShowPanel(false)
            onOrderClick(orderId)
          }}
          onViewAllClick={() => {
            setShowPanel(false)
            onViewAllClick()
          }}
          onClose={() => setShowPanel(false)}
        />
      )}
    </Dropdown>
  )
}

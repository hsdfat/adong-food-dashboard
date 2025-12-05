'use client'

import React from 'react'
import { Dropdown, Spinner, ListGroup, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { OrderDTO } from '@/models/order'
import useDictionary from '@/locales/dictionary-hook'

export interface OrderPanelProps {
  orders: OrderDTO[]
  loading: boolean
  totalCount: number
  onOrderClick: (orderId: string) => void
  onViewAllClick: () => void
  onClose: () => void
}

export function OrderPanel({
  orders,
  loading,
  totalCount,
  onOrderClick,
  onViewAllClick,
}: OrderPanelProps) {
  const dict = useDictionary()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  return (
    <Dropdown.Menu align="end" style={{ minWidth: '320px', maxWidth: '400px' }} show>
      <Dropdown.Header className="d-flex justify-content-between align-items-center">
        <span>{dict.orders?.pending_orders || 'Pending Orders'}</span>
        <Badge bg="warning" text="dark">
          {totalCount}
        </Badge>
      </Dropdown.Header>
      <Dropdown.Divider />

      {loading ? (
        <div className="text-center py-3">
          <Spinner animation="border" size="sm" />
        </div>
      ) : orders.length > 0 ? (
        <>
          <ListGroup variant="flush">
            {orders.map((order) => (
              <ListGroup.Item
                key={order.orderId}
                action
                onClick={() => onOrderClick(order.orderId)}
                className="px-3 py-2"
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="fw-semibold text-truncate">
                      {order.orderId}
                    </div>
                    <small className="text-muted">
                      {order.kitchenName || order.kitchenId}
                    </small>
                    <div className="mt-1">
                      <small className="text-muted">
                        {formatDate(order.orderDate)}
                      </small>
                    </div>
                  </div>
                  <FontAwesomeIcon
                    icon={faEye}
                    className="text-muted ms-2"
                    size="sm"
                  />
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Dropdown.Divider />
          <Dropdown.Item
            onClick={onViewAllClick}
            className="text-center text-primary fw-semibold"
          >
            {dict.common?.view_all || 'View All'} ({totalCount})
          </Dropdown.Item>
        </>
      ) : (
        <div className="text-center py-3 text-muted">
          <small>{dict.orders?.no_pending_orders || 'No pending orders'}</small>
        </div>
      )}
    </Dropdown.Menu>
  )
}

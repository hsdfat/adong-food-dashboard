'use client'

import React from 'react'
import { Table, Alert } from 'react-bootstrap'
import { OrderDTO } from '@/models/order'
import useDictionary from '@/locales/dictionary-hook'
import OrderRow from './OrderRow'

interface OrderTableProps {
  orders: OrderDTO[];
  allStatuses: string[];
  hasActiveFilters: boolean;
  getCurrentStatus: (orderId: string) => string;
  isStatusChanged: (orderId: string) => boolean;
  isSavingStatus: (orderId: string) => boolean;
  getStatusColors: (status: string) => { bg: string; text: string; border: string };
  onStatusChange: (orderId: string, newStatus: string) => void;
  onSaveStatus: (orderId: string) => void;
  onDiscardStatus: (orderId: string) => void;
  onView: (orderId: string) => void;
  onViewIngredients: (orderId: string) => void;
  onViewSupplierRequests: (orderId: string) => void;
  onDelete: (orderId: string) => void;
}

export default function OrderTable({
  orders,
  allStatuses,
  hasActiveFilters,
  getCurrentStatus,
  isStatusChanged,
  isSavingStatus,
  getStatusColors,
  onStatusChange,
  onSaveStatus,
  onDiscardStatus,
  onView,
  onViewIngredients,
  onViewSupplierRequests,
  onDelete,
}: OrderTableProps) {
  const dict = useDictionary()
  
  if (orders.length === 0) {
    return (
      <Alert variant="info" className="mb-0">
        {hasActiveFilters
          ? (dict.orders?.labels?.no_orders_match_filters || 'No orders found matching the filters')
          : (dict.orders?.labels?.no_orders || 'No orders yet')}
      </Alert>
    )
  }

  return (
    <div className="table-responsive">
      <Table striped bordered hover>
        <thead className="table-light">
          <tr>
            <th className="table-priority-column">{dict.orders?.columns?.orderId || 'Order ID'}</th>
            <th className="table-priority-column">{dict.orders?.table_headers?.kitchen || 'Kitchen'}</th>
            <th className="table-non-priority-column">{dict.orders?.table_headers?.order_date || 'Order Date'}</th>
            <th className="table-non-priority-column">{dict.orders?.table_headers?.status || 'Status'}</th>
            <th className="table-non-priority-column">{dict.orders?.table_headers?.created_by || 'Created By'}</th>
            <th className="table-non-priority-column">{dict.orders?.table_headers?.details_count || 'Details Count'}</th>
            <th className="text-center table-non-priority-column table-actions-column">{dict.common?.actions || 'Actions'}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow
              key={order.orderId}
              order={order}
              allStatuses={allStatuses}
              getCurrentStatus={getCurrentStatus}
              isStatusChanged={isStatusChanged}
              isSavingStatus={isSavingStatus}
              getStatusColors={getStatusColors}
              onStatusChange={onStatusChange}
              onSaveStatus={onSaveStatus}
              onDiscardStatus={onDiscardStatus}
              onView={onView}
              onViewIngredients={onViewIngredients}
              onViewSupplierRequests={onViewSupplierRequests}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </Table>
    </div>
  )
}


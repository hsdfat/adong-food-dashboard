'use client'

import React from 'react'
import { Table, Alert } from 'react-bootstrap'
import { OrderDTO } from '@/models/order'
import OrderRow from './OrderRow'

interface OrderTableProps {
  orders: OrderDTO[]
  allStatuses: string[]
  hasActiveFilters: boolean
  getCurrentStatus: (orderId: string) => string
  isStatusChanged: (orderId: string) => boolean
  isSavingStatus: (orderId: string) => boolean
  getStatusColors: (status: string) => { bg: string; text: string; border: string }
  onStatusChange: (orderId: string, newStatus: string) => void
  onSaveStatus: (orderId: string) => void
  onDiscardStatus: (orderId: string) => void
  onView: (orderId: string) => void
  onViewIngredients: (orderId: string) => void
  onViewSupplierRequests: (orderId: string) => void
  onDelete: (orderId: string) => void
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
  if (orders.length === 0) {
    return (
      <Alert variant="info" className="mb-0">
        {hasActiveFilters
          ? 'Không tìm thấy đơn hàng nào phù hợp với bộ lọc.'
          : 'Chưa có đơn hàng nào.'}
      </Alert>
    )
  }

  return (
    <div className="table-responsive">
      <Table striped bordered hover>
        <thead className="table-light">
          <tr>
            <th className="table-priority-column">Mã đơn hàng</th>
            <th className="table-priority-column">Bếp</th>
            <th className="table-non-priority-column">Ngày lên đơn</th>
            <th className="table-non-priority-column">Trạng thái</th>
            <th className="table-non-priority-column">Người tạo</th>
            <th className="table-non-priority-column">Chi tiết</th>
            <th className="text-center table-non-priority-column">Thao tác</th>
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


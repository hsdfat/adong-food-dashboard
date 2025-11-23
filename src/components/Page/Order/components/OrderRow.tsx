'use client'

import React from 'react'
import { OrderDTO } from '@/models/order'
import StatusSelect from './StatusSelect'
import OrderActions from './OrderActions'

interface OrderRowProps {
  order: OrderDTO
  allStatuses: string[]
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

export default function OrderRow({
  order,
  allStatuses,
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
}: OrderRowProps) {
  const orderId = String(order.orderId)
  const currentStatus = getCurrentStatus(orderId)
  const colors = getStatusColors(currentStatus)
  const isChanged = isStatusChanged(orderId)
  const isSaving = isSavingStatus(orderId)

  return (
    <tr>
      <td className="table-priority-column">
        <strong>#{order.orderId}</strong>
      </td>
      <td className="table-priority-column">
        <div>
          <div>{order.kitchenName}</div>
          <small className="text-muted">{order.kitchenId}</small>
        </div>
      </td>
      <td className="table-non-priority-column">
        {new Date(order.orderDate).toLocaleDateString('vi-VN')}
      </td>
      <td className="table-non-priority-column">
        <StatusSelect
          currentStatus={currentStatus}
          allStatuses={allStatuses}
          isChanged={isChanged}
          isSaving={isSaving}
          colors={colors}
          onStatusChange={(newStatus) => onStatusChange(orderId, newStatus)}
          onSave={() => onSaveStatus(orderId)}
          onDiscard={() => onDiscardStatus(orderId)}
        />
      </td>
      <td className="table-non-priority-column">
        <div>
          <div>{order.createdByName}</div>
          <small className="text-muted">{order.createdByUserId}</small>
        </div>
      </td>
      <td className="table-non-priority-column">
        <div>
          {order.details?.length || 0} món ăn
          {order.supplementaries && order.supplementaries.length > 0 && (
            <div className="text-muted small">
              + {order.supplementaries.length} thực phẩm bổ sung
            </div>
          )}
        </div>
      </td>
      <td className="text-center table-non-priority-column">
        <OrderActions
          orderId={orderId}
          onView={onView}
          onViewIngredients={onViewIngredients}
          onViewSupplierRequests={onViewSupplierRequests}
          onDelete={onDelete}
        />
      </td>
    </tr>
  )
}


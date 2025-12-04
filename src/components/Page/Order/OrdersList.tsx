'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { orderApi } from '@/services'
import { OrderDTO } from '@/models/order'
import { ResourceCollection } from '@/models/resource'
import useDictionary from '@/locales/dictionary-hook'
import { useNotification } from '@/components/Common/Notification/NotificationProvider'
import MasterDataListPage from '@/components/Common/MasterDataListPage'
import {
  TableColumn,
  TableAction,
} from '@/components/Common/MasterDataTable/MasterDataTable'
import StatusCell from './components/StatusCell'

const COMMON_STATUSES = [
  'Pending',
  'Approved',
  'Completed',
  'Cancelled',
  'Rejected',
]

export default function OrdersList() {
  const [ordersData, setOrdersData] =
    useState<ResourceCollection<OrderDTO> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()
  const { addNotification } = useNotification()

  const loadOrders = async (
    page: number,
    perPage: number,
    search: string,
  ) => {
    try {
      setLoading(true)
      setError('')

      const data = await orderApi.getAll({
        page,
        per_page: perPage,
        search: search || undefined,
      })

      setOrdersData(data)
    } catch (err: any) {
      setError(
        err?.message ||
          dict.orders?.error_load ||
          'Không thể tải danh sách đơn hàng',
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    await orderApi.delete(parseInt(id))
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await orderApi.updateStatus(orderId, newStatus)
      addNotification({
        type: 'success',
        title: dict.common?.success || 'Thành công',
        message:
          dict.orders?.status_updated ||
          'Cập nhật trạng thái đơn hàng thành công.',
      })
      // Reload orders to reflect changes
      const page = 1 // You can maintain current page if needed
      const perPage = 10
      await loadOrders(page, perPage, '')
    } catch (err: any) {
      console.error('[OrdersList] Status update error:', err)
      addNotification({
        type: 'error',
        title: dict.common?.error || 'Lỗi',
        message:
          err?.message ||
          dict.orders?.error_update_status ||
          'Không thể cập nhật trạng thái đơn hàng.',
      })
      throw err
    }
  }

  // Get all unique statuses from loaded orders
  const allStatuses = useMemo(() => {
    const statusSet = new Set<string>(COMMON_STATUSES)
    ordersData?.data?.forEach((order) => {
      if (order.status) {
        statusSet.add(order.status)
      }
    })
    return Array.from(statusSet).sort()
  }, [ordersData?.data])

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'orderId',
      label: dict.orders?.id || 'Mã đơn',
      align: 'left',
      priority: true,
    },
    {
      key: 'status',
      label: dict.orders?.status || 'Trạng thái',
      align: 'left',
      priority: true,
      render: (_value, row) => {
        const order = row as OrderDTO
        // Ensure orderId exists and is valid
        if (!order.orderId) {
          console.error('[OrdersList] Missing orderId for order:', order)
          return <span>-</span>
        }
        return (
          <StatusCell
            orderId={String(order.orderId)}
            currentStatus={order.status || 'Pending'}
            allStatuses={allStatuses}
            onSave={handleUpdateStatus}
          />
        )
      },
    },
    {
      key: 'orderDate',
      label: dict.orders?.order_date || 'Ngày đặt hàng',
      align: 'left',
      render: (value) =>
        value ? new Date(value as string | number).toLocaleDateString() : '-',
    },
    {
      key: 'eventDate',
      label: dict.orders?.event_date || 'Ngày sự kiện',
      align: 'left',
      render: (value) =>
        value ? new Date(value as string | number).toLocaleDateString() : '-',
    },
    {
      key: 'totalAmount',
      label: dict.orders?.total_amount || 'Tổng tiền',
      align: 'right',
      render: (value) => (value ? `$${Number(value).toFixed(2)}` : '-'),
    },
  ]

  // Define table actions
  const actions: TableAction[] = [
    {
      label: dict.action?.view || 'Xem chi tiết',
      onClick: async (row: unknown) => {
        const order = row as OrderDTO
        router.push(`/orders/${order.orderId}`)
      },
    },
    {
      label: dict.action?.ingredients || 'Nguyên liệu',
      onClick: async (row: unknown) => {
        const order = row as OrderDTO
        router.push(`/orders/${order.orderId}/ingredients/summary`)
      },
    },
    {
      label: dict.action?.supplier_requests || 'Yêu cầu nhà cung cấp',
      onClick: async (row: unknown) => {
        const order = row as OrderDTO
        router.push(`/orders/${order.orderId}/supplier-requests`)
      },
    },
  ]

  return (
    <MasterDataListPage<OrderDTO>
      title={dict.orders?.title || 'Quản lý đơn hàng'}
      addNewLabel={dict.orders?.create || 'Tạo đơn hàng'}
      createPath="/orders/create"
      searchPlaceholder={
        dict.orders?.search_placeholder || 'Tìm kiếm đơn hàng...'
      }
      emptyMessage={dict.orders?.no_data || 'Không có đơn hàng nào'}
      loadingMessage={dict.orders?.loading || 'Đang tải danh sách đơn hàng...'}
      columns={columns}
      actions={actions}
      data={ordersData}
      loading={loading}
      error={error}
      onLoadData={loadOrders}
      onDelete={handleDelete}
      onError={setError}
      getItemName={(order) => `Order #${order.orderId}`}
      getItemId={(order) => String(order.orderId)}
      basePath="/orders"
      dictKey="orders"
      actionsColumnPosition="orderId"
    />
  )
}

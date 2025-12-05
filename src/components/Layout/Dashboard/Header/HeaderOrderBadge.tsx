'use client'

import { OrderBadge } from '@/components/Common/Order/OrderBadge'
import { useRouter } from 'next/navigation'

export default function HeaderOrderBadge() {
  const router = useRouter()

  const handleOrderClick = (orderId: string) => {
    router.push(`/orders/${orderId}`)
  }

  const handleViewAllClick = () => {
    router.push('/orders?status=Pending')
  }

  return (
    <OrderBadge
      pollingInterval={60000}
      onOrderClick={handleOrderClick}
      onViewAllClick={handleViewAllClick}
    />
  )
}

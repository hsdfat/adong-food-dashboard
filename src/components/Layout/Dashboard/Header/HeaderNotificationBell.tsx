'use client'

import { NotificationBell } from '@/components/Common/Notification/NotificationBell'
import { NavLink } from 'react-bootstrap'

export default function HeaderNotificationBell() {
  // Get polling interval from environment variable, default to 5 minutes (300000ms)
  const pollingInterval = process.env.NEXT_PUBLIC_NOTIFICATION_POLLING_INTERVAL
    ? parseInt(process.env.NEXT_PUBLIC_NOTIFICATION_POLLING_INTERVAL, 10)
    : 300000

  return (
    <NavLink className="px-2 mx-1 px-sm-3 mx-sm-0">
      <NotificationBell pollingInterval={pollingInterval} />
    </NavLink>
  )
}

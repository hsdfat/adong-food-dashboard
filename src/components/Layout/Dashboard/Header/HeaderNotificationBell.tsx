'use client'

import { NotificationBell } from '@/components/Common/Notification/NotificationBell'
import { NavLink } from 'react-bootstrap'

export default function HeaderNotificationBell() {
  return (
    <NavLink className="px-2 mx-1 px-sm-3 mx-sm-0">
      <NotificationBell pollingInterval={30000} />
    </NavLink>
  )
}

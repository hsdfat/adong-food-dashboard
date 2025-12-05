'use client'

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-regular-svg-icons'
import { useNotifications } from '@/hooks/use-notifications'
import { NotificationPanel } from './NotificationPanel'

export interface NotificationBellProps {
  pollingInterval?: number
}

export function NotificationBell({
  pollingInterval = 30000,
}: NotificationBellProps) {
  const [showPanel, setShowPanel] = useState(false)
  const { count, notifications, loading, markAsRead, refresh } =
    useNotifications({
      pollingInterval,
      enabled: true,
      maxNotifications: 10,
    })

  const handleTogglePanel = () => {
    setShowPanel(!showPanel)
    if (!showPanel) {
      refresh()
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId)
  }

  const unreadCount = count?.unreadCount || 0

  return (
    <div className="notification-bell-container position-relative d-inline-block">
      <div
        className="position-relative cursor-pointer"
        onClick={handleTogglePanel}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleTogglePanel()
          }
        }}
        aria-label="Notifications"
      >
        <FontAwesomeIcon icon={faBell} style={{ fontSize: '1.25rem' }} />
        {unreadCount > 0 && (
          <span
            className="position-absolute translate-middle badge rounded-pill bg-danger"
            style={{ top: '-2px', left: '100%', fontSize: '0.65rem' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
            <span className="visually-hidden">unread notifications</span>
          </span>
        )}
      </div>

      {showPanel && (
        <NotificationPanel
          notifications={notifications}
          loading={loading}
          onClose={() => setShowPanel(false)}
          onMarkAsRead={handleMarkAsRead}
          onRefresh={refresh}
        />
      )}

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

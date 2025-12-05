'use client'

import React, { useEffect, useRef } from 'react'
import { Notification, NotificationPriority } from '@/models/notification'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import Link from 'next/link'

export interface NotificationPanelProps {
  notifications: Notification[]
  loading: boolean
  onClose: () => void
  onMarkAsRead: (notificationId: string) => void
  onRefresh: () => void
}

export function NotificationPanel({
  notifications,
  loading,
  onClose,
  onMarkAsRead,
  onRefresh,
}: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case NotificationPriority.URGENT:
        return 'bg-danger'
      case NotificationPriority.HIGH:
        return 'bg-warning'
      case NotificationPriority.NORMAL:
        return 'bg-info'
      case NotificationPriority.LOW:
        return 'bg-secondary'
      default:
        return 'bg-info'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_created':
        return 'bi-cart-plus'
      case 'order_status_changed':
        return 'bi-arrow-repeat'
      case 'supplier_request_due':
        return 'bi-clock'
      case 'inventory_low':
        return 'bi-exclamation-triangle'
      case 'system_alert':
        return 'bi-info-circle'
      default:
        return 'bi-bell'
    }
  }

  const getNotificationLink = (notification: Notification) => {
    if (
      notification.relatedEntityType === 'order' &&
      notification.relatedEntityId
    ) {
      return `/orders/${notification.relatedEntityId}`
    }
    return null
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.notificationId)
    }
  }

  return (
    <div
      ref={panelRef}
      className="notification-panel position-absolute bg-white border rounded shadow-lg"
      style={{
        top: '100%',
        right: 0,
        width: '400px',
        maxHeight: '500px',
        zIndex: 1050,
        marginTop: '0.5rem',
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h6 className="mb-0 fw-bold">Notifications</h6>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-link p-0"
            onClick={onRefresh}
            disabled={loading}
            aria-label="Refresh notifications"
          >
            <i
              className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`}
            ></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-link p-0"
            onClick={onClose}
            aria-label="Close notifications"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <div className="notification-list overflow-auto" style={{ maxHeight: '400px' }}>
        {loading && notifications.length === 0 ? (
          <div className="text-center p-4">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-4 text-muted">
            <i className="bi bi-inbox fs-1"></i>
            <p className="mt-2 mb-0">No new notifications</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const link = getNotificationLink(notification)
            const content = (
              <div
                className={`notification-item p-3 border-bottom ${
                  !notification.isRead ? 'bg-light' : ''
                } ${link ? 'cursor-pointer' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="d-flex gap-2">
                  <div className="flex-shrink-0">
                    <i
                      className={`bi ${getNotificationIcon(notification.notificationType)} fs-5 text-primary`}
                    ></i>
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                      <h6 className="mb-0 fw-semibold">{notification.title}</h6>
                      <span
                        className={`badge ${getPriorityBadgeClass(notification.priority)} text-uppercase`}
                        style={{ fontSize: '0.65rem' }}
                      >
                        {notification.priority}
                      </span>
                    </div>
                    {notification.message && (
                      <p className="mb-1 text-muted small">
                        {notification.message}
                      </p>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {formatDistanceToNow(
                          new Date(notification.createdDate),
                          {
                            addSuffix: true,
                            locale: vi,
                          },
                        )}
                      </small>
                      {!notification.isRead && (
                        <span className="badge bg-primary rounded-circle p-1">
                          <span className="visually-hidden">Unread</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )

            return link ? (
              <Link
                key={notification.notificationId}
                href={link}
                className="text-decoration-none text-dark"
                onClick={onClose}
              >
                {content}
              </Link>
            ) : (
              <div key={notification.notificationId}>{content}</div>
            )
          })
        )}
      </div>

      <div className="p-2 border-top text-center">
        <Link
          href="/notifications"
          className="btn btn-sm btn-link text-decoration-none"
          onClick={onClose}
        >
          View All Notifications
        </Link>
      </div>

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .cursor-pointer:hover {
          background-color: #f8f9fa !important;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}

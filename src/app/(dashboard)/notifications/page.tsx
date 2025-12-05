'use client'

import React, { useState, useEffect } from 'react'
import { Card, Badge, Button, Form } from 'react-bootstrap'
import { notificationApi } from '@/services/notification-api'
import { Notification, NotificationPriority } from '@/models/notification'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import Link from 'next/link'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const perPage = 20

  useEffect(() => {
    fetchNotifications()
  }, [filter, page])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const data = await notificationApi.getAll({
        page,
        per_page: perPage,
        is_read: filter === 'unread' ? false : undefined,
        sortBy: 'created_date',
        sortDir: 'desc',
      })
      setNotifications(data.data)
      setTotalPages(data.meta.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n,
        ),
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case NotificationPriority.URGENT:
        return 'danger'
      case NotificationPriority.HIGH:
        return 'warning'
      case NotificationPriority.NORMAL:
        return 'info'
      case NotificationPriority.LOW:
        return 'secondary'
      default:
        return 'info'
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

  return (
    <div className="notifications-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Notifications</h2>
        <div className="d-flex gap-2">
          <Form.Select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as 'all' | 'unread')
              setPage(1)
            }}
            style={{ width: 'auto' }}
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
          </Form.Select>
          <Button variant="outline-primary" onClick={fetchNotifications}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <i className="bi bi-inbox fs-1 text-muted"></i>
            <p className="mt-3 mb-0 text-muted">
              {filter === 'unread'
                ? 'No unread notifications'
                : 'No notifications'}
            </p>
          </Card.Body>
        </Card>
      ) : (
        <>
          <div className="notifications-list">
            {notifications.map((notification) => {
              const link = getNotificationLink(notification)
              return (
                <Card
                  key={notification.notificationId}
                  className={`mb-3 ${!notification.isRead ? 'border-primary' : ''}`}
                >
                  <Card.Body>
                    <div className="d-flex gap-3">
                      <div className="flex-shrink-0">
                        <i
                          className={`bi ${getNotificationIcon(notification.notificationType)} fs-3 text-primary`}
                        ></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h5 className="mb-1">
                              {notification.title}
                              {!notification.isRead && (
                                <Badge bg="primary" className="ms-2">
                                  New
                                </Badge>
                              )}
                            </h5>
                            <small className="text-muted">
                              {formatDistanceToNow(
                                new Date(notification.createdDate),
                                {
                                  addSuffix: true,
                                  locale: vi,
                                },
                              )}
                            </small>
                          </div>
                          <Badge bg={getPriorityBadgeClass(notification.priority)}>
                            {notification.priority}
                          </Badge>
                        </div>
                        {notification.message && (
                          <p className="mb-2">{notification.message}</p>
                        )}
                        <div className="d-flex gap-2">
                          {link && (
                            <Link href={link} className="btn btn-sm btn-primary">
                              View Details
                            </Link>
                          )}
                          {!notification.isRead && (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                handleMarkAsRead(notification.notificationId)
                              }
                            >
                              Mark as Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-4">
              <Button
                variant="outline-primary"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <i className="bi bi-chevron-left"></i> Previous
              </Button>
              <span className="align-self-center px-3">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline-primary"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next <i className="bi bi-chevron-right"></i>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

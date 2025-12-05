export interface Notification {
  notificationId: string;
  notificationType: string;
  title: string;
  message?: string;
  targetRole?: string;
  targetUserId?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  isRead: boolean;
  readAt?: string;
  priority: string;
  createdByUserId?: string;
  createdDate: string;
  modifiedDate: string;
  createdBy?: {
    userId: string;
    userName: string;
    fullName: string;
  };
}

export interface CreateNotificationInput {
  notificationType: string;
  title: string;
  message?: string;
  targetRole?: string;
  targetUserId?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  priority?: string;
}

export interface NotificationCountResponse {
  unreadCount: number;
  totalCount: number;
}

export const NotificationType = {
  ORDER_CREATED: 'order_created',
  ORDER_STATUS_CHANGED: 'order_status_changed',
  SUPPLIER_REQUEST_DUE: 'supplier_request_due',
  INVENTORY_LOW: 'inventory_low',
  SYSTEM_ALERT: 'system_alert',
} as const;

export const NotificationPriority = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

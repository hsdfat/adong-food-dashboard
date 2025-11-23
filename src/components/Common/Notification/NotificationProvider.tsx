'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    )
  }
  return context
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newNotification = { ...notification, id };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto-remove notification after duration (default 5 seconds)
      const duration = notification.duration || 5000;
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    },
    [removeNotification],
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return faCheckCircle;
      case 'error':
        return faExclamationTriangle;
      case 'warning':
        return faExclamationTriangle;
      case 'info':
        return faInfoCircle;
      default:
        return faInfoCircle;
    }
  };

  const getBgVariant = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const contextValue = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      clearNotifications,
    }),
    [notifications, addNotification, removeNotification, clearNotifications],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}

      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 1050 }}
      >
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            bg={getBgVariant(notification.type)}
            onClose={() => removeNotification(notification.id)}
            show
            delay={notification.duration || 5000}
            autohide
          >
            <Toast.Header className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon
                  icon={getIcon(notification.type)}
                  className={`me-2 text-${getBgVariant(notification.type)}`}
                />
                <strong className="me-auto">{notification.title}</strong>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => removeNotification(notification.id)}
                aria-label="Close"
              />
            </Toast.Header>
            {notification.message && (
              <Toast.Body className="text-white">
                {notification.message}
              </Toast.Body>
            )}
          </Toast>
        ))}
      </ToastContainer>
    </NotificationContext.Provider>
  )
}

export default NotificationProvider

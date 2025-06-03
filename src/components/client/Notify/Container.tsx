import React, { useState, useEffect } from 'react'
import { NotificationItem } from './item'
import { NotificationOptions } from '@/type/notification'

interface Notification extends NotificationOptions {
  id: string
}

declare global {
  interface Window {
    __addNotification?: (
      notification: NotificationOptions
    ) => Promise<Notification>
    __removeNotification?: (id: string) => void
    __clearNotifications?: () => void
  }
}

export const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Register global functions
    window.__addNotification = (notification: NotificationOptions) => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const newNotification: Notification = { ...notification, id }

      setNotifications((prev) => [...prev, newNotification])

      return Promise.resolve(newNotification)
    }

    window.__removeNotification = (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }

    window.__clearNotifications = () => {
      setNotifications([])
    }

    return () => {
      delete window.__addNotification
      delete window.__removeNotification
      delete window.__clearNotifications
    }
  }, [])

  const handleRemoveNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          {...notification}
          onClose={handleRemoveNotification}
        />
      ))}
    </div>
  )
}

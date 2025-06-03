import { NotificationOptions } from '@/type/notification'
import notificationInstance from './NotificationSingleton'

export const notify = (options: NotificationOptions) => {
  return notificationInstance.notify(options)
}

export const clearNotifications = () => {
  return notificationInstance.clear()
}

export const notifySuccess = (
  title?: string,
  description?: string,
  duration?: number
) => {
  return notify({ variant: 'success', title, description, duration })
}

export const notifyError = (
  title?: string,
  description?: string,
  duration?: number
) => {
  return notify({ variant: 'error', title, description, duration })
}

export const notifyWarning = (
  title?: string,
  description?: string,
  duration?: number
) => {
  return notify({ variant: 'warning', title, description, duration })
}

export const notifyInfo = (
  title?: string,
  description?: string,
  duration?: number
) => {
  return notify({ variant: 'info', title, description, duration })
}

export interface NotificationOptions {
  variant?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  description?: string
  duration?: number
  className?: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface NotificationItem extends NotificationOptions {
  id: string
  onClose: (id: string) => void
}

export interface VariantConfig {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  className: string
}

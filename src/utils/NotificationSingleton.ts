import { NotificationContainer } from '@/components/client/Notify/Container'
import { NotificationOptions } from '@/type/notification'
import React from 'react'

class NotificationSingleton {
  private isInitialized = false

  constructor() {
    this.init()
  }

  private init(): void {
    if (this.isInitialized) return

    // Create container element
    const container = document.createElement('div')
    container.id = 'notification-root'
    document.body.appendChild(container)

    // Create React root and render container
    import('react-dom/client')
      .then(({ createRoot }) => {
        const root = createRoot(container)
        root.render(React.createElement(NotificationContainer))
      })
      .catch((error) => {
        console.error('Failed to initialize notification system:', error)
      })

    this.isInitialized = true
  }

  async notify(options: NotificationOptions = {}): Promise<any> {
    const { variant = 'success', title, description, duration = 5000 } = options

    // Wait for initialization
    let attempts = 0
    while (!window.__addNotification && attempts < 50) {
      await new Promise((resolve) => setTimeout(resolve, 10))
      attempts++
    }

    if (window.__addNotification) {
      return window.__addNotification({
        variant,
        title,
        description,
        duration,
      })
    }

    throw new Error('Notification system not initialized')
  }

  async clear(): Promise<void> {
    if (window.__clearNotifications) {
      window.__clearNotifications()
    }
  }
}

// Create singleton instance
const notificationInstance = new NotificationSingleton()

export default notificationInstance

import { useEffect, useState } from 'react'
import { NOTIFICATION_VARIANTS } from '@/configs/NotificationVariant'
import { NotificationItem as NotificationItemProps } from '@/type/notification'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { twMerge } from 'tailwind-merge'

export const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  variant = 'success',
  title,
  description,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const variantConfig =
    NOTIFICATION_VARIANTS[variant] || NOTIFICATION_VARIANTS.success

  const IconComponent =
    NOTIFICATION_VARIANTS[variant].icon || variantConfig.icon

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10)

    const removeTimer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => {
      clearTimeout(timer)
      clearTimeout(removeTimer)
    }
  }, [duration])

  const handleClose = () => {
    setIsRemoving(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  return (
    <div
      className={twMerge(
        isVisible && !isRemoving
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0',
        'transform transition-all duration-300 ease-in-out mb-3'
      )}
    >
      <Alert
        className={twMerge(
          variantConfig.className,
          'max-w-sm shadow-lg relative pr-12'
        )}
      >
        <IconComponent
          className={twMerge(
            (variant === 'success' && '!text-green-800') ||
              (variant === 'error' && '!text-red-800') ||
              (variant === 'warning' && '!text-yellow-800'),
            'h-4 w-4 '
          )}
        />
        <AlertTitle className="ml-2">{title || variantConfig.title}</AlertTitle>
        <AlertDescription className="ml-2">
          {description || variantConfig.description}
        </AlertDescription>
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
        >
          x
        </button>
      </Alert>
    </div>
  )
}

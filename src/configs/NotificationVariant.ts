import { VariantConfig } from '@/type/notification'
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react'

export const NOTIFICATION_VARIANTS: Record<string, VariantConfig> = {
  success: {
    icon: CheckCircle2,
    title: 'Success!',
    description: 'Your changes have been saved successfully.',
    className: 'border border-green-500 bg-green-50 text-green-800',
  },
  error: {
    icon: XCircle,
    title: 'Error!',
    description: 'Something went wrong. Please try again.',
    className: 'border-red-200 bg-red-50 text-red-800',
  },
  warning: {
    icon: AlertCircle,
    title: 'Warning!',
    description: 'Please check your input and try again.',
    className: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  },
  info: {
    icon: Info,
    title: 'Info',
    description: 'Here is some information for you.',
    className: 'border-blue-200 bg-blue-50 text-blue-800',
  },
}

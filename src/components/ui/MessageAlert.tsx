import React from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { ExclamationCircle, CheckCircle, InfoCircle, ExclamationTriangle } from 'react-bootstrap-icons'

type MessageType = 'error' | 'success' | 'warning' | 'info'

interface MessageAlertProps {
  message: string
  type?: MessageType
  title?: string
  className?: string
}

const messageConfig = {
  error: {
    icon: ExclamationCircle,
    title: 'Error',
    className: 'border-destructive text-destructive bg-destructive/5',
  },
  success: {
    icon: CheckCircle,
    title: 'Success',
    className: 'border-success text-success bg-success/5',
  },
  warning: {
    icon: ExclamationTriangle,
    title: 'Warning', 
    className: 'border-warning text-warning bg-warning/5',
  },
  info: {
    icon: InfoCircle,
    title: 'Info',
    className: 'border-primary text-primary bg-primary/5',
  },
}

export const MessageAlert: React.FC<MessageAlertProps> = ({ 
  message, 
  type = 'error',
  title,
  className
}) => {
  const config = messageConfig[type]
  const Icon = config.icon
  
  return (
    <Alert className={cn('mt-8 rounded-sm', config.className, className)}>
      <Icon size={20} color="currentColor" className={cn('mt-0.5')} />
      <div>
        <AlertTitle className={cn('font-semibold text-base')}>
          {title || config.title}
        </AlertTitle>
        <AlertDescription className={cn('opacity-90')}>
          {message}
        </AlertDescription>
      </div>
    </Alert>
  )
}

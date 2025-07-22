import React from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { ExclamationCircle } from 'react-bootstrap-icons'

interface ErrorAlertProps {
  error: string
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  return (
    <Alert
      variant="destructive"
      className={cn(
        'mt-8 bg-transparent rounded-sm border-destructive text-destructive-foreground',
      )}
    >
      <ExclamationCircle size={20} color="currentColor" className={cn('mt-0.5')} />
      <div>
        <AlertTitle className={cn('font-semibold text-base')}>Error</AlertTitle>
        <AlertDescription className={cn('text-muted-foreground')}>{error}</AlertDescription>
      </div>
    </Alert>
  )
}

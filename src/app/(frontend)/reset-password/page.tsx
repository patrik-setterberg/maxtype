import { type Metadata } from 'next/types'
import { Suspense } from 'react'
import ResetPasswordForm from '@/components/ui/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password | MaxType',
  description: 'Reset your MaxType password using the link sent to your email.',
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}

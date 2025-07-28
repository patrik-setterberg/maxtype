import { type Metadata } from 'next/types'
import { Suspense } from 'react'
import VerifyEmailContent from '@/components/ui/VerifyEmailContent'

export const metadata: Metadata = {
  title: 'Verify Email | MaxType',
  description: 'Verify your email address to complete your MaxType account setup.',
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}

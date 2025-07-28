import { type Metadata } from 'next/types'
import ForgotPasswordForm from '@/components/ui/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Forgot Password | MaxType',
  description: 'Reset your MaxType password by entering your username.',
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <ForgotPasswordForm />
    </div>
  )
}

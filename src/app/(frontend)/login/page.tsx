import { type Metadata } from 'next/types'
import { Suspense } from 'react'
import LoginForm from '@/components/ui/LoginForm'

export const metadata: Metadata = {
  title: 'Login | MaxType',
  description:
    'Log in to your MaxType account to track your typing progress and access your preferences.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

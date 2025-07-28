import { type Metadata } from 'next/types'
import SignupForm from '@/components/ui/SignupForm'

export const metadata: Metadata = {
  title: 'Sign Up | MaxType',
  description:
    'Create a MaxType account to track your typing progress and customize your experience.',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignupForm />
    </div>
  )
}

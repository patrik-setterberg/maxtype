'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type VerificationState = 'loading' | 'success' | 'error' | 'expired' | 'invalid'

export default function VerifyEmailContent() {
  const [state, setState] = useState<VerificationState>('loading')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const verifyEmail = useCallback(
    async (verificationToken: string) => {
      try {
        // PayloadCMS verification endpoint - token in URL path as per docs
        const response = await fetch(`/api/users/verify/${verificationToken}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        const data = await response.json()

        // Debug logging
        console.log('Verification response status:', response.status)
        console.log('Verification response data:', data)

        if (response.ok) {
          setState('success')
          setMessage(
            'Your email has been successfully verified! You can now log in to your account.',
          )

          // Redirect to login page after 3 seconds
          setTimeout(() => {
            router.push('/login?verified=true')
          }, 3000)
        } else {
          if (data.errors?.[0]?.message?.includes('expired')) {
            setState('expired')
            setMessage(
              'Your verification link has expired. Please request a new verification email.',
            )
          } else {
            setState('error')
            setMessage(data.errors?.[0]?.message || 'Failed to verify email. Please try again.')
          }
        }
      } catch (error) {
        console.error('Verification error:', error)
        setState('error')
        setMessage('An unexpected error occurred. Please try again later.')
      }
    },
    [router],
  )

  useEffect(() => {
    if (!token) {
      setState('invalid')
      setMessage('No verification token provided.')
      return
    }

    verifyEmail(token)
  }, [token, verifyEmail])

  const handleResendVerification = async () => {
    // This would need to be implemented - request a new verification email
    // For now, redirect to login/signup page
    router.push('/login')
  }

  const getIcon = () => {
    switch (state) {
      case 'loading':
        return <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case 'error':
      case 'expired':
      case 'invalid':
        return <XCircle className="h-16 w-16 text-red-500" />
    }
  }

  const getTitle = () => {
    switch (state) {
      case 'loading':
        return 'Verifying Your Email...'
      case 'success':
        return 'Email Verified!'
      case 'expired':
        return 'Link Expired'
      case 'invalid':
        return 'Invalid Link'
      case 'error':
        return 'Verification Failed'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex justify-center mb-6">{getIcon()}</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{getTitle()}</h2>
          <p className="text-gray-600 mb-8">{message}</p>

          <div className="space-y-4">
            {state === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700">
                  Redirecting you to the login page in a few seconds...
                </p>
              </div>
            )}

            {(state === 'expired' || state === 'error' || state === 'invalid') && (
              <div className="space-y-3">
                <Button onClick={handleResendVerification} className="w-full">
                  Go to Login Page
                </Button>
              </div>
            )}

            {state === 'loading' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  Please wait while we verify your email address...
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Having trouble?{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-500">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

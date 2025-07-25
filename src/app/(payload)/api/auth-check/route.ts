import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { User } from '@/payload-types'

/**
 * Server-side auth check endpoint
 * Use this in server components or API routes
 */
export const GET = async (req: NextRequest) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    // This automatically checks the HTTP-only cookie
    const { user } = await payload.auth({ headers: req.headers })

    if (user) {
      const typedUser = user as User
      return NextResponse.json({ 
        authenticated: true, 
        user: {
          id: typedUser.id,
          email: user.email, // email is on the base auth user
          username: typedUser.username,
          preferences: typedUser.preferences,
        }
      })
    } else {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 })
    }
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 })
  }
}
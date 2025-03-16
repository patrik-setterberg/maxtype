import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import bcrypt from 'bcryptjs'
import { User } from '@/payload-types'

export const POST = async (req: NextRequest) => {
  const defaultPreferences: User['preferences'] = {
    language: 'en',
    keyboardLayout: 'qwerty',
    testDuration: '30',
    showKeyboard: true,
  }

  try {
    const { username, email, password } = await req.json()

    const payload = await getPayload({
      config: configPromise,
    })

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the new user
    const newUser = await payload.create({
      collection: 'users',
      data: {
        username,
        email,
        password: hashedPassword,
        preferences: defaultPreferences,
      },
    })

    return NextResponse.json(newUser)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

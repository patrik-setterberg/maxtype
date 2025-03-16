import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const POST = async (req: NextRequest) => {
  try {
    const { username } = await req.json()

    const payload = await getPayload({
      config: configPromise,
    })

    const data = await payload.find({
      collection: 'users',
      where: { username: { equals: username } },
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

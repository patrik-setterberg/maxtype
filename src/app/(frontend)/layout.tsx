import React from 'react'
import { cn } from '@/lib/utils'
import './styles.css'

import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

export const metadata = {
  description: 'Type your heart out',
  title: 'maxtype',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={cn('dark', 'bg-primary-foreground', 'min-h-screen', 'flex', 'flex-col')}>
        <Header />
        <main className={cn('flex-1')}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

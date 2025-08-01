import React from 'react'
import { cn } from '@/lib/utils'
import './styles.css'

import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { ThemeProvider, THEME_SCRIPT } from '@/components/ui/ThemeProvider'

export const metadata = {
  description: 'Type your heart out',
  title: 'maxtype',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={cn('bg-background', 'text-foreground', 'min-h-screen', 'flex', 'flex-col')}>
        <ThemeProvider>
          <Header />
          <main className={cn('flex-1')}>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

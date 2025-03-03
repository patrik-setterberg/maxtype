import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Type your heart out',
  title: 'maxtype',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <header>Header</header>
        <main>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  )
}

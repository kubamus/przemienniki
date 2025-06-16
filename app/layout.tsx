import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Przemienniki - Kuba i Wiktor',
  description: 'Strona o przemiennikach radiowych',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

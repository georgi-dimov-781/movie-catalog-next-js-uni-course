/**
 * Global Providers Component
 * Wraps app with NextAuth SessionProvider for authentication state
 */

'use client'

import { SessionProvider } from 'next-auth/react'

// Client component that wraps app with SessionProvider
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
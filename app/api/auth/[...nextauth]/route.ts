/**
 * NextAuth API Route Handler
 * Handles authentication requests with custom auth configuration
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/app/lib/auth'

// Create NextAuth handler with auth configuration
const handler = NextAuth(authOptions)

// Export GET and POST handlers for NextAuth
export { handler as GET, handler as POST }
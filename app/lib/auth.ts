/**
 * NextAuth Configuration - Authentication System
 * Credentials-based auth with JWT sessions and role-based access control
 */

import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from '@/app/lib/data'

// NextAuth configuration with credentials provider and JWT sessions
export const authOptions: AuthOptions = {
  // Email/password authentication with bcrypt verification
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      // Validate credentials and return user data
      async authorize(credentials) {
        // Validate that both email and password are provided
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Look up user in database by email
        const user = getUserByEmail(credentials.email)
        
        if (!user) {
          return null
        }

        // Verify password using bcrypt comparison
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        // Return user data for successful authentication
        // Note: Password is excluded for security
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  
  // Use JWT for stateless sessions
  session: {
    strategy: 'jwt',
  },
  
  // Custom sign-in page
  pages: {
    signIn: '/auth/signin',
  },
  
  // Add custom user data to tokens and sessions
  callbacks: {
    // Add user ID and role to JWT token
    async jwt({ token, user }) {
      // Add user data to token on initial sign in
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    
    // Format session object with user data from token
    async session({ session, token }) {
      // Add custom token data to session
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
}
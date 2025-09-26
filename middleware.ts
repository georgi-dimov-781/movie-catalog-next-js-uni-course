/**
 * @fileoverview Next.js Middleware - Authentication and Route Protection
 *
 * This middleware implements comprehensive authentication and authorization for the Movie Catalog application.
 * It uses NextAuth.js middleware to protect routes based on user authentication status and role-based permissions.
 */

import { withAuth } from 'next-auth/middleware'

/**
 * NextAuth Middleware Configuration
 *
 * Implements the authentication and authorization logic for protected routes.
 * Uses the withAuth higher-order function to wrap the middleware with
 * authentication capabilities.
 */
export default withAuth(
  {
    callbacks: {
      /**
       * Authorization callback function
       *
       * Determines whether a user is authorized to access a specific route
       * based on their authentication status and role. This function is called
       * for every request to a protected route.
       */
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Admin-only routes - Require 'admin' role for movie management
        if (pathname.startsWith('/add-movie')) {
          return token?.role === 'admin'
        }

        // User routes - Require any authenticated user for personal features
        if (pathname.startsWith('/favorites')) {
          return !!token // Convert to boolean: null/undefined -> false, object -> true
        }

        // Public routes - Allow access without authentication
        return true
      },
    },
  }
)

/**
 * Middleware Configuration
 *
 * Defines which routes should be processed by this middleware.
 * Only the specified routes will trigger the authentication checks,
 * improving performance by avoiding unnecessary middleware execution.
 */
export const config = {
  matcher: ['/add-movie', '/favorites']
}
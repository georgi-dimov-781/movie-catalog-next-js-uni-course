/**
 * @fileoverview Header Component - Navigation and Authentication UI
 *
 * The main header component that provides consistent navigation and authentication
 * interface across all pages of the Movie Catalog application. Implements responsive
 * design, role-based navigation, and modern UI patterns.
 */

'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

/**
 * Header Component
 *
 * Main navigation header that adapts based on user authentication status and role.
 * Provides consistent navigation experience across all pages with modern design
 * and smooth interactions.
 */
export default function Header() {
  // Get current authentication session and loading status
  const { data: session, status } = useSession()

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-xl border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Left side: Logo and main navigation */}
          <div className="flex items-center space-x-8">
            {/* Brand logo with gradient text effect */}
            <Link
              href="/"
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              🎬 Movie Catalog
            </Link>
            
            {/* Main navigation menu - hidden on mobile */}
            <nav className="hidden md:flex space-x-6">
              {/* Home link - always visible */}
              <Link
                href="/"
                className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium"
              >
                Home
              </Link>
              
              {/* Authenticated user navigation */}
              {session && (
                <>
                  {/* Favorites - available to all authenticated users */}
                  <Link
                    href="/favorites"
                    className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium"
                  >
                    Favorites
                  </Link>
                  
                  {/* Admin-only navigation */}
                  {session.user?.role === 'admin' && (
                    <Link
                      href="/add-movie"
                      className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium"
                    >
                      Add Movie
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
          
          {/* Right side: Authentication controls */}
          <div className="flex items-center space-x-4">
            {/* Loading state - show skeleton while checking authentication */}
            {status === 'loading' ? (
              <div className="flex items-center space-x-2 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            ) : session ? (
              /* Authenticated user controls */
              <div className="flex items-center space-x-4">
                {/* User profile display - hidden on small screens */}
                <div className="hidden sm:flex items-center space-x-3">
                  {/* User avatar with first letter of name/email */}
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {(session.user?.name || session.user?.email)?.charAt(0).toUpperCase()}
                  </div>
                  {/* Welcome message with user name */}
                  <span className="text-gray-700 font-medium">
                    Hello, {session.user?.name || session.user?.email}
                  </span>
                </div>
                
                {/* Sign out button with hover effects */}
                <button
                  onClick={() => signOut()}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              /* Guest user controls */
              <div className="flex items-center space-x-3">
                {/* Sign up link */}
                <Link
                  href="/auth/signup"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Sign Up
                </Link>
                
                {/* Sign in button with gradient background */}
                <button
                  onClick={() => signIn()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
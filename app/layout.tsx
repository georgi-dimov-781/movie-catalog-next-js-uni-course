/**
 * Root Layout Component - Movie Catalog Application
 * Global layout with authentication provider, Inter font, and consistent structure
 */

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import Header from './components/Header'
import Footer from './components/Footer'

// Inter font configuration for optimal UI readability
const inter = Inter({ subsets: ['latin'] })

// Global metadata for SEO and social sharing
export const metadata: Metadata = {
  title: 'Movie Catalog',
  description: 'A modern movie catalog application built with Next.js',
}

// Root layout with authentication provider and consistent structure
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
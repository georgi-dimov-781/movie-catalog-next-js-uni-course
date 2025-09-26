/**
 * Next.js Configuration - Movie Catalog Application
 * Image optimization for TMDB and performance optimizations
 */

import type { NextConfig } from "next";

// Next.js configuration for image optimization and performance
const nextConfig: NextConfig = {
  // Allow external images from TMDB and other HTTPS sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Experimental features for better performance
  experimental: {
    // Optimize NextAuth imports for smaller bundle size
    optimizePackageImports: ['next-auth'],
  },
};

export default nextConfig;

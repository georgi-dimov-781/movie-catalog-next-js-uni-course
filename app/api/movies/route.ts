/**
 * @fileoverview Movies API Route - RESTful Movie Management
 *
 * This API route handles all movie-related operations including fetching, searching,
 * filtering, and creating movies. Implements RESTful conventions with proper HTTP
 * status codes, authentication, and validation.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { getMovies, addMovie, searchMovies, filterMoviesByYear } from '@/app/lib/data'
import { z } from 'zod'

/**
 * Zod validation schema for movie creation and updates
 *
 * Ensures data integrity and provides clear validation messages
 * for client-side error handling and user feedback.
 */
const movieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Must be a valid URL'),
  releaseDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Must be a valid date'
  })
})

/**
 * GET /api/movies - Retrieve movies with optional filtering
 *
 * Handles movie retrieval with support for search and year filtering.
 * Implements efficient filtering logic and returns JSON response.
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters from request URL
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const year = searchParams.get('year')

    // Start with all movies from data layer
    let movies = getMovies()

    // Apply search filter if search term provided
    if (search) {
      movies = searchMovies(search)
    }

    // Apply year filter if year parameter provided
    if (year) {
      const yearNum = parseInt(year)
      if (!isNaN(yearNum)) {
        // Filter movies by release year
        movies = movies.filter(movie => {
          const movieYear = new Date(movie.releaseDate).getFullYear()
          return movieYear === yearNum
        })
      }
    }

    // Return filtered movies as JSON
    return NextResponse.json(movies)
  } catch (error) {
    // Log error for debugging (in production, use proper logging)
    console.error('GET /api/movies error:', error)
    
    // Return generic error message to avoid data leakage
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/movies - Create a new movie (Admin only)
 *
 * Handles movie creation with authentication and authorization checks.
 * Validates input data and creates new movie entries in the catalog.
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication status
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to add movies' },
        { status: 401 }
      )
    }

    // Check admin role authorization
    if (session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = movieSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues
        },
        { status: 400 }
      )
    }

    // Create new movie with validated data
    const newMovie = addMovie(validation.data)
    
    // Return created movie with 201 status
    return NextResponse.json(newMovie, { status: 201 })
    
  } catch (error) {
    // Log error for debugging
    console.error('POST /api/movies error:', error)
    
    // Return generic error message
    return NextResponse.json(
      { error: 'Failed to create movie' },
      { status: 500 }
    )
  }
}
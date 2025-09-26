import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { addRating, getUserRating } from '@/app/lib/data'
import { z } from 'zod'

const ratingSchema = z.object({
  movieId: z.string().min(1, 'Movie ID is required'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  review: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get('movieId')
    
    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      )
    }

    const userRating = getUserRating(movieId, session.user.id)
    return NextResponse.json(userRating)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch rating' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = ratingSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { movieId, rating, review } = validation.data
    const updatedMovie = addRating(movieId, session.user.id, rating, review)
    
    if (!updatedMovie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Rating added successfully', movie: updatedMovie })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add rating' },
      { status: 500 }
    )
  }
}
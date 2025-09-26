import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { addToFavorites, removeFromFavorites, getFavoriteMovies } from '@/app/lib/data'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const favoriteMovies = getFavoriteMovies(session.user.id)
    return NextResponse.json(favoriteMovies)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
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

    const { movieId } = await request.json()
    
    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      )
    }

    const success = addToFavorites(session.user.id, movieId)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Movie already in favorites or not found' },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Added to favorites successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add to favorites' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const { movieId } = await request.json()
    
    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      )
    }

    const success = removeFromFavorites(session.user.id, movieId)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to remove from favorites' },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Removed from favorites successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove from favorites' },
      { status: 500 }
    )
  }
}
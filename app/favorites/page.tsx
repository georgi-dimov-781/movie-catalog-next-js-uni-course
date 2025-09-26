'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import MovieCard from '../components/MovieCard'
import SkeletonCard from '../components/SkeletonCard'
import { Movie } from '../lib/data'

export default function Favorites() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [favorites, setFavorites] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchFavorites()
  }, [session, status, router])

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites')
      if (!response.ok) {
        throw new Error('Failed to fetch favorites')
      }
      const data = await response.json()
      setFavorites(data)
    } catch (error) {
      setError('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl text-white mb-6 animate-bounce-in">
              ⭐
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Favorites</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center text-4xl text-red-600 mb-4">
              ❌
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Favorites</h3>
            <p className="text-gray-600 text-lg mb-6">{error}</p>
            <button
              onClick={fetchFavorites}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl text-white mb-6 animate-bounce-in">
            ⭐
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Favorites</h1>
          <p className="text-lg text-gray-600">
            {favorites.length > 0 
              ? `You have ${favorites.length} favorite ${favorites.length === 1 ? 'movie' : 'movies'}`
              : 'Your personal collection of favorite movies'
            }
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map((movie, index) => (
              <div
                key={movie.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MovieCard movie={movie} showFavoriteButton={false} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl text-white mb-4">
                💫
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Favorites Yet</h3>
              <p className="text-gray-600 text-lg mb-6">
                Start adding movies to your favorites to see them here!
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Browse Movies
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
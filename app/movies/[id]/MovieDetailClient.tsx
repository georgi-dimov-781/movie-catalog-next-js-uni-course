'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Movie } from '@/app/lib/data'

interface MovieDetailClientProps {
  movie: Movie
}

interface UserRating {
  rating: number
  review?: string
}

export default function MovieDetailClient({ movie }: MovieDetailClientProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(false)
  const [userRating, setUserRating] = useState<UserRating | null>(null)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newReview, setNewReview] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    title: movie.title,
    description: movie.description,
    imageUrl: movie.imageUrl,
    releaseDate: movie.releaseDate
  })

  const releaseYear = new Date(movie.releaseDate).getFullYear()
  const formattedDate = new Date(movie.releaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/favorites')
      const favorites = await response.json()
      setIsFavorited(favorites.some((fav: Movie) => fav.id === movie.id))
    } catch (error) {
      console.error('Failed to check favorite status:', error)
    }
  }, [movie.id])

  const checkUserRating = useCallback(async () => {
    try {
      const response = await fetch(`/api/ratings?movieId=${movie.id}`)
      const rating = await response.json()
      setUserRating(rating)
    } catch (error) {
      console.error('Failed to check user rating:', error)
    }
  }, [movie.id])

  useEffect(() => {
    if (session?.user?.id) {
      checkFavoriteStatus()
      checkUserRating()
    }
  }, [session, movie.id, checkFavoriteStatus, checkUserRating])

  const toggleFavorite = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/favorites', {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId: movie.id })
      })

      if (response.ok) {
        setIsFavorited(!isFavorited)
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitRating = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: movie.id,
          rating: newRating,
          review: newReview.trim() || undefined
        })
      })

      if (response.ok) {
        setUserRating({ rating: newRating, review: newReview })
        setIsRatingModalOpen(false)
        setNewRating(5)
        setNewReview('')
        // Refresh the page to show updated movie ratings
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to submit rating:', error)
    } finally {
      setLoading(false)
    }
  }

  const shareMovie = (platform: string) => {
    const url = window.location.href
    const text = `Check out ${movie.title} on Movie Catalog!`
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
        break
    }
    setIsShareModalOpen(false)
  }

  const handleEditMovie = async () => {
    if (!session || session.user.role !== 'admin') {
      alert('Admin access required')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/movies/${movie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        setIsEditModalOpen(false)
        window.location.reload() // Refresh to show updates
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update movie')
      }
    } catch (error) {
      console.error('Failed to update movie:', error)
      alert('Failed to update movie')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMovie = async () => {
    if (!session || session.user.role !== 'admin') {
      alert('Admin access required')
      return
    }

    if (!confirm(`Are you sure you want to delete "${movie.title}"? This action cannot be undone.`)) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/movies/${movie.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Movie deleted successfully')
        router.push('/')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete movie')
      }
    } catch (error) {
      console.error('Failed to delete movie:', error)
      alert('Failed to delete movie')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-purple-600 mb-8 transition-all duration-200 transform hover:-translate-x-1 animate-fade-in-up"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Movies
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="lg:flex">
            <div className="lg:w-2/5">
              <div className="relative h-96 lg:h-full">
                <Image
                  src={movie.imageUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            </div>
            
            <div className="lg:w-3/5 p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 lg:mb-0">
                  {movie.title}
                </h1>
                <div className="flex items-center space-x-3">
                  <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full border border-blue-200">
                    {releaseYear}
                  </span>
                  {movie.totalRatings > 0 ? (
                    <div className="flex items-center bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-full">
                      <span className="text-yellow-500 mr-1">⭐</span>
                      <span className="text-sm font-medium text-gray-700">
                        {movie.averageRating.toFixed(1)} ({movie.totalRatings})
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200 px-3 py-2 rounded-full">
                      No ratings yet
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                    📅
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Release Date</h2>
                </div>
                <p className="text-gray-600 text-lg ml-11">{formattedDate}</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                    📖
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Description</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg ml-11">{movie.description}</p>
              </div>

              {/* User Rating Display */}
              {userRating && (
                <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 mr-2">⭐</span>
                    <span className="font-medium">Your Rating: {userRating.rating}/5</span>
                  </div>
                  {userRating.review && (
                    <p className="text-gray-700 italic">&quot;{userRating.review}&quot;</p>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={toggleFavorite}
                  disabled={loading}
                  className={`flex-1 py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium ${
                    isFavorited
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  }`}
                >
                  {loading ? '⏳' : isFavorited ? '💖 Favorited' : '⭐ Add to Favorites'}
                </button>
                <button
                  onClick={() => setIsRatingModalOpen(true)}
                  className="flex-1 bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                >
                  {userRating ? '✏️ Edit Rating' : '⭐ Rate Movie'}
                </button>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                >
                  📤 Share Movie
                </button>
              </div>

              {/* Admin Controls */}
              {session?.user?.role === 'admin' && (
                <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div className="text-center mb-2 w-full">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      👑 Admin Controls
                    </span>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                  >
                    ✏️ Edit Movie
                  </button>
                  <button
                    onClick={handleDeleteMovie}
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                  >
                    🗑️ Delete Movie
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          {movie.ratings && movie.ratings.length > 0 && (
            <div className="border-t border-gray-200 p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Reviews ({movie.ratings.length})</h3>
              <div className="space-y-4">
                {movie.ratings.slice(0, 5).map((rating, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-500 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < rating.rating ? 'opacity-100' : 'opacity-30'}>⭐</span>
                        ))}
                      </div>
                      <span className="font-medium text-gray-700">{rating.rating}/5</span>
                    </div>
                    {rating.review && (
                      <p className="text-gray-700 italic">&quot;{rating.review}&quot;</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Rate {movie.title}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewRating(star)}
                    className={`text-2xl ${star <= newRating ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600">{newRating}/5 stars</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Review (Optional)</label>
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Share your thoughts about this movie..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{newReview.length}/500 characters</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitRating}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Rating'}
              </button>
              <button
                onClick={() => setIsRatingModalOpen(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Share {movie.title}</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => shareMovie('twitter')}
                className="w-full flex items-center justify-center space-x-2 bg-blue-400 text-white py-3 px-4 rounded-lg hover:bg-blue-500 transition-colors"
              >
                <span>🐦</span>
                <span>Share on Twitter</span>
              </button>
              <button
                onClick={() => shareMovie('facebook')}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>📘</span>
                <span>Share on Facebook</span>
              </button>
              <button
                onClick={() => shareMovie('copy')}
                className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span>📋</span>
                <span>Copy Link</span>
              </button>
            </div>

            <button
              onClick={() => setIsShareModalOpen(false)}
              className="w-full mt-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Movie Modal - Admin Only */}
      {isEditModalOpen && session?.user?.role === 'admin' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Movie</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  value={editForm.imageUrl}
                  onChange={(e) => setEditForm({...editForm, imageUrl: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Release Date</label>
                <input
                  type="date"
                  value={editForm.releaseDate}
                  onChange={(e) => setEditForm({...editForm, releaseDate: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEditMovie}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Movie'}
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
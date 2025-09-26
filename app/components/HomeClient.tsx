/**
 * @fileoverview HomeClient Component - Main Application Interface
 *
 * The primary client-side component that renders the home page of the Movie Catalog application.
 * Implements advanced search and filtering functionality, responsive movie grid layout,
 * and dynamic content loading with smooth animations.
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import MovieCard from './MovieCard'
import SkeletonCard from './SkeletonCard'
import { Movie } from '../lib/data'

/**
 * Props interface for HomeClient component
 *
 * @interface HomeClientProps
 * @property {Movie[]} initialMovies - Server-rendered initial movie data
 * @property {number[]} availableYears - Array of years for filter dropdown
 */
interface HomeClientProps {
  initialMovies: Movie[]
  availableYears: number[]
}

/**
 * HomeClient Component
 *
 * Main interface component that provides movie browsing, searching, and filtering
 * functionality. Combines server-side rendered data with client-side interactivity
 * for optimal user experience.
 */
export default function HomeClient({ initialMovies, availableYears }: HomeClientProps) {
  // Get current user session for role-based UI
  const { data: session } = useSession()
  
  // Component state management
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  /**
   * Fetches movies from API based on search and filter criteria
   *
   * Makes API call to /api/movies with search and year parameters.
   * Updates component state with results and manages loading states.
   * Includes error handling for failed requests.
   */
  const fetchMovies = async (search?: string, year?: number | null) => {
    setLoading(true)
    try {
      // Build query parameters for API request
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (year) params.append('year', year.toString())

      // Fetch filtered movies from API
      const response = await fetch(`/api/movies?${params.toString()}`)
      const data = await response.json()
      setMovies(data)
    } catch (error) {
      console.error('Failed to fetch movies:', error)
      // TODO: Add user-facing error handling
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handles search form submission
   *
   * Prevents default form submission and triggers movie fetch
   * with current search term and year filter.
   *
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchMovies(searchTerm, selectedYear)
  }

  /**
   * Handles year filter selection
   *
   * Updates selected year state and immediately fetches filtered results.
   * Maintains current search term while applying year filter.
   *
   * @param {number | null} year - Selected year or null for all years
   */
  const handleYearFilter = (year: number | null) => {
    setSelectedYear(year)
    fetchMovies(searchTerm, year)
  }

  /**
   * Clears all filters and search terms
   *
   * Resets component state to initial values and restores
   * original movie list without making API calls.
   */
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedYear(null)
    setMovies(initialMovies)
  }

  // Computed values for UI state
  const filteredMoviesCount = movies.length
  const isFiltered = searchTerm || selectedYear

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-700/90"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              🎬 Movie Catalog
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Discover amazing movies, explore cinematic masterpieces, and add your favorites to our growing collection
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-white font-medium">
                ✨ {initialMovies.length} Movies Available
              </div>
              {session?.user?.role === 'admin' && (
                <div className="bg-green-500/20 backdrop-blur-sm rounded-full px-6 py-2 text-white font-medium">
                  👑 Admin Access
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-300 rounded-full opacity-20 -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-300 rounded-full opacity-20 translate-y-16 -translate-x-16"></div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            {/* Mobile-first responsive layout */}
            <div className="space-y-4">
              {/* Search input - full width on mobile */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Movies
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or description..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              
              {/* Filter and buttons row - responsive layout */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                <div className="flex-1 sm:max-w-xs">
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Year
                  </label>
                  <select
                    id="year"
                    value={selectedYear || ''}
                    onChange={(e) => handleYearFilter(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">All Years</option>
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Buttons - stack on mobile, inline on larger screens */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Searching...
                      </div>
                    ) : (
                      '🔍 Search'
                    )}
                  </button>
                  
                  {isFiltered && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="w-full sm:w-auto bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {isFiltered && (
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-600">
                  {filteredMoviesCount} movie{filteredMoviesCount !== 1 ? 's' : ''} found
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedYear && ` from ${selectedYear}`}
                </span>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl text-white mb-4">
                {isFiltered ? '🔍' : '🎭'}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {isFiltered ? 'No Movies Found' : 'No Movies Yet'}
              </h3>
              <p className="text-gray-600 text-lg">
                {isFiltered 
                  ? 'Try adjusting your search terms or filters'
                  : 'Be the first to add a movie to our collection!'
                }
              </p>
              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Show All Movies
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
/**
 * Core Data Layer - Movie Catalog Application
 * Mock database with CRUD operations, user management, favorites, and ratings
 */

// Movie entity interface
export interface Movie {
  id: string
  title: string
  description: string
  imageUrl: string
  releaseDate: string
  ratings: Array<{userId: string, rating: number, review?: string}>
  averageRating: number
  totalRatings: number
}

// User entity interface
export interface User {
  id: string
  email: string
  name: string
  password: string
  role: 'admin' | 'user'
  favorites: string[]
  createdAt: string
}

// Mock movie database with TMDB poster images
export const movies: Movie[] = [
  {
    id: '1',
    title: 'The Matrix',
    description: 'A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a computer program.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    releaseDate: '1999-03-31',
    ratings: [],
    averageRating: 0,
    totalRatings: 0
  },
  {
    id: '2',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    releaseDate: '2010-07-16',
    ratings: [],
    averageRating: 0,
    totalRatings: 0
  },
  {
    id: '3',
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    releaseDate: '2014-11-07',
    ratings: [],
    averageRating: 0,
    totalRatings: 0
  },
  {
    id: '4',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    releaseDate: '2008-07-18',
    ratings: [],
    averageRating: 0,
    totalRatings: 0
  },
  {
    id: '5',
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    releaseDate: '1994-10-14',
    ratings: [],
    averageRating: 0,
    totalRatings: 0
  },
  {
    id: '6',
    title: 'Fight Club',
    description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into an anarchist organization.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    releaseDate: '1999-10-15',
    ratings: [],
    averageRating: 0,
    totalRatings: 0
  }
]

// Demo user accounts - both use password: "password"
// Admin: admin@movieapp.com, User: demo@example.com
export const users: User[] = [
  {
    id: '1',
    email: 'admin@movieapp.com',
    name: 'Movie Admin',
    password: '$2b$10$Vp41WiGzXbNY2cAl7rqC/u46K126o1uOhEfUjWR83.uzlL8ExBvIq', // 'password' hashed with bcrypt
    role: 'admin',
    favorites: [],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    email: 'demo@example.com',
    name: 'Demo User',
    password: '$2b$10$Vp41WiGzXbNY2cAl7rqC/u46K126o1uOhEfUjWR83.uzlL8ExBvIq', // 'password' hashed with bcrypt
    role: 'user',
    favorites: [],
    createdAt: '2024-01-01T00:00:00.000Z'
  }
]

// CORE DATA ACCESS FUNCTIONS

// Get all movies from catalog
export function getMovies(): Movie[] {
  return movies
}

// Get movie by ID
export function getMovieById(id: string): Movie | undefined {
  return movies.find(movie => movie.id === id)
}

// Add new movie to catalog (admin only)
export function addMovie(movie: Omit<Movie, 'id' | 'ratings' | 'averageRating' | 'totalRatings'>): Movie {
  const newMovie: Movie = {
    ...movie,
    id: (movies.length + 1).toString(), // Simple auto-increment ID generation
    ratings: [], // Initialize empty ratings array
    averageRating: 0, // Start with no ratings
    totalRatings: 0 // Start with zero rating count
  }
  movies.push(newMovie)
  return newMovie
}

// Get user by email for authentication
export function getUserByEmail(email: string): User | undefined {
  return users.find(user => user.email === email)
}

// Create new user account
export function addUser(userData: Omit<User, 'id' | 'role' | 'favorites' | 'createdAt'>): User {
  const newUser: User = {
    ...userData,
    id: (users.length + 1).toString(), // Simple auto-increment ID generation
    role: 'user', // Default role for new users
    favorites: [], // Initialize empty favorites array
    createdAt: new Date().toISOString() // Current timestamp
  }
  users.push(newUser)
  return newUser
}

// FAVORITES MANAGEMENT SYSTEM

// Add movie to user's favorites
export function addToFavorites(userId: string, movieId: string): boolean {
  const user = users.find(u => u.id === userId)
  if (!user || user.favorites.includes(movieId)) return false
  user.favorites.push(movieId)
  return true
}

// Remove movie from user's favorites
export function removeFromFavorites(userId: string, movieId: string): boolean {
  const user = users.find(u => u.id === userId)
  if (!user) return false
  user.favorites = user.favorites.filter(id => id !== movieId)
  return true
}

// Get all favorite movies for a user
export function getFavoriteMovies(userId: string): Movie[] {
  const user = users.find(u => u.id === userId)
  if (!user) return []
  return movies.filter(movie => user.favorites.includes(movie.id))
}

// Check if movie is in user's favorites
export function isMovieFavorited(userId: string, movieId: string): boolean {
  const user = users.find(u => u.id === userId)
  return user ? user.favorites.includes(movieId) : false
}

// ============================================================================
// RATING AND REVIEW SYSTEM
// ============================================================================

/**
 * Adds or updates a user's rating and review for a movie
 *
 * Implements the rating system allowing users to rate movies on a 1-5 scale
 * with optional text reviews. Automatically recalculates aggregate ratings
 * and handles rating updates by replacing existing ratings from the same user.
 */
export function addRating(movieId: string, userId: string, rating: number, review?: string): Movie | null {
  const movie = movies.find(m => m.id === movieId)
  if (!movie) return null

  // Remove existing rating if any (prevents duplicate ratings from same user)
  movie.ratings = movie.ratings.filter(r => r.userId !== userId)
  
  // Add new rating
  movie.ratings.push({ userId, rating, review })
  
  // Recalculate aggregate rating data
  movie.totalRatings = movie.ratings.length
  movie.averageRating = movie.ratings.reduce((sum, r) => sum + r.rating, 0) / movie.totalRatings
  
  return movie
}

/**
 * Retrieves a specific user's rating and review for a movie
 *
 * Used to display existing ratings in the UI and determine if a user
 * has already rated a movie. Essential for the rating interface to show
 * current user ratings and enable rating updates.
 */
export function getUserRating(movieId: string, userId: string): {rating: number, review?: string} | null {
  const movie = movies.find(m => m.id === movieId)
  const userRating = movie?.ratings.find(r => r.userId === userId)
  return userRating ? { rating: userRating.rating, review: userRating.review } : null
}

// ============================================================================
// ADMIN MOVIE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Updates an existing movie's information
 *
 * Allows administrators to modify movie details such as title, description,
 * image URL, and release date. Preserves rating data and movie ID while
 * updating other fields. Used by the admin interface for movie editing.
 */
export function updateMovie(id: string, updates: Partial<Omit<Movie, 'id' | 'ratings' | 'averageRating' | 'totalRatings'>>): Movie | null {
  const movieIndex = movies.findIndex(m => m.id === id)
  if (movieIndex === -1) return null
  
  // Merge updates with existing movie data
  movies[movieIndex] = { ...movies[movieIndex], ...updates }
  return movies[movieIndex]
}

/**
 * Permanently deletes a movie from the catalog
 *
 * Removes a movie and cleans up all associated data including removing
 * the movie from all users' favorites lists. This is a destructive operation
 * that should only be available to administrators.
 */
export function deleteMovie(id: string): boolean {
  const movieIndex = movies.findIndex(m => m.id === id)
  if (movieIndex === -1) return false
  
  // Remove movie from catalog
  movies.splice(movieIndex, 1)
  
  // Clean up: Remove from all users' favorites to maintain data integrity
  users.forEach(user => {
    user.favorites = user.favorites.filter(fav => fav !== id)
  })
  
  return true
}

// SEARCH AND FILTERING SYSTEM

// Search movies by title and description (case-insensitive)
export function searchMovies(query: string): Movie[] {
  if (!query.trim()) return movies
  
  const searchTerm = query.toLowerCase().trim()
  return movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm) ||
    movie.description.toLowerCase().includes(searchTerm)
  )
}

// Filter movies by release year
export function filterMoviesByYear(year: number | null): Movie[] {
  if (!year) return movies
  
  return movies.filter(movie => {
    const movieYear = new Date(movie.releaseDate).getFullYear()
    return movieYear === year
  })
}

// Get unique release years for filter dropdown (newest first)
export function getMovieYears(): number[] {
  const years = movies.map(movie => new Date(movie.releaseDate).getFullYear())
  return Array.from(new Set(years)).sort((a, b) => b - a) // Descending order (newest first)
}
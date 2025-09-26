/**
 * Home Page - Server-Side Rendered Movie Catalog
 * Fetches movie data on server and passes to client component for interactivity
 */

import { getMovies, getMovieYears } from './lib/data'
import HomeClient from './components/HomeClient'

// Server component that fetches movie data and renders home page
export default async function Home() {
  const movies = getMovies()
  const years = getMovieYears()

  return <HomeClient initialMovies={movies} availableYears={years} />
}
import { notFound } from 'next/navigation'
import { getMovies, getMovieById } from '@/app/lib/data'
import type { Metadata } from 'next'
import MovieDetailClient from './MovieDetailClient'

interface MoviePageProps {
  params: Promise<{
    id: string
  }>
}

// Static Site Generation - generateStaticParams for pre-rendering
export async function generateStaticParams() {
  const movies = getMovies()
  
  return movies.map((movie) => ({
    id: movie.id,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params
  const movie = getMovieById(id)
  
  if (!movie) {
    return {
      title: 'Movie Not Found',
    }
  }

  return {
    title: `${movie.title} - Movie Catalog`,
    description: movie.description,
    openGraph: {
      title: movie.title,
      description: movie.description,
      images: [movie.imageUrl],
    },
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params
  const movie = getMovieById(id)

  if (!movie) {
    notFound()
  }

  const releaseYear = new Date(movie.releaseDate).getFullYear()
  const formattedDate = new Date(movie.releaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return <MovieDetailClient movie={movie} />
}
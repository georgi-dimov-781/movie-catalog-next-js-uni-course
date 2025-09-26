import Link from 'next/link'
import Image from 'next/image'
import { Movie } from '../lib/data'

interface MovieCardProps {
  movie: Movie
  showFavoriteButton?: boolean
}

export default function MovieCard({ movie, showFavoriteButton = true }: MovieCardProps) {
  const releaseYear = new Date(movie.releaseDate).getFullYear()

  return (
    <Link href={`/movies/${movie.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
        <div className="relative h-80 w-full overflow-hidden">
          <Image
            src={movie.imageUrl}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-800">
              {releaseYear}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 line-clamp-2 mb-2">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {movie.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {movie.totalRatings > 0 ? (
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">⭐</span>
                  <span className="text-sm font-medium text-gray-700">
                    {movie.averageRating.toFixed(1)} ({movie.totalRatings})
                  </span>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No ratings</div>
              )}
            </div>
            <div className="text-sm text-blue-600 font-medium group-hover:text-purple-600 transition-colors">
              View Details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
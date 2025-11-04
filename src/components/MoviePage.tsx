
import { useEffect, useState } from 'react'
import loadingSpinner from '../assets/loading_spinner'


const API_KEY = import.meta.env.VITE_TMDB_API_KEY

type Genre = { id: number; name: string }

type MovieDetail = {
  id: number
  title: string
  poster_path?: string | null
  overview?: string
  release_date?: string
  runtime?: number
  vote_average?: number
  genres?: Genre[]
}

type MoviePageProps = {
  movieId: number
  onClose: () => void
}

const MoviePage = ({ movieId, onClose }: MoviePageProps) => {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch movie')
        return res.json()
      })
      .then((data: MovieDetail) => {
        if (!cancelled) setMovie(data)
      })
      .catch(err => {
        console.error(err)
        if (!cancelled) setError(String(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [movieId])

  const year = movie?.release_date ? movie.release_date.slice(0,4) : ''

  return (
    // Modal backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      {/* Modal content */}
      <div 
        className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-white text-2xl sm:text-3xl font-bold z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
          aria-label="Close"
        >
          ×
        </button>

        {loading ? (
          <div className="p-4 sm:p-6 flex items-center justify-center"> {loadingSpinner()}</div>
        ) : error ? (
          <div className="p-4 sm:p-6 text-center">
            <p className="text-red-400 mb-4 text-sm sm:text-base">{error}</p>
            <button className="px-4 py-2 bg-gray-700 text-white rounded text-sm sm:text-base" onClick={onClose}>Close</button>
          </div>
        ) : !movie ? (
          <div className="p-4 sm:p-6 text-center">
            <p className="text-sm sm:text-base">Movie not found.</p>
            <button className="px-4 py-2 bg-gray-700 text-white rounded mt-4 text-sm sm:text-base" onClick={onClose}>Close</button>
          </div>
        ) : (
          <div className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              {movie.poster_path ? (
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full md:w-64 rounded-lg shadow" />
              ) : (
                <div className="w-full md:w-64 h-80 sm:h-96 bg-gray-800 rounded-lg flex items-center justify-center text-sm sm:text-base">No image</div>
              )}

              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white pr-8 sm:pr-0">{movie.title} {year && <span className="text-gray-400 text-base sm:text-lg">({year})</span>}</h1>
                <div className="mt-2 text-xs sm:text-sm text-gray-300">{movie.runtime ? `${movie.runtime} min` : null} {movie.vote_average ? <span className="ml-2">⭐ {movie.vote_average.toFixed(1)}</span> : null}</div>

                {movie.genres && movie.genres.length > 0 && (
                  <div className="mt-3 sm:mt-5 flex flex-wrap justify-center gap-2 sm:gap-3">
                    {movie.genres.map(g => (
                      <span key={g.id} className="text-xs sm:text-sm px-2 py-1 bg-gray-700 rounded text-gray-200">{g.name}</span>
                    ))}
                  </div>
                )}

                <section className="mt-4 sm:mt-6 text-gray-200 leading-relaxed">
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">Overview</h2>
                  <p className="text-sm sm:text-base">{movie.overview || 'No overview available.'}</p>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MoviePage
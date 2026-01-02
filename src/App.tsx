import Card from './components/Card'
import Hero from './components/Hero'
import Search from './components/Search'
import SearchCard from './components/SearchCard'
import MoviePage from './components/MoviePage'
import SortField from './components/SortField'
import GenreFilter from './components/GenreFilter'
import ScrollToTop from './components/ScrollToTop'
import ShowMoreButton from './components/ShowMoreButton'
import fullHeart from './assets/full_heart.svg';
import './App.css'
import {useEffect, useState, useRef} from 'react'
import { useDebounce } from 'react-use'



const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


const App = () => {

  type Movie = {
  id: number;
  title: string;
  poster_path?: string | null;
  overview?: string;
  year?: number;
  release_date?: string;
  vote_average?: number;
};
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [refetchTrigger, setRefetchTrigger] = useState(1);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'title' | 'year'>('popularity');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [, setSidebarCollapsed] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    try {
      const raw = localStorage.getItem('favorites');
      return raw ? JSON.parse(raw) as Movie[] : [];
    } catch {
      return [];
    }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
    
  useEffect(() => {
    // Fetch movies - either by genre or popular
    let cancelled = false;

    async function loadMovies() {
      try {
        const seen = new Set<number>();
        const final: Movie[] = [];
        const desiredCount = 18;

        // Build API URL based on whether genre is selected
        const baseUrl = selectedGenre
          ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}`
          : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

        // Try pages 1..5 to collect movies with poster_path
        for (let page = 1; page <= 5 && final.length < desiredCount; page++) {
          const res = await fetch(`${baseUrl}&page=${page}`);
          const data = await res.json();
          const results: Movie[] = data.results || [];

          for (const m of results) {
            if (final.length >= desiredCount) break;
            if (seen.has(m.id)) continue;
            seen.add(m.id);
            if (m.poster_path) {
              final.push(m);
            }
          }
        }

        // If we still don't have enough, fall back to including items even without poster
        if (final.length < desiredCount) {
          const res = await fetch(`${baseUrl}&page=1`);
          const data = await res.json();
          const results: Movie[] = data.results || [];
          for (const m of results) {
            if (final.length >= desiredCount) break;
            if (!seen.has(m.id)) {
              seen.add(m.id);
              final.push(m);
            }
          }
        }

        if (!cancelled) {
          setMovies(final);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setIsInitialLoading(false);
      }
    }

    loadMovies();
    return () => { cancelled = true; };
  }, [refetchTrigger, selectedGenre]);

  // Load more movies function
  const loadMoreMovies = async () => {
    setIsLoadingMore(true);
    try {
      const seen = new Set(movies.map(m => m.id));
      const newMovies: Movie[] = [];
      const desiredCount = 20;

      // Build API URL based on whether genre is selected
      const baseUrl = selectedGenre
        ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}`
        : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

      // Fetch from next pages
      const startPage = currentPage + 1;
      for (let page = startPage; page <= startPage + 4 && newMovies.length < desiredCount; page++) {
        const res = await fetch(`${baseUrl}&page=${page}`);
        const data = await res.json();
        const results: Movie[] = data.results || [];

        for (const m of results) {
          if (newMovies.length >= desiredCount) break;
          if (seen.has(m.id)) continue;
          seen.add(m.id);
          if (m.poster_path) {
            newMovies.push(m);
          }
        }
      }

      setMovies(prev => [...prev, ...newMovies]);
      setCurrentPage(startPage + 4);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMore(false);
    }
  };




    //Debounce search input
  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 300, [searchTerm]);


    // Live search for dropdown
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setSearchResults(data.results || []);
        setShowDropdown(true);
      })
      .catch(() => {
        setSearchResults([]);
        setShowDropdown(false);
      });
  }, [debouncedSearchTerm]);



  // Search handler (on submit)
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setMovies(searchResults);
    // Show dropdown results as main results
    setShowDropdown(false);
  };


  // Hide dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHeroClick = () => {
    // Re-fetch the popular movies
    setRefetchTrigger(prev => prev + 1);
    // And reset all search-related state
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSearchResults([]);
    setShowDropdown(false);
    setIsInitialLoading(true);
    setSelectedGenre(null);
  };

  if (isInitialLoading) return <div>Loading...</div>;
  
  // Sort movies based on selected criteria
  const sortMovies = (moviesToSort: Movie[]) => {
    const sorted = [...moviesToSort];
    
    switch(sortBy) {
      case 'rating':
        return sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'year':
        return sorted.sort((a, b) => {
          const yearA = a.release_date ? parseInt(a.release_date.slice(0, 4)) : 0;
          const yearB = b.release_date ? parseInt(b.release_date.slice(0, 4)) : 0;
          return yearB - yearA;
        });
      case 'popularity':
      default:
        return sorted; // Already in popularity order from API
    }
  };

  const sortedMovies = sortMovies(movies);

  // Which list to render: favorites OR the normal movies
  const displayMovies = showFavorites ? favorites : sortedMovies;

  // Toggle favorite: add or remove movie from favorites and persist
  const toggleFavorite = (movie?: Movie) => {
    if (!movie) return;
    setFavorites(prev => {
      const exists = prev.findIndex(f => f.id === movie.id) !== -1;
      let next: Movie[];
      if (exists) {
        next = prev.filter(f => f.id !== movie.id);
      } else {
        next = [movie, ...prev];
      }
      try { localStorage.setItem('favorites', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // helper to check if a movie is in favorites
  const isFavorite = (id?: number) => id != null && favorites.some(f => f.id === id);

  return (
    <div className="min-h-screen">
        {/* Favorites toggle button */}
  <div className="fixed top-4 right-4 z-50">
    <button
      type="button"
      onClick={() => setShowFavorites(s => !s)}
      className="flex items-center gap-2 px-3 py-2 bg-[var(--color-secondary)] text-white rounded-lg shadow hover:opacity-90"
    >
      <img src={fullHeart} className="w-5 h-5" alt="favorites" />
      <span className="text-sm">Favorites ({favorites.length})</span>
    </button>
  </div>

  {/* Genre Sidebar*/}
  <GenreFilter selectedGenre={selectedGenre} onGenreChange={setSelectedGenre} onToggleCollapse={setSidebarCollapsed} />
      
      {/* Main Content*/}
  <div className="">
        <Hero 
          title={<>Find Your Next<span className='text-gradient sm:text-7xl text-5xl'>Favorite Movie</span></>}
          onImageClick={handleHeroClick}
        />


        {/* Search bar with dropdown preview */}
        <div style={{ position: 'relative', marginBottom: 24 }} ref={dropdownRef}>
          <form onSubmit={handleSearch} autoComplete="off">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </form>
          {showDropdown && searchResults.length > 0 && (
            <div
              className="
                absolute top-full left-[5%] right-[5%] sm:left-[10%] sm:right-[10%] z-50 
                max-h-[300px] sm:max-h-[350px] overflow-y-auto 
                bg-(--color-secondary) 
                rounded 
                shadow-lg 
                p-3 sm:p-4
                mt-3 sm:mt-5
                [scrollbar-width:thin]
              "
            >
              {searchResults.slice(0, 7).map(movie => (
                <SearchCard
                  key={movie.id}
                  title={movie.title}
                  imageSrc={movie.poster_path ? movie.poster_path : undefined}
                  year={movie.release_date ? parseInt(movie.release_date.slice(0, 4)) : undefined}
                  onClick={() => {
                    setMovies([movie]);
                    setSelectedMovieId(movie.id);
                    setShowDropdown(false);
                    setSearchTerm('');
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sort Filter */}
        {movies.length > 0 && (
          <div className="mx-auto max-w-6xl px-4 mb-6 flex flex-wrap justify-end gap-4">
            <SortField sortBy={sortBy} setSortBy={setSortBy} />
          </div>
        )}

        {displayMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">{showFavorites ? 'No favorites yet' : 'No movies found'}</p>
            <button 
              onClick={() => { setShowFavorites(false); handleHeroClick(); }}
              className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Back to Popular Movies
            </button>
          </div>
        ) : (
          <>
            <div className='mx-auto justify-items-center sm:max-w-6xl px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-2 md:gap-4 lg:gap-6'>
              {displayMovies.map(movie => (
                <div
                  key={movie.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedMovieId(movie.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMovieId(movie.id) }}
                  className="cursor-pointer w-[200px] sm:w-auto hover:scale-[1.01] transition-transform"
                >
                  <Card
                    id={movie.id}
                    title={movie.title}
                    imageSrc={movie.poster_path || ''}
                    year={movie.release_date ? parseInt(movie.release_date.slice(0, 4)) : undefined}
                    rating={movie.vote_average}
                    isLiked={isFavorite(movie.id)}
                    onToggleLike={() => toggleFavorite(movie)}
                  />
                </div>
              ))}
            </div>

            {/* Show More Button (hide when viewing favorites) */}
            {!showFavorites && <ShowMoreButton onClick={loadMoreMovies} isLoading={isLoadingMore} />}
          </>
        )}

        {/* Movie Modal */}
        {selectedMovieId && (
          <MoviePage movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
        )}

        {/* Scroll to Top Button */}
        <ScrollToTop duration={800} />
      </div>
    </div>
  )
}

export default App

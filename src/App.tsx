import Card from './components/Card'
import Hero from './components/Hero'
import Search from './components/Search'
import SearchCard from './components/SearchCard'
import MoviePage from './components/MoviePage'
import './App.css'
import {useEffect, useState, useRef} from 'react'
import { Link } from 'react-router-dom'
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
  
  useEffect(() => {
    // Fetch popular movies on initial load and ensure we have images for each slot.
    let cancelled = false;

    async function loadPopularWithImages() {
      try {
        // Fetch first page to know how many items the UI expects
        const firstRes = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1`);
        const firstData = await firstRes.json();
        const desiredCount = (firstData.results && firstData.results.length) ? firstData.results.length : 20;

        const seen = new Set<number>();
        const final: Movie[] = [];

        // Try pages 1..5 (or until we filled desiredCount) to collect movies that DO have poster_path
        for (let page = 1; page <= 5 && final.length < desiredCount; page++) {
          const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`);
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

        // If we still don't have enough, fall back to including items even without poster (preserve original count)
        if (final.length < desiredCount) {
          const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1`);
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

        if (!cancelled) setMovies(final);
      } catch (err) {
        console.error(err);
      }
    }

    loadPopularWithImages();
    return () => { cancelled = true; };
  }, [refetchTrigger]);




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
  };

  if (!movies.length) return <div>Loading...</div>;
  



  console.log(movies);
  return (
    <>
    <Link to="/" onClick={handleHeroClick}>
      <Hero title={<>Watch your favorite <span className='text-gradient'>movies</span></>}/>
    </Link>


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
                  setShowDropdown(false);
                  setSearchTerm('');
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className='mx-auto max-w-6xl px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6'>
        {movies.map(movie => (
          <div
            key={movie.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedMovieId(movie.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMovieId(movie.id) }}
            className="cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <Card
              title={movie.title}
              imageSrc={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              year={movie.release_date ? parseInt(movie.release_date.slice(0, 4)) : undefined}
              rating={movie.vote_average}
              alt={movie.overview}
            />
          </div>
        ))}
      </div>

      {/* Movie Modal */}
      {selectedMovieId && (
        <MoviePage movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
      )}

    </>
  )
}

export default App

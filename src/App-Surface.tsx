import Card from './components/Card'
import Hero from './components/Hero'
import Search from './components/Search'
import SearchCard from './components/SearchCard'
import './App.css'
import {useEffect, useState, useRef} from 'react'
import MoviePage from './components/MoviePage'
import { Routes, Route, Link } from 'react-router-dom';
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
};


  
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  
  useEffect(() => {
    // Fetch popular movies on initial load
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setMovies(data.results))
      .catch(err => console.error(err));
  }, []);



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

  if (!movies.length) return <div>Loading...</div>;


 
  return (
    <>
      <Hero title={<>Watch your favorite <span className='text-white'>movies</span></>}/>


      {/* Search bar with dropdown preview */}
      <div style={{ position: 'relative', marginBottom: 24 }} ref={dropdownRef}>
        <form onSubmit={handleSearch} autoComplete="off">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </form>
        {showDropdown && searchResults.length > 0 && (
          <div
            className="
              absolute top-full left-[10%] right-[10%] z-50 
              max-h-[350px] overflow-y-auto 
              bg-(--color-secondary) 
              rounded 
              shadow-lg 
              p-4
              mt-5
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

      <div className='mx-auto max-w-6xl px-4 grid grid-cols-3 lg:grid-cols-4 gap-6'>
        {movies.map(movie => (
          <Card
            key={movie.id}
            title={movie.title}
            imageSrc={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            year={movie.release_date ? parseInt(movie.release_date.slice(0, 4)) : undefined}
            alt={movie.overview}
          />
        ))}
      </div>
    </>
  )
}

export default App

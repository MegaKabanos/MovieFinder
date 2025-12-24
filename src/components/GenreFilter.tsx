import { useState, useEffect } from 'react';
import Arrow from '../assets/arrow';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// const svgarrow = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>


type Genre = {
  id: number;
  name: string;
};

interface GenreFilterProps {
  selectedGenre: number | null;
  onGenreChange: (genreId: number | null) => void;
  // optional: notify parent about collapsed state so layout can adjust
  onToggleCollapse?: (collapsed: boolean) => void;
}

const GenreFilter = ({ selectedGenre, onGenreChange, onToggleCollapse }: GenreFilterProps) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Fetch genres from TMDB API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
        );
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleSelect = (genreId: number | null) => {
    onGenreChange(genreId);
  };

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      if (onToggleCollapse) onToggleCollapse(next);
      return next;
    });
  };

  return (
    <>
      {/* Backdrop (kept in DOM so opacity can transition) */}
      <div
        className={`fixed inset-0 bg-black/90 z-30 lg:hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onClick={toggleCollapse}
      />

      {/* Sidebar wrapper: fixed width but slide in/out via transform for smooth animation */}
      <div className={`fixed top-0 left-0 h-screen w-56 z-40 transform ${isCollapsed ? '-translate-x-full' : 'translate-x-0'} transition-all duration-300 ease-in-out overflow-visible`}>
        {/* Sidebar background/border */}
  <aside className={`h-full p-4 bg-(--color-secondary) border-r border-(--color-border) shadow-lg relative`}>
          {/* Scrollable inner area */}
          <div className={`h-full overflow-y-auto hide-scrollbar p-4`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold text-white`}>Genres</h2>
            </div>

            <div className="space-y-2">
              {/* All Genres Option */}
              <button
                onClick={() => handleSelect(null)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                  selectedGenre === null
                    ? 'bg-purple-600 text-white font-semibold' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>All Genres</span>
              </button>

              {/* Genre Options */}
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleSelect(genre.id)}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                    selectedGenre === genre.id
                      ? 'bg-purple-600 text-white font-semibold' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span>{genre.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Toggle button placed on the wrapper so it's never clipped by inner scroll area */}
        <button
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? 'Expand genres' : 'Collapse genres'}
          onClick={toggleCollapse}
          className={`group absolute top-1/2 right-[1.2px] translate-x-full  
            -translate-y-1/2 py-3 px-2 md:py-3 md:px-2 rounded-r-xl text-white 
            ${isCollapsed ? 'border-none' : 'border-r border-b border-t border-(--color-border) border-l-0'}
            bg-(--color-secondary) z-50`}
          type="button"
        >
          {isCollapsed ? (
            <Arrow className="transition-all duration-150 w-4 h-4 md:w-6 md:h-6 stroke-current text-(--color-icon) group-hover:text-white" />
          ) : (
            <Arrow className="transition-all duration-150 w-4 h-4 md:w-6 md:h-6 stroke-current text-(--color-icon) group-hover:text-white rotate-180" />
          )}
        </button>
      </div>
    </>
  );
};

export default GenreFilter;

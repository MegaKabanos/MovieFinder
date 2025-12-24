import { useState, useRef, useEffect } from 'react';

interface SortFieldProps {
  sortBy: 'popularity' | 'rating' | 'title' | 'year';
  setSortBy: (value: 'popularity' | 'rating' | 'title' | 'year') => void;
}

const sortOptions = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'year', label: 'Year (Newest)' }
] as const;

const SortField = ({ sortBy, setSortBy }: SortFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: 'popularity' | 'rating' | 'title' | 'year') => {
    setSortBy(value);
    setIsOpen(false);
  };

  const currentLabel = sortOptions.find(opt => opt.value === sortBy)?.label;

  return (
    <div className="mx-auto max-w-6xl px-4 mb-6 flex justify-end">
      <div className="flex items-center gap-3">
        <label className="text-gray-300 text-sm">Sort by:</label>
        
        {/* Custom Dropdown */}
        <div ref={dropdownRef} className="relative">
          {/* Selected Value Display */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-(--color-secondary) text-gray-200 px-4 py-2 rounded-lg border-none focus:outline-none  transition-colors cursor-pointer min-w-40 text-left flex items-center justify-between"
          >
            <span>{currentLabel}</span>
            <svg 
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Options */}
          {isOpen && (
            <div className="absolute top-full mt-2 w-full bg-(--color-secondary) border border-gray-700 rounded-lg overflow-hidden shadow-lg z-10">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-4 py-2 text-left transition-colors ${
                    sortBy === option.value 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-200 hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortField;